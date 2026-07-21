import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { calculatorSubmissions, leads } from '@/lib/db/schema';
import { sendRequestReceivedEmail } from '@/lib/mailer';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { submission_id, name, email, phone, company } = await req.json();

    if (!submission_id || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Get the submission
    const [subData] = await db
      .select()
      .from(calculatorSubmissions)
      .where(eq(calculatorSubmissions.id, submission_id))
      .limit(1);

    if (!subData) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (subData.leadId) {
      // Already unlocked. Prices stay server-side (admin only).
      return NextResponse.json({
        success: true,
        tier2: { estimated_days: subData.estimatedDays },
      });
    }

    // 2. Create the Lead
    const [leadData] = await db
      .insert(leads)
      .values({
        name,
        email,
        phone,
        company,
        source: 'calculator',
        notes: `Unlocked Calculator Result. Complexity: ${subData.complexity}`,
      })
      .returning({ id: leads.id });

    // 3. Update Submission with lead_id (PDF generation could be added here later)
    const mockPdfUrl = '/placeholder-br.pdf';

    await db
      .update(calculatorSubmissions)
      .set({ leadId: leadData.id, pdfUrl: mockPdfUrl })
      .where(eq(calculatorSubmissions.id, submission_id));

    // Fire-and-forget acknowledgement email to the client.
    void sendRequestReceivedEmail({
      to: String(email),
      name: String(name),
      locale: subData.locale ?? undefined,
    });

    // Return the confirmation data. Prices stay server-side (admin only).
    return NextResponse.json({
      success: true,
      tier2: { estimated_days: subData.estimatedDays },
    });
  } catch (error) {
    console.error('Gate API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
