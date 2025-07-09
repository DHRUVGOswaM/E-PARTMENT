import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

      const user = await db.user.findUnique({ where: { clerkUserId: userId } });
        
        const { id, action, amount } = await req.json();
        const request = await db.pendingAdmin.findUnique({
            where: { id },

        })
        if (!request) {
            return new NextResponse("Request not found", { status: 404 });
      }

      const finalAmount = parseFloat(amount);
      
      if (action === "QUOTE") {
        await db.pendingAdmin.update({
          where: { id },
          data: {
            status: "QUOTED",
            quotedAmount: finalAmount,
          },
        });
        return NextResponse.json({ message: "Quoted Amount Sent to Applicant" }, { status: 200 });
      }
      if (action === "APPROVE") {
         
          if (!user) return new NextResponse("User not found", { status: 404 });

          //create new society
          const newSociety = await db.society.create({
            data: {
              name: request.apartmentName,
              address: request.address,
              registrationNumber: request.registrationNumber,
            },
          });

          // Update user to link them to this society and assign role
          await db.user.update({
            where: { id: user.id },
            data: {
              role: "SOCIETY_ADMIN",
              societyId: newSociety.id,
              phoneNumber: request.phoneNumber,
            },
          });

          // Create SocietyAdmin entry
          await db.societyAdmin.create({
            data: {
              userId: user.id,
              societyId: newSociety.id,
              societyName: newSociety.name,
              totalFlats: request.totalFlats,
            },
          });   

          await db.pendingAdmin.delete({ where: { id } });
          return NextResponse.json({
            message: "Request approved and society created successfully",
          });
        } else if (action === "REJECT") {
            // Reject the request
            await db.pendingAdmin.delete({ where: { id } });
            return NextResponse.json({ message: "Request rejected successfully" });
        } else {
            return new NextResponse("Invalid action", { status: 400 });
        }
    } catch (error) {
        console.error("Error in POST /api/society-admin/approve:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
