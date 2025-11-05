"use client";

import { CustomerForm } from "@/components/forms/customer-form";
import { CustomError } from "@/type";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewCustomerPage() {
  const router = useRouter();

  // In a real application, this would be handled by a server action
  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await response.json();
      }

      let customer = await response.json();

      router.push("/dashboard/customers");

      toast.success(customer.message);
    } catch (error) {
      console.log(error, "<<<");

      toast.error((error as CustomError).message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Create New Customer
        </h2>
      </div>
      <CustomerForm onSubmit={handleSubmit} />
    </div>
  );
}
