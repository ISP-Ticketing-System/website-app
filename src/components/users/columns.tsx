"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { User } from "@/db/schema/user_collection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  Key,
  ArchiveRestore,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteDataById } from "@/action";
import toast from "react-hot-toast";
import { CustomError } from "@/type";
import { useUserContext } from "@/context/user-context";
import { useState } from "react";
import { PasswordUpdateModal } from "./password-update-modal";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => {
      const firstName = row.getValue("firstName") as string;
      return <p>{firstName ? firstName : "-"}</p>;
    },
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => {
      const lastName = row.getValue("lastName") as string;
      return <p>{lastName ? lastName : "-"}</p>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge
          variant={
            role === "admin"
              ? "default"
              : role === "manager"
              ? "secondary"
              : "outline"
          }
        >
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "Active" ? "blue" : "destructive"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const router = useRouter();

      const { fetchUsers, activeTab } = useUserContext();
      const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
      const [isLoading, setIsLoading] = useState(false);

      const handleDelete = async (id: string) => {
        try {
          setIsLoading(true);
          let response = await deleteDataById(id, "/users");
          toast.success(response.message);
          await fetchUsers();
        } catch (error) {
          toast.error((error as CustomError).message);
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={isLoading}
              >
                <span className="sr-only">Open menu</span>
                {isLoading ? (
                  <Loader2 className="h-4 w-4" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(user._id.toString())
                }
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {activeTab !== "Inactive" && user.isDeleted === false && (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/dashboard/users/${user._id}/edit`)
                    }
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsPasswordModalOpen(true)}
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Reset Password
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDelete(user._id.toString())}
              >
                {activeTab !== "Inactive" && user.isDeleted === false ? (
                  <Trash className="mr-2 h-4 w-4" />
                ) : (
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                )}

                {activeTab !== "Inactive" && user.isDeleted === false
                  ? "Delete"
                  : "Restore"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <PasswordUpdateModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            userId={user._id.toString()}
            username={user.username}
            setIsPasswordModalOpen={setIsPasswordModalOpen}
          />
        </>
      );
    },
  },
];
