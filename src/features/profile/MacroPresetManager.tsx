import { useState, useEffect } from 'react';
import macroPresetService, { MacroPreset, CreateMacroPresetRequest } from '../../services/macroPresetService';
import { Button } from '@components/ui/Button';
import { toast } from 'react-hot-toast';
import './MacroPresetManager.css';

interface MacroPresetManagerProps {
    onApplyPreset?: () => void;
}

export const MacroPresetManager: React.FC<MacroPresetManagerProps> = ({ onApplyPreset }) => {
    const [presets, setPresets] = useState<MacroPreset[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<CreateMacroPresetRequest>({
        name: '',
        proteinPercentage: 30,
        carbsPercentage: 40,
        fatsPercentage: 30
    });

    useEffect(() => {
        loadPresets();
    }, []);

    const loadPresets = async () => {
        try {
            setLoading(true);
            const data = await macroPresetService.getPresets();
            setPresets(data);
        } catch (error) {
            console.error('Error loading presets:', error);
            toast.error('Error al cargar presets');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate sum
        const sum = formData.proteinPercentage + formData.carbsPercentage + formData.fatsPercentage;
        if (sum !== 100) {
            toast.error('Los porcentajes deben sumar 100%');
            return;
        }

        try {
            await macroPresetService.createPreset(formData);
            toast.success('Preset creado');
            setShowForm(false);
            setFormData({ name: '', proteinPercentage: 30, carbsPercentage: 40, fatsPercentage: 30 });
            loadPresets();
        } catch (error) {
            console.error('Error creating preset:', error);
            toast.error('Error al crear preset');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Eliminar este preset?')) return;

        try {
            await macroPresetService.deletePreset(id);
            toast.success('Preset eliminado');
            loadPresets();
        } catch (error) {
            console.error('Error deleting preset:', error);
            toast.error('Error al eliminar preset');
        }
    };

    const handleApply = async (id: number) => {
        try {
            await macroPresetService.applyPreset(id);
            toast.success('Preset aplicado al perfil');
            onApplyPreset?.();
        } catch (error) {
            console.error('Error applying preset:', error);
            toast.error('Error al aplicar preset');
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await macroPresetService.setDefaultPreset(id);
            toast.success('Preset marcado como predeterminado');
            loadPresets();
        } catch (error) {
            console.error('Error setting default:', error);
            toast.error('Error al marcar como predeterminado');
        }
    };

    if (loading) return <div>Cargando presets...</div>;

    return (
        <div className="macro-preset-manager">
            <div className="preset-header">
                <h3>Presets de Macronutrientes</h3>
                <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancelar' : '+ Nuevo Preset'}
                </Button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="preset-form">
                    <input
                        type="text"
                        placeholder="Nombre del preset"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="macro-inputs">
                        <div>
                            <label>Proteína (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.proteinPercentage}
                                onChange={(e) => setFormData({ ...formData, proteinPercentage: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label>Carbohidratos (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.carbsPercentage}
                                onChange={(e) => setFormData({ ...formData, carbsPercentage: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label>Grasas (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.fatsPercentage}
                                onChange={(e) => setFormData({ ...formData, fatsPercentage: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <Button type="submit" variant="primary">Guardar Preset</Button>
                </form>
            )}

            <div className="presets-list">
                {presets.length === 0 ? (
                    <p>No hay presets guardados</p>
                ) : (
                    presets.map((preset) => (
                        <div key={preset.id} className={`preset-card ${preset.isDefault ? 'default' : ''}`}>
                            <div className="preset-info">
                                <h4>{preset.name} {preset.isDefault && <span className="badge">Predeterminado</span>}</h4>
                                <div className="preset-macros">
                                    <span>P: {preset.proteinPercentage}%</span>
                                    <span>C: {preset.carbsPercentage}%</span>
                                    <span>G: {preset.fatsPercentage}%</span>
                                </div>
                            </div>
                            <div className="preset-actions">
                                <Button variant="primary" onClick={() => handleApply(preset.id)}>Aplicar</Button>
                                {!preset.isDefault && (
                                    <Button variant="secondary" onClick={() => handleSetDefault(preset.id)}>Predeterminado</Button>
                                )}
                                <Button variant="secondary" onClick={() => handleDelete(preset.id)}>Eliminar</Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
