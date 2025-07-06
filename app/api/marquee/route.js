import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const societyId = searchParams.get("societyId");

  if (!societyId) {
    return NextResponse.json([], { status: 200 });
  }

  const notices = await db.marqueeNotice.findMany({
    where: { societyId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return NextResponse.json(notices);
}


export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { content, societyId } = await req.json();

    if (!content || !societyId) {
      return NextResponse.json(
        { error: "Missing content or societyId" },
        { status: 400 }
      );
    }

    const notice = await db.marqueeNotice.create({
      data: {
        content,
        societyId,
      },
    });

    return NextResponse.json(notice);
  } catch (error) {
    console.error("Error creating notice:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await db.marqueeNotice.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Notice deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}