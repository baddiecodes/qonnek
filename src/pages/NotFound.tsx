import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-6xl font-extrabold text-muted-foreground/10 font-mono">404</span>
        <p className="mt-3 text-sm text-muted-foreground/40">Page not found</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-sm text-primary/70 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
