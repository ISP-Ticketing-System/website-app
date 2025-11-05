"use client";

import type { ColumnDef } from "@tanstack/react-table";
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
  Ticket,
  ArchiveRestore,
  Loader2,
} from "lucide-react";
import { Customer } from "@/db/schema/customer_collection";
import { useRouter } from "next/navigation";
import { useCustomerContext } from "@/context/customer-context";
import { useState } from "react";
import { deleteDataById } from "@/action";
import toast from "react-hot-toast";
import { CustomError } from "@/type";

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "cid",
    header: "CID",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => {
      const lastName = row.getValue("lastName") as string;
      return <>{lastName ? lastName : "-"}</>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <>{email ? email : "-"}</>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "serviceData.name",
    header: "Service",
  },
  {
    accessorKey: "installationDate",
    header: "Installation Date",
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const customer = row.original;
      const router = useRouter();

      const { activeTab, fetchCustomers } = useCustomerContext();

      const [isLoading, setIsLoading] = useState(false);

      const handleDelete = async (id: string) => {
        try {
          setIsLoading(true);
          let response = await deleteDataById(id, "/customers");
          toast.success(response.message);
          await fetchCustomers();
        } catch (error) {
          toast.error((error as CustomError).message);
        } finally {
          setIsLoading(false);
        }
      };

      return (
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
                navigator.clipboard.writeText(customer.cid as string)
              }
            >
              Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {activeTab !== "Inactive" && customer.isDeleted === false && (
              <>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/dashboard/customers/${customer._id}/edit`)
                  }
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Ticket className="mr-2 h-4 w-4" />
                  Create Ticket
                </DropdownMenuItem> */}
              </>
            )}

            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(customer._id.toString())}
            >
              {activeTab !== "Inactive" && customer.isDeleted === false ? (
                <Trash className="mr-2 h-4 w-4" />
              ) : (
                <ArchiveRestore className="mr-2 h-4 w-4" />
              )}
              {activeTab !== "Inactive" && customer.isDeleted === false
                ? "Delete"
                : "Restore"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
