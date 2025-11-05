"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/sla/data-table";
import { createColumns } from "@/components/sla/columns";
import { CreateSLAModal } from "@/components/sla/create-sla-modal";
import { UpdateSLAModal } from "@/components/sla/update-sla-modal";
import { SLA } from "@/db/schema/sla_collection";
import { useSLAContext } from "@/context/sla-context";
import { deleteDataById } from "@/action";
import toast from "react-hot-toast";
import { CustomError } from "@/type";

export default function SLAContentPage() {
  const { sla: slaData, isLoading, fetchSLA } = useSLAContext();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedSLA, setSelectedSLA] = useState<SLA | null>(null);

  const handleEdit = (sla: SLA) => {
    setSelectedSLA(sla);
    setUpdateModalOpen(true);
  };

  const handleSuccess = () => {
    // In a real app, you would refetch the data here
    fetchSLA();
    // For now, we'll just close the modals
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedSLA(null);
  };

  const columns = createColumns({ onEdit: handleEdit });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Service Level Agreement
        </h2>
        <Button asChild>
          <Button
            onClick={() => setCreateModalOpen(true)}
            disabled={slaData.length === 5 ? true : false}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add SLA
          </Button>
        </Button>
      </div>
      <div>
        {isLoading ? (
          <p>Loading SLA data...</p>
        ) : (
          <>
            <DataTable columns={columns} data={slaData} />

            <CreateSLAModal
              open={createModalOpen}
              onOpenChange={setCreateModalOpen}
              onSuccess={handleSuccess}
            />

            <UpdateSLAModal
              open={updateModalOpen}
              onOpenChange={setUpdateModalOpen}
              onSuccess={handleSuccess}
              sla={selectedSLA}
            />
          </>
        )}
      </div>
    </div>
  );
}
