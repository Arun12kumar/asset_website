
"use client";

import { columns } from "@/app/admin/(dashboard)/subcategory/columns"
import { DataTable } from "@/app/admin/(dashboard)/subcategory/data-table"
import { useGetAllsubcategory } from '@/controller/subcategoryController';
import React from 'react'

const SubCategoryTable = () => {
  const { data, isLoading, error } = useGetAllsubcategory();

  return (
  <>
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data || []} />
    </div>
  </>
  )
}

export default SubCategoryTable