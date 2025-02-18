import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
    Dashboard,
    Sidebar,
    UserManagement,
    WorkspaceManagement,
    MessageManagement,
    UserPermissions,
    UserLogs,
    WorkspaceSettings,
    WorkspaceIntegrations,
    MessageTemplates,
    MessageSettings,
    SystemSettings,
    SystemBackup,
    SystemLogs
} from './components';

export default function SuperAdminPage() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-background">
                <div className="container mx-auto py-6 px-4">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/users/permissions" element={<UserPermissions />} />
                        <Route path="/users/logs" element={<UserLogs />} />
                        <Route path="/workspaces" element={<WorkspaceManagement />} />
                        <Route path="/workspaces/settings" element={<WorkspaceSettings />} />
                        <Route path="/workspaces/integrations" element={<WorkspaceIntegrations />} />
                        <Route path="/messages" element={<MessageManagement />} />
                        <Route path="/messages/templates" element={<MessageTemplates />} />
                        <Route path="/messages/settings" element={<MessageSettings />} />
                        <Route path="/system/settings" element={<SystemSettings />} />
                        <Route path="/system/backup" element={<SystemBackup />} />
                        <Route path="/system/logs" element={<SystemLogs />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
} 