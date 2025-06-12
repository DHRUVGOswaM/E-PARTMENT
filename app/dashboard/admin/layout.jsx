// app/dashboard/admin/layout.jsx
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { role: true },
  });

  if (!user || user.role !== "SUPER_ADMIN") { 
    return redirect("/"); // ⛔️ Redirect if not admin
  }

  return <>{children}</>;
}
