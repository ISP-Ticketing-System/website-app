"use client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/customers/data-table";
import { columns } from "@/components/customers/columns";
import { useCustomerContext } from "@/context/customer-context";
import Link from "next/link";

export default function CustomersContentPage() {
  const { customers, isLoading } = useCustomerContext();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Button asChild>
          <Link href={"/dashboard/customers/new"}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Customer
          </Link>
        </Button>
      </div>
      <div>
        {isLoading ? (
          <p>Loading customers data...</p>
        ) : (
          <DataTable columns={columns} data={customers} />
        )}
      </div>
    </div>
  );
}
