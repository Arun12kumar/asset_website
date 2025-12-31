

"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import UserTable from "./UserTable";
import { UserProvider, useUserContext } from "@/context/UserProvider";
import AddNewUser from "./AddNewUser";

const UserPageContent = () => {
  const { setOpen } = useUserContext();

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl text-black/80 font-bold">
          Users Management
        </h1>
        <Button
          onClick={() => setOpen(true)}
          className="bg-blue-500 hover:bg-blue-500/80 transition delay-75 duration-300 ease-in-out cursor-pointer"
        >
          Add <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* No props needed anymore */}
      <UserTable/>
      <AddNewUser />
    </>
  );
};

const UserPage = () => (
  <UserProvider>
    <UserPageContent />
  </UserProvider>
);

export default UserPage;