
"use client"

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { AssetProvider, useAssetContext } from "@/context/AssetProvider";
import AssetTable from "./AssetTable";
import AddAsset from "./AddAsset";
import EditAsset from "./EditAsset";
import DetailAsset from "./DetailAsset";

const AssetPageContent = () => {
    const { setOpen } = useAssetContext();
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl text-black/80 font-bold">Asset Management</h1>
        <Button
          onClick={() => setOpen(true)}
          className="bg-blue-500 hover:bg-blue-500/80 transition delay-75 duration-300 ease-in-out cursor-pointer"
        >
          Add <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <AssetTable/>
      <AddAsset/>
      <EditAsset/>
      <DetailAsset/>

    </>
  );
};

const AssetPage = () => (
  <AssetProvider>
    <AssetPageContent />
  </AssetProvider>
);

export default AssetPage;
