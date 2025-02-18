import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingUser, setEditingUser] = useState(null);
    const { authUser } = useAuthContext();
    const { toast } = useToast();
    const limit = 10;

    const fetchUsers = async (page) => {
        if (!authUser?.token) return;
        
        setLoading(true);
        try {
            const response = await fetch(`/api/users/list?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${authUser.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao buscar usuários');
            }

            const data = await response.json();
            setUsers(data.users || []);
            setTotalPages(Math.ceil((data.total || 0) / limit));
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            toast({
                title: "Erro ao carregar usuários",
                description: error.message || "Não foi possível carregar a lista de usuários",
                variant: "destructive",
            });
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authUser?.token) {
            fetchUsers(currentPage);
        }
    }, [currentPage, authUser]);

    const handleEditUser = async (event) => {
        event.preventDefault();
        if (!authUser?.token || !editingUser?.id) return;

        const formData = new FormData(event.target);
        const userData = {
            email: formData.get('email'),
            username: formData.get('username'),
            cpf: formData.get('cpf'),
            gender: formData.get('gender'),
            password: formData.get('password')
        };

        try {
            const response = await fetch(`/api/users/update/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authUser.token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Falha ao atualizar usuário');
            }

            toast({
                title: "Sucesso",
                description: "Usuário atualizado com sucesso",
            });
            setEditingUser(null);
            fetchUsers(currentPage);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            toast({
                title: "Erro",
                description: error.message || "Erro ao atualizar usuário",
                variant: "destructive",
            });
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            const response = await fetch(`/api/users/toggle-status/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authUser.token}`
                }
            });

            if (response.ok) {
                toast({
                    title: "Sucesso",
                    description: "Status do usuário atualizado com sucesso",
                });
                fetchUsers(currentPage);
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao atualizar status do usuário",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.cpf}</TableCell>
                                <TableCell>{user.active ? 'Ativo' : 'Inativo'}</TableCell>
                                <TableCell className="space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingUser(user)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant={user.active ? "destructive" : "default"}
                                        size="sm"
                                        onClick={() => handleToggleStatus(user.id)}
                                    >
                                        {user.active ? 'Desativar' : 'Ativar'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i + 1}>
                            <PaginationLink
                                onClick={() => setCurrentPage(i + 1)}
                                isActive={currentPage === i + 1}
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditUser} className="space-y-4">
                        <div>
                            <Label htmlFor="username">Nome</Label>
                            <Input 
                                id="username" 
                                name="username" 
                                defaultValue={editingUser?.username}
                                required 
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                name="email" 
                                type="email"
                                defaultValue={editingUser?.email}
                                required 
                            />
                        </div>
                        <div>
                            <Label htmlFor="cpf">CPF</Label>
                            <Input 
                                id="cpf" 
                                name="cpf"
                                defaultValue={editingUser?.cpf}
                                required 
                            />
                        </div>
                        <div>
                            <Label htmlFor="gender">Gênero</Label>
                            <Select name="gender" defaultValue={editingUser?.gender}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o gênero" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Masculino">Masculino</SelectItem>
                                    <SelectItem value="Feminino">Feminino</SelectItem>
                                    <SelectItem value="Outro">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="password">Nova Senha (opcional)</Label>
                            <Input 
                                id="password" 
                                name="password" 
                                type="password"
                            />
                        </div>
                        <Button type="submit">Salvar Alterações</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
} 