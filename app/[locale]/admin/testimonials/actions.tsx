'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Trash2 } from 'lucide-react';

export default function TestimonialActions({ id, approved }: { id: string; approved: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const call = async (fn: () => Promise<Response>) => {
    setBusy(true);
    try {
      await fn();
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const setApproved = (value: boolean) =>
    call(() =>
      fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: value }),
      }),
    );

  const remove = () => {
    if (!confirm('Delete this testimonial?')) return;
    call(() => fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' }));
  };

  return (
    <div className="flex justify-end gap-2">
      {approved ? (
        <button
          onClick={() => setApproved(false)}
          disabled={busy}
          title="Hide from site"
          className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" /> Hide
        </button>
      ) : (
        <button
          onClick={() => setApproved(true)}
          disabled={busy}
          title="Approve — show on site"
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" /> Approve
        </button>
      )}
      <button
        onClick={remove}
        disabled={busy}
        title="Delete"
        className="inline-flex items-center rounded-lg border border-border px-2.5 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
