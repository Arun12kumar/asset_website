
"use client";

import { columns } from "@/app/admin/(dashboard)/asset/columns"
import { DataTable } from "@/app/admin/(dashboard)/asset/data-table"
import { useGetAllAsset } from "@/controller/assetController";
import React from 'react'

const AssetTable = () => {
  const { data, isLoading, error } = useGetAllAsset();

  return (
  <>
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data || []} />
    </div>
  </>
  )
}

export default AssetTable