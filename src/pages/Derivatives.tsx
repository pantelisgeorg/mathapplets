import { useState, useCallback, useRef } from "react";
import * as math from "mathjs";
import { GraphApp } from "@/lib/graph-app";
import AppletLayout from "@/components/AppletLayout";
import MathCanvas from "@/components/MathCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EXAMPLES = [
  { value: "x^3 - 2*x + 1", label: "Cubic: x³ - 2x + 1" },
  { value: "sin(x)", label: "Sine: sin(x)" },
  { value: "cos(x)", label: "Cosine: cos(x)" },
  { value: "exp(x)", label: "Exponential: eˣ" },
  { value: "log(x)", label: "Logarithm: ln(x)" },
  { value: "1/x", label: "Rational: 1/x" },
  { value: "x^2", label: "Parabola: x²" },
];

const Derivatives = () => {
  const [funcStr, setFuncStr] = useState("x^3 - 2*x + 1");
  const [xValue, setXValue] = useState(0);
  const [showDeriv, setShowDeriv] = useState(true);
  const [showSecond, setShowSecond] = useState(false);
  const [showTangent, setShowTangent] = useState(true);
  const [info, setInfo] = useState({ fx: "", dfx: "", fVal: "", dfVal: "", tangent: "" });
  const appRef = useRef<GraphApp | null>(null);

  const draw = useCallback((app: GraphApp, expr: string, x: number, sd: boolean, sd2: boolean, st: boolean) => {
    try {
      const node = math.parse(expr);
      const compiled = node.compile();
      const derivNode = math.derivative(node, 'x');
      const compiledDeriv = derivNode.compile();
      const secondDerivNode = math.derivative(derivNode, 'x');
      const compiledSecond = secondDerivNode.compile();

      app.clear();
      app.drawGrid();
      app.drawAxes();
      app.plotFunction(compiled, 'blue', 2);

      if (sd) app.plotFunction(compiledDeriv, 'red', 1.5, [5, 5]);
      if (sd2) app.plotFunction(compiledSecond, 'purple', 1, [2, 2]);

      const scope = { x };
      const y = compiled.evaluate(scope) as number;
      const m = compiledDeriv.evaluate(scope) as number;

      if (st && isFinite(y) && isFinite(m)) {
        const x1 = x - 2, x2 = x + 2;
        const y1 = y + m * (x1 - x), y2 = y + m * (x2 - x);
        app.ctx.strokeStyle = 'green';
        app.ctx.lineWidth = 2;
        app.ctx.beginPath();
        app.ctx.moveTo(app.toCanvasX(x1), app.toCanvasY(y1));
        app.ctx.lineTo(app.toCanvasX(x2), app.toCanvasY(y2));
        app.ctx.stroke();
      }

      app.drawPoint(x, y, 'blue');
      if (sd) {
        const dy = compiledDeriv.evaluate(scope) as number;
        app.drawPoint(x, dy, 'red');
      }

      const intercept = y - m * x;
      const sign = intercept >= 0 ? '+' : '-';
      setInfo({
        fx: `f(x) = ${expr}`,
        dfx: `f'(x) = ${derivNode.toString()}`,
        fVal: isFinite(y) ? y.toFixed(4) : "—",
        dfVal: isFinite(m) ? m.toFixed(4) : "—",
        tangent: `y = ${m.toFixed(2)}x ${sign} ${Math.abs(intercept).toFixed(2)}`,
      });
    } catch { /* invalid */ }
  }, []);

  const redraw = useCallback(() => {
    if (appRef.current) draw(appRef.current, funcStr, xValue, showDeriv, showSecond, showTangent);
  }, [funcStr, xValue, showDeriv, showSecond, showTangent, draw]);

  const handleInit = useCallback((app: GraphApp) => {
    appRef.current = app;
    draw(app, "x^3 - 2*x + 1", 0, true, false, true);
  }, [draw]);

  return (
    <AppletLayout title="Derivative Visualizer" description="Explore functions and their derivatives interactively.">
      <div className="space-y-3 mb-4 p-4 rounded-lg bg-muted">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <Label>f(x) =</Label>
            <Input value={funcStr} onChange={(e) => setFuncStr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && redraw()} />
          </div>
          <Select onValueChange={(v) => { setFuncStr(v); }}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Examples" /></SelectTrigger>
            <SelectContent>
              {EXAMPLES.map((ex) => <SelectItem key={ex.value} value={ex.value}>{ex.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={redraw}>Plot</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={showDeriv} onCheckedChange={(c) => { setShowDeriv(!!c); }} /> Show f'(x)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={showSecond} onCheckedChange={(c) => { setShowSecond(!!c); }} /> Show f''(x)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={showTangent} onCheckedChange={(c) => { setShowTangent(!!c); }} /> Tangent Line
          </label>
        </div>
      </div>

      <MathCanvas onInit={handleInit} />

      <div className="mt-4 space-y-2 p-4 rounded-lg bg-muted text-sm">
        <div className="flex items-center gap-4">
          <Label>x = {xValue.toFixed(2)}</Label>
          <Slider min={-5} max={5} step={0.01} value={[xValue]}
            onValueChange={([v]) => { setXValue(v); if (appRef.current) draw(appRef.current, funcStr, v, showDeriv, showSecond, showTangent); }}
            className="flex-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-muted-foreground">
          <span>{info.fx}</span>
          <span>{info.dfx}</span>
          <span>f({xValue.toFixed(2)}) = {info.fVal}</span>
          <span>f'({xValue.toFixed(2)}) = {info.dfVal}</span>
        </div>
        <p className="text-muted-foreground">Tangent: {info.tangent}</p>
      </div>
    </AppletLayout>
  );
};

export default Derivatives;
