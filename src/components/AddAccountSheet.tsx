import { X, Banknote, Building2, PiggyBank, TrendingUp, CreditCard, FileText, ChevronLeft } from "lucide-react";
import { useState, useRef } from "react";

export interface AccountFormData {
  // Common fields
  accountType: "cash" | "checking" | "savings" | "investment" | "credit_card" | "loan";
  name: string;
  balance: number;
  currency: string;

  // Cash
  description?: string;

  // Checking
  bank?: string;
  accountNumber?: string;

  // Savings
  expectedYield?: number;
  goal?: string;

  // Credit Card
  creditLimit?: number;
  availableCredit?: number;
  billingDay?: number;
  paymentDueDay?: number;

  // Investment
  investmentSubtype?: "FIXED" | "VARIABLE";
  broker?: string;
  investmentType?: string; // Acciones, Fondos, Cripto, Bonos, Otro
  annualInterest?: number;
  isLocked?: boolean;
  lockedUntil?: string;
  // For VARIABLE investments
  quantity?: number;
  pricePerUnit?: number;

  // Loan
  loanSubtype?: "Personal" | "Institutional";
  loanType?: string; // Personal, Auto, Hipotecario, Otro
  interestRate?: number;
  originalAmount?: number; // Monto original del préstamo
  paymentAmount?: number;
  paymentFrequency?: string;
  nextPaymentDate?: string;
  lenderInfo?: string;
  // For Personal loans
  paymentMode?: "ONE_TIME" | "INSTALLMENTS";
  totalInstallments?: number;
  dueDate?: string;
  // For Institutional loans
  loanTerm?: number; // in months
}

interface AddAccountSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AccountFormData) => void;
}

// Auto-calculation helper functions
const calculateCreditCardBalance = (creditLimit: number, availableCredit: number): number => {
  return creditLimit - availableCredit;
};

const calculateVariableInvestmentBalance = (quantity: number, pricePerUnit: number): number => {
  return quantity * pricePerUnit;
};

const calculateLoanPayment = (
  principal: number,
  annualRate: number,
  termMonths: number
): number => {
  // Monthly payment formula: P * [r(1+r)^n] / [(1+r)^n - 1]
  // where r = monthly interest rate, n = number of months
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;

  const power = Math.pow(1 + monthlyRate, termMonths);
  const payment = principal * (monthlyRate * power) / (power - 1);
  return Math.round(payment * 100) / 100; // Round to 2 decimals
};

const calculatePersonalLoanInstallment = (originalAmount: number, totalInstallments: number): number => {
  return originalAmount / totalInstallments;
};

const accountTypes = [
  {
    id: "cash" as const,
    name: "Cash",
    icon: Banknote,
    description: "Dinero físico y efectivo en mano",
  },
  {
    id: "checking" as const,
    name: "Checking",
    icon: Building2,
    description: "Cuenta de débito o nómina para gastos diarios",
  },
  {
    id: "savings" as const,
    name: "Savings",
    icon: PiggyBank,
    description: "Ahorros o metas con posible rendimiento",
  },
  {
    id: "investment" as const,
    name: "Investment",
    icon: TrendingUp,
    description: "Cuentas de inversión, fondos, acciones o cripto",
  },
  {
    id: "credit_card" as const,
    name: "Credit",
    icon: CreditCard,
    description: "Tarjetas de crédito y líneas de crédito",
  },
  {
    id: "loan" as const,
    name: "Loan",
    icon: FileText,
    description: "Préstamos personales, auto u otros",
  },
];

export function AddAccountSheet({ isOpen, onClose, onSave }: AddAccountSheetProps) {
  const [step, setStep] = useState<"select-type" | "form">("select-type");
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  const [formData, setFormData] = useState<AccountFormData>({
    accountType: "cash",
    name: "",
    balance: 0,
    currency: "MXN",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleTypeSelect = () => {
    setFormData({ 
      ...formData, 
      accountType: accountTypes[currentTypeIndex].id 
    });
    setStep("form");
  };

  const handleCarouselScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const cardWidth = containerWidth; // Cada tarjeta ocupa el ancho completo del contenedor
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex !== currentTypeIndex && newIndex >= 0 && newIndex < accountTypes.length) {
      setCurrentTypeIndex(newIndex);
    }
  };

  const handlePaginationClick = (index: number) => {
    setCurrentTypeIndex(index);
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: index * containerWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleBack = () => {
    setStep("select-type");
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // Common validations
    if (!formData.name.trim()) {
      newErrors.name = "Ingresa un nombre para la cuenta";
    }

    // Credit Card validations
    if (formData.accountType === "credit_card") {
      if (!formData.creditLimit) {
        newErrors.creditLimit = "Ingresa el límite de crédito";
      }
      if (formData.availableCredit === undefined) {
        newErrors.availableCredit = "Ingresa el crédito disponible";
      }
      if (formData.creditLimit && formData.availableCredit !== undefined) {
        if (formData.availableCredit > formData.creditLimit) {
          newErrors.availableCredit = "El crédito disponible no puede ser mayor al límite";
        }
      }
    }

    // Investment validations
    if (formData.accountType === "investment") {
      if (!formData.investmentSubtype) {
        newErrors.investmentSubtype = "Selecciona el tipo de inversión";
      }

      if (formData.investmentSubtype === "VARIABLE") {
        if (!formData.quantity) {
          newErrors.quantity = "Ingresa la cantidad";
        }
        if (!formData.pricePerUnit) {
          newErrors.pricePerUnit = "Ingresa el precio por unidad";
        }
      }

      if (formData.investmentSubtype === "FIXED" && formData.isLocked && !formData.lockedUntil) {
        newErrors.lockedUntil = "Ingresa la fecha de desbloqueo";
      }
    }

    // Loan validations
    if (formData.accountType === "loan") {
      if (!formData.loanSubtype) {
        newErrors.loanSubtype = "Selecciona el tipo de préstamo";
      }

      if (!formData.originalAmount) {
        newErrors.originalAmount = "Ingresa el monto original del préstamo";
      }

      if (formData.loanSubtype === "Personal") {
        if (!formData.paymentMode) {
          newErrors.paymentMode = "Selecciona la modalidad de pago";
        }

        if (formData.paymentMode === "ONE_TIME" && !formData.dueDate) {
          newErrors.dueDate = "Ingresa la fecha de vencimiento";
        }

        if (formData.paymentMode === "INSTALLMENTS" && !formData.totalInstallments) {
          newErrors.totalInstallments = "Ingresa el número de cuotas";
        }
      }

      if (formData.loanSubtype === "Institutional") {
        if (!formData.interestRate) {
          newErrors.interestRate = "Ingresa la tasa de interés";
        }
        if (!formData.loanTerm) {
          newErrors.loanTerm = "Ingresa el plazo del préstamo";
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setStep("select-type");
    setCurrentTypeIndex(0);
    setFormData({
      accountType: "cash",
      name: "",
      balance: 0,
      currency: "MXN",
    });
    setErrors({});
    // Resetear scroll del carrusel
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="bg-bg rounded-t-3xl w-full max-w-[390px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-bg border-b border-divider p-4 flex items-center justify-between">
          {step === "form" && (
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Atrás"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-[20px] leading-[28px] text-text-primary flex-1">
            Agregar cuenta
          </h2>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "select-type" && (
          <div className="p-4 space-y-6">
            {/* Título de sección */}
            <div>
              <h3 className="text-[16px] leading-[24px] text-text-primary mb-1">
                Tipo de cuenta
              </h3>
              <p className="caption text-text-secondary">
                Elige qué tipo de cuenta quieres crear
              </p>
            </div>

            {/* Carrusel de tarjetas */}
            <div className="relative">
              <div 
                ref={carouselRef}
                onScroll={handleCarouselScroll}
                className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-4 pb-2"
              >
                {accountTypes.map((type, index) => {
                  const Icon = type.icon;
                  const isActive = index === currentTypeIndex;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => handlePaginationClick(index)}
                      className={`flex-shrink-0 w-full snap-center transition-all ${
                        isActive ? "scale-100" : "scale-95 opacity-60"
                      }`}
                    >
                      <div className={`bg-card-custom rounded-2xl p-6 border-2 transition-colors ${
                        isActive 
                          ? "border-brand shadow-lg" 
                          : "border-divider shadow-sm"
                      }`}>
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                            isActive ? "bg-brand/20" : "bg-brand/10"
                          }`}>
                            <Icon className={`w-8 h-8 ${
                              isActive ? "text-brand" : "text-brand/60"
                            }`} />
                          </div>
                          <h4 className="text-[18px] leading-[24px] text-text-primary mb-2">
                            {type.name}
                          </h4>
                          <p className="caption text-text-secondary">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paginador de puntos */}
            <div className="flex justify-center gap-2">
              {accountTypes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePaginationClick(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentTypeIndex 
                      ? "w-6 bg-brand" 
                      : "w-2 bg-divider"
                  }`}
                  aria-label={`Ir a tipo ${index + 1}`}
                />
              ))}
            </div>

            {/* Botón Siguiente */}
            <button
              onClick={handleTypeSelect}
              className="w-full bg-brand text-white py-3 rounded-2xl hover:bg-brand/90 transition-colors"
              style={{ minHeight: '44px' }}
            >
              Siguiente
            </button>
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Campos comunes */}
            <div>
              <label className="caption text-text-secondary mb-2 block">Nombre de la cuenta</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: "" });
                }}
                className={`w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none ${
                  errors.name ? "ring-2 ring-err" : ""
                }`}
                placeholder={
                  formData.accountType === "cash" ? "Ej. Cartera" :
                  formData.accountType === "checking" ? "Ej. Nómina Santander" :
                  formData.accountType === "savings" ? "Ej. Ahorro Meta" :
                  formData.accountType === "investment" ? "Ej. Crypto Portfolio" :
                  formData.accountType === "credit_card" ? "Ej. Tarjeta Azul" :
                  "Ej. Préstamo Personal"
                }
                style={{ minHeight: '44px' }}
              />
              {errors.name && (
                <p className="caption text-err mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="caption text-text-secondary mb-2 block">
                {formData.accountType === "credit_card" || formData.accountType === "loan" 
                  ? "Saldo inicial (deuda actual)" 
                  : "Saldo inicial"}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary text-[20px] leading-[28px]">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance || ""}
                  onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-4 py-3 bg-surface text-text-primary rounded-2xl text-[20px] leading-[28px] outline-none"
                  placeholder="$ 0.00"
                  style={{ minHeight: '44px', fontVariantNumeric: 'tabular-nums' }}
                />
              </div>
              {(formData.accountType === "credit_card" || formData.accountType === "loan") && (
                <p className="caption text-text-secondary mt-1">
                  {formData.accountType === "credit_card" 
                    ? "El saldo inicial se considera como deuda actual de esta tarjeta."
                    : "El saldo inicial se considera como deuda pendiente de este préstamo."}
                </p>
              )}
            </div>

            <div>
              <label className="caption text-text-secondary mb-2 block">Moneda</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none appearance-none"
                style={{ minHeight: '44px' }}
              >
                <option value="MXN">MXN - Peso Mexicano</option>
                <option value="USD">USD - Dólar Estadounidense</option>
              </select>
            </div>

            {/* Campos específicos por tipo */}
            {formData.accountType === "cash" && (
              <div>
                <label className="caption text-text-secondary mb-2 block">Descripción (opcional)</label>
                <input
                  type="text"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none"
                  placeholder="Agregar detalles..."
                  style={{ minHeight: '44px' }}
                />
              </div>
            )}

            {formData.accountType === "checking" && (
              <>
                <div>
                  <label className="caption text-text-secondary mb-2 block">Banco (opcional)</label>
                  <input
                    type="text"
                    value={formData.bank || ""}
                    onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                    className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none"
                    placeholder="Ej. BBVA, Santander"
                    style={{ minHeight: '44px' }}
                  />
                </div>
                <div>
                  <label className="caption text-text-secondary mb-2 block">Número de cuenta (opcional)</label>
                  <input
                    type="text"
                    value={formData.accountNumber || ""}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none"
                    placeholder="**** **** **** 1234"
                    style={{ minHeight: '44px' }}
                  />
                </div>
              </>
            )}

            {formData.accountType === "savings" && (
              <>
                <div>
                  <label className="caption text-text-secondary mb-2 block">Tasa de rendimiento esperada (opcional)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.expectedYield || ""}
                      onChange={(e) => setFormData({ ...formData, expectedYield: parseFloat(e.target.value) || undefined })}
                      className="w-full px-4 pr-8 py-3 bg-surface text-text-primary rounded-2xl outline-none"
                      placeholder="Ej. 6.5 %"
                      style={{ minHeight: '44px' }}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">%</span>
                  </div>
                </div>
                <div>
                  <label className="caption text-text-secondary mb-2 block">Objetivo (opcional)</label>
                  <input
                    type="text"
                    value={formData.goal || ""}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none"
                    placeholder="Ej. Fondo de emergencia, Viaje"
                    style={{ minHeight: '44px' }}
                  />
                </div>
              </>
            )}

            {formData.accountType === "credit_card" && (
              <>
                <div>
                  <label className="caption text-text-secondary mb-2 block">Límite de crédito</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary text-[20px] leading-[28px]">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.creditLimit || ""}
                      onChange={(e) => {
                        const creditLimit = parseFloat(e.target.value) || undefined;
                        const newFormData = { ...formData, creditLimit };
                        // Auto-calculate balance if both creditLimit and availableCredit are present
                        if (creditLimit && formData.availableCredit !== undefined) {
                          newFormData.balance = calculateCreditCardBalance(creditLimit, formData.availableCredit);
                        }
                        setFormData(newFormData);
                        setErrors({ ...errors, creditLimit: "" });
                      }}
                      className={`w-full pl-8 pr-4 py-3 bg-surface text-text-primary rounded-2xl text-[20px] leading-[28px] outline-none ${
                        errors.creditLimit ? "ring-2 ring-err" : ""
                      }`}
                      placeholder="$ 20,000.00"
                      style={{ minHeight: '44px', fontVariantNumeric: 'tabular-nums' }}
                    />
                  </div>
                  {errors.creditLimit && (
                    <p className="caption text-err mt-1">{errors.creditLimit}</p>
                  )}
                </div>
                <div>
                  <label className="caption text-text-secondary mb-2 block">Crédito disponible</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary text-[20px] leading-[28px]">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.availableCredit || ""}
                      onChange={(e) => {
                        const availableCredit = parseFloat(e.target.value) || undefined;
                        const newFormData = { ...formData, availableCredit };
                        // Auto-calculate balance if both creditLimit and availableCredit are present
                        if (availableCredit !== undefined && formData.creditLimit) {
                          newFormData.balance = calculateCreditCardBalance(formData.creditLimit, availableCredit);
                        }
                        setFormData(newFormData);
                        setErrors({ ...errors, availableCredit: "" });
                      }}
                      className={`w-full pl-8 pr-4 py-3 bg-surface text-text-primary rounded-2xl text-[20px] leading-[28px] outline-none ${
                        errors.availableCredit ? "ring-2 ring-err" : ""
                      }`}
                      placeholder="15,000.00"
                      style={{ minHeight: '44px', fontVariantNumeric: 'tabular-nums' }}
                    />
                  </div>
                  {errors.availableCredit && (
                    <p className="caption text-err mt-1">{errors.availableCredit}</p>
                  )}
                </div>
                {formData.creditLimit && formData.availableCredit !== undefined && (
                  <div className="p-3 bg-err/10 border border-err/20 rounded-2xl">
                    <p className="caption text-text-secondary mb-1">Saldo adeudado calculado</p>
                    <p className="text-[20px] leading-[28px] text-err font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      ${formData.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="caption text-text-secondary mb-2 block">Día de corte</label>
                    <select
                      value={formData.billingDay || ""}
                      onChange={(e) => setFormData({ ...formData, billingDay: parseInt(e.target.value) || undefined })}
                      className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none appearance-none"
                      style={{ minHeight: '44px' }}
                    >
                      <option value="">Seleccionar</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="caption text-text-secondary mb-2 block">Día de pago</label>
                    <select
                      value={formData.paymentDueDay || ""}
                      onChange={(e) => setFormData({ ...formData, paymentDueDay: parseInt(e.target.value) || undefined })}
                      className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none appearance-none"
                      style={{ minHeight: '44px' }}
                    >
                      <option value="">Seleccionar</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {formData.accountType === "investment" && (
              <>
                {/* Investment Subtype Selection */}
                <div>
                  <label className="caption text-text-secondary mb-2 block">Tipo de inversión</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, investmentSubtype: "FIXED" })}
                      className={`p-3 rounded-2xl border transition-colors caption ${
                        formData.investmentSubtype === "FIXED"
                          ? "border-brand bg-brand/10 text-brand"
                          : "border-divider text-text-secondary"
                      }`}
                      style={{ minHeight: '44px' }}
                    >
                      Renta Fija
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, investmentSubtype: "VARIABLE" })}
                      className={`p-3 rounded-2xl border transition-colors caption ${
                        formData.investmentSubtype === "VARIABLE"
                          ? "border-brand bg-brand/10 text-brand"
                          : "border-divider text-text-secondary"
                      }`}
                      style={{ minHeight: '44px' }}
                    >
                      Renta Variable
                    </button>
                  </div>
                </div>

                <div>
                  <label className="caption text-text-secondary mb-2 block">Broker / plataforma</label>
                  <input
                    type="text"
                    value={formData.broker || ""}
                    onChange={(e) => setFormData({ ...formData, broker: e.target.value })}
                    className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none"
                    placeholder="Ej. GBM, Binance, CETESdirecto"
                    style={{ minHeight: '44px' }}
                  />
                </div>

                <div>
                  <label className="caption text-text-secondary mb-2 block">Categoría</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Acciones", "Fondos", "Cripto", "Bonos", "Otro"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, investmentType: type })}
                        className={`p-3 rounded-2xl border transition-colors caption ${
                          formData.investmentType === type
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-divider text-text-secondary"
                        }`}
                        style={{ minHeight: '44px' }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FIXED Investment Fields */}
                {formData.investmentSubtype === "FIXED" && (
                  <>
                    <div>
                      <label className="caption text-text-secondary mb-2 block">Rendimiento anual</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={formData.annualInterest || ""}
                          onChange={(e) => setFormData({ ...formData, annualInterest: parseFloat(e.target.value) || undefined })}
                          className="w-full px-4 pr-8 py-3 bg-surface text-text-primary rounded-2xl outline-none"
                          placeholder="8.5"
                          style={{ minHeight: '44px' }}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isLocked || false}
                          onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked, lockedUntil: e.target.checked ? formData.lockedUntil : undefined })}
                          className="w-5 h-5 rounded border-divider text-brand focus:ring-brand"
                        />
                        <span className="caption text-text-primary">Bloqueado</span>
                      </label>
                    </div>
                    {formData.isLocked && (
                      <div>
                        <label className="caption text-text-secondary mb-2 block">Bloqueado hasta</label>
                        <input
                          type="date"
                          value={formData.lockedUntil || ""}
                          onChange={(e) => setFormData({ ...formData, lockedUntil: e.target.value })}
                          className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none"
                          style={{ minHeight: '44px' }}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* VARIABLE Investment Fields */}
                {formData.investmentSubtype === "VARIABLE" && (
                  <>
                    <div>
                      <label className="caption text-text-secondary mb-2 block">Cantidad</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.quantity || ""}
                        onChange={(e) => {
                          const quantity = parseFloat(e.target.value) || undefined;
                          const newFormData = { ...formData, quantity };
                          // Auto-calculate balance if both quantity and pricePerUnit are present
                          if (quantity && formData.pricePerUnit) {
                            newFormData.balance = calculateVariableInvestmentBalance(quantity, formData.pricePerUnit);
                          }
                          setFormData(newFormData);
                          setErrors({ ...errors, quantity: "" });
                        }}
                        className={`w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none ${
                          errors.quantity ? "ring-2 ring-err" : ""
                        }`}
                        placeholder="10.5"
                        style={{ minHeight: '44px' }}
                      />
                      {errors.quantity && (
                        <p className="caption text-err mt-1">{errors.quantity}</p>
                      )}
                    </div>
                    <div>
                      <label className="caption text-text-secondary mb-2 block">Precio por unidad</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary text-[20px] leading-[28px]">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.pricePerUnit || ""}
                          onChange={(e) => {
                            const pricePerUnit = parseFloat(e.target.value) || undefined;
                            const newFormData = { ...formData, pricePerUnit };
                            // Auto-calculate balance if both quantity and pricePerUnit are present
                            if (pricePerUnit && formData.quantity) {
                              newFormData.balance = calculateVariableInvestmentBalance(formData.quantity, pricePerUnit);
                            }
                            setFormData(newFormData);
                            setErrors({ ...errors, pricePerUnit: "" });
                          }}
                          className={`w-full pl-8 pr-4 py-3 bg-surface text-text-primary rounded-2xl text-[20px] leading-[28px] outline-none ${
                            errors.pricePerUnit ? "ring-2 ring-err" : ""
                          }`}
                          placeholder="1,234.56"
                          style={{ minHeight: '44px', fontVariantNumeric: 'tabular-nums' }}
                        />
                      </div>
                      {errors.pricePerUnit && (
                        <p className="caption text-err mt-1">{errors.pricePerUnit}</p>
                      )}
                    </div>
                    {formData.quantity && formData.pricePerUnit && (
                      <div className="p-3 bg-brand/10 border border-brand/20 rounded-2xl">
                        <p className="caption text-text-secondary mb-1">Balance calculado</p>
                        <p className="text-[20px] leading-[28px] text-brand font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          ${formData.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {formData.accountType === "loan" && (
              <>
                {/* Loan Subtype Selection */}
                <div>
                  <label className="caption text-text-secondary mb-2 block">Tipo de préstamo</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, loanSubtype: "Personal" })}
                      className={`p-3 rounded-2xl border transition-colors caption ${
                        formData.loanSubtype === "Personal"
                          ? "border-brand bg-brand/10 text-brand"
                          : "border-divider text-text-secondary"
                      }`}
                      style={{ minHeight: '44px' }}
                    >
                      Personal
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, loanSubtype: "Institutional" })}
                      className={`p-3 rounded-2xl border transition-colors caption ${
                        formData.loanSubtype === "Institutional"
                          ? "border-brand bg-brand/10 text-brand"
                          : "border-divider text-text-secondary"
                      }`}
                      style={{ minHeight: '44px' }}
                    >
                      Institucional
                    </button>
                  </div>
                </div>

                <div>
                  <label className="caption text-text-secondary mb-2 block">Categoría</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Personal", "Auto", "Hipotecario", "Otro"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, loanType: type })}
                        className={`p-3 rounded-2xl border transition-colors caption ${
                          formData.loanType === type
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-divider text-text-secondary"
                        }`}
                        style={{ minHeight: '44px' }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="caption text-text-secondary mb-2 block">Monto original del préstamo</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary text-[20px] leading-[28px]">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalAmount || ""}
                      onChange={(e) => {
                        const originalAmount = parseFloat(e.target.value) || undefined;
                        setFormData({ ...formData, originalAmount });
                        setErrors({ ...errors, originalAmount: "" });
                      }}
                      className={`w-full pl-8 pr-4 py-3 bg-surface text-text-primary rounded-2xl text-[20px] leading-[28px] outline-none ${
                        errors.originalAmount ? "ring-2 ring-err" : ""
                      }`}
                      placeholder="10,000.00"
                      style={{ minHeight: '44px', fontVariantNumeric: 'tabular-nums' }}
                    />
                  </div>
                  {errors.originalAmount && (
                    <p className="caption text-err mt-1">{errors.originalAmount}</p>
                  )}
                </div>

                {/* Personal Loan Fields */}
                {formData.loanSubtype === "Personal" && (
                  <>
                    <div>
                      <label className="caption text-text-secondary mb-2 block">Modalidad de pago</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMode: "ONE_TIME" })}
                          className={`p-3 rounded-2xl border transition-colors caption ${
                            formData.paymentMode === "ONE_TIME"
                              ? "border-brand bg-brand/10 text-brand"
                              : "border-divider text-text-secondary"
                          }`}
                          style={{ minHeight: '44px' }}
                        >
                          Pago único
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMode: "INSTALLMENTS" })}
                          className={`p-3 rounded-2xl border transition-colors caption ${
                            formData.paymentMode === "INSTALLMENTS"
                              ? "border-brand bg-brand/10 text-brand"
                              : "border-divider text-text-secondary"
                          }`}
                          style={{ minHeight: '44px' }}
                        >
                          Cuotas
                        </button>
                      </div>
                    </div>

                    {formData.paymentMode === "ONE_TIME" && (
                      <div>
                        <label className="caption text-text-secondary mb-2 block">Fecha de vencimiento</label>
                        <input
                          type="date"
                          value={formData.dueDate || ""}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none"
                          style={{ minHeight: '44px' }}
                        />
                      </div>
                    )}

                    {formData.paymentMode === "INSTALLMENTS" && (
                      <>
                        <div>
                          <label className="caption text-text-secondary mb-2 block">Número de cuotas</label>
                          <input
                            type="number"
                            step="1"
                            value={formData.totalInstallments || ""}
                            onChange={(e) => {
                              const totalInstallments = parseInt(e.target.value) || undefined;
                              const newFormData = { ...formData, totalInstallments };
                              // Auto-calculate installment amount
                              if (totalInstallments && formData.originalAmount) {
                                newFormData.paymentAmount = calculatePersonalLoanInstallment(formData.originalAmount, totalInstallments);
                              }
                              setFormData(newFormData);
                              setErrors({ ...errors, totalInstallments: "" });
                            }}
                            className={`w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none ${
                              errors.totalInstallments ? "ring-2 ring-err" : ""
                            }`}
                            placeholder="12"
                            style={{ minHeight: '44px' }}
                          />
                          {errors.totalInstallments && (
                            <p className="caption text-err mt-1">{errors.totalInstallments}</p>
                          )}
                        </div>
                        {formData.totalInstallments && formData.originalAmount && (
                          <div className="p-3 bg-brand/10 border border-brand/20 rounded-2xl">
                            <p className="caption text-text-secondary mb-1">Monto por cuota</p>
                            <p className="text-[20px] leading-[28px] text-brand font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                              ${formData.paymentAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        )}
                        <div>
                          <label className="caption text-text-secondary mb-2 block">Próxima fecha de pago</label>
                          <input
                            type="date"
                            value={formData.nextPaymentDate || ""}
                            onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
                            className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none"
                            style={{ minHeight: '44px' }}
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="caption text-text-secondary mb-2 block">Prestamista (opcional)</label>
                      <input
                        type="text"
                        value={formData.lenderInfo || ""}
                        onChange={(e) => setFormData({ ...formData, lenderInfo: e.target.value })}
                        className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none"
                        placeholder="Ej. Familiar, Amigo"
                        style={{ minHeight: '44px' }}
                      />
                    </div>
                  </>
                )}

                {/* Institutional Loan Fields */}
                {formData.loanSubtype === "Institutional" && (
                  <>
                    <div>
                      <label className="caption text-text-secondary mb-2 block">Tasa de interés anual</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={formData.interestRate || ""}
                          onChange={(e) => {
                            const interestRate = parseFloat(e.target.value) || undefined;
                            const newFormData = { ...formData, interestRate };
                            // Auto-calculate payment if all fields present
                            if (interestRate && formData.originalAmount && formData.loanTerm) {
                              newFormData.paymentAmount = calculateLoanPayment(
                                formData.originalAmount,
                                interestRate,
                                formData.loanTerm
                              );
                            }
                            setFormData(newFormData);
                            setErrors({ ...errors, interestRate: "" });
                          }}
                          className={`w-full px-4 pr-8 py-3 bg-surface text-text-primary rounded-2xl outline-none ${
                            errors.interestRate ? "ring-2 ring-err" : ""
                          }`}
                          placeholder="12.5"
                          style={{ minHeight: '44px' }}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">%</span>
                      </div>
                      {errors.interestRate && (
                        <p className="caption text-err mt-1">{errors.interestRate}</p>
                      )}
                    </div>

                    <div>
                      <label className="caption text-text-secondary mb-2 block">Plazo (meses)</label>
                      <input
                        type="number"
                        step="1"
                        value={formData.loanTerm || ""}
                        onChange={(e) => {
                          const loanTerm = parseInt(e.target.value) || undefined;
                          const newFormData = { ...formData, loanTerm };
                          // Auto-calculate payment if all fields present
                          if (loanTerm && formData.originalAmount && formData.interestRate) {
                            newFormData.paymentAmount = calculateLoanPayment(
                              formData.originalAmount,
                              formData.interestRate,
                              loanTerm
                            );
                          }
                          setFormData(newFormData);
                          setErrors({ ...errors, loanTerm: "" });
                        }}
                        className={`w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none ${
                          errors.loanTerm ? "ring-2 ring-err" : ""
                        }`}
                        placeholder="24"
                        style={{ minHeight: '44px' }}
                      />
                      {errors.loanTerm && (
                        <p className="caption text-err mt-1">{errors.loanTerm}</p>
                      )}
                    </div>

                    {formData.originalAmount && formData.interestRate && formData.loanTerm && (
                      <div className="p-3 bg-brand/10 border border-brand/20 rounded-2xl">
                        <p className="caption text-text-secondary mb-1">Pago mensual calculado</p>
                        <p className="text-[20px] leading-[28px] text-brand font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          ${formData.paymentAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="caption text-text-secondary mb-2 block">Frecuencia de pago</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Mensual", "Quincenal", "Semanal", "Otro"].map((freq) => (
                          <button
                            key={freq}
                            type="button"
                            onClick={() => setFormData({ ...formData, paymentFrequency: freq })}
                            className={`p-3 rounded-2xl border transition-colors caption ${
                              formData.paymentFrequency === freq
                                ? "border-brand bg-brand/10 text-brand"
                                : "border-divider text-text-secondary"
                            }`}
                            style={{ minHeight: '44px' }}
                          >
                            {freq}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="caption text-text-secondary mb-2 block">Próxima fecha de pago</label>
                      <input
                        type="date"
                        value={formData.nextPaymentDate || ""}
                        onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
                        className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none"
                        style={{ minHeight: '44px' }}
                      />
                    </div>

                    <div>
                      <label className="caption text-text-secondary mb-2 block">Institución financiera</label>
                      <input
                        type="text"
                        value={formData.lenderInfo || ""}
                        onChange={(e) => setFormData({ ...formData, lenderInfo: e.target.value })}
                        className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none"
                        placeholder="Ej. Banco X, SOFOM"
                        style={{ minHeight: '44px' }}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Botón Guardar */}
            <button
              type="submit"
              className="w-full bg-brand text-white py-3 rounded-2xl hover:bg-brand/90 transition-colors"
              style={{ minHeight: '44px' }}
            >
              Guardar cuenta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
