import { useState, useCallback, useRef } from "react";
import * as math from "mathjs";
import { GraphApp } from "@/lib/graph-app";
import AppletLayout from "@/components/AppletLayout";
import MathCanvas from "@/components/MathCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Parametric = () => {
  const [xStr, setXStr] = useState("sin(3*t)");
  const [yStr, setYStr] = useState("cos(5*t)");
  const [tMinStr, setTMinStr] = useState("0");
  const [tMaxStr, setTMaxStr] = useState("2*pi");
  const [error, setError] = useState("");
  const appRef = useRef<GraphApp | null>(null);

  const draw = useCallback((app: GraphApp, xE: string, yE: string, tMn: string, tMx: string) => {
    setError("");
    app.clear();
    app.drawGrid();
    app.drawAxes();
    try {
      const xComp = math.parse(xE).compile();
      const yComp = math.parse(yE).compile();
      const min = math.evaluate(tMn) as number;
      const max = math.evaluate(tMx) as number;
      app.plotParametric(xComp, yComp, min, max, 'blue');
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const redraw = useCallback(() => {
    if (appRef.current) draw(appRef.current, xStr, yStr, tMinStr, tMaxStr);
  }, [xStr, yStr, tMinStr, tMaxStr, draw]);

  const handleInit = useCallback((app: GraphApp) => {
    appRef.current = app;
    draw(app, "sin(3*t)", "cos(5*t)", "0", "2*pi");
  }, [draw]);

  return (
    <AppletLayout title="Parametric Curves" description="Plot curves defined by parametric equations.">
      <div className="space-y-3 mb-4 p-4 rounded-lg bg-muted">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[150px]">
            <Label>x(t) =</Label>
            <Input value={xStr} onChange={(e) => setXStr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && redraw()} />
          </div>
          <div className="flex-1 min-w-[150px]">
            <Label>y(t) =</Label>
            <Input value={yStr} onChange={(e) => setYStr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && redraw()} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label>t ∈ [</Label>
          <Input value={tMinStr} onChange={(e) => setTMinStr(e.target.value)} className="w-20" />
          <span>,</span>
          <Input value={tMaxStr} onChange={(e) => setTMaxStr(e.target.value)} className="w-20" />
          <span>]</span>
          <Button onClick={redraw}>Plot</Button>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
      <MathCanvas onInit={handleInit} />
    </AppletLayout>
  );
};

export default Parametric;
