"use client";

import { useState } from "react";
import { Moon, Sun, Bell, Lock, LogOut, Trash2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: "account", label: "Account" },
    { id: "security", label: "Security" },
    { id: "appearance", label: "Appearance" },
    { id: "notifications", label: "Notifications" },
  ];

  const sessions = [
    { device: "Chrome on Mac OS", location: "San Francisco, CA", lastActive: "Just now" },
    { device: "Safari on iPhone", location: "San Francisco, CA", lastActive: "2 hours ago" },
    { device: "Firefox on Windows", location: "New York, NY", lastActive: "1 day ago" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-blue-500 text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      {activeTab === "account" && (
        <div className="space-y-6 max-w-2xl">
          <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
            <h2 className="text-lg font-display font-bold mb-6">Email & Contact</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  value="john@company.com"
                  className="mt-1 h-10"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  type="tel"
                  value="+1 (555) 123-4567"
                  className="mt-1 h-10"
                />
              </div>
              <Button className="w-full">Save Changes</Button>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
            <h2 className="text-lg font-display font-bold mb-6">Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Organization Name</label>
                <Input
                  type="text"
                  value="Acme Corp"
                  className="mt-1 h-10"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Input
                  type="text"
                  value="Travel Manager"
                  className="mt-1 h-10"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <div className="space-y-6 max-w-2xl">
          <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
            <h2 className="text-lg font-display font-bold mb-6">Password</h2>
            <Button variant="outline" className="gap-2">
              <Lock className="w-4 h-4" />
              Change Password
            </Button>
          </div>

          <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
            <h2 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
              Two-Factor Authentication
            </h2>
            <div className="flex items-center justify-between p-4 rounded-lg border border-foreground/5 mb-4">
              <div>
                <p className="font-medium text-sm">Enable 2FA</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
          </div>

          <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
            <h2 className="text-lg font-display font-bold mb-6">Active Sessions</h2>
            <div className="space-y-3">
              {sessions.map((session, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-foreground/5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{session.device}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {session.location} • {session.lastActive}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Appearance Settings */}
      {activeTab === "appearance" && (
        <div className="space-y-6 max-w-2xl">
          <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
            <h2 className="text-lg font-display font-bold mb-6">Theme</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-lg border-2 border-blue-500 bg-background/50">
                <Moon className="w-5 h-5 mx-auto mb-2" />
                <p className="text-sm font-medium">Dark</p>
              </button>
              <button className="p-4 rounded-lg border border-foreground/10 hover:border-foreground/20 transition-all">
                <Sun className="w-5 h-5 mx-auto mb-2" />
                <p className="text-sm font-medium">Light</p>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
            <h2 className="text-lg font-display font-bold mb-6">Color Scheme</h2>
            <div className="space-y-2">
              {["Blue", "Indigo", "Purple"].map((color) => (
                <div
                  key={color}
                  className="p-3 rounded-lg border border-foreground/5 hover:border-foreground/10 cursor-pointer transition-all"
                >
                  {color}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === "notifications" && (
        <div className="space-y-6 max-w-2xl">
          <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
            <h2 className="text-lg font-display font-bold mb-6">Email Notifications</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Travel Updates",
                  description: "Get notified about your bookings and trips",
                },
                {
                  title: "Approval Requests",
                  description: "Notifications for pending approvals",
                },
                {
                  title: "Team Activity",
                  description: "Updates on team member activities",
                },
                {
                  title: "Weekly Summary",
                  description: "Receive a weekly summary of your travel",
                },
              ].map((notif) => (
                <div
                  key={notif.title}
                  className="flex items-center justify-between p-4 rounded-lg border border-foreground/5"
                >
                  <div>
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.description}</p>
                  </div>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
            <h2 className="text-lg font-display font-bold mb-6">Push Notifications</h2>
            <div className="flex items-center justify-between p-4 rounded-lg border border-foreground/5">
              <div>
                <p className="text-sm font-medium">Enable Push Notifications</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Receive notifications on your devices
                </p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone (appears on Account tab) */}
      {activeTab === "account" && (
        <div className="max-w-2xl p-6 rounded-lg border border-red-500/20 bg-red-500/5">
          <h2 className="text-lg font-display font-bold mb-4 text-red-500">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10 gap-2">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>
        </div>
      )}
    </div>
  );
}
