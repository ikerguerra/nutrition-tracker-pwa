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
import './TemplatesPage.css';

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
            <div className="templates-header">
                <h1 className="text-2xl font-bold">Mis Plantillas</h1>
                <Button onClick={() => setShowCreateModal(true)}>
                    Crear Plantilla
                </Button>
            </div>

            {loading ? (
                <div className="loading-state">Cargando plantillas...</div>
            ) : templates.length === 0 ? (
                <div className="empty-state">
                    <p>No tienes plantillas guardadas.</p>
                </div>
            ) : (
                <div className="templates-grid">
                    {templates.map(template => (
                        <div key={template.id} className="template-card card">
                            <div className="template-card-header">
                                <h3>{template.name}</h3>
                                <span className={`badge badge-${template.mealType?.toLowerCase() || 'default'}`}>
                                    {template.mealType || 'Cualquiera'}
                                </span>
                            </div>
                            <p className="template-desc">{template.description}</p>
                            <div className="template-items">
                                <strong>Alimentos:</strong>
                                <ul>
                                    {template.items.map(item => (
                                        <li key={item.id}>
                                            {item.foodName} - {item.quantity} {item.unit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="template-actions">
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        setSelectedTemplate(template);
                                        setApplyMealType(template.mealType || '');
                                        setShowApplyModal(true);
                                    }}
                                >
                                    Aplicar
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(template.id)}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </div>
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
