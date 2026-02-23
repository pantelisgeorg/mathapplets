import { useState, useCallback, useRef } from "react";
import * as math from "mathjs";
import { GraphApp } from "@/lib/graph-app";
import AppletLayout from "@/components/AppletLayout";
import MathCanvas from "@/components/MathCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const FunctionComposition = () => {
  const [fStr, setFStr] = useState("x^2");
  const [gStr, setGStr] = useState("sin(x)");
  const [showF, setShowF] = useState(true);
  const [showG, setShowG] = useState(true);
  const [showFG, setShowFG] = useState(true);
  const appRef = useRef<GraphApp | null>(null);

  const draw = useCallback((app: GraphApp, f: string, g: string, sf: boolean, sg: boolean, sfg: boolean) => {
    app.clear();
    app.drawGrid();
    app.drawAxes();
    try {
      const fComp = math.parse(f).compile();
      const gComp = math.parse(g).compile();
      const fgComp = {
        evaluate: (scope: any) => {
          const gx = gComp.evaluate(scope);
          return fComp.evaluate({ x: gx });
        }
      };
      if (sf) app.plotFunction(fComp, 'blue');
      if (sg) app.plotFunction(gComp, 'red');
      if (sfg) app.plotFunction(fgComp, 'purple', 3);
    } catch {}
  }, []);

  const redraw = useCallback(() => {
    if (appRef.current) draw(appRef.current, fStr, gStr, showF, showG, showFG);
  }, [fStr, gStr, showF, showG, showFG, draw]);

  const handleInit = useCallback((app: GraphApp) => {
    appRef.current = app;
    draw(app, "x^2", "sin(x)", true, true, true);
  }, [draw]);

  return (
    <AppletLayout title="Function Composition" description="Visualize f(g(x)).">
      <div className="space-y-3 mb-4 p-4 rounded-lg bg-muted">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[150px]">
            <Label>f(x) =</Label>
            <Input value={fStr} onChange={(e) => setFStr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && redraw()} />
          </div>
          <div className="flex-1 min-w-[150px]">
            <Label>g(x) =</Label>
            <Input value={gStr} onChange={(e) => setGStr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && redraw()} />
          </div>
          <Button onClick={redraw}>Update</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={showF} onCheckedChange={(c) => setShowF(!!c)} /> f(x) <span className="text-blue-500">■</span></label>
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={showG} onCheckedChange={(c) => setShowG(!!c)} /> g(x) <span className="text-red-500">■</span></label>
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={showFG} onCheckedChange={(c) => setShowFG(!!c)} /> f(g(x)) <span className="text-purple-500">■</span></label>
        </div>
      </div>
      <MathCanvas onInit={handleInit} />
    </AppletLayout>
  );
};

export default FunctionComposition;
