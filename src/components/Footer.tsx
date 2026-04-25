import { FileText, Github } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/50 py-12">
    <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <Link to="/" className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        <span className="font-display font-bold text-foreground">
          ReadMe<span className="gradient-text">AI</span>
        </span>
      </Link>
            <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Github className="w-5 h-5" />
      </a>
    </div>
  </footer>
);

export default Footer;
