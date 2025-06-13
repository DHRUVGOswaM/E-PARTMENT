/* POST body  {
       flatNumber : string
       areaSqFt   : number
       bedrooms   : number
       buildingId : string
       residentId ?: string   // optional – assign immediately
   }
*/
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function POST(req) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await db.user.findUnique({
    where: {
      clerkUserId: userId,
  } });
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { flatNumber, areaSqFt, bedrooms, buildingId, residentId } =
    await req.json();

  // Make sure the building belongs to this admin’s society
  const building = await db.building.findFirst({
    where: { id: buildingId, societyId: admin.societyId },
  });
  if (!building)
    return NextResponse.json({ error: "Invalid building" }, { status: 400 });

  // Create the flat
  const flat = await db.flat.create({
    data: {
      flatNumber,
      areaSqFt,
      bedrooms,
      buildingId,
      isOccupied: !!residentId,
      residentId: residentId || null,
    },
  });

  // If residentId was passed, also update that user’s role → SOCIETY_MEMBER
  if (residentId) {
    await db.user.update({
      where: { id: residentId },
      data: { role: "HOUSE_OWNER" },
    });
  }

  return NextResponse.json({ flat });
}
