"use client";

import { getDataById } from "@/action";
import { CustomerForm } from "@/components/forms/customer-form";
import { CustomError } from "@/type";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditCustomerPage() {
  const params = useParams();
  const customerId = params.id as string | undefined;

  const [customer, setCustomer] = useState({});
  const router = useRouter();

  async function fetchData(customerId: string) {
    let result = await getDataById(customerId, "/customers");
    setCustomer(result);
  }

  const handleSubmit = async (input: any) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw await response.json();
      }

      let customer = await response.json();

      router.push("/dashboard/customers");

      toast.success(customer.message);
    } catch (error) {
      toast.error((error as CustomError).message);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchData(customerId);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Update Customer</h2>
      </div>
      {Object.keys(customer).length === 0 ? (
        <p>Loading user data...</p>
      ) : (
        <CustomerForm
          initialData={customer}
          onSubmit={handleSubmit}
          isEditMode
        />
      )}{" "}
    </div>
  );
}
