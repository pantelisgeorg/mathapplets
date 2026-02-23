import { useState, useCallback, useRef, useEffect } from "react";
import * as math from "mathjs";
import { GraphApp } from "@/lib/graph-app";
import AppletLayout from "@/components/AppletLayout";
import MathCanvas from "@/components/MathCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Play, Pause } from "lucide-react";

const AnimatedGraph = () => {
  const [funcStr, setFuncStr] = useState("sin(k*x)");
  const [k, setK] = useState(1);
  const [playing, setPlaying] = useState(false);
  const appRef = useRef<GraphApp | null>(null);
  const kRef = useRef(k);

  const draw = useCallback((app: GraphApp, expr: string, kVal: number) => {
    app.clear();
    app.drawGrid();
    app.drawAxes();
    try {
      const compiled = math.parse(expr).compile();
      app.plotFunction(compiled, 'blue', 2, [], { k: kVal });
    } catch {}
  }, []);

  useEffect(() => {
    kRef.current = k;
  }, [k]);

  useEffect(() => {
    if (!playing) return;
    let id: number;
    const animate = () => {
      let newK = kRef.current + 0.05;
      if (newK > 5) newK = -5;
      kRef.current = newK;
      setK(newK);
      if (appRef.current) draw(appRef.current, funcStr, newK);
      id = requestAnimationFrame(animate);
    };
    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [playing, funcStr, draw]);

  const handleInit = useCallback((app: GraphApp) => {
    appRef.current = app;
    draw(app, "sin(k*x)", 1);
  }, [draw]);

  return (
    <AppletLayout title="Animated Graph" description="Watch parameters change in real-time.">
      <div className="space-y-3 mb-4 p-4 rounded-lg bg-muted">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <Label>f(x, k) =</Label>
            <Input value={funcStr} onChange={(e) => setFuncStr(e.target.value)} />
          </div>
          <Button onClick={() => { if (appRef.current) draw(appRef.current, funcStr, k); }}>Update</Button>
          <Button variant={playing ? "destructive" : "default"} onClick={() => setPlaying(!playing)}>
            {playing ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {playing ? "Pause" : "Play"}
          </Button>
        </div>
        <div>
          <Label>k = {k.toFixed(1)}</Label>
          <Slider min={-5} max={5} step={0.1} value={[k]}
            onValueChange={([v]) => { setK(v); if (appRef.current) draw(appRef.current, funcStr, v); }}
          />
        </div>
      </div>
      <MathCanvas onInit={handleInit} />
    </AppletLayout>
  );
};

export default AnimatedGraph;
