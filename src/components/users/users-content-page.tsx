"use client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/users/data-table";
import { columns } from "@/components/users/columns";
import Link from "next/link";
import { useUserContext } from "@/context/user-context";

export default function UsersContentPage() {
  const { users, isLoading } = useUserContext();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <Button asChild>
          <Link href={"/dashboard/users/new"}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>
      <div>
        {isLoading ? (
          <p>Loading user data...</p>
        ) : (
          <DataTable columns={columns} data={users} />
        )}{" "}
      </div>
    </div>
  );
}
