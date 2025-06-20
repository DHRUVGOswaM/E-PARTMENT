import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";


const ADMIN_EMAIL = "rishabhsikarwar1000@gmail.com";

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        society: true, // Include society details if needed
      },
    })

    if (!user ) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if(!user.societyId) {
      return NextResponse.json({ error: "Please join a society to view notices" }, { status: 403 });
    }
    const notices = await db.notice.findMany({
      where:{ societyId: user.societyId },
      orderBy: {postedAt: 'desc'}
    })
    return NextResponse.json(notices);
  } catch (error) {
    console.error("Error fetching notices:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
    
  }
}

export async function POST(req) {
 try {
   const { userId} = await auth();
   if (!userId ) {
     return NextResponse.json({ error: "User not found" }, { status: 403 });
   }

   const user = await db.user.findUnique({
     where: {
       clerkUserId: userId,
       role: 'SUPER_ADMIN' || 'SOCIETY_ADMIN',
     },
     
   })
 
   const { content, postedBy } = await req.json();
 
   const newNotice = await db.notice.create({
     data: {
       content,
       postedBy,
     }
   })

   return NextResponse.json(newNotice);
 
 } catch (error) {
   return NextResponse.json({ error: error.message }, { status: 500 });
  
 }
}

export async function PUT(req) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId || sessionClaims?.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Only admin can edit" }, { status: 403 });
    }
  
    const { id, content } = await req.json();
  
    const updateNotice = await db.notice.update({
      where: { id },
      data: {content}
    })

    return NextResponse.json(updateNotice);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
    
  }
}

export async function DELETE(req) {
 try {
   const { userId, sessionClaims } = await auth();
   if (!userId || sessionClaims?.email !== ADMIN_EMAIL) {
     return NextResponse.json(
       { error: "Only admin can delete" },
       { status: 403 }
     );
   }
 
   const { id } = await req.json();
 
   await db.notice.delete({
     where: {id}
   })

   return NextResponse.json({ message: "Deleted successfully" });
 } catch (error) {
   return NextResponse.json({ error: error.message }, { status: 500 });
  
 }
}
