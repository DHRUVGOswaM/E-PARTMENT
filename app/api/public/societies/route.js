import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const societies = await db.society.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            }
        })
        return NextResponse.json({societies})
    } catch (error) {
        console.error("Error fetching societies:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
        
    }
}