"use client";

import { useState } from "react";
import { createOrg } from "@/actions/org";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateOrgForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [slug, setSlug] = useState("");

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 30);
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await createOrg(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Organization name</Label>
        <Input id="name" name="name" required placeholder="Acme Corp" className="bg-surface-card border-border-subtle" onChange={(e) => setSlug(generateSlug(e.target.value))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">URL slug</Label>
        <Input id="slug" name="slug" required placeholder="acme-corp" value={slug} onChange={(e) => setSlug(e.target.value)} className="bg-surface-card border-border-subtle font-mono text-sm" />
        <p className="text-xs text-muted-foreground">
          app.trakr.io/<span className="text-accent-ai">{slug || "your-org"}</span>
        </p>
      </div>
      {error && <p className="text-sm text-accent-red">{error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating..." : "Create organization"}
      </Button>
    </form>
  );
}
