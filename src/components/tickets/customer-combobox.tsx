import { useState } from "react";
import { Controller, Control } from "react-hook-form";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Customer } from "@/db/schema/customer_collection";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type Props = {
  control: Control<any>;
  customers: Customer[] | undefined;
  isEditMode: boolean;
};

export const CustomerCombobox: React.FC<Props> = ({
  control,
  customers,
  isEditMode,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <Controller
      control={control}
      name="customerId"
      render={({ field }) => {
        const selectedCustomer = customers?.find((c) => c._id === field.value);

        const filtered = customers?.filter((c) => {
          const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
          return fullName.includes(search.toLowerCase());
        });

        return (
          <div className="space-y-1 mt-1">
            <label className="text-sm font-medium">Customer</label>
            <Popover.Root open={open} onOpenChange={setOpen}>
              <Popover.Trigger asChild disabled={isEditMode}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm",
                    isEditMode
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : ""
                  )}
                >
                  {selectedCustomer
                    ? `${selectedCustomer.firstName} ${selectedCustomer.lastName} -
                          ${selectedCustomer.idNumber}`
                    : "Select a customer"}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="z-50 w-[350px] rounded-md border bg-white p-2 shadow-md"
                  side="bottom"
                  align="start"
                >
                  <input
                    type="text"
                    placeholder="Search customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-2 w-full rounded-md border px-2 py-1 text-sm"
                  />

                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {filtered?.length === 0 && (
                      <div className="text-sm text-muted-foreground px-2 py-1">
                        No customer found.
                      </div>
                    )}

                    {filtered?.map((customer) => (
                      <button
                        key={customer._id.toString()}
                        type="button"
                        onClick={() => {
                          field.onChange(customer._id);
                          setOpen(false);
                          setSearch("");
                        }}
                        className="flex w-full items-center justify-between px-2 py-1 text-sm hover:bg-gray-100 rounded-md"
                      >
                        <span>
                          {customer.firstName} {customer.lastName} -{" "}
                          {customer.idNumber}
                        </span>
                        {field.value === customer._id && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        );
      }}
    />
  );
};
