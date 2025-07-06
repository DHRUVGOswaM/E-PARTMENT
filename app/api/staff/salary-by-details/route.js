import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const phone = searchParams.get("phone");

    if (!name || !phone) {
      return NextResponse.json({ 
        success: false, 
        error: "Name and phone number are required" 
      }, { status: 400 });
    }

    // Validate phone number format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ 
        success: false, 
        error: "Please enter a valid 10-digit mobile number starting with 6-9" 
      }, { status: 400 });
    }

    // Find staff by name and phone number
    const staff = await db.staff.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive' // Case-insensitive search
        },
        phoneNumber: phone
      }
    });

    if (!staff) {
      return NextResponse.json({ 
        success: false, 
        error: "No staff member found with the provided name and phone number" 
      }, { status: 404 });
    }

    // Get salary records for this staff member
    const salaryRecords = await db.salary.findMany({
      where: { 
        staff_id: staff.id 
      },
      orderBy: { 
        payDate: "desc" 
      },
    });

    // Format the salary records to match the expected structure
    const formattedSlips = salaryRecords.map(record => ({
      id: record.id,
      amount: record.amount,
      paidAt: record.payDate,
      status: record.status,
      notes: null, // Add if you have notes field
      overtime: null, // Add if you have overtime field
      leaveDeduction: null, // Add if you have deduction field
      tdaCut: null,
      festivalAdvance: null,
      slipFile: null // Add if you have file attachments
    }));

    return NextResponse.json({ 
      success: true, 
      slips: formattedSlips,
      staffInfo: {
        name: staff.name,
        role: staff.role,
        phoneNumber: staff.phoneNumber
      }
    });

  } catch (error) {
    console.error("Error in salary-by-details API:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
