import { motion, AnimatePresence, PanInfo } from "motion/react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { WhatsAppInput } from "./WhatsAppInput";
import { Bubble } from "./Bubble";
import { TransactionData } from "./ConfirmCard";
import { ConfirmUnit } from "./ConfirmUnit";

interface Message {
  id: string;
  type: "user" | "bot";
  message: string;
  suggestions?: string[];
}

interface ChatDrawerProps {
  messages: Message[];
  confirmCard: TransactionData | null;
  onSendMessage: (message: string) => void;
  onConfirm: () => void;
  onEdit: () => void;
  onSuggestionClick: (suggestion: string) => void;
  onExpandedChange?: (isExpanded: boolean) => void;
}

export function ChatDrawer({
  messages,
  confirmCard,
  onSendMessage,
  onConfirm,
  onEdit,
  onSuggestionClick,
  onExpandedChange,
}: ChatDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Notify parent when expanded state changes
  useEffect(() => {
    onExpandedChange?.(isExpanded);
  }, [isExpanded, onExpandedChange]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If dragged down more than 100px, close the drawer
    if (info.offset.y > 100) {
      setIsExpanded(false);
    }
    // If dragged up more than 100px while closed, open the drawer
    else if (info.offset.y < -100 && !isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <>
      {/* Scrim overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsExpanded(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col max-w-[390px] mx-auto"
        initial={false}
        animate={{
          height: isExpanded ? "100vh" : "auto",
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
        }}
      >
        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 bg-bg flex flex-col overflow-hidden"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              {/* Header with chevron-down */}
              <div className="flex items-center justify-center pt-3 pb-2 bg-bg border-b border-divider">
                <button
                  onClick={handleToggle}
                  className="w-11 h-11 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors rounded-full hover:bg-surface"
                  aria-label="Ocultar chat"
                  aria-expanded={isExpanded}
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>

              {/* Chat content */}
              <div 
                className="flex-1 overflow-y-auto p-4" 
                style={{ scrollbarGutter: 'stable' }}
              >
                <div className="space-y-2">
                  {messages.length === 0 ? (
                    <div className="mb-4">
                      <Bubble
                        type="bot"
                        message="¡Hola! Registra tus gastos e ingresos. Ejemplo: 'gasto 50 café'"
                        suggestions={["gasto 50 café", "ingreso 2000 salario", "gasto 120 uber ayer"]}
                        onSuggestionClick={onSuggestionClick}
                      />
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <Bubble
                        key={msg.id}
                        type={msg.type}
                        message={msg.message}
                        suggestions={msg.suggestions}
                        onSuggestionClick={onSuggestionClick}
                      />
                    ))
                  )}
                </div>

                {/* Confirm Card - inline variant when drawer is expanded */}
                {confirmCard && (
                  <ConfirmUnit
                    variant="inline"
                    transaction={confirmCard}
                    onConfirm={onConfirm}
                    onEdit={onEdit}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar - always visible */}
        <div className="bg-bg border-t border-divider">
          {/* Chevron up button when collapsed */}
          {!isExpanded && (
            <div className="flex items-center justify-center pt-2">
              <button
                onClick={handleToggle}
                className="w-11 h-11 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors rounded-full hover:bg-surface"
                aria-label="Desplegar chat"
                aria-expanded={isExpanded}
              >
                <ChevronUp className="w-6 h-6" />
              </button>
            </div>
          )}
          
          <WhatsAppInput onSend={onSendMessage} />
        </div>
      </motion.div>
    </>
  );
}
