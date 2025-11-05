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
import toast from "react-hot-toast";
import { CustomError } from "@/type";

interface CreateSLAModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateSLAModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateSLAModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: SLAFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/sla", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await response.json();
      }

      let sla = await response.json();

      toast.success(sla.message);

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error((error as CustomError).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New SLA</DialogTitle>
          <DialogDescription>
            Add a new Service Level Agreement with role and response time.
          </DialogDescription>
        </DialogHeader>
        <SLAForm onSubmit={handleSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
