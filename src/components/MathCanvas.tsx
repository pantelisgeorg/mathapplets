import { useRef, useEffect, useCallback } from "react";
import { GraphApp } from "@/lib/graph-app";

interface MathCanvasProps {
  onInit: (app: GraphApp) => void;
  className?: string;
}

const MathCanvas = ({ onInit, className }: MathCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<GraphApp | null>(null);

  const initCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    if (container) {
      const w = Math.min(container.clientWidth, 800);
      canvas.width = w;
      canvas.height = Math.round(w * 0.75);
    }
    appRef.current = new GraphApp(canvas);
    onInit(appRef.current);
  }, [onInit]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  return (
    <div className={`relative w-full ${className || ""}`}>
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border border-border bg-white"
        width={800}
        height={600}
      />
    </div>
  );
};

export default MathCanvas;
