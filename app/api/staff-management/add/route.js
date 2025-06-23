import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req) {
  const data = await req.formData();
  const name = data.get("name");
  const role = data.get("role");
  const joinedOn = data.get("joinedOn");
  const image = data.get("image"); // file upload

  const { userId } = await auth();
  const user = await db.user.findUnique({
    where: {clerkUserId: userId}
  })
  // Assuming image is being saved as URL or base64 string
  const saved = await db.staff.create({
    data: {
      id: userId,
      name,
      role,
      image: image || "", // You can also store file buffer or URL
      userId: user.id,
      salary: 50000,
      societyId: user.societyId,

    },
  });

  return NextResponse.json(saved);
}

export async function GET() {
  const staffList = await prisma.staff.findMany();
  return NextResponse.json(staffList);
}
