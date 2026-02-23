import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const applets = [
  { path: "/derivatives", title: "Derivatives", desc: "Explore functions and their derivatives with tangent lines.", tag: "Calculus" },
  { path: "/simple-graph", title: "Simple Graph", desc: "Basic function plotter.", tag: "Graphing" },
  { path: "/multi-graph", title: "Multi Graph", desc: "Plot multiple functions simultaneously.", tag: "Graphing" },
  { path: "/families", title: "Families of Graphs", desc: "Explore function families with a parameter slider.", tag: "Graphing" },
  { path: "/animated", title: "Animated Graph", desc: "Automatically animated function parameters.", tag: "Animation" },
  { path: "/secant-tangent", title: "Secant & Tangent", desc: "Visualize the limit definition of the derivative.", tag: "Calculus" },
  { path: "/composition", title: "Function Composition", desc: "Visualize f(g(x)).", tag: "Functions" },
  { path: "/evaluator", title: "Evaluator", desc: "Evaluate mathematical expressions.", tag: "Tools" },
  { path: "/parametric", title: "Parametric Curves", desc: "Plot curves defined by x(t) and y(t).", tag: "Parametric" },
  { path: "/riemann", title: "Riemann Sums", desc: "Visualize integration via rectangle approximation.", tag: "Calculus" },
  { path: "/integral-curves", title: "Integral Curves", desc: "Vector fields and direction fields.", tag: "Diff Eq" },
  { path: "/scatter", title: "Scatter Plot", desc: "Plot data points and regression lines.", tag: "Statistics" },
  { path: "/epsilon-delta", title: "Epsilon Delta", desc: "Visualize the formal definition of a limit.", tag: "Calculus" },
];

const tagColors: Record<string, string> = {};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            Math Applets Collection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive Java applets transformed through HTML/Canvas and Math.js to React pages.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {applets.map((app) => (
            <Link
              key={app.path}
              to={app.path}
              className="group block rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/50"
            >
              <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors mb-2">
                  {app.title}
              </h3>
              <p className="text-sm text-muted-foreground">{app.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
