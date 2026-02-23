import { useState, useCallback, useRef } from "react";
import { GraphApp } from "@/lib/graph-app";
import AppletLayout from "@/components/AppletLayout";
import MathCanvas from "@/components/MathCanvas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_DATA = `1, 2
2, 3.5
3, 4
4, 5.5
5, 7`;

const ScatterPlot = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [showReg, setShowReg] = useState(true);
  const [stats, setStats] = useState("Regression: y = mx + b");
  const appRef = useRef<GraphApp | null>(null);

  const draw = useCallback((app: GraphApp, dataStr: string, reg: boolean) => {
    app.clear();
    app.drawGrid();
    app.drawAxes();
    try {
      const lines = dataStr.split('\n');
      const points: { x: number; y: number }[] = [];
      for (const line of lines) {
        const parts = line.split(',');
        if (parts.length >= 2) {
          const x = parseFloat(parts[0]), y = parseFloat(parts[1]);
          if (!isNaN(x) && !isNaN(y)) points.push({ x, y });
        }
      }
      if (points.length === 0) return;
      for (const p of points) app.drawPoint(p.x, p.y, 'black');

      if (reg && points.length >= 2) {
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        const n = points.length;
        for (const p of points) { sumX += p.x; sumY += p.y; sumXY += p.x * p.y; sumXX += p.x * p.x; }
        const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const b = (sumY - m * sumX) / n;
        const f = { evaluate: (scope: any) => m * scope.x + b };
        app.plotFunction(f, 'red', 2);
        setStats(`Regression: y = ${m.toFixed(2)}x + ${b.toFixed(2)}`);
      } else {
        setStats("Regression: Need >1 points");
      }
    } catch {}
  }, []);

  const handleInit = useCallback((app: GraphApp) => {
    appRef.current = app;
    draw(app, DEFAULT_DATA, true);
  }, [draw]);

  return (
    <AppletLayout title="Scatter Plot" description="Analyze data points with linear regression.">
      <div className="space-y-3 mb-4 p-4 rounded-lg bg-muted">
        <div>
          <Label>Data Points (x,y per line):</Label>
          <Textarea value={data} onChange={(e) => setData(e.target.value)} rows={5} className="font-mono mt-1" />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={showReg} onCheckedChange={(c) => setShowReg(!!c)} /> Regression Line
          </label>
          <Button onClick={() => appRef.current && draw(appRef.current, data, showReg)}>Update</Button>
        </div>
      </div>
      <MathCanvas onInit={handleInit} />
      <p className="mt-2 text-sm text-muted-foreground p-2 bg-muted rounded">{stats}</p>
    </AppletLayout>
  );
};

export default ScatterPlot;
