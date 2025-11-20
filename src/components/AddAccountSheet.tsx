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
    
    if (!formData.name.trim()) {
      newErrors.name = "Ingresa un nombre para la cuenta";
    }
    
    if (formData.accountType === "credit_card" && !formData.creditLimit) {
      newErrors.creditLimit = "Ingresa el límite de crédito";
    }
    
    if (formData.accountType === "loan" && !formData.interestRate) {
      newErrors.interestRate = "Ingresa la tasa de interés";
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
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-bg rounded-t-3xl w-full max-w-[390px] max-h-[90vh] overflow-y-auto">
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
                        setFormData({ ...formData, creditLimit: parseFloat(e.target.value) || undefined });
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
                  <label className="caption text-text-secondary mb-2 block">Crédito disponible (opcional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary text-[20px] leading-[28px]">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.availableCredit || ""}
                      onChange={(e) => setFormData({ ...formData, availableCredit: parseFloat(e.target.value) || undefined })}
                      className="w-full pl-8 pr-4 py-3 bg-surface text-text-primary rounded-2xl text-[20px] leading-[28px] outline-none"
                      placeholder="15,000.00"
                      style={{ minHeight: '44px', fontVariantNumeric: 'tabular-nums' }}
                    />
                  </div>
                </div>
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
                  <label className="caption text-text-secondary mb-2 block">Tipo de inversión</label>
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
                <div>
                  <label className="caption text-text-secondary mb-2 block">Rendimiento anual estimado (opcional)</label>
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

            {formData.accountType === "loan" && (
              <>
                <div>
                  <label className="caption text-text-secondary mb-2 block">Tipo de préstamo</label>
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
                  <label className="caption text-text-secondary mb-2 block">Tasa de interés</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.interestRate || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, interestRate: parseFloat(e.target.value) || undefined });
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
                  <label className="caption text-text-secondary mb-2 block">Pago periódico</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary text-[20px] leading-[28px]">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.paymentAmount || ""}
                      onChange={(e) => setFormData({ ...formData, paymentAmount: parseFloat(e.target.value) || undefined })}
                      className="w-full pl-8 pr-4 py-3 bg-surface text-text-primary rounded-2xl text-[20px] leading-[28px] outline-none"
                      placeholder="500.00"
                      style={{ minHeight: '44px', fontVariantNumeric: 'tabular-nums' }}
                    />
                  </div>
                </div>
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
                  <label className="caption text-text-secondary mb-2 block">Prestamista (opcional)</label>
                  <input
                    type="text"
                    value={formData.lenderInfo || ""}
                    onChange={(e) => setFormData({ ...formData, lenderInfo: e.target.value })}
                    className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none"
                    placeholder="Ej. Banco X, Familiar"
                    style={{ minHeight: '44px' }}
                  />
                </div>
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
