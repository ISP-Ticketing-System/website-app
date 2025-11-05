"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "@/components/news/columns";
import { DataTable } from "@/components/news/data-table";
import { CreateNewsModal } from "@/components/news/create-news-modal";
import { useNewsContext } from "@/context/news-context";

export default function NewsContextPage() {
  const { news, isLoading, fetchNews } = useNewsContext();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const onSuccess = async () => {
    await fetchNews();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">News Management</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add News
        </Button>
      </div>
      <div>
        {isLoading ? (
          <p>Loading News data...</p>
        ) : (
          <DataTable columns={columns} data={news} />
        )}

        <CreateNewsModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}
