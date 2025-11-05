"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SLAForm, type SLAFormValues } from "@/components/forms/sla-form";
import { SLA } from "@/db/schema/sla_collection";
import toast from "react-hot-toast";
import { CustomError } from "@/type";

interface UpdateSLAModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  sla: SLA | null;
}

export function UpdateSLAModal({
  open,
  onOpenChange,
  onSuccess,
  sla,
}: UpdateSLAModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (input: SLAFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      const response = await fetch(`/api/sla/${sla?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw await response.json();
      }

      let user = await response.json();

      toast.success(user.message);

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error((error as CustomError).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!sla) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update SLA</DialogTitle>
          <DialogDescription>
            Update the Service Level Agreement details.
          </DialogDescription>
        </DialogHeader>
        <SLAForm
          initialData={{
            role: sla.role,
            times: sla.times,
          }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEdit={true}
        />
      </DialogContent>
    </Dialog>
  );
}
