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
  ArchiveRestore,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash,
  Users,
  Info,
} from "lucide-react";
import { Service } from "@/db/schema/service_collection";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteDataById } from "@/action";
import toast from "react-hot-toast";
import { useServiceContext } from "@/context/service-context";
import { CustomError } from "@/type";
import { ServiceInfoModal } from "./service-info-modal";

export const columns: ColumnDef<Service>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  {
    accessorKey: "serviceName",
    header: "Service Name",
  },
  {
    accessorKey: "monthlyPrice",
    header: "Monthly Price",
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("monthlyPrice"));
      const formatted = new Intl.NumberFormat("ID-id", {
        style: "currency",
        currency: "IDR",
      }).format(price);
      return formatted;
    },
  },
  // {
  //   accessorKey: "setupFee",
  //   header: "Setup Fee",
  //   cell: ({ row }) => {
  //     const price = Number.parseFloat(row.getValue("setupFee"));
  //     const formatted = new Intl.NumberFormat("ID-id", {
  //       style: "currency",
  //       currency: "IDR",
  //     }).format(price);
  //     return formatted;
  //   },
  // },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "Available" ? "blue" : "destructive"}>
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
    header: "Actions",
    cell: ({ row }) => {
      const service = row.original;
      const router = useRouter();

      const { fetchServices, activeTab } = useServiceContext();
      const [isLoading, setIsLoading] = useState(false);
      const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

      const handleDelete = async (slug: string) => {
        try {
          setIsLoading(true);
          let response = await deleteDataById(slug, "/services");
          toast.success(response.message);
          await fetchServices();
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
                  navigator.clipboard.writeText(service._id.toString())
                }
              >
                Copy service ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {activeTab !== "Unavaiable" && service.isDeleted === false && (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/dashboard/services/${service.slug}/edit`)
                    }
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  View Customers
                </DropdownMenuItem> */}
                </>
              )}
              <DropdownMenuItem onClick={() => setIsInfoModalOpen(true)}>
                <Info className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDelete(service.slug as string)}
              >
                {activeTab !== "Unavaiable" && service.isDeleted === false ? (
                  <Trash className="mr-2 h-4 w-4" />
                ) : (
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                )}
                {activeTab !== "Unavaiable" && service.isDeleted === false
                  ? "Delete"
                  : "Restore"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ServiceInfoModal
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
            service={service}
          />
        </>
      );
    },
  },
];
