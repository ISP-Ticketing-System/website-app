"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { SLA } from "@/db/schema/sla_collection";
import { useSLAContext } from "@/context/sla-context";

const formSchema = z.object({
  role: z.string().min(1, "Role is required"),
  times: z.string().min(1, "Response time must be at least 1 hour"),
});

export type SLAFormValues = z.infer<typeof formSchema>;

interface SLAFormProps {
  initialData?: {
    role: string;
    times: string;
  };
  onSubmit: (data: SLAFormValues) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function SLAForm({
  initialData,
  onSubmit,
  isLoading,
  isEdit = false,
}: SLAFormProps) {
  const form = useForm<SLAFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: initialData?.role || "",
      times: initialData?.times || "1",
    },
  });
  type Role = "Admin" | "Helpdesk" | "NOC" | "Super NOC" | "CS FTTH";

  const { sla: slaData } = useSLAContext();
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const allRoles: Role[] = ["Admin", "Helpdesk", "NOC", "Super NOC", "CS FTTH"];

  function checkAvaiableRole() {
    const usedRoles: Role[] = slaData.map((item) => item.role);

    const availableRoles = allRoles.filter(
      (role) => !usedRoles.includes(role) || role === initialData?.role
    );

    return availableRoles;
  }

  useEffect(() => {
    let avaiableRoles = checkAvaiableRole();
    setAvailableRoles(avaiableRoles);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableRoles.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="times"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Response Time (Hours)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter response time in hours"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save SLA"}
        </Button>
      </form>
    </Form>
  );
}
