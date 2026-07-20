import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { calculatorSubmissions, leads } from '@/lib/db/schema';

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
      // Already unlocked
      return NextResponse.json({
        success: true,
        tier2: {
          min_price: subData.minPrice,
          max_price: subData.maxPrice,
          estimated_days: subData.estimatedDays,
          pdf_url: subData.pdfUrl,
        },
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

    // Return the unlocked data
    return NextResponse.json({
      success: true,
      tier2: {
        min_price: subData.minPrice,
        max_price: subData.maxPrice,
        estimated_days: subData.estimatedDays,
        pdf_url: mockPdfUrl,
      },
    });
  } catch (error) {
    console.error('Gate API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
