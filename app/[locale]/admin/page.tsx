import { db } from '@/lib/db';
import { leads, posts, calculatorSubmissions } from '@/lib/db/schema';
import { desc, count } from 'drizzle-orm';
import { Users, FileText, Calculator } from 'lucide-react';

export default async function AdminDashboard() {
  // Fetch some quick stats
  const [[{ value: leadsCount }], [{ value: postsCount }], [{ value: calcSubmissions }], recentLeads] =
    await Promise.all([
      db.select({ value: count() }).from(leads),
      db.select({ value: count() }).from(posts),
      db.select({ value: count() }).from(calculatorSubmissions),
      db.select().from(leads).orderBy(desc(leads.createdAt)).limit(5),
    ]);

  const stats = [
    { title: 'Total Leads', value: leadsCount || 0, icon: Users },
    { title: 'Calculator Submissions', value: calcSubmissions || 0, icon: Calculator },
    { title: 'Blog Posts', value: postsCount || 0, icon: FileText },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-foreground">Dashboard</h1>

      <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 card-shadow"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card card-shadow">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-xl font-bold text-foreground">Recent Leads</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-border transition-colors hover:bg-muted/40">
                  <td className="px-6 py-4 font-medium text-foreground">{lead.name}</td>
                  <td className="px-6 py-4">{lead.email}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
