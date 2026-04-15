import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export async function Topnav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const initials = user?.user_metadata?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <header className="flex h-14 items-center justify-between border-b border-border-subtle bg-surface-base/80 px-6 backdrop-blur-xl">
      <div />
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-accent-ai text-xs font-bold text-white">{initials}</AvatarFallback>
        </Avatar>
        <form action={signOut}>
          <Button variant="ghost" size="sm" className="text-muted-foreground">Sign out</Button>
        </form>
      </div>
    </header>
  );
}
