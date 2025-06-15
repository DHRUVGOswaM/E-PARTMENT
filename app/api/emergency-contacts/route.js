// import { supabase } from '@/lib/supabase'

// export async function GET() {
//   const { data, error } = await supabase.from('emergency_contacts').select('*')

//   if (error) {
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 })
//   }

//   return new Response(JSON.stringify(data), { status: 200 })
// }

// export async function POST(req) {
//   const body = await req.json()
//   const { name, phoneNumber, email, userId, designation } = body

//   if (!userId) {
//     return new Response(JSON.stringify({ error: 'userId is required' }), { status: 400 })
//   }

//   const { data, error } = await supabase
//     .from('emergency_contacts')
//     .insert([
//       {
//         name,
//         phoneNumber,
//         email,
//         designation,
//         createdAt: new Date().toISOString(),
//         userId,
//       }
//     ])
//     .select()
//     .single()

//   if (error) {
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 })
//   }

//   return new Response(JSON.stringify(data), { status: 201 })
// }

// app/api/emergency-contacts/route.js
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // your Prisma instance

// // GET all contacts
// export async function GET(req) {
//   try {
//     const contacts = await prisma.emergencyContact.findMany();
//     return NextResponse.json(contacts);
//   } catch (error) {
//     console.error("GET error:", error);
//     return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
//   }
// }

// // POST new contact
// export async function POST(req) {
//   try {
//     const { userId } = auth();
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { name, phoneNumber, email, designation } = await req.json();

//     const newContact = await prisma.emergencyContact.create({
//       data: {
//         name,
//         phoneNumber,
//         email,
//         designation,
//         userId,
//       },
//     });

//     return NextResponse.json(newContact);
//   } catch (error) {
//     console.error("POST error:", error);
//     return NextResponse.json({ error: "Failed to add contact" }, { status: 500 });
//   }
// }

// app/api/emergency-contacts/route.js
// app/api/emergency-contacts/route.js
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    // Enhanced auth check with debugging
    const authResult = auth();
    console.log("Auth result:", authResult);

    if (!authResult.userId) {
      console.warn("No user ID found in auth - headers:", req.headers);
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please sign in to access this resource",
        },
        { status: 401 }
      );
    }

    const contacts = await prisma.emergencyContact.findMany({
      where: { userId: authResult.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
