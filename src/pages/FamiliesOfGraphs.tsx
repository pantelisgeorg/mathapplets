import { useState, useCallback, useRef } from "react";
import * as math from "mathjs";
import { GraphApp } from "@/lib/graph-app";
import AppletLayout from "@/components/AppletLayout";
import MathCanvas from "@/components/MathCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const FamiliesOfGraphs = () => {
  const [funcStr, setFuncStr] = useState("sin(k*x)");
  const [k, setK] = useState(1);
  const [kMin, setKMin] = useState(-5);
  const [kMax, setKMax] = useState(5);
  const appRef = useRef<GraphApp | null>(null);

  const draw = useCallback((app: GraphApp, expr: string, kVal: number) => {
    app.clear();
    app.drawGrid();
    app.drawAxes();
    try {
      const compiled = math.parse(expr).compile();
      app.plotFunction(compiled, 'blue', 2, [], { k: kVal });
    } catch { /* invalid */ }
  }, []);

  const redraw = useCallback(() => {
    if (appRef.current) draw(appRef.current, funcStr, k);
  }, [funcStr, k, draw]);

  const handleInit = useCallback((app: GraphApp) => {
    appRef.current = app;
    draw(app, "sin(k*x)", 1);
  }, [draw]);

  return (
    <AppletLayout title="Families of Graphs" description="Explore how parameters affect function shapes.">
      <div className="space-y-3 mb-4 p-4 rounded-lg bg-muted">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <Label>f(x, k) =</Label>
            <Input value={funcStr} onChange={(e) => setFuncStr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && redraw()} />
          </div>
          <Button onClick={redraw}>Update</Button>
        </div>
        <div className="flex items-center gap-3">
          <Input type="number" value={kMin} onChange={(e) => setKMin(Number(e.target.value))} className="w-16" />
          <div className="flex-1">
            <Label>k = {k.toFixed(2)}</Label>
            <Slider min={kMin} max={kMax} step={(kMax - kMin) / 100} value={[k]}
              onValueChange={([v]) => { setK(v); if (appRef.current) draw(appRef.current, funcStr, v); }}
            />
          </div>
          <Input type="number" value={kMax} onChange={(e) => setKMax(Number(e.target.value))} className="w-16" />
        </div>
      </div>
      <MathCanvas onInit={handleInit} />
    </AppletLayout>
  );
};

export default FamiliesOfGraphs;
