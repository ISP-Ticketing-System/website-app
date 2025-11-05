"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  Currency,
  Hash,
  Info,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { Service } from "@/db/schema/service_collection";

interface ServiceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

export function ServiceInfoModal({
  isOpen,
  onClose,
  service,
}: ServiceInfoModalProps) {
  if (!service) return null;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Service Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about this service plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Service Name and Status */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">{service.serviceName}</h3>
              <p className="text-sm text-muted-foreground">
                <span className="flex items-center gap-1 mt-1">
                  <Tag className="h-4 w-4" />
                  {service.slug}
                </span>
              </p>
            </div>
            <Badge
              variant={
                service.status === "Available" ? "default" : "destructive"
              }
              className="capitalize"
            >
              {service.status}
            </Badge>
          </div>

          <Separator />

          {/* Pricing Information */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Pricing</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Currency className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Monthly Price</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(Number(service.monthlyPrice))}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Currency className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Setup Fee</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(Number(service.setupFee))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">
              {service.planDescription}
            </p>
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Additional Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Service ID</p>
                  <p className="text-sm text-muted-foreground">
                    {service._id.toString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created At</p>
                  <p className="text-sm text-muted-foreground">
                    {service.createdAt.toString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
