import { Plus } from "lucide-react";

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <div className="fixed bottom-[156px] left-0 right-0 z-30 pointer-events-none max-w-[390px] mx-auto">
      <div className="px-4 flex justify-end">
        <button
          onClick={onClick}
          className="w-14 h-14 bg-brand text-white rounded-full shadow-lg hover:bg-brand/90 active:scale-95 transition-all flex items-center justify-center pointer-events-auto"
          aria-label="Agregar transacción manual"
          style={{ minWidth: '56px', minHeight: '56px' }}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
