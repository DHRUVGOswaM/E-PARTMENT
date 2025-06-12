import React from "react";
import ApartmentManager from "@/components/admin/ApartmentManager";
import { Card, CardContent } from "@/components/ui/card";

const ApartmentManagementPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Apartment Management</h1>
      <Card>
        <CardContent>
          <ApartmentManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default ApartmentManagementPage;
