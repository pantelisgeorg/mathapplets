import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SimpleGraph from "./pages/SimpleGraph";
import Derivatives from "./pages/Derivatives";
import MultiGraph from "./pages/MultiGraph";
import FamiliesOfGraphs from "./pages/FamiliesOfGraphs";
import AnimatedGraph from "./pages/AnimatedGraph";
import SecantTangent from "./pages/SecantTangent";
import FunctionComposition from "./pages/FunctionComposition";
import Evaluator from "./pages/Evaluator";
import Parametric from "./pages/Parametric";
import RiemannSums from "./pages/RiemannSums";
import IntegralCurves from "./pages/IntegralCurves";
import ScatterPlot from "./pages/ScatterPlot";
import EpsilonDelta from "./pages/EpsilonDelta";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/simple-graph" element={<SimpleGraph />} />
          <Route path="/derivatives" element={<Derivatives />} />
          <Route path="/multi-graph" element={<MultiGraph />} />
          <Route path="/families" element={<FamiliesOfGraphs />} />
          <Route path="/animated" element={<AnimatedGraph />} />
          <Route path="/secant-tangent" element={<SecantTangent />} />
          <Route path="/composition" element={<FunctionComposition />} />
          <Route path="/evaluator" element={<Evaluator />} />
          <Route path="/parametric" element={<Parametric />} />
          <Route path="/riemann" element={<RiemannSums />} />
          <Route path="/integral-curves" element={<IntegralCurves />} />
          <Route path="/scatter" element={<ScatterPlot />} />
          <Route path="/epsilon-delta" element={<EpsilonDelta />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
