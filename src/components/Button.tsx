import { cn } from "@/lib/utils";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler;
}

const baseStyles =
  "inline-flex items-center justify-center font-medium transition-all duration-300 ease-out rounded-full focus:outline-none focus:ring-2 focus:ring-gold/50 active:scale-95";

const variants = {
  primary:
    "bg-gold text-background hover:bg-[#E5BC6B] hover:shadow-[0_0_20px_rgba(212,168,83,0.3)]",
  secondary:
    "bg-surface text-text-primary hover:bg-surface/80 border border-white/5 hover:border-gold/30",
  outline:
    "bg-transparent text-text-primary border border-text-muted/30 hover:border-gold hover:text-gold",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className,
  onClick,
}: ButtonProps) {
  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
