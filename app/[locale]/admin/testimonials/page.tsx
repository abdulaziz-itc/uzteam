import { desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { testimonials } from '@/lib/db/schema';
import TestimonialActions from './actions';

export const dynamic = 'force-dynamic';

type Row = typeof testimonials.$inferSelect;

function TestimonialTable({ items, title }: { items: Row[]; title: string }) {
  return (
    <div className="mb-10 overflow-hidden rounded-2xl border border-border bg-card card-shadow">
      <div className="flex items-center justify-between border-b border-border p-6">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
          {items.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Message</th>
              <th className="px-6 py-4 font-medium">Lang</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border align-top transition-colors hover:bg-muted/40">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{item.name}</div>
                  {item.position && <div className="text-xs">{item.position}</div>}
                </td>
                <td className="max-w-md px-6 py-4">
                  <p className="line-clamp-3 whitespace-pre-wrap">{item.message}</p>
                </td>
                <td className="px-6 py-4 uppercase">{item.locale}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <TestimonialActions id={item.id} approved={item.isApproved} />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  Nothing here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function AdminTestimonials() {
  const rows = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));

  const pending = rows.filter((r) => !r.isApproved);
  const approved = rows.filter((r) => r.isApproved);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-foreground">Testimonials</h1>
      <TestimonialTable items={pending} title="Pending review" />
      <TestimonialTable items={approved} title="Approved (visible on site)" />
    </div>
  );
}
