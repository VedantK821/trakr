"use client";

import { useState } from "react";
import { inviteMember } from "@/actions/members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InviteForm({ orgId }: { orgId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setInviteLink(null);
    const result = await inviteMember(orgId, formData);
    if (result.error) { setError(result.error); }
    else if (result.token) { setInviteLink(`${window.location.origin}/invite/${result.token}`); }
    setPending(false);
  }

  return (
    <div className="space-y-4">
      <form action={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="colleague@company.com" className="bg-surface-card border-border-subtle" />
        </div>
        <div className="w-32 space-y-2">
          <Label htmlFor="role">Role</Label>
          <select id="role" name="role" className="flex h-10 w-full rounded-md border border-border-subtle bg-surface-card px-3 py-2 text-sm">
            <option value="dev">dev</option>
            <option value="pm">pm</option>
            <option value="admin">admin</option>
            <option value="viewer">viewer</option>
          </select>
        </div>
        <Button type="submit" disabled={pending}>{pending ? "Sending..." : "Invite"}</Button>
      </form>
      {error && <p className="text-sm text-accent-red">{error}</p>}
      {inviteLink && (
        <div className="rounded-lg border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 p-3">
          <p className="text-xs text-muted-foreground mb-1">Share this invite link:</p>
          <code className="text-xs text-accent-ai break-all">{inviteLink}</code>
        </div>
      )}
    </div>
  );
}
