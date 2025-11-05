"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    created: 45,
    resolved: 40,
  },
  {
    name: "Feb",
    created: 52,
    resolved: 48,
  },
  {
    name: "Mar",
    created: 38,
    resolved: 42,
  },
  {
    name: "Apr",
    created: 60,
    resolved: 55,
  },
  {
    name: "May",
    created: 45,
    resolved: 50,
  },
  {
    name: "Jun",
    created: 55,
    resolved: 52,
  },
  {
    name: "Jul",
    created: 48,
    resolved: 45,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="created" fill="#4a6522" radius={[4, 4, 0, 0]} className="fill-accent" />
        <Bar dataKey="resolved" fill="#c2d984" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
