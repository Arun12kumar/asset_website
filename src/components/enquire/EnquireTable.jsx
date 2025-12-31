
"use client";

import { columns } from "@/app/admin/(dashboard)/enquiry/columns"
import { DataTable } from "@/app/admin/(dashboard)/enquiry/data-table"
import { useGetAllenquiry } from "@/controller/enquireController";
import React from 'react'

const EnquireTable = () => {
  const { data, isLoading, error } = useGetAllenquiry();

  return (
  <>
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data || []} />
    </div>
  </>
  )
}

export default EnquireTable;