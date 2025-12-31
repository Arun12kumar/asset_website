"use client";

import { columns } from "@/app/admin/(dashboard)/category/columns"
import { DataTable } from "@/app/admin/(dashboard)/category/data-table"
import { useGetAllcategory } from "@/controller/categoryController";

const CategoryTable = () => {
  const { data, isLoading, error } = useGetAllcategory();

  return (
  <>
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data || []} />
    </div>
  </>
  )
}

export default CategoryTable