import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/* GET – list pending requests for *my* society */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauth", { status: 401 });

  const meAdmin = await db.societyAdmin.findFirst({
    where: { user: { clerkUserId: userId } },
    include: { society: true },
  });
  if (!meAdmin) return new NextResponse("Forbidden", { status: 40 });

  const requests = await db.pendingAccess.findMany({
    where: { societyId: meAdmin.societyId, status: "PENDING" },
    include: { user: true },
  });
  return NextResponse.json({ requests });
}

/* PATCH – approve / reject */
export async function PATCH(req) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauth", { status: 401 });

  const meAdmin = await db.societyAdmin.findFirst({
    where: { user: { clerkUserId: userId } },
  });
  if (!meAdmin) return new NextResponse("Forbidden", { status: 403 });

  const { id, action } = await req.json();
  const reqEntry = await db.pendingAccess.findUnique({ where: { id } });
  if (!reqEntry || reqEntry.societyId !== meAdmin.societyId)
    return new NextResponse("Not found", { status: 404 });

  if (action === "APPROVE") {
    // 1) update user
    await db.user.update({
      where: { id: reqEntry.userId },
      data: {
        role: reqEntry.requestedRole,
        societyId: reqEntry.societyId,
        phoneNumber: reqEntry.phoneNumber,
      },
    });

    // 2) attach to flat if provided
    if (reqEntry.flatId) {
      const flatUpdateField =
        reqEntry.requestedRole === "HOUSE_OWNER"
          ? { ownerId: reqEntry.userId }
          : { residentId: reqEntry.userId };

      await db.flat.update({
        where: { id: reqEntry.flatId },
        data: flatUpdateField,
      });
    }

    // 3) create society member row
    const staffRoles = ["STAFF", "TECHNICIAN", "WATCHMAN"];
    if (staffRoles.includes(reqEntry.requestedRole)) {
      // avoid duplicate staff rows if user was already a staff member
      const existing = await db.staff.findFirst({
        where: { userId: reqEntry.userId, societyId: reqEntry.societyId },
      });


      
      if (!existing) {
        await db.staff.create({
          data: {
            name: reqEntry.userId.name || reqEntry.userId.firstName || "", // fallback if user.name nullable
            role: reqEntry.requestedRole,
            salary: 0, // or set an initial salary
            societyId: reqEntry.societyId,
            userId: reqEntry.userId,
          },
        });
      }
    }

    
    // 4) mark request done
    await db.pendingAccess.delete({
      where: { id },
    });
  } else {
    await db.pendingAccess.update({
      where: { id },
      data: { status: "REJECTED" },
    });
  }
  return NextResponse.json({ ok: true });
}
