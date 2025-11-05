"use client";

import { getDataById } from "@/action";
import { ServiceForm } from "@/components/forms/service-form";
import { CustomError } from "@/type";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditServicePage() {
  const params = useParams();
  const slug = params.slug as string | undefined;

  const [service, setService] = useState({});
  const router = useRouter();

  async function fetchData(slug: string) {
    let result = await getDataById(slug, "/services");
    setService(result);
  }

  const handleSubmit = async (input: any) => {
    try {
      const response = await fetch(`/api/services/${slug}`, {
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

      router.push("/dashboard/services");

      toast.success(user.message);
    } catch (error) {
      toast.error((error as CustomError).message);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchData(slug);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Update Service</h2>
      </div>
      {Object.keys(service).length === 0 ? (
        <p>Loading service data...</p>
      ) : (
        <ServiceForm initialData={service} onSubmit={handleSubmit} isEditMode />
      )}{" "}
    </div>
  );
}
