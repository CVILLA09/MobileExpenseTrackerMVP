import { MessageSquare, Zap, BarChart3 } from "lucide-react";

interface OnboardingScreenProps {
  onStart: () => void;
}

export function OnboardingScreen({ onStart }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 max-w-[390px] mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-brand/20 flex items-center justify-center mb-8">
          <MessageSquare className="w-10 h-10 text-brand" />
        </div>

        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary mb-4 text-center">
          Registra tus gastos<br />por chat
        </h1>

        <div className="space-y-4 mb-12">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 mt-1">
              <MessageSquare className="w-4 h-4 text-brand" />
            </div>
            <div>
              <p className="text-[16px] leading-[24px] text-text-primary font-medium">
                Habla naturalmente
              </p>
              <p className="caption text-text-secondary mt-1">
                "gasto 120 gasolina hoy" y listo
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Zap className="w-4 h-4 text-brand" />
            </div>
            <div>
              <p className="text-[16px] leading-[24px] text-text-primary font-medium">
                Confirmación rápida
              </p>
              <p className="caption text-text-secondary mt-1">
                Valida o edita antes de guardar
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 mt-1">
              <BarChart3 className="w-4 h-4 text-brand" />
            </div>
            <div>
              <p className="text-[16px] leading-[24px] text-text-primary font-medium">
                Ve tus totales
              </p>
              <p className="caption text-text-secondary mt-1">
                Sigue tu balance diario y mensual
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-brand text-white py-4 rounded-2xl hover:bg-brand/90 transition-colors"
        style={{ minHeight: '56px' }}
      >
        Empezar
      </button>
    </div>
  );
}
