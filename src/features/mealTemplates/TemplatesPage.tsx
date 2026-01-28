import React, { useState, useEffect } from 'react';
import { Layout } from '@components/layout/Layout';
import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { toast } from 'react-hot-toast';
import mealTemplateService from '@services/mealTemplateService';
import { MealTemplate } from '../../types/mealTemplate';
import { MealType } from '../../types/dailyLog';
import './TemplatesPage.css';

const TemplatesPage: React.FC = () => {
    const [templates, setTemplates] = useState<MealTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showApplyModal, setShowApplyModal] = useState(false);
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
                applyDate || new Date().toISOString().split('T')[0],
                applyMealType || undefined
            );
            toast.success('Plantilla aplicada correctamente');
            setShowApplyModal(false);
        } catch (error) {
            console.error('Error applying template:', error);
            toast.error('Error al aplicar la plantilla');
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

    return (
        <Layout>
            <div className="templates-header">
                <h1 className="text-2xl font-bold">Mis Plantillas</h1>
                <Button onClick={() => toast('Funcionalidad de creación próximamente')}>
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
                                    variant="danger"
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

            <Modal
                isOpen={showApplyModal}
                onClose={() => setShowApplyModal(false)}
                title="Aplicar Plantilla"
            >
                <div className="apply-modal-content">
                    <div className="form-group">
                        <label>Fecha</label>
                        <input
                            type="date"
                            className="input"
                            value={applyDate}
                            onChange={(e) => setApplyDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Momento del día (opcional)</label>
                        <select
                            className="input"
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
                    <div className="modal-actions">
                        <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleApply}>
                            Aplicar ahora
                        </Button>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default TemplatesPage;
