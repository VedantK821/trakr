"use client";

import { useState } from "react";
import { removeMember, changeMemberRole } from "@/actions/members";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "./role-badge";

type Member = { id: string; display_name: string; role: string; user_id: string };

export function MemberList({ members, orgId, currentUserId, currentUserRole }: {
  members: Member[]; orgId: string; currentUserId: string; currentUserRole: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const isAdmin = currentUserRole === "admin";

  async function handleRemove(memberId: string) {
    const result = await removeMember(orgId, memberId);
    if (result.error) setError(result.error);
  }

  async function handleRoleChange(memberId: string, newRole: string) {
    const result = await changeMemberRole(orgId, memberId, newRole);
    if (result.error) setError(result.error);
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-accent-red">{error}</p>}
      {members.map((member) => {
        const initials = member.display_name.split(" ").map((n) => n[0]).join("").toUpperCase();
        return (
          <div key={member.id} className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-card p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-accent-ai text-xs font-bold text-white">{initials}</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium">{member.display_name}</p>
            </div>
            <div className="flex items-center gap-2">
              <RoleBadge role={member.role} />
              {isAdmin && member.user_id !== currentUserId && (
                <>
                  <select className="rounded bg-surface-deep px-2 py-1 text-xs text-muted-foreground border border-border-subtle" value={member.role} onChange={(e) => handleRoleChange(member.id, e.target.value)}>
                    <option value="admin">admin</option>
                    <option value="pm">pm</option>
                    <option value="dev">dev</option>
                    <option value="viewer">viewer</option>
                  </select>
                  <Button variant="ghost" size="sm" className="text-accent-red hover:text-red-300" onClick={() => handleRemove(member.id)}>
                    Remove
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
