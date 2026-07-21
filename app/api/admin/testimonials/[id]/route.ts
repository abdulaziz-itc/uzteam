import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { testimonials } from '@/lib/db/schema';
import { getSession } from '@/lib/session';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

// Admin: approve / unapprove a testimonial.
export async function PATCH(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { approved } = await req.json();

  const [row] = await db
    .update(testimonials)
    .set({ isApproved: Boolean(approved) })
    .where(eq(testimonials.id, id))
    .returning({ id: testimonials.id });

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

// Admin: delete a testimonial.
export async function DELETE(_req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const [row] = await db
    .delete(testimonials)
    .where(eq(testimonials.id, id))
    .returning({ id: testimonials.id });

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
