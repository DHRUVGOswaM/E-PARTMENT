// app/api/watchman/logs/route.js
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/** helper: verify user & role */
async function currentWatchman() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;

  const user = await db.user.findUnique({ where: { clerkUserId } });
    if (!user || user.role !== "WATCHMAN") return null;
    
    console.log("Current Watchman:", user);

  // link watchman staff row (optional)
  const staff = await db.staff.findFirst({
    where: { userId: user.id, role: "WATCHMAN" },
  });

    console.log("Associated Staff:", staff);
  return { user, staff };
}

// ── GET (list today’s open logs) ─────────────────────────
export async function GET() {
  const ctx = await currentWatchman();
  if (!ctx) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const logs = await db.entryLog.findMany({
    where: {
      societyId: ctx.user.societyId,
      inTime: { gte: today },
      outTime: null,
    },
    orderBy: { inTime: "desc" },
  });

  return NextResponse.json(logs);
}

// ── POST (NEW entry) ─────────────────────────────────────
export async function POST(req) {
  const ctx = await currentWatchman();
  if (!ctx) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { personType, personName, vehicleNumber } = await req.json();
  if (!personType || !personName)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const log = await db.entryLog.create({
    data: {
      personType,
      personName,
      vehicleNumber,
      societyId: ctx.user.societyId,
      watchmanId: ctx.staff?.id ?? ctx.user.id, // fallback
    },
  });

  return NextResponse.json(log, { status: 201 });
}

// ── PATCH (mark OUT)  expects ?id=<entryLogId> ───────────
export async function PATCH(req) {
  const ctx = await currentWatchman();
  if (!ctx) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const updated = await db.entryLog.update({
    where: { id },
    data: { outTime: new Date() },
  });

  return NextResponse.json(updated);
}
