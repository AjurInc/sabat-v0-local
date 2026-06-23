"use client";

import { Plus, Archive, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const projects = [
    {
      name: "Q2 Annual Conference",
      description: "Corporate conference with 500+ attendees",
      status: "In Progress",
      team: 8,
      progress: 65,
      dueDate: "Jun 30, 2026",
    },
    {
      name: "Executive Retreat",
      description: "Mountain resort team building",
      status: "Planning",
      team: 5,
      progress: 30,
      dueDate: "Jul 15, 2026",
    },
    {
      name: "Client Summit NYC",
      description: "Annual client meeting in New York",
      status: "Completed",
      team: 12,
      progress: 100,
      dueDate: "May 20, 2026",
    },
    {
      name: "Sales Kickoff",
      description: "Regional sales team meetings",
      status: "In Progress",
      team: 20,
      progress: 45,
      dueDate: "Jul 1, 2026",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-500";
      case "In Progress":
        return "bg-blue-500/10 text-blue-500";
      case "Planning":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-foreground/5 text-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your travel initiatives</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.name}
            className="p-6 rounded-lg border border-foreground/10 bg-background/50 hover:border-foreground/20 transition-all group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg mb-1">{project.name}</h3>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Status & Meta */}
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className="text-xs text-muted-foreground">{project.team} team members</span>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium">Progress</p>
                <p className="text-xs text-muted-foreground">{project.progress}%</p>
              </div>
              <div className="w-full h-2 rounded-full bg-foreground/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Due Date */}
            <p className="text-xs text-muted-foreground">Due: {project.dueDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
