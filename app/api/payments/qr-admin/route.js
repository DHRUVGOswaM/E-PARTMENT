
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        const user = await db.user.findMany({
          where: {
            role: "SUPER_ADMIN",
            profilePicture: {
              not: null,
            },
          },
        });
        
        if (!user) return NextResponse.json({ error: "401" }, { status: 401 });
        
        const qrImageUrl = user[0].profilePicture;
    
        return NextResponse.json({ qrImageUrl });
    
    
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "500" }, { status: 500 });
    
    }
}
