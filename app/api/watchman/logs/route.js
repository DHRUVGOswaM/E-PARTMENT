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

// ── GET (list today's open logs) ─────────────────────────
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

  try {
    const body = await req.json();
    console.log("Received request body:", body);

    const { personType, personName, personId, vehicleNumber } = body;

    // Validate required fields
    if (!personType) {
      return NextResponse.json(
        { error: "personType is required" },
        { status: 400 }
      );
    }

    // For residents, we need either personName or personId
    let finalPersonName = personName;

    if (personType === "RESIDENT") {
      if (!personName && !personId) {
        return NextResponse.json(
          { error: "Either personName or personId is required for residents" },
          { status: 400 }
        );
      }

      // If we have personId but no personName, fetch the resident's name
      if (personId && !personName) {
        const resident = await db.user.findUnique({
          where: { id: personId },
          select: { name: true, email: true },
        });

        if (!resident) {
          return NextResponse.json(
            { error: "Resident not found" },
            { status: 404 }
          );
        }

        finalPersonName =
          resident.name || resident.email || `Resident ${personId}`;
      }
    } else {
      // For non-residents, personName is required
      if (!personName) {
        return NextResponse.json(
          { error: "personName is required" },
          { status: 400 }
        );
      }
    }

    console.log("Creating entry log with:", {
      personType,
      personName: finalPersonName,
      vehicleNumber,
      societyId: ctx.user.societyId,
      watchmanId: ctx.staff?.id ?? ctx.user.id,
    });

    const log = await db.entryLog.create({
      data: {
        personType,
        personName: finalPersonName,
        vehicleNumber: vehicleNumber || null,
        societyId: ctx.user.societyId,
        watchmanId: ctx.staff?.id ?? ctx.user.id, // fallback
      },
    });

    console.log("Created entry log:", log);
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Error creating entry log:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// ── PATCH (mark OUT)  expects ?id=<entryLogId> ───────────
export async function PATCH(req) {
  const ctx = await currentWatchman();
  if (!ctx) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const updated = await db.entryLog.update({
      where: { id },
      data: { outTime: new Date() },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating entry log:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
