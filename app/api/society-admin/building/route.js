import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId } = await auth()
      if (!userId) return new NextResponse("Unauthorized", { status: 401 });

      
      const admin = await db.user.findUnique({
        where: {
          clerkUserId: userId,
        },
        include: {
          society: true,
        },
      });


    const body = await req.json();
    const { name, numberOfFloors } = body;


    if (!admin) {
      console.error("Admin not found");
      return new NextResponse.json({error: "Admin not found"}, { status: 404});
    }

    const building = await db.building.create({
      data: {
        name,
        numberOfFloors: parseInt(numberOfFloors),
        societyId: admin.societyId,
      },
    });

    return NextResponse.json(building);
  } catch (err) {
    console.error(err);
    return new NextResponse("Server Error", { status: 500 });
  }
}




export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Is this user a society‑admin?
  const admin = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
   });
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const buildings = await db.building.findMany({
    where: { societyId: admin.societyId },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ buildings });
}