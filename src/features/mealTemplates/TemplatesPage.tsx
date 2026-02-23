import React, { useState, useEffect } from 'react';
import { Layout } from '@components/layout/Layout';
import { Button } from '@components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@components/ui/dialog';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { toast } from 'react-hot-toast';
import mealTemplateService from '@services/mealTemplateService';
import { MealTemplate, CreateMealTemplateRequest } from '../../types/mealTemplate';
import { MealType } from '../../types/dailyLog';
import { TemplateForm } from './TemplateForm';
import { Card, CardContent, CardHeader, CardFooter } from '@components/ui/card';
import { Utensils, PlusCircle, Trash2, LayoutTemplate } from 'lucide-react';

const TemplatesPage: React.FC = () => {
    const [templates, setTemplates] = useState<MealTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<MealTemplate | null>(null);
    const [applyDate, setApplyDate] = useState(new Date().toISOString().split('T')[0]);
    const [applyMealType, setApplyMealType] = useState<MealType | ''>('');

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const data = await mealTemplateService.getTemplates();
            setTemplates(data);
        } catch (error) {
            console.error('Error fetching templates:', error);
            toast.error('Error al cargar las plantillas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleApply = async () => {
        if (!selectedTemplate) return;

        try {
            await mealTemplateService.applyTemplate(
                selectedTemplate.id,
                applyDate || new Date().toISOString().split('T')[0] || '',
                applyMealType || undefined
            );
            toast.success('Plantilla aplicada correctamente');
            setShowApplyModal(false);
        } catch (error) {
            console.error('Error applying template:', error);
            toast.error('Error al aplicar la plantilla');
        }
    };

    const handleCreateTemplate = async (data: CreateMealTemplateRequest) => {
        try {
            const newTemplate = await mealTemplateService.createTemplate(data);
            setTemplates([...templates, newTemplate]);
            toast.success('Plantilla creada exitosamente');
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating template:', error);
            toast.error('Error al crear la plantilla');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) return;

        try {
            await mealTemplateService.deleteTemplate(id);
            setTemplates(prev => prev.filter(t => t.id !== id));
            toast.success('Plantilla eliminada');
        } catch (error) {
            console.error('Error deleting template:', error);
            toast.error('Error al eliminar la plantilla');
        }
    };

    const handleOpenChangeApply = (open: boolean) => {
        if (!open) setShowApplyModal(false);
    };

    const handleOpenChangeCreate = (open: boolean) => {
        if (!open) setShowCreateModal(false);
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Mis Plantillas</h1>
                <Button onClick={() => setShowCreateModal(true)} className="gap-2 shadow-lg hover:shadow-primary/25">
                    <LayoutTemplate className="w-4 h-4" />
                    Crear Plantilla
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : templates.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-accent/20 rounded-xl border border-dashed border-border/50">
                    <p>No tienes plantillas guardadas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(template => (
                        <Card key={template.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg leading-tight">{template.name}</h3>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                                            ${!template.mealType ? 'bg-secondary text-secondary-foreground' :
                                                template.mealType === 'BREAKFAST' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                    template.mealType === 'LUNCH' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        template.mealType === 'DINNER' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                            {!template.mealType ? 'Cualquiera' :
                                                template.mealType === 'BREAKFAST' ? 'Desayuno' :
                                                    template.mealType === 'LUNCH' ? 'Almuerzo' :
                                                        template.mealType === 'DINNER' ? 'Cena' : 'Snack'}
                                        </div>
                                        {template.isSystem && (
                                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                Sistema
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {template.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{template.description}</p>
                                )}
                            </CardHeader>

                            <CardContent className="flex-1 pb-4">
                                <div className="space-y-3">
                                    <div className="text-sm font-medium flex items-center gap-2">
                                        <Utensils className="h-4 w-4 text-primary" />
                                        <span>Alimentos incluidos:</span>
                                    </div>
                                    <div className="bg-secondary/20 rounded-lg p-3 text-sm space-y-1.5 max-h-[120px] overflow-y-auto no-scrollbar">
                                        {template.items.map(item => (
                                            <div key={item.id} className="flex justify-between items-center text-muted-foreground">
                                                <span className="truncate pr-2">{item.foodName}</span>
                                                <span className="font-medium whitespace-nowrap text-foreground">{item.quantity} {item.unit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-0 gap-2">
                                <Button
                                    className="flex-1 gap-2"
                                    onClick={() => {
                                        setSelectedTemplate(template);
                                        setApplyMealType(template.mealType || '');
                                        setShowApplyModal(true);
                                    }}
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    Aplicar
                                </Button>
                                {!template.isSystem && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(template.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={showApplyModal} onOpenChange={handleOpenChangeApply}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Aplicar Plantilla</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="applyDate">Fecha</Label>
                            <Input
                                id="applyDate"
                                type="date"
                                value={applyDate}
                                onChange={(e) => setApplyDate(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="applyMealType">Momento del día (opcional)</Label>
                            <select
                                id="applyMealType"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                value={applyMealType}
                                onChange={(e) => setApplyMealType(e.target.value as MealType)}
                            >
                                <option value="">Mantener original</option>
                                <option value="BREAKFAST">Desayuno</option>
                                <option value="LUNCH">Almuerzo</option>
                                <option value="DINNER">Cena</option>
                                <option value="SNACK">Snack</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowApplyModal(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleApply}>
                            Aplicar ahora
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showCreateModal} onOpenChange={handleOpenChangeCreate}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Nueva Plantilla</DialogTitle>
                    </DialogHeader>
                    <TemplateForm
                        onCancel={() => setShowCreateModal(false)}
                        onSave={handleCreateTemplate}
                    />
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default TemplatesPage;
