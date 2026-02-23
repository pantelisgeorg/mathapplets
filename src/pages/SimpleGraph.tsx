import { useState, useCallback, useRef } from "react";
import * as math from "mathjs";
import { GraphApp } from "@/lib/graph-app";
import AppletLayout from "@/components/AppletLayout";
import MathCanvas from "@/components/MathCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SimpleGraph = () => {
  const [funcStr, setFuncStr] = useState("x^3 - x");
  const appRef = useRef<GraphApp | null>(null);

  const draw = useCallback(() => {
    const app = appRef.current;
    if (!app) return;
    try {
      const node = math.parse(funcStr);
      const compiled = node.compile();
      app.clear();
      app.drawGrid();
      app.drawAxes();
      app.plotFunction(compiled, 'blue');
    } catch { /* invalid */ }
  }, [funcStr]);

  const handleInit = useCallback((app: GraphApp) => {
    appRef.current = app;
    try {
      const node = math.parse("x^3 - x");
      const compiled = node.compile();
      app.clear();
      app.drawGrid();
      app.drawAxes();
      app.plotFunction(compiled, 'blue');
    } catch { /* */ }
  }, []);

  return (
    <AppletLayout title="Simple Graph Visualizer" description="Basic function plotting tool.">
      <div className="flex flex-wrap items-end gap-3 mb-4 p-4 rounded-lg bg-muted">
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="func">f(x) =</Label>
          <Input
            id="func"
            value={funcStr}
            onChange={(e) => setFuncStr(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && draw()}
          />
        </div>
        <Button onClick={draw}>Plot</Button>
      </div>
      <MathCanvas onInit={handleInit} />
    </AppletLayout>
  );
};

export default SimpleGraph;
