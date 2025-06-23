

// import { db } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";


// export async function GET(req) {
//   try {
//     // Enhanced auth check with debugging
//     const { userId } = await auth();
   

//     if (!userId) {
//       console.warn("No user ID found in auth - headers:", req.headers);
//       return NextResponse.json(
//         {
//           error: "Unauthorized",
//           message: "Please sign in to access this resource",
//         },
//         { status: 401 }
//       );
//       }
      
//       const user = await db.user.findUnique({
//           where: {clerkUserId: userId},
//       })

//     const contacts = await db.emergencyContact.findMany({
//       where: { userId: user.id },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json(contacts);
//   } catch (error) {
//     console.error("GET error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch contacts" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req) {
//   try {
//     // Enhanced auth check with debugging
//     const { userId } = await auth();
   

//     if (!userId) {
//       console.warn("No user ID found in auth - headers:", req.headers);
//       return NextResponse.json(
//         {
//           error: "Unauthorized",
//           message: "Please sign in to access this resource",
//         },
//         { status: 401 }
//       );
//       }
      
//       const user = await db.user.findUnique({
//           where: {clerkUserId: userId},
//       })

//    const { name, phoneNumber, designation, type } = await req.json();

//     if (!name || !phoneNumber || !designation) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//       }
      
//       const updateContact = await db.emergencyContact.create({
//           data: {
//               name,
//               phoneNumber,
//               designation,
//               email: user.email,
//               userId: user.id,
//               id: user.id + "-" + Date.now().toString(),
//               type,
//           }
//       });

//     return NextResponse.json(updateContact);
//   } catch (error) {
//     console.error("GET error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch contacts" },
//       { status: 500 }
//     );
//   }
// }
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const contacts = await db.emergencyContact.findMany({
      where: { societyId: user.societyId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ contacts, user: { role: user.role, societyId: user.societyId } });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 403 });
    }

    const { name, phoneNumber, email, designation } = await req.json();

    if (!name || !phoneNumber || !designation || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if(user.role !== "SUPER_ADMIN" && user.role !== "SOCIETY_ADMIN" && user.role !== "SOCIETY_SECRETARY") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const newContact = await db.emergencyContact.create({
      data: {
        name,
        phoneNumber,
        designation,
        email,
        userId: user.id,
        societyId: user.societyId,
        id: user.id + "-" + Date.now().toString(),
      },
    });

    return NextResponse.json(newContact);
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}
