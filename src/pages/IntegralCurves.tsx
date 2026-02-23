import { useState, useCallback, useRef } from "react";
import * as math from "mathjs";
import { GraphApp } from "@/lib/graph-app";
import AppletLayout from "@/components/AppletLayout";
import MathCanvas from "@/components/MathCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const IntegralCurves = () => {
  const [funcStr, setFuncStr] = useState("sin(x)*cos(y)");
  const appRef = useRef<GraphApp | null>(null);

  const draw = useCallback((app: GraphApp, expr: string) => {
    try {
      const compiled = math.parse(expr).compile();
      app.clear();
      app.drawGrid();
      app.drawAxes();

      // Slope field
      const step = 0.5, len = 0.4;
      for (let x = Math.ceil(app.xMin); x <= Math.floor(app.xMax); x += step) {
        for (let y = Math.ceil(app.yMin); y <= Math.floor(app.yMax); y += step) {
          try {
            const m = compiled.evaluate({ x, y }) as number;
            if (isFinite(m)) {
              const theta = Math.atan(m);
              const dx = Math.cos(theta) * (len / 2);
              const dy = Math.sin(theta) * (len / 2);
              app.ctx.strokeStyle = 'blue';
              app.ctx.lineWidth = 1;
              app.ctx.beginPath();
              app.ctx.moveTo(app.toCanvasX(x - dx), app.toCanvasY(y - dy));
              app.ctx.lineTo(app.toCanvasX(x + dx), app.toCanvasY(y + dy));
              app.ctx.stroke();
            }
          } catch {}
        }
      }

      // Euler solution curve from (0,1)
      app.ctx.strokeStyle = 'red';
      app.ctx.lineWidth = 2;
      const h = 0.01;

      // Forward
      app.ctx.beginPath();
      let cx = 0, cy = 1;
      app.ctx.moveTo(app.toCanvasX(cx), app.toCanvasY(cy));
      for (let i = 0; i < 500; i++) {
        if (cx > app.xMax || cy > app.yMax || cy < app.yMin) break;
        try {
          const m = compiled.evaluate({ x: cx, y: cy }) as number;
          cy += h * m;
          cx += h;
          app.ctx.lineTo(app.toCanvasX(cx), app.toCanvasY(cy));
        } catch { break; }
      }
      app.ctx.stroke();

      // Backward
      app.ctx.beginPath();
      cx = 0; cy = 1;
      app.ctx.moveTo(app.toCanvasX(cx), app.toCanvasY(cy));
      for (let i = 0; i < 500; i++) {
        if (cx < app.xMin || cy > app.yMax || cy < app.yMin) break;
        try {
          const m = compiled.evaluate({ x: cx, y: cy }) as number;
          cy -= h * m;
          cx -= h;
          app.ctx.lineTo(app.toCanvasX(cx), app.toCanvasY(cy));
        } catch { break; }
      }
      app.ctx.stroke();
    } catch {}
  }, []);

  const handleInit = useCallback((app: GraphApp) => {
    appRef.current = app;
    draw(app, "sin(x)*cos(y)");
  }, [draw]);

  return (
    <AppletLayout title="Integral Curves" description="Visualize slope fields and solution curves.">
      <div className="flex flex-wrap items-end gap-3 mb-4 p-4 rounded-lg bg-muted">
        <div className="flex-1 min-w-[200px]">
          <Label>dy/dx =</Label>
          <Input value={funcStr} onChange={(e) => setFuncStr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && appRef.current && draw(appRef.current, funcStr)} />
        </div>
        <Button onClick={() => appRef.current && draw(appRef.current, funcStr)}>Update</Button>
      </div>
      <MathCanvas onInit={handleInit} />
    </AppletLayout>
  );
};

export default IntegralCurves;
