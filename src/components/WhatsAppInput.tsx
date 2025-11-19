import { Send, Mic, Paperclip, Camera, Bot, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface WhatsAppInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  state?: "default" | "disabled" | "loading" | "error";
}

export function WhatsAppInput({ 
  onSend, 
  placeholder = "gasto / ingreso", 
  state = "default"
}: WhatsAppInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [hasAttachment, setHasAttachment] = useState(false);
  
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, []);

  // Update recording time
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const handleSend = () => {
    if ((message.trim() || hasAttachment) && state !== "disabled" && state !== "loading") {
      onSend(message);
      setMessage("");
      setHasAttachment(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = (cancelled: boolean = false) => {
    setIsRecording(false);
    setStartX(0);
    setCurrentX(0);
    
    if (!cancelled && recordingTime > 0) {
      // Simular envío de audio
      onSend(`[Audio ${recordingTime}s]`);
    }
  };

  const handleMicMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    
    longPressTimerRef.current = setTimeout(() => {
      startRecording();
    }, 200);
  };

  const handleMicTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setCurrentX(touch.clientX);
    
    longPressTimerRef.current = setTimeout(() => {
      startRecording();
    }, 200);
  };

  const handleMicMouseUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (isRecording) {
      const slideDistance = startX - currentX;
      const cancelled = slideDistance > 100;
      stopRecording(cancelled);
    }
  };

  const handleMicTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (isRecording) {
      const slideDistance = startX - currentX;
      const cancelled = slideDistance > 100;
      stopRecording(cancelled);
    }
  };

  const handleMicMouseMove = (e: React.MouseEvent) => {
    if (isRecording) {
      setCurrentX(e.clientX);
    }
  };

  const handleMicTouchMove = (e: React.TouchEvent) => {
    if (isRecording) {
      const touch = e.touches[0];
      setCurrentX(touch.clientX);
    }
  };

  const handleAttachment = () => {
    // Simular adjunto
    setHasAttachment(true);
  };

  const handleCamera = () => {
    // Simular cámara
    setHasAttachment(true);
  };

  const removeAttachment = () => {
    setHasAttachment(false);
  };

  const isDisabled = state === "disabled" || state === "loading";
  const hasContent = message.trim().length > 0 || hasAttachment;
  const slideDistance = startX - currentX;
  const shouldCancel = slideDistance > 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-3 py-3">
      {/* Recording Overlay */}
      {isRecording && (
        <div className="fixed inset-0 bg-bg/95 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 px-8">
            {/* Timer */}
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-err rounded-full animate-pulse" />
              <span className="text-text-primary text-[20px] leading-[28px]">
                {formatTime(recordingTime)}
              </span>
            </div>
            
            {/* Slide Indicator */}
            <div className="relative w-full max-w-[280px] h-12 flex items-center">
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <div 
                  className={`flex items-center gap-2 transition-all ${
                    shouldCancel ? "text-err scale-110" : "text-text-secondary"
                  }`}
                >
                  <X className="w-5 h-5" />
                  <span className="text-[14px] leading-[20px]">
                    Cancelar
                  </span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary opacity-50">
                  <span className="text-[14px] leading-[20px]">
                    Desliza
                  </span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-divider w-full rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    shouldCancel ? "bg-err" : "bg-brand"
                  }`}
                  style={{ 
                    width: `${Math.min((slideDistance / 100) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>

            {/* Mic Button */}
            <div 
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                shouldCancel ? "bg-err scale-95" : "bg-brand"
              }`}
            >
              <Mic className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview */}
      {hasAttachment && (
        <div className="mb-2 bg-surface rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand/20 rounded-lg flex items-center justify-center">
              <Paperclip className="w-5 h-5 text-brand" />
            </div>
            <span className="text-text-primary text-[14px] leading-[20px]">
              Archivo adjunto
            </span>
          </div>
          <button
            onClick={removeAttachment}
            className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-err transition-colors"
            aria-label="Remover adjunto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Container - Full Width with Integrated Button */}
      <div
        className={`flex items-center gap-2 pl-3 pr-3 py-2 rounded-full bg-surface ${
          state === "error" ? "ring-2 ring-err" : ""
        }`}
        style={{ minHeight: '56px' }}
      >
        {/* Bot Icon */}
        <div
          className="w-9 h-9 flex items-center justify-center text-brand flex-shrink-0"
          aria-label="Asistente"
        >
          <Bot className="w-5 h-5" />
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isDisabled}
          className="flex-1 bg-transparent text-text-primary placeholder:text-text-secondary outline-none text-[16px] leading-[24px] min-w-0"
        />

        {/* Inline Action Icons */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={handleAttachment}
            disabled={isDisabled}
            className="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-brand transition-colors disabled:opacity-50"
            aria-label="Adjuntar archivo"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            onClick={handleCamera}
            disabled={isDisabled}
            className="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-brand transition-colors disabled:opacity-50"
            aria-label="Cámara"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Integrated Mic/Send Button */}
          {hasContent ? (
            <button
              onClick={handleSend}
              disabled={isDisabled}
              className="w-11 h-11 flex items-center justify-center bg-brand text-white rounded-full hover:bg-brand/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Enviar"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              ref={micButtonRef}
              onMouseDown={handleMicMouseDown}
              onMouseUp={handleMicMouseUp}
              onMouseMove={handleMicMouseMove}
              onMouseLeave={handleMicMouseUp}
              onTouchStart={handleMicTouchStart}
              onTouchEnd={handleMicTouchEnd}
              onTouchMove={handleMicTouchMove}
              disabled={isDisabled}
              className="w-11 h-11 flex items-center justify-center bg-brand text-white rounded-full hover:bg-brand/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 active:scale-95"
              aria-label="Grabar audio"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
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