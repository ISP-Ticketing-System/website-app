"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Technical",
    hours: 8.5,
  },
  {
    name: "Billing",
    hours: 4.2,
  },
  {
    name: "Installation",
    hours: 12.8,
  },
  {
    name: "General",
    hours: 3.5,
  },
]

export function TicketResolutionTimeChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}h`}
        />
        <Tooltip />
        <Bar dataKey="hours" fill="#4a6522" radius={[4, 4, 0, 0]} className="fill-accent" />
      </BarChart>
    </ResponsiveContainer>
  )
}
