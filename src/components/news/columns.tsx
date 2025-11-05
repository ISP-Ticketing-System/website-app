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
import { MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { UpdateNewsModal } from "./update-news-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { News } from "@/db/schema/news_collection";
import { useNewsContext } from "@/context/news-context";
import toast from "react-hot-toast";
import { deleteDataById } from "@/action";
import { CustomError } from "@/type";

export const columns: ColumnDef<News>[] = [
  {
    accessorKey: "id",
    header: "No",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="max-w-[300px]">
          <div className="font-medium truncate">{title}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => {
      const content = row.getValue("content") as string;
      // Strip HTML tags for preview
      const plainText = content.replace(/<[^>]*>/g, "");
      return (
        <div className="max-w-[300px]">
          <div className="text-sm text-muted-foreground truncate">
            {plainText.substring(0, 100)}...
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Auhor",
    cell: ({ row }) => {
      const author = row.getValue("author") as string;
      return (
        <Badge variant="outline" className="font-normal">
          {author}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="text-sm">
          {format(date, "MMM dd, yyyy")}
          <div className="text-xs text-muted-foreground">
            {format(date, "HH:mm")}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const news = row.original;
      const [showUpdateModal, setShowUpdateModal] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const { fetchNews } = useNewsContext();

      const handleDelete = async () => {
        // delete category
        try {
          setIsLoading(true);
          let response = await deleteDataById(news._id.toString(), "/news");
          toast.success(response.message);

          await fetchNews();
        } catch (error) {
          toast.error((error as CustomError).message);
        } finally {
          setIsLoading(false);
        }
      };

      const onSuccess = async () => {
        await fetchNews();
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
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
              <DropdownMenuItem onClick={() => setShowUpdateModal(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the news article
                      <strong> "{news.title}"</strong>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>

          <UpdateNewsModal
            news={news}
            open={showUpdateModal}
            onOpenChange={setShowUpdateModal}
            onSuccess={onSuccess}
          />
        </>
      );
    },
  },
];
