"use client";

import { TrendingUp, Calendar, Users, DollarSign } from "lucide-react";

export default function AnalyticsPage() {
  const metrics = [
    {
      icon: Users,
      label: "Total Travelers",
      value: "1,234",
      change: "+12%",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: DollarSign,
      label: "Total Spend",
      value: "$124.5K",
      change: "+8%",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Calendar,
      label: "Active Trips",
      value: "87",
      change: "+5%",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      label: "Avg Trip Cost",
      value: "$1,245",
      change: "-3%",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Travel and expense analytics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="p-6 rounded-lg border border-foreground/10 bg-background/50 hover:border-foreground/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} opacity-20`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-green-500">
                  {metric.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <p className="text-2xl font-display font-bold">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
          <h2 className="text-lg font-display font-bold mb-6">Spending Trend</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-foreground/10 rounded-lg">
            <p className="text-muted-foreground">Chart placeholder</p>
          </div>
        </div>

        <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
          <h2 className="text-lg font-display font-bold mb-6">Trip Distribution</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-foreground/10 rounded-lg">
            <p className="text-muted-foreground">Chart placeholder</p>
          </div>
        </div>
      </div>

      {/* Table Placeholder */}
      <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
        <h2 className="text-lg font-display font-bold mb-6">Top Routes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/5">
                <th className="text-left py-3 font-medium">Route</th>
                <th className="text-left py-3 font-medium">Trips</th>
                <th className="text-left py-3 font-medium">Cost</th>
                <th className="text-left py-3 font-medium">Avg Cost</th>
              </tr>
            </thead>
            <tbody>
              {[
                { route: "NYC → LA", trips: 45, cost: "$89K", avg: "$1,980" },
                { route: "SF → Boston", trips: 38, cost: "$76K", avg: "$2,000" },
                { route: "Chicago → Miami", trips: 22, cost: "$35K", avg: "$1,590" },
              ].map((row) => (
                <tr key={row.route} className="border-b border-foreground/5 hover:bg-foreground/5 transition-all">
                  <td className="py-3">{row.route}</td>
                  <td className="py-3">{row.trips}</td>
                  <td className="py-3">{row.cost}</td>
                  <td className="py-3">{row.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
