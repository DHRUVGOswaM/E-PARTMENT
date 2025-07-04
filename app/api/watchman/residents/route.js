import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
   try {
     const { userId } = await auth()
     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
     
     const user = await db.user.findUnique({
         where:{clerkUserId: userId}
     })
 
     if (!user || user.role !== "WATCHMAN") {
         return NextResponse.json({ error: "Forbidden" }, { status: 403 });
     }
 
     const residents = await db.user.findMany({
         where: {
             societyId: user.societyId,
 
         }
     })
     return NextResponse.json(residents)
   } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
   }
}