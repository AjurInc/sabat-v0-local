"use client";

import { useState } from "react";
import { Camera, Mail, Phone, MapPin, Briefcase, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Activity" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <div className="rounded-lg border border-foreground/10 bg-background/50 overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20"></div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex items-end gap-4 mb-6">
            <div className="relative -mt-20">
              <div className="w-24 h-24 rounded-xl border-4 border-background bg-gradient-to-br from-blue-500 to-cyan-500"></div>
              <button className="absolute bottom-0 right-0 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold">John Doe</h1>
              <p className="text-muted-foreground">john@company.com</p>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              ) : (
                "Edit Profile"
              )}
            </Button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">john@company.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">San Francisco, CA</span>
            </div>
          </div>
        </div>
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

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Account Info */}
            <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
              <h2 className="text-lg font-display font-bold mb-6">Account Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      type="text"
                      value="John"
                      disabled={!isEditing}
                      className="mt-1 h-10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      type="text"
                      value="Doe"
                      disabled={!isEditing}
                      className="mt-1 h-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value="john@company.com"
                    disabled={!isEditing}
                    className="mt-1 h-10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Job Title</label>
                  <Input
                    type="text"
                    value="Travel Manager"
                    disabled={!isEditing}
                    className="mt-1 h-10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <Input
                    type="text"
                    value="Operations"
                    disabled={!isEditing}
                    className="mt-1 h-10"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
              <h2 className="text-lg font-display font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  "Logged in from Chrome on Mac OS",
                  "Updated profile picture",
                  "Changed password",
                  "Created new project",
                ].map((activity, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-foreground/5 text-sm"
                  >
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
              <h2 className="text-lg font-display font-bold mb-6">Profile Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-foreground/5">
                  <div>
                    <p className="font-medium text-sm">Email Notifications</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Receive email updates about your account
                    </p>
                  </div>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-foreground/5">
                  <div>
                    <p className="font-medium text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Secure your account with 2FA
                    </p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 rounded-lg border border-red-500/20 bg-red-500/5">
              <h3 className="text-lg font-display font-bold mb-4 text-red-500">
                Danger Zone
              </h3>
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                Delete Account
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
