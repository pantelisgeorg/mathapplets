import { useState, useCallback, useRef } from "react";
import * as math from "mathjs";
import { GraphApp } from "@/lib/graph-app";
import AppletLayout from "@/components/AppletLayout";
import MathCanvas from "@/components/MathCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MultiGraph = () => {
  const [fStr, setFStr] = useState("sin(x)");
  const [gStr, setGStr] = useState("cos(x)");
  const appRef = useRef<GraphApp | null>(null);

  const draw = useCallback((app: GraphApp, f: string, g: string) => {
    app.clear();
    app.drawGrid();
    app.drawAxes();
    try { if (f) app.plotFunction(math.parse(f).compile(), 'blue'); } catch {}
    try { if (g) app.plotFunction(math.parse(g).compile(), 'red'); } catch {}
  }, []);

  const redraw = useCallback(() => {
    if (appRef.current) draw(appRef.current, fStr, gStr);
  }, [fStr, gStr, draw]);

  const handleInit = useCallback((app: GraphApp) => {
    appRef.current = app;
    draw(app, "sin(x)", "cos(x)");
  }, [draw]);

  return (
    <AppletLayout title="Multi Graph Visualizer" description="Plot and compare multiple functions.">
      <div className="flex flex-wrap items-end gap-3 mb-4 p-4 rounded-lg bg-muted">
        <div className="flex-1 min-w-[150px]">
          <Label>f(x) = <span className="text-blue-500">■</span></Label>
          <Input value={fStr} onChange={(e) => setFStr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && redraw()} />
        </div>
        <div className="flex-1 min-w-[150px]">
          <Label>g(x) = <span className="text-red-500">■</span></Label>
          <Input value={gStr} onChange={(e) => setGStr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && redraw()} />
        </div>
        <Button onClick={redraw}>Plot</Button>
      </div>
      <MathCanvas onInit={handleInit} />
    </AppletLayout>
  );
};

export default MultiGraph;
