export function Logo({ className }: { className?: string }) {
  return (
    <span className={`font-heading font-extrabold tracking-tight bg-gradient-to-r from-accent-ai via-indigo-500 to-accent-blue bg-clip-text text-transparent ${className}`}>
      Trakr
    </span>
  );
}
