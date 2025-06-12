"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateBuildingForm from "./CreateBuildingForm";
import CreateFlatForm from "./CreateFlatForm";
import AssignResidentForm from "./AssignResidentForm";

const ApartmentManager = () => {
  return (
    <Tabs defaultValue="buildings" className="w-full">
      <TabsList>
        <TabsTrigger value="buildings">Create Building</TabsTrigger>
        <TabsTrigger value="flats">Create Flats</TabsTrigger>
        <TabsTrigger value="assign">Assign Residents & Roles</TabsTrigger>
      </TabsList>
      <TabsContent value="buildings">
        <CreateBuildingForm />
      </TabsContent>
      <TabsContent value="flats">
        <CreateFlatForm />
      </TabsContent>
      <TabsContent value="assign">
        <AssignResidentForm />
      </TabsContent>
    </Tabs>
  );
};

export default ApartmentManager;
