"use client";

import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const notifications = [
    {
      icon: Bell,
      title: "New booking confirmation",
      description: "Your flight to NYC has been booked",
      timestamp: "1 hour ago",
      read: false,
    },
    {
      icon: Bell,
      title: "Expense approval required",
      description: "Sarah needs approval for travel expenses",
      timestamp: "3 hours ago",
      read: false,
    },
    {
      icon: Bell,
      title: "Travel policy update",
      description: "New travel guidelines have been published",
      timestamp: "1 day ago",
      read: true,
    },
    {
      icon: Bell,
      title: "Trip reminder",
      description: "Your meeting in Boston starts tomorrow at 9 AM",
      timestamp: "2 days ago",
      read: true,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Notifications</h1>
        <p className="text-muted-foreground mt-1">Stay updated on your travel activities</p>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-w-2xl">
        {notifications.map((notif, idx) => {
          const Icon = notif.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-lg border transition-all ${
                notif.read
                  ? "border-foreground/5 bg-background/50"
                  : "border-blue-500/20 bg-blue-500/5"
              }`}
            >
              <div className="flex items-start gap-4">
                <Icon
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    notif.read ? "text-muted-foreground" : "text-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <p className={`font-medium ${notif.read ? "text-muted-foreground" : ""}`}>
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {notif.description}
                  </p>
                  <p className="text-xs text-muted-foreground/50">{notif.timestamp}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-foreground/5 rounded transition-all">
                    <Check className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 hover:bg-foreground/5 rounded transition-all">
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clear All Button */}
      <div className="pt-4 max-w-2xl">
        <Button variant="outline" className="w-full">
          Clear All Notifications
        </Button>
      </div>
    </div>
  );
}
