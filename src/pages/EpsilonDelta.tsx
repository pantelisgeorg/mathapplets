import { useState, useCallback, useRef } from "react";
import * as math from "mathjs";
import { GraphApp } from "@/lib/graph-app";
import AppletLayout from "@/components/AppletLayout";
import MathCanvas from "@/components/MathCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EpsilonDelta = () => {
  const [funcStr, setFuncStr] = useState("x^2");
  const appRef = useRef<GraphApp | null>(null);

  const draw = useCallback((app: GraphApp, expr: string) => {
    try {
      const compiled = math.parse(expr).compile();
      app.clear();
      app.drawGrid();
      app.drawAxes();
      app.plotFunction(compiled, 'blue');

      const a = 1, eps = 0.5, delta = 0.25;
      const L = compiled.evaluate({ x: a }) as number;

      if (isFinite(L)) {
        // Horizontal band (L-eps, L+eps)
        const yTop = app.toCanvasY(L + eps);
        const yBot = app.toCanvasY(L - eps);
        app.ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        app.ctx.fillRect(0, yTop, app.width, yBot - yTop);

        // Vertical band (a-delta, a+delta)
        const xL = app.toCanvasX(a - delta);
        const xR = app.toCanvasX(a + delta);
        app.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        app.ctx.fillRect(xL, 0, xR - xL, app.height);

        app.drawPoint(a, L, 'black');
      }
    } catch {}
  }, []);

  const handleInit = useCallback((app: GraphApp) => {
    appRef.current = app;
    draw(app, "x^2");
  }, [draw]);

  return (
    <AppletLayout title="Epsilon Delta" description="Visualize the formal definition of a limit.">
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

export default EpsilonDelta;
