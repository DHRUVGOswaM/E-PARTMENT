import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db  } from "@/lib/db";

export async function POST(req) {
  try {
    const { userId } = await auth();
      if (!userId) return new NextResponse("Unauthorized", { status: 401 });

      console.log("User ID:", userId);
      
      const admin = await db.user.findUnique({
          where: { id: userId },
          include: {
              society: true,
              role: "SOCIETY_ADMIN",
           },
      })

    console.log("Admin Data:", admin);

    const body = await req.json();
    const { name, numberOfFloors } = body;


    if (!admin) return new NextResponse("Admin not found", { status: 404 });

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
