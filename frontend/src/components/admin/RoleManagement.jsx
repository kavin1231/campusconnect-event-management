import React from "react";
import Sidebar from "../common/Sidebar";

const RoleManagement = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex">
      <Sidebar isAdmin={true} />
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-black text-white mb-6">Role Management</h1>
        <div className="bg-neutral-dark/30 rounded-2xl p-8 border border-neutral-border">
          <p className="text-slate-400 mb-6">
            This module allows administrators to manage user roles and permissions across the platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-neutral-dark/50 border border-neutral-border">
              <h3 className="text-xl font-bold text-white mb-2">System Admins</h3>
              <p className="text-sm text-slate-400">Manage global settings and platform-level configurations.</p>
            </div>

            <div className="p-6 rounded-xl bg-neutral-dark/50 border border-neutral-border">
              <h3 className="text-xl font-bold text-white mb-2">Club Presidents</h3>
              <p className="text-sm text-slate-400">Manage club-specific activities and logistics requests.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
