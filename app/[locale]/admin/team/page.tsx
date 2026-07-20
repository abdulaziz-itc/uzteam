import { db } from '@/lib/db';
import { teamMembers as teamMembersTable } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default async function AdminTeam() {
  const teamMembers = await db
    .select()
    .from(teamMembersTable)
    .orderBy(desc(teamMembersTable.createdAt));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Team Members</h1>
        <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="h-5 w-5" />
          Add Member
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Role (EN)</th>
                <th className="px-6 py-4 font-medium">Photo URL</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b border-border transition-colors hover:bg-muted/40">
                  <td className="px-6 py-4 font-medium text-foreground">{member.name}</td>
                  <td className="px-6 py-4">{member.roleEn}</td>
                  <td className="max-w-[200px] truncate px-6 py-4">{member.photoUrl}</td>
                  <td className="flex justify-end gap-3 px-6 py-4">
                    <button className="text-muted-foreground transition-colors hover:text-primary">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground transition-colors hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {teamMembers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No team members found.
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
