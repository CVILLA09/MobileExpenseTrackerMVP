interface BubbleProps {
  type: "user" | "bot";
  message: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export function Bubble({ type, message, suggestions, onSuggestionClick }: BubbleProps) {
  return (
    <div className={`flex ${type === "user" ? "justify-end" : "justify-start"} mb-3`}>
      <div className="max-w-[80%]">
        <div
          className={`px-4 py-3 rounded-2xl ${
            type === "user"
              ? "bg-brand text-white"
              : "bg-surface text-text-primary"
          }`}
        >
          <p className="text-[16px] leading-[24px]">{message}</p>
        </div>
        {suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="px-4 py-2 rounded-[24px] bg-surface text-text-primary text-[14px] leading-[20px] hover:bg-card-custom transition-colors border border-divider"
                style={{ minHeight: '44px' }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
