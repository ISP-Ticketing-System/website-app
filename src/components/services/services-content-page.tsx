"use client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/services/data-table";
import { columns } from "@/components/services/columns";
import { useServiceContext } from "@/context/service-context";
import Link from "next/link";

export default function ServicesContentPage() {
  const { services, isLoading } = useServiceContext();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Services</h2>
        <Button asChild>
          <Link href={"/dashboard/services/new"}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Service
          </Link>
        </Button>
      </div>
      <div>
        {isLoading ? (
          <p>Loading services data...</p>
        ) : (
          <DataTable columns={columns} data={services} />
        )}
      </div>
    </div>
  );
}
