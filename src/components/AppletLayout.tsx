import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface AppletLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const AppletLayout = ({ title, description, children }: AppletLayoutProps) => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Link>

        <header className="text-center mb-6 pb-4 border-b border-border">
          <h1 className="text-2xl md:text-3xl font-bold text-sky-400">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </header>

        {children}
      </div>
    </div>
  );
};

export default AppletLayout;
