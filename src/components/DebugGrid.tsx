interface DebugGridProps {
  enabled?: boolean;
}

export function DebugGrid({ enabled = false }: DebugGridProps) {
  if (!enabled) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none max-w-[390px] mx-auto">
      {/* Left Gutter Line - 16px from left edge */}
      <div 
        className="absolute top-0 bottom-0 w-px bg-red-500"
        style={{ left: '16px' }}
      />
      
      {/* Right Gutter Line - 16px from right edge */}
      <div 
        className="absolute top-0 bottom-0 w-px bg-red-500"
        style={{ right: '16px' }}
      />
      
      {/* Container Left Edge */}
      <div 
        className="absolute top-0 bottom-0 w-px bg-blue-500 left-0"
      />
      
      {/* Container Right Edge */}
      <div 
        className="absolute top-0 bottom-0 w-px bg-blue-500 right-0"
      />

      {/* Debug Label */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded text-xs pointer-events-auto">
        DEBUG: Red = 16px gutter | Blue = Container edges
      </div>
    </div>
  );
}
