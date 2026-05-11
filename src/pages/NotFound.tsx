import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center animate-fade-in-up">
        <span className="text-6xl font-extrabold text-muted-foreground/10 font-mono">404</span>
        <p className="mt-3 text-sm text-muted-foreground">Page not found</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
