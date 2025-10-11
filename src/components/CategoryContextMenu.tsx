import { motion, AnimatePresence } from "motion/react";
import { Edit3, Type, ImageIcon, Trash2, GripVertical } from "lucide-react";

interface CategoryContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit: () => void;
  onRename: () => void;
  onChangeIcon: () => void;
  onDelete: () => void;
  onReorder: () => void;
}

export function CategoryContextMenu({
  isOpen,
  position,
  onClose,
  onEdit,
  onRename,
  onChangeIcon,
  onDelete,
  onReorder,
}: CategoryContextMenuProps) {
  const menuItems = [
    { icon: Edit3, label: "Editar", onClick: onEdit },
    { icon: Type, label: "Renombrar", onClick: onRename },
    { icon: ImageIcon, label: "Cambiar icono", onClick: onChangeIcon },
    { icon: Trash2, label: "Eliminar", onClick: onDelete, danger: true },
    { icon: GripVertical, label: "Reordenar", onClick: onReorder },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[80]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              left: position.x,
              top: position.y,
              zIndex: 90,
            }}
            className="bg-card-custom border border-divider rounded-xl shadow-2xl overflow-hidden min-w-[200px]"
          >
            <div className="py-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick();
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface transition-colors ${
                      item.danger ? "text-err" : "text-text-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[14px] leading-[20px]">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
