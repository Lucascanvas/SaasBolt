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

export default function MessageManagement() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const { authUser } = useAuthContext();
    const { toast } = useToast();

    const fetchMessages = async () => {
        try {
            const response = await fetch('/api/admin/messages', {
                headers: {
                    'Authorization': `Bearer ${authUser.token}`
                }
            });
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            toast({
                title: "Erro ao carregar mensagens",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleAddMessage = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const messageData = {
            content: formData.get('content'),
            type: formData.get('type'),
            workspaceId: formData.get('workspaceId')
        };

        try {
            const response = await fetch('/api/admin/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authUser.token}`
                },
                body: JSON.stringify(messageData)
            });

            if (response.ok) {
                toast({
                    title: "Sucesso",
                    description: "Mensagem adicionada com sucesso",
                });
                setShowAddDialog(false);
                fetchMessages();
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao adicionar mensagem",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gerenciamento de Mensagens</h2>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                        <Button>Adicionar Mensagem</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar Nova Mensagem</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddMessage} className="space-y-4">
                            <div>
                                <Label htmlFor="content">Conteúdo</Label>
                                <Input id="content" name="content" required />
                            </div>
                            <div>
                                <Label htmlFor="type">Tipo</Label>
                                <Input id="type" name="type" required />
                            </div>
                            <div>
                                <Label htmlFor="workspaceId">ID do Workspace</Label>
                                <Input id="workspaceId" name="workspaceId" type="number" required />
                            </div>
                            <Button type="submit">Adicionar Mensagem</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Conteúdo</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Workspace</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.map((message) => (
                            <TableRow key={message.id}>
                                <TableCell>{message.id}</TableCell>
                                <TableCell>{message.content}</TableCell>
                                <TableCell>{message.type}</TableCell>
                                <TableCell>{message.workspaceName}</TableCell>
                                <TableCell>{message.status}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteMessage(message.id)}
                                    >
                                        Deletar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
} 