"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Edit,
  Trash2,
  Trash,
  ArchiveRestore,
  Loader2,
} from "lucide-react";
import { SLA } from "@/db/schema/sla_collection";
import { useState } from "react";
import { useSLAContext } from "@/context/sla-context";
import { deleteDataById } from "@/action";
import toast from "react-hot-toast";
import { CustomError } from "@/type";

interface ColumnsProps {
  onEdit: (sla: SLA) => void;
}

export const createColumns = ({ onEdit }: ColumnsProps): ColumnDef<SLA>[] => [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  //   cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  // },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "times",
    header: "Response Time (Minutes)",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("times")} minutes</div>
    ),
  },
  {
    accessorKey: "isDeleted",
    header: "isDeleted",
    cell: ({ row }) => {
      const isDeleted = row.getValue("isDeleted") as boolean;

      const getIsDeletedBadgeVariant = (isDeleted: boolean) => {
        switch (isDeleted) {
          case true:
            return "destructive";
          case false:
            return "default";
        }
      };

      return (
        <Badge variant={getIsDeletedBadgeVariant(isDeleted)}>
          {isDeleted ? "true" : "false"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const sla = row.original;
      const { fetchSLA } = useSLAContext();
      const [isLoading, setIsLoading] = useState(false);

      const handleDelete = async (id: string) => {
        // delete sla
        try {
          setIsLoading(true);
          let response = await deleteDataById(id, "/sla");
          toast.success(response.message);

          await fetchSLA();
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(sla)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(sla._id.toString())}
            >
              {sla.isDeleted === false ? (
                <Trash className="mr-2 h-4 w-4" />
              ) : (
                <ArchiveRestore className="mr-2 h-4 w-4" />
              )}

              {sla.isDeleted === false ? "Delete" : "Restore"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
