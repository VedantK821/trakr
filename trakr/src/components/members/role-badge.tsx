import { Badge } from "@/components/ui/badge";

const roleColors: Record<string, string> = {
  admin: "bg-red-500/10 text-red-400 border-red-400/20",
  pm: "bg-amber-500/10 text-amber-400 border-amber-400/20",
  dev: "bg-blue-500/10 text-blue-400 border-blue-400/20",
  viewer: "bg-white/5 text-muted-foreground border-border-subtle",
};

export function RoleBadge({ role }: { role: string }) {
  return (
    <Badge variant="outline" className={`font-mono text-xs ${roleColors[role] || roleColors.viewer}`}>
      {role}
    </Badge>
  );
}
