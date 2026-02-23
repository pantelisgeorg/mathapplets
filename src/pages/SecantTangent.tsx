import { useState, useCallback, useRef } from "react";
import * as math from "mathjs";
import { GraphApp } from "@/lib/graph-app";
import AppletLayout from "@/components/AppletLayout";
import MathCanvas from "@/components/MathCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const SecantTangent = () => {
  const [funcStr, setFuncStr] = useState("x^2");
  const [x0, setX0] = useState(1);
  const [h, setH] = useState(1);
  const [slopes, setSlopes] = useState({ secant: "", tangent: "" });
  const appRef = useRef<GraphApp | null>(null);

  const draw = useCallback((app: GraphApp, expr: string, xVal: number, hVal: number) => {
    app.clear();
    app.drawGrid();
    app.drawAxes();
    try {
      const node = math.parse(expr);
      const compiled = node.compile();
      app.plotFunction(compiled, 'blue');

      const deriv = math.derivative(node, 'x').compile();
      const mTan = deriv.evaluate({ x: xVal }) as number;
      const y0 = compiled.evaluate({ x: xVal }) as number;

      // Tangent (Green)
      const x1 = xVal - 2, x2 = xVal + 2;
      app.ctx.strokeStyle = 'green';
      app.ctx.lineWidth = 1;
      app.ctx.beginPath();
      app.ctx.moveTo(app.toCanvasX(x1), app.toCanvasY(y0 + mTan * (x1 - xVal)));
      app.ctx.lineTo(app.toCanvasX(x2), app.toCanvasY(y0 + mTan * (x2 - xVal)));
      app.ctx.stroke();

      let secText = "undefined (h=0)";
      if (Math.abs(hVal) > 0.001) {
        const ySec = compiled.evaluate({ x: xVal + hVal }) as number;
        const mSec = (ySec - y0) / hVal;
        app.ctx.strokeStyle = 'red';
        app.ctx.lineWidth = 2;
        app.ctx.beginPath();
        app.ctx.moveTo(app.toCanvasX(x1), app.toCanvasY(y0 + mSec * (x1 - xVal)));
        app.ctx.lineTo(app.toCanvasX(x2), app.toCanvasY(y0 + mSec * (x2 - xVal)));
        app.ctx.stroke();
        app.drawPoint(xVal + hVal, ySec, 'red');
        secText = mSec.toFixed(4);
      }

      app.drawPoint(xVal, y0, 'blue');
      setSlopes({ secant: secText, tangent: mTan.toFixed(4) });
    } catch {}
  }, []);

  const handleInit = useCallback((app: GraphApp) => {
    appRef.current = app;
    draw(app, "x^2", 1, 1);
  }, [draw]);

  return (
    <AppletLayout title="Secant & Tangent" description="Visualize the limit definition of the derivative.">
      <div className="space-y-3 mb-4 p-4 rounded-lg bg-muted">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <Label>f(x) =</Label>
            <Input value={funcStr} onChange={(e) => setFuncStr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && appRef.current && draw(appRef.current, funcStr, x0, h)} />
          </div>
          <Button onClick={() => appRef.current && draw(appRef.current, funcStr, x0, h)}>Update</Button>
        </div>
        <div>
          <Label>x = {x0.toFixed(2)}</Label>
          <Slider min={-3} max={3} step={0.1} value={[x0]}
            onValueChange={([v]) => { setX0(v); if (appRef.current) draw(appRef.current, funcStr, v, h); }} />
        </div>
        <div>
          <Label>h = {h.toFixed(2)}</Label>
          <Slider min={-2} max={2} step={0.1} value={[h]}
            onValueChange={([v]) => { setH(v); if (appRef.current) draw(appRef.current, funcStr, x0, v); }} />
        </div>
      </div>
      <MathCanvas onInit={handleInit} />
      <div className="mt-4 p-4 rounded-lg bg-muted text-sm text-muted-foreground space-y-1">
        <p>Tangent Slope: <span className="font-mono text-green-600">{slopes.tangent}</span></p>
        <p>Secant Slope: <span className="font-mono text-red-600">{slopes.secant}</span></p>
      </div>
    </AppletLayout>
  );
};

export default SecantTangent;
