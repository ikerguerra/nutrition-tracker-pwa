import React, { useState, useEffect } from 'react';
import { Layout } from '@components/layout/Layout';
import userProfileService from '@services/userProfileService';
import type { UserProfile, UserProfileUpdateRequest } from '../../types/userProfile';
import { toast } from 'react-hot-toast';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<UserProfileUpdateRequest>({});

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await userProfileService.getMyProfile();
            setProfile(data);
            setFormData({
                height: data.height ?? undefined,
                weight: data.weight ?? undefined,
                dateOfBirth: data.dateOfBirth ?? undefined,
                gender: data.gender ?? undefined,
                nutritionalGoal: data.nutritionalGoal ?? undefined,
                dietType: data.dietType ?? undefined,
                activityLevel: data.activityLevel ?? undefined,
                useCustomMacros: data.useCustomMacros,
                customProteinPercentage: data.customProteinPercentage ?? undefined,
                customCarbsPercentage: data.customCarbsPercentage ?? undefined,
                customFatsPercentage: data.customFatsPercentage ?? undefined,
            });
        } catch (error) {
            console.error('Error loading profile:', error);
            toast.error('Error al cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            const updated = await userProfileService.updateMyProfile(formData);
            setProfile(updated);
            toast.success('Perfil actualizado correctamente');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error al actualizar el perfil');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof UserProfileUpdateRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <Layout>
                <div className="profile-loading">Cargando perfil...</div>
            </Layout>
        );
    }

    const hasGoals = profile?.dailyCalorieGoal !== null;

    return (
        <Layout>
            <div className="profile-container">
                <h1 className="profile-title">Mi Perfil</h1>

                <div className="profile-grid">
                    {/* Form Section */}
                    <div className="profile-form-section">
                        <form onSubmit={handleSubmit} className="profile-form">
                            <h2>Datos Personales</h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="height">Altura (cm)</label>
                                    <input
                                        id="height"
                                        type="number"
                                        min="50"
                                        max="300"
                                        value={formData.height ?? ''}
                                        onChange={(e) => handleChange('height', parseFloat(e.target.value))}
                                        placeholder="175"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="weight">Peso (kg)</label>
                                    <input
                                        id="weight"
                                        type="number"
                                        min="20"
                                        max="500"
                                        step="0.1"
                                        value={formData.weight ?? ''}
                                        onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
                                        placeholder="75"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="dateOfBirth">Fecha de Nacimiento</label>
                                    <input
                                        id="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth ?? ''}
                                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="gender">Género</label>
                                    <select
                                        id="gender"
                                        value={formData.gender ?? ''}
                                        onChange={(e) => handleChange('gender', e.target.value)}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="MALE">Masculino</option>
                                        <option value="FEMALE">Femenino</option>
                                        <option value="OTHER">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <h2>Objetivos Nutricionales</h2>

                            <div className="form-group">
                                <label htmlFor="nutritionalGoal">Objetivo</label>
                                <select
                                    id="nutritionalGoal"
                                    value={formData.nutritionalGoal ?? ''}
                                    onChange={(e) => handleChange('nutritionalGoal', e.target.value)}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="LOSE_WEIGHT">Perder Peso</option>
                                    <option value="MAINTAIN">Mantener Peso</option>
                                    <option value="GAIN_MUSCLE">Ganar Músculo</option>
                                    <option value="GAIN_WEIGHT">Ganar Peso</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="activityLevel">Nivel de Actividad</label>
                                    <select
                                        id="activityLevel"
                                        value={formData.activityLevel ?? ''}
                                        onChange={(e) => handleChange('activityLevel', e.target.value)}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="SEDENTARY">Sedentario</option>
                                        <option value="LIGHTLY_ACTIVE">Ligeramente Activo</option>
                                        <option value="MODERATELY_ACTIVE">Moderadamente Activo</option>
                                        <option value="VERY_ACTIVE">Muy Activo</option>
                                        <option value="EXTREMELY_ACTIVE">Extremadamente Activo</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="dietType">Tipo de Dieta</label>
                                    <select
                                        id="dietType"
                                        value={formData.dietType ?? ''}
                                        onChange={(e) => handleChange('dietType', e.target.value)}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="STANDARD">Estándar</option>
                                        <option value="KETOGENIC">Cetogénica</option>
                                        <option value="HIGH_PROTEIN">Alta en Proteína</option>
                                        <option value="LOW_CARB">Baja en Carbohidratos</option>
                                        <option value="VEGAN">Vegana</option>
                                        <option value="VEGETARIAN">Vegetariana</option>
                                        <option value="PALEO">Paleo</option>
                                    </select>
                                </div>
                            </div>

                            <h2>Macros Personalizados</h2>

                            <div className="form-group">
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.useCustomMacros ?? false}
                                        onChange={(e) => handleChange('useCustomMacros', e.target.checked)}
                                    />
                                    <span>Usar macros personalizados</span>
                                </label>
                                <p className="form-help">Personaliza la distribución de macronutrientes en lugar de usar los valores predeterminados según tu tipo de dieta.</p>
                            </div>

                            {formData.useCustomMacros && (
                                <div className="custom-macros-section">
                                    <div className="macro-input-group">
                                        <label htmlFor="customProtein">Proteína (%)</label>
                                        <input
                                            id="customProtein"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value={formData.customProteinPercentage ?? 20}
                                            onChange={(e) => handleChange('customProteinPercentage', parseFloat(e.target.value))}
                                        />
                                        {profile?.dailyCalorieGoal && (
                                            <span className="macro-grams">
                                                {Math.round((formData.customProteinPercentage ?? 20) * profile.dailyCalorieGoal / 400)}g
                                            </span>
                                        )}
                                    </div>

                                    <div className="macro-input-group">
                                        <label htmlFor="customCarbs">Carbohidratos (%)</label>
                                        <input
                                            id="customCarbs"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value={formData.customCarbsPercentage ?? 50}
                                            onChange={(e) => handleChange('customCarbsPercentage', parseFloat(e.target.value))}
                                        />
                                        {profile?.dailyCalorieGoal && (
                                            <span className="macro-grams">
                                                {Math.round((formData.customCarbsPercentage ?? 50) * profile.dailyCalorieGoal / 400)}g
                                            </span>
                                        )}
                                    </div>

                                    <div className="macro-input-group">
                                        <label htmlFor="customFats">Grasas (%)</label>
                                        <input
                                            id="customFats"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value={formData.customFatsPercentage ?? 30}
                                            onChange={(e) => handleChange('customFatsPercentage', parseFloat(e.target.value))}
                                        />
                                        {profile?.dailyCalorieGoal && (
                                            <span className="macro-grams">
                                                {Math.round((formData.customFatsPercentage ?? 30) * profile.dailyCalorieGoal / 900)}g
                                            </span>
                                        )}
                                    </div>

                                    <div className="macro-validation">
                                        {(() => {
                                            const sum = (formData.customProteinPercentage ?? 20) +
                                                (formData.customCarbsPercentage ?? 50) +
                                                (formData.customFatsPercentage ?? 30);
                                            const isValid = Math.abs(sum - 100) < 0.01;
                                            return isValid ? (
                                                <span className="validation-success">✓ Total: {sum.toFixed(0)}%</span>
                                            ) : (
                                                <span className="validation-error">⚠ Total: {sum.toFixed(0)}% (debe ser 100%)</span>
                                            );
                                        })()}
                                    </div>

                                    <div className="macro-distribution-bar">
                                        <div
                                            className="macro-bar protein"
                                            style={{ width: `${formData.customProteinPercentage ?? 20}%` }}
                                        />
                                        <div
                                            className="macro-bar carbs"
                                            style={{ width: `${formData.customCarbsPercentage ?? 50}%` }}
                                        />
                                        <div
                                            className="macro-bar fats"
                                            style={{ width: `${formData.customFatsPercentage ?? 30}%` }}
                                        />
                                    </div>
                                </div>
                            )}


                            <div className="form-actions">
                                <button type="submit" className="btn-primary" disabled={saving}>
                                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Goals Section */}
                    <div className="profile-goals-section">
                        <h2>Objetivos Calculados</h2>

                        {hasGoals ? (
                            <div className="goals-grid">
                                <div className="goal-card">
                                    <div className="goal-icon">🔥</div>
                                    <div className="goal-value">{profile ? Math.round(profile.dailyCalorieGoal!) : 0}</div>
                                    <div className="goal-label">Calorías/día</div>
                                </div>

                                <div className="goal-card">
                                    <div className="goal-icon">🥩</div>
                                    <div className="goal-value">{profile ? Math.round(profile.dailyProteinGoal!) : 0}g</div>
                                    <div className="goal-label">Proteína</div>
                                </div>

                                <div className="goal-card">
                                    <div className="goal-icon">🍞</div>
                                    <div className="goal-value">{profile ? Math.round(profile.dailyCarbsGoal!) : 0}g</div>
                                    <div className="goal-label">Carbohidratos</div>
                                </div>

                                <div className="goal-card">
                                    <div className="goal-icon">🥑</div>
                                    <div className="goal-value">{profile ? Math.round(profile.dailyFatsGoal!) : 0}g</div>
                                    <div className="goal-label">Grasas</div>
                                </div>
                            </div>
                        ) : (
                            <div className="goals-empty">
                                <p>Completa tu perfil para ver tus objetivos nutricionales calculados</p>
                            </div>
                        )}

                        {profile?.age && (
                            <div className="profile-info">
                                <p><strong>Edad:</strong> {profile.age} años</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;
