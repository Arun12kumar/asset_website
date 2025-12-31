"use client";

import { columns } from "@/app/admin/(dashboard)/user/columns"
import { DataTable } from "@/app/admin/(dashboard)/user/data-table"
import { useGetAllUsers } from "@/controller/authController"



const UserTable = () => {
  const { data, isLoading, error } = useGetAllUsers();

  return (
  <>
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data || []} />
    </div>
  </>
  )
}

export default UserTable;