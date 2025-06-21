import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  const data = await req.formData();
  const name = data.get("name");
  const role = data.get("role");
  const joinedOn = data.get("joinedOn");
  const image = data.get("image"); // file upload

  // Assuming image is being saved as URL or base64 string
  const saved = await prisma.staff.create({
    data: {
      name,
      role,
      joinedOn,
      image: image.name || "", // You can also store file buffer or URL
    },
  });

  return NextResponse.json(saved);
}

export async function GET() {
  const staffList = await prisma.staff.findMany();
  return NextResponse.json(staffList);
}
