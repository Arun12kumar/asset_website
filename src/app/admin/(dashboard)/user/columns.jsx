"use client";

import { Info, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useDeleteUserController } from "@/controller/authController";

function DeleteProductDialog({ users, onDelete }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, } = useDeleteUserController();

  const handleDelete = () => {
    mutate(users._id, {
      onSuccess: () => {
        toast.success(`Deleted User: ${users.userName}`);
        onDelete?.(users); // notify table
        setOpen(false);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to delete users");
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="text-red-600 flex items-center justify-between"
          onSelect={(e) => e.preventDefault()}
        >
          Delete
          <Trash2 className="text-red-600 ml-2" size={16} />
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{users.userName}</span>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

        <Button
          onClick={handleDelete}
          disabled={isPending}
          className="bg-red-600 hover:bg-red-700"
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 border-black/50"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 border-black/50"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "userName",
    header: "User Name",

  },
  {
    accessorKey: "email",
    header: "Email",

  },
  {
    accessorKey: "role",
    header: "Role",

  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const users = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Delete with loading */}
            <DeleteProductDialog
              users={users}
              onDelete={() => table.options.meta?.onDelete?.(users)}
            />

          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];