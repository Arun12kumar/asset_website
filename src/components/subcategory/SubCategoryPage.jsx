"use client"

import { SubCategoryProvider, useSubCategoryContext } from "@/context/SubCategoryProvider";
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import SubCategoryTable from "./SubCategoryTable";
import AddSubCategory from "./AddSubCategory";
import EditSubCategory from "./EditSubCategory";

const SubCategoryPageContent = () => {
    const { setOpen } = useSubCategoryContext();
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl text-black/80 font-bold">SubCategory Management</h1>
        <Button
          onClick={() => setOpen(true)}
          className="bg-blue-500 hover:bg-blue-500/80 transition delay-75 duration-300 ease-in-out cursor-pointer"
        >
          Add <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <SubCategoryTable/>
      <AddSubCategory/>
      <EditSubCategory/>
    </>
  );
};

const SubCategoryPage = () => (
  <SubCategoryProvider>
    <SubCategoryPageContent />
  </SubCategoryProvider>
);

export default SubCategoryPage;
