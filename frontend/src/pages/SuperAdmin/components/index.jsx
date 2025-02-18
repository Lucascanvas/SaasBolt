import React from 'react';

// Componentes principais
export { default as Dashboard } from './Dashboard';
export { default as UserManagement } from './UserManagement';
export { default as WorkspaceManagement } from './WorkspaceManagement';
export { default as MessageManagement } from './MessageManagement';
export { default as Sidebar } from './Sidebar';

// Componentes temporários
const TempComponent = ({ children }) => (
    <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">{children}</h2>
        <p className="text-muted-foreground">Esta página está em desenvolvimento.</p>
    </div>
);

export const UserPermissions = () => <TempComponent>Permissões de Usuários</TempComponent>;
export const UserLogs = () => <TempComponent>Logs de Usuários</TempComponent>;
export const WorkspaceSettings = () => <TempComponent>Configurações de Workspace</TempComponent>;
export const WorkspaceIntegrations = () => <TempComponent>Integrações de Workspace</TempComponent>;
export const MessageTemplates = () => <TempComponent>Templates de Mensagens</TempComponent>;
export const MessageSettings = () => <TempComponent>Configurações de Mensagens</TempComponent>;
export const SystemSettings = () => <TempComponent>Configurações do Sistema</TempComponent>;
export const SystemBackup = () => <TempComponent>Backup do Sistema</TempComponent>;
export const SystemLogs = () => <TempComponent>Logs do Sistema</TempComponent>; 