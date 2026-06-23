"use client";

import { TrendingUp, Users, FileText, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      icon: Users,
      label: "Active Travelers",
      value: "1,234",
      change: "+12%",
    },
    {
      icon: FileText,
      label: "Pending Requests",
      value: "48",
      change: "-4%",
    },
    {
      icon: CheckCircle,
      label: "Completed Trips",
      value: "892",
      change: "+23%",
    },
    {
      icon: TrendingUp,
      label: "Cost Savings",
      value: "$47.2K",
      change: "+8%",
    },
  ];

  const recentProjects = [
    { name: "Q2 Conference", status: "In Progress", team: "5 members" },
    { name: "Executive Retreat", status: "Planning", team: "3 members" },
    { name: "Annual Summit", status: "Completed", team: "12 members" },
  ];

  const recentActivity = [
    {
      action: "New booking created",
      description: "John Doe booked flight to NYC",
      time: "2 hours ago",
    },
    {
      action: "Expense approved",
      description: "Hotel accommodation approved",
      time: "4 hours ago",
    },
    {
      action: "Trip completed",
      description: "Executive visit to San Francisco completed",
      time: "1 day ago",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-display font-bold">Welcome back</h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your travel operations overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-6 rounded-lg border border-foreground/10 bg-background/50 hover:border-foreground/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-green-500 font-medium">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-display font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 p-6 rounded-lg border border-foreground/10 bg-background/50">
          <h2 className="text-lg font-display font-bold mb-4">Recent Projects</h2>
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div
                key={project.name}
                className="p-4 rounded-lg border border-foreground/5 hover:border-foreground/10 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{project.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{project.team}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
          <h2 className="text-lg font-display font-bold mb-4">Activity Feed</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="pb-4 border-b border-foreground/5 last:border-0">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground/50 mt-2">
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
        <h2 className="text-lg font-display font-bold mb-4">Performance</h2>
        <div className="h-64 flex items-center justify-center border border-dashed border-foreground/10 rounded-lg">
          <p className="text-muted-foreground">Chart placeholder</p>
        </div>
      </div>
    </div>
  );
}
