import { useState, useCallback } from "react";
import * as math from "mathjs";
import AppletLayout from "@/components/AppletLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Evaluator = () => {
  const [varX, setVarX] = useState("2");
  const [varY, setVarY] = useState("3");
  const [expr1, setExpr1] = useState("x^2 + y^2");
  const [expr2, setExpr2] = useState("sqrt(x^2 + y^2)");
  const [res1, setRes1] = useState("...");
  const [res2, setRes2] = useState("...");
  const [error, setError] = useState("");

  const evaluate = useCallback(() => {
    setError("");
    try {
      const scope = {
        x: math.evaluate(varX),
        y: math.evaluate(varY),
      };
      try { setRes1(String(math.evaluate(expr1, scope))); } catch { setRes1("Error"); }
      try { setRes2(String(math.evaluate(expr2, scope))); } catch { setRes2("Error"); }
    } catch (e: any) {
      setError("Invalid variable input: " + e.message);
    }
  }, [varX, varY, expr1, expr2]);

  // Auto-evaluate on mount
  useState(() => { evaluate(); });

  return (
    <AppletLayout title="Evaluator" description="Evaluate mathematical expressions.">
      <div className="space-y-4 p-4 rounded-lg bg-muted">
        <h3 className="font-semibold text-foreground">Variables</h3>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Label>x =</Label>
            <Input value={varX} onChange={(e) => setVarX(e.target.value)} className="w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Label>y =</Label>
            <Input value={varY} onChange={(e) => setVarY(e.target.value)} className="w-24" />
          </div>
        </div>

        <h3 className="font-semibold text-foreground">Expressions</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>f =</Label>
            <Input value={expr1} onChange={(e) => setExpr1(e.target.value)} className="flex-1" />
            <span>=</span>
            <span className="font-bold text-primary min-w-[60px]">{res1}</span>
          </div>
          <div className="flex items-center gap-2">
            <Label>g =</Label>
            <Input value={expr2} onChange={(e) => setExpr2(e.target.value)} className="flex-1" />
            <span>=</span>
            <span className="font-bold text-primary min-w-[60px]">{res2}</span>
          </div>
        </div>

        <Button onClick={evaluate}>Calculate</Button>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    </AppletLayout>
  );
};

export default Evaluator;
