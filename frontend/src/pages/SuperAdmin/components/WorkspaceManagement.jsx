import React, { useState, useEffect } from 'react';
import { useWorkspaceManagement } from '@/hooks/useWorkspaceManagement';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WorkspaceManagement() {
    const {
        workspaces,
        loading,
        currentPage,
        totalPages,
        setCurrentPage,
        fetchWorkspaces,
        updateWorkspaceMessages
    } = useWorkspaceManagement();
    
    const [editingWorkspace, setEditingWorkspace] = useState(null);
    const [date, setDate] = useState(null);

    useEffect(() => {
        fetchWorkspaces(currentPage);
    }, [currentPage]);

    const handleUpdateMessages = async (event) => {
        event.preventDefault();
        if (!editingWorkspace?.id) return;

        const formData = new FormData(event.target);
        const messagesData = {
            availableMessages: parseInt(formData.get('availableMessages')),
            messagesExpiration: date?.toISOString()
        };

        const success = await updateWorkspaceMessages(editingWorkspace.id, messagesData);
        if (success) {
            setEditingWorkspace(null);
            fetchWorkspaces(currentPage);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gerenciamento de Empresas</h2>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>CNPJ</TableHead>
                            <TableHead>Mensagens Disponíveis</TableHead>
                            <TableHead>Expiração</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workspaces.map((workspace) => (
                            <TableRow key={workspace.id}>
                                <TableCell>{workspace.id}</TableCell>
                                <TableCell>{workspace.name}</TableCell>
                                <TableCell>{workspace.cnpj}</TableCell>
                                <TableCell>{workspace.availableMessages}</TableCell>
                                <TableCell>
                                    {workspace.messagesExpiration ? 
                                        format(new Date(workspace.messagesExpiration), 'dd/MM/yyyy', { locale: ptBR }) 
                                        : 'Não definido'}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingWorkspace(workspace)}
                                    >
                                        Editar Mensagens
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

            <Dialog open={!!editingWorkspace} onOpenChange={() => setEditingWorkspace(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Mensagens - {editingWorkspace?.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateMessages} className="space-y-4">
                        <div>
                            <Label htmlFor="availableMessages">Mensagens Disponíveis</Label>
                            <Input 
                                id="availableMessages" 
                                name="availableMessages" 
                                type="number"
                                defaultValue={editingWorkspace?.availableMessages}
                                required 
                            />
                        </div>
                        <div>
                            <Label>Data de Expiração</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button type="submit">Salvar Alterações</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
} 