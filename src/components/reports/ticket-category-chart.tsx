"use client";

import { Ticket } from "@/db/schema/ticket_collection";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

// const data = [
//   { name: "Technical", value: 65, color: "#4a6522" },
//   { name: "Billing", value: 25, color: "#c2d984" },
//   { name: "Installation", value: 18, color: "#666666" },
//   { name: "General", value: 12, color: "#999999" },
// ];

type DataChart = {
  name: string;
  value: number;
  color: string;
};

export function TicketCategoryChart({
  filteredTickets,
}: {
  filteredTickets: Ticket[];
}) {
  const [data, setData] = useState<DataChart[]>([]);

  useEffect(() => {
    let group: any = {};

    filteredTickets.forEach((el: Ticket) => {
      let ticketCategory = el.ticketCategory;
      if (group[ticketCategory] === undefined) {
        group[ticketCategory] = 0;
      }
      group[ticketCategory]++;
    });

    const keys = Object.keys(group);

    let result: DataChart[] = [];

    keys.forEach((el) => {
      let color = "";
      if (el === "Request & Activation") {
        color = "#0f7535";
      } else if (el === "Complaint") {
        color = "#999999";
      }
      result.push({ name: el, value: group[el], color });
    });

    setData(result);
  }, []);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
