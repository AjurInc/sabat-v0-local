"use client";

import { Search, Send, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MessagesPage() {
  const conversations = [
    {
      name: "Sarah Johnson",
      lastMessage: "Great work on the conference planning!",
      timestamp: "2 hours ago",
      unread: 0,
    },
    {
      name: "Finance Team",
      lastMessage: "Budget approval for Q3 travel pending",
      timestamp: "4 hours ago",
      unread: 3,
    },
    {
      name: "Travel Coordinators",
      lastMessage: "New booking preferences updated",
      timestamp: "Yesterday",
      unread: 0,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Messages</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Message
        </Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        {/* Conversations List */}
        <div className="lg:col-span-1 border border-foreground/10 rounded-lg bg-background/50 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-foreground/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 h-9"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.name}
                className="p-4 border-b border-foreground/5 hover:bg-foreground/5 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-sm">{conv.name}</p>
                  {conv.unread > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500 text-white">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {conv.lastMessage}
                </p>
                <p className="text-xs text-muted-foreground/50 mt-1">{conv.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 border border-foreground/10 rounded-lg bg-background/50 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-foreground/10">
            <h2 className="font-display font-bold">Select a conversation</h2>
            <p className="text-sm text-muted-foreground">
              or start a new message
            </p>
          </div>

          {/* Chat Messages - Placeholder */}
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">
              Select a conversation to start messaging
            </p>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-foreground/10">
            <div className="flex gap-2">
              <Input placeholder="Type your message..." />
              <Button size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
