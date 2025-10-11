import { Send, Mic, Loader2 } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  showMic?: boolean;
  state?: "default" | "disabled" | "loading" | "error";
}

export function ChatInput({ 
  onSend, 
  placeholder = "gasto 120 gasolina hoy", 
  showMic = true,
  state = "default"
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && state !== "disabled" && state !== "loading") {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDisabled = state === "disabled" || state === "loading";

  return (
    <div className="p-4">
      <div className={`flex items-center gap-2 p-3 rounded-2xl bg-surface ${
        state === "error" ? "ring-2 ring-err" : ""
      }`}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isDisabled}
          className="flex-1 bg-transparent text-text-primary placeholder:text-text-secondary outline-none text-[16px] leading-[24px]"
          style={{ minHeight: '44px' }}
        />
        <div className="flex items-center gap-2">
          {showMic && (
            <button
              className="w-11 h-11 flex items-center justify-center text-text-secondary hover:text-brand transition-colors disabled:opacity-50"
              disabled={isDisabled}
              aria-label="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={isDisabled || !message.trim()}
            className="w-11 h-11 flex items-center justify-center bg-brand text-white rounded-full hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            {state === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      {state === "error" && (
        <p className="caption text-err mt-2 px-1">
          No pude registrar esto. Intenta editar o reintentar.
        </p>
      )}
    </div>
  );
}
