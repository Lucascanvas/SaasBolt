import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
    Users,
    Building2,
    MessageSquare,
    Settings,
    BarChart3,
    Shield,
    Database,
    Network,
    Mail,
    ChevronDown,
    ArrowLeft
} from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const menuItems = [
    {
        title: 'Dashboard',
        icon: BarChart3,
        path: '/superadmin',
        exact: true
    },
    {
        title: 'Usuários',
        icon: Users,
        path: '/superadmin/users',
        submenu: [
            { title: 'Lista de Usuários', path: '/superadmin/users' },
            { title: 'Permissões', path: '/superadmin/users/permissions' },
            { title: 'Logs de Acesso', path: '/superadmin/users/logs' }
        ]
    },
    {
        title: 'Workspaces',
        icon: Building2,
        path: '/superadmin/workspaces',
        submenu: [
            { title: 'Lista de Empresas', path: '/superadmin/workspaces' },
            { title: 'Configurações', path: '/superadmin/workspaces/settings' },
            { title: 'Integrações', path: '/superadmin/workspaces/integrations' }
        ]
    },
    {
        title: 'Mensagens',
        icon: MessageSquare,
        path: '/superadmin/messages',
        submenu: [
            { title: 'Histórico', path: '/superadmin/messages' },
            { title: 'Templates', path: '/superadmin/messages/templates' },
            { title: 'Configurações', path: '/superadmin/messages/settings' }
        ]
    },
    {
        title: 'Sistema',
        icon: Settings,
        path: '/superadmin/system',
        submenu: [
            { title: 'Configurações', path: '/superadmin/system/settings' },
            { title: 'Backup', path: '/superadmin/system/backup' },
            { title: 'Logs', path: '/superadmin/system/logs' }
        ]
    }
];

const MenuItem = ({ item, isActive }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const location = useLocation();

    const isSubmenuActive = hasSubmenu && 
        item.submenu.some(subItem => location.pathname === subItem.path);

    if (hasSubmenu) {
        return (
            <Collapsible
                open={isOpen || isSubmenuActive}
                onOpenChange={setIsOpen}
                className="w-full"
            >
                <CollapsibleTrigger className="w-full">
                    <div
                        className={cn(
                            "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            "hover:bg-accent hover:text-accent-foreground w-full",
                            (isActive || isSubmenuActive) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5 mr-2" />
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronDown
                            className={cn(
                                "h-4 w-4 transition-transform",
                                isOpen && "transform rotate-180"
                            )}
                        />
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 space-y-1 mt-1">
                    {item.submenu.map((subItem) => (
                        <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={cn(
                                "flex items-center px-3 py-2 rounded-lg text-sm transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                location.pathname === subItem.path
                                    ? "bg-accent/50 text-accent-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {subItem.title}
                        </Link>
                    ))}
                </CollapsibleContent>
            </Collapsible>
        );
    }

    return (
        <Link
            to={item.path}
            className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
        >
            <item.icon className="h-5 w-5 mr-2" />
            {item.title}
        </Link>
    );
};

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="h-screen w-64 border-r bg-background p-4 space-y-4">
            <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    <span className="text-lg font-semibold">Admin Panel</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/app')}
                    className="hover:bg-accent"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                </Button>
            </div>
            
            <nav className="space-y-1">
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.path}
                        item={item}
                        isActive={location.pathname === item.path}
                    />
                ))}
            </nav>
        </div>
    );
} 