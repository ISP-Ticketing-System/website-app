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
//   { name: "Open", value: 42, color: "#4a6522" },
//   { name: "In Progress", value: 28, color: "#c2d984" },
//   { name: "Resolved", value: 15, color: "#666666" },
//   { name: "Closed", value: 65, color: "#999999" },
// ];

type DataChart = {
  name: string;
  value: number;
  color: string;
};

export function TicketStatusChart({
  filteredTickets,
}: {
  filteredTickets: Ticket[];
}) {
  const [data, setData] = useState<DataChart[]>([]);

  useEffect(() => {
    let group: any = {};

    filteredTickets.forEach((el: Ticket) => {
      let status = el.status;
      if (group[status] === undefined) {
        group[status] = 0;
      }
      group[status]++;
    });

    const keys = Object.keys(group);

    let result: DataChart[] = [];

    keys.forEach((el) => {
      let color = "";
      if (el === "Done") {
        color = "#0f7535";
      } else if (el === "In Progress") {
        color = "oklch(85.2% 0.199 91.936)";
      } else if (el === "Escalated") {
        color = "red";
      } else if (el === "Started") {
        color = "oklch(62.3% 0.214 259.815)";
      }
      console.log(color, el, "<<<<");

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
