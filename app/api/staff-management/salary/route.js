import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('slip');

    const staffId = formData.get('staffId');
    const salaryAmount = formData.get('salaryAmount');
    const paymentDate = new Date(formData.get('paymentDate'));
    const overtime = formData.get('overtime') || null;
    const leaveDeduction = formData.get('leaveDeduction') || null;
    const tdaCut = formData.get('tdaCut') || null;
    const festivalAdvance = formData.get('festivalAdvance') || null;
    const notes = formData.get('notes') || null;
    const paymentMode = formData.get('paymentMode') || 'Cash';

    let fileUrl = null;
    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name}`;
      const path = join(process.cwd(), 'public', 'salary_slips', fileName);

      await writeFile(path, buffer);
      fileUrl = `/salary_slips/${fileName}`;
    }

    await prisma.salarySlip.create({
      data: {
        staffId,
        salaryAmount: parseFloat(salaryAmount),
        paymentDate,
        overtime,
        leaveDeduction,
        tdaCut,
        festivalAdvance,
        notes,
        paymentMode,
        slipUrl: fileUrl,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}