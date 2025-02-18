import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useWorkspaceManagement() {
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { authUser } = useAuthContext();
    const { toast } = useToast();
    const limit = 10;

    const fetchWorkspaces = async (page) => {
        if (!authUser?.token) {
            toast({
                title: "Erro de autenticação",
                description: "Você precisa estar logado para acessar esta função",
                variant: "destructive",
            });
            return;
        }
        
        setLoading(true);
        try {
            const response = await fetch(`/api/workspaces/list?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${authUser.token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha ao buscar empresas');
            }

            setWorkspaces(data.workspaces || []);
            setTotalPages(Math.ceil((data.total || 0) / limit));
            setCurrentPage(page);
        } catch (error) {
            console.error('Erro ao buscar empresas:', error);
            toast({
                title: "Erro ao carregar empresas",
                description: error.message || "Não foi possível carregar a lista de empresas",
                variant: "destructive",
            });
            setWorkspaces([]);
        } finally {
            setLoading(false);
        }
    };

    const updateWorkspaceMessages = async (workspaceId, messagesData) => {
        if (!authUser?.token) {
            toast({
                title: "Erro de autenticação",
                description: "Você precisa estar logado para acessar esta função",
                variant: "destructive",
            });
            return false;
        }

        try {
            const response = await fetch(`/api/workspaces/${workspaceId}/messages`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authUser.token}`
                },
                body: JSON.stringify(messagesData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha ao atualizar mensagens');
            }

            toast({
                title: "Sucesso",
                description: "Mensagens atualizadas com sucesso",
            });
            
            return true;
        } catch (error) {
            console.error('Erro ao atualizar mensagens:', error);
            toast({
                title: "Erro",
                description: error.message || "Erro ao atualizar mensagens",
                variant: "destructive",
            });
            return false;
        }
    };

    return {
        workspaces,
        loading,
        currentPage,
        totalPages,
        setCurrentPage,
        fetchWorkspaces,
        updateWorkspaceMessages
    };
}