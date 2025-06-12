"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  ClipboardList,
  AlertTriangle,
  FileText,
  House,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Manage Apartments",
    icon: <House className="h-8 w-8" />,
    href: "/dashboard/society-admin/apartments",
  },
  {
    title: "Manage Flats",
    icon: <Building2 className="h-8 w-8" />,
    href: "/dashboard/society-admin/flats",
  },
  {
    title: "Assign Flats to Residents",
    icon: <Users className="h-8 w-8" />,
    href: "/dashboard/society-admin/assign-flats",
  },
  {
    title: "Emergency Contacts",
    icon: <AlertTriangle className="h-8 w-8" />,
    href: "/dashboard/society-admin/emergency-contacts",
  },
  {
    title: "Complaints",
    icon: <ClipboardList className="h-8 w-8" />,
    href: "/dashboard/society-admin/complaints",
  },
  {
    title: "Notices & Documents",
    icon: <FileText className="h-8 w-8" />,
    href: "/dashboard/society-admin/notices",
  },
];

export default function SocietyAdminDashboard() {
  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-3xl font-bold">Society Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href}>
            <Card className="hover:shadow-lg cursor-pointer transition-all">
              <CardContent className="flex items-center gap-4 p-6">
                {feature.icon}
                <span className="text-lg font-medium">{feature.title}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
