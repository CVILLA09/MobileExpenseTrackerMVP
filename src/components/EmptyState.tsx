import { MessageSquare } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({ 
  title = "Sin transacciones",
  description = "Usa el chat para registrar tus movimientos"
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-3">
        <MessageSquare className="w-8 h-8 text-brand" />
      </div>
      <h3 className="text-[16px] leading-[24px] text-text-primary mb-1 text-center">
        {title}
      </h3>
      <p className="caption text-text-secondary text-center max-w-[280px]">
        {description}
      </p>
    </div>
  );
}
