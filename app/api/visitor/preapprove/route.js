import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const {
      visitorName,
      phoneNumber,
      vehicleNumber, // Optional
      purpose,
      flatNumber,
      residentName,
      imageUrl, // Optional
    } = body;

    // Find the flat and resident user by flat number and resident name
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    console.log("User:", user);

    const flat = await db.flat.findMany({
      where: {
        ownerId: user.id,
      }
    })
    console.log("Flat:", flat);

    

    // Generate QR code token
    const qrCodeToken = nanoid(32);

    // Create the visitor record
    const visitor = await db.visitor.create({
      data: {
        name: visitorName,
        phoneNumber,
        vehicleNumber: vehicleNumber || null,
        purpose,
        visitingFlatId: flat[0].id,
        preApprovedByUserId: flat[0].ownerId,
        status: "PENDING",
        qrCodeToken,
        imageUrl: imageUrl || null,
      },
    });

    const qrCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/visitor/checkin?token=${qrCodeToken}`;

    return NextResponse.json({ visitor, qrCodeUrl });
  } catch (err) {
    console.error("Pre-approval Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
