

"use client";

import { columns } from "@/app/admin/(dashboard)/contact/columns"
import { DataTable } from "@/app/admin/(dashboard)/contact/data-table"
import { useGetAllContact } from "@/controller/contactController";
import React from 'react'

const ContactTable = () => {
  const { data, isLoading, error } = useGetAllContact();

  return (
  <>
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data || []} />
    </div>
  </>
  )
}

export default ContactTable;