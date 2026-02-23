import { useState, useCallback, useRef } from "react";
import * as math from "mathjs";
import { GraphApp } from "@/lib/graph-app";
import AppletLayout from "@/components/AppletLayout";
import MathCanvas from "@/components/MathCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RiemannSums = () => {
  const [funcStr, setFuncStr] = useState("x^2");
  const appRef = useRef<GraphApp | null>(null);

  const draw = useCallback((app: GraphApp, expr: string) => {
    try {
      const compiled = math.parse(expr).compile();
      app.clear();
      app.drawGrid();
      app.drawAxes();
      app.plotFunction(compiled, 'blue');

      const n = 20, start = -4, end = 4;
      const dx = (end - start) / n;
      app.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      app.ctx.strokeStyle = 'red';
      app.ctx.lineWidth = 1;

      for (let i = 0; i < n; i++) {
        const x = start + i * dx;
        try {
          const y = compiled.evaluate({ x }) as number;
          if (isFinite(y)) {
            const x1 = app.toCanvasX(x);
            const x2 = app.toCanvasX(x + dx);
            const yAxis = app.toCanvasY(0);
            const yVal = app.toCanvasY(y);
            const width = x2 - x1;
            const height = yVal - yAxis;
            app.ctx.fillRect(x1, yAxis, width, height);
            app.ctx.strokeRect(x1, yAxis, width, height);
          }
        } catch {}
      }
    } catch {}
  }, []);

  const handleInit = useCallback((app: GraphApp) => {
    appRef.current = app;
    draw(app, "x^2");
  }, [draw]);

  return (
    <AppletLayout title="Riemann Sums" description="Visualize integration via rectangle approximation.">
      <div className="flex flex-wrap items-end gap-3 mb-4 p-4 rounded-lg bg-muted">
        <div className="flex-1 min-w-[200px]">
          <Label>f(x) =</Label>
          <Input value={funcStr} onChange={(e) => setFuncStr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && appRef.current && draw(appRef.current, funcStr)} />
        </div>
        <Button onClick={() => appRef.current && draw(appRef.current, funcStr)}>Update</Button>
      </div>
      <MathCanvas onInit={handleInit} />
    </AppletLayout>
  );
};

export default RiemannSums;
