import React, { useState, useEffect } from 'react';
import { Layout } from '@components/layout/Layout';
import userProfileService from '@services/userProfileService';
import type { UserProfile, UserProfileUpdateRequest } from '../../types/userProfile';
import { toast } from 'react-hot-toast';
import './ProfilePage.css';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../components/common/LanguageSelector';

const ProfilePage: React.FC = () => {
    const { t } = useTranslation();
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
            toast.error(t('profile.errorLoad'));
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
            toast.success(t('profile.success'));
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(t('profile.errorUpdate'));
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
                <div className="profile-loading">{t('profile.loading')}</div>
            </Layout>
        );
    }

    const hasGoals = profile?.dailyCalorieGoal !== null;

    return (
        <Layout>
            <div className="profile-container">
                <h1 className="profile-title">{t('profile.title')}</h1>

                <div className="profile-grid">
                    {/* Form Section */}
                    <div className="profile-form-section">
                        <form onSubmit={handleSubmit} className="profile-form">
                            <h2>{t('profile.personalDetails')}</h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="height">{t('profile.height')}</label>
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
                                    <label htmlFor="weight">{t('profile.weight')}</label>
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
                                    <label htmlFor="dateOfBirth">{t('profile.dob')}</label>
                                    <input
                                        id="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth ?? ''}
                                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="gender">{t('profile.gender')}</label>
                                    <select
                                        id="gender"
                                        value={formData.gender ?? ''}
                                        onChange={(e) => handleChange('gender', e.target.value)}
                                    >
                                        <option value="">{t('profile.select')}</option>
                                        <option value="MALE">{t('profile.enums.MALE')}</option>
                                        <option value="FEMALE">{t('profile.enums.FEMALE')}</option>
                                        <option value="OTHER">{t('profile.enums.OTHER')}</option>
                                    </select>
                                </div>
                            </div>

                            <h2>{t('profile.nutritionalGoals')}</h2>

                            <div className="form-group">
                                <label htmlFor="nutritionalGoal">{t('profile.goal')}</label>
                                <select
                                    id="nutritionalGoal"
                                    value={formData.nutritionalGoal ?? ''}
                                    onChange={(e) => handleChange('nutritionalGoal', e.target.value)}
                                >
                                    <option value="">{t('profile.select')}</option>
                                    <option value="LOSE_WEIGHT">{t('profile.enums.LOSE_WEIGHT')}</option>
                                    <option value="MAINTAIN">{t('profile.enums.MAINTAIN')}</option>
                                    <option value="GAIN_MUSCLE">{t('profile.enums.GAIN_MUSCLE')}</option>
                                    <option value="GAIN_WEIGHT">{t('profile.enums.GAIN_WEIGHT')}</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="activityLevel">{t('profile.activityLevel')}</label>
                                    <select
                                        id="activityLevel"
                                        value={formData.activityLevel ?? ''}
                                        onChange={(e) => handleChange('activityLevel', e.target.value)}
                                    >
                                        <option value="">{t('profile.select')}</option>
                                        <option value="SEDENTARY">{t('profile.enums.SEDENTARY')}</option>
                                        <option value="LIGHTLY_ACTIVE">{t('profile.enums.LIGHTLY_ACTIVE')}</option>
                                        <option value="MODERATELY_ACTIVE">{t('profile.enums.MODERATELY_ACTIVE')}</option>
                                        <option value="VERY_ACTIVE">{t('profile.enums.VERY_ACTIVE')}</option>
                                        <option value="EXTREMELY_ACTIVE">{t('profile.enums.EXTREMELY_ACTIVE')}</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="dietType">{t('profile.dietType')}</label>
                                    <select
                                        id="dietType"
                                        value={formData.dietType ?? ''}
                                        onChange={(e) => handleChange('dietType', e.target.value)}
                                    >
                                        <option value="">{t('profile.select')}</option>
                                        <option value="STANDARD">{t('profile.enums.STANDARD')}</option>
                                        <option value="KETOGENIC">{t('profile.enums.KETOGENIC')}</option>
                                        <option value="HIGH_PROTEIN">{t('profile.enums.HIGH_PROTEIN')}</option>
                                        <option value="LOW_CARB">{t('profile.enums.LOW_CARB')}</option>
                                        <option value="VEGAN">{t('profile.enums.VEGAN')}</option>
                                        <option value="VEGETARIAN">{t('profile.enums.VEGETARIAN')}</option>
                                        <option value="PALEO">{t('profile.enums.PALEO')}</option>
                                    </select>
                                </div>
                            </div>

                            <h2>{t('profile.customMacros')}</h2>

                            <div className="form-group">
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.useCustomMacros ?? false}
                                        onChange={(e) => handleChange('useCustomMacros', e.target.checked)}
                                    />
                                    <span>{t('profile.useCustomMacros')}</span>
                                </label>
                                <p className="form-help">{t('profile.useCustomMacrosDesc')}</p>
                            </div>

                            {formData.useCustomMacros && (
                                <div className="custom-macros-section">
                                    <div className="macro-input-group">
                                        <label htmlFor="customProtein">{t('breakdown.macros.protein')} (%)</label>
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
                                        <label htmlFor="customCarbs">{t('breakdown.macros.carbs')} (%)</label>
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
                                        <label htmlFor="customFats">{t('breakdown.macros.fat')} (%)</label>
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
                                    {saving ? t('profile.saving') : t('profile.save')}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preferences Section */}
                    <div className="profile-preferences-section card p-6 bg-white dark:bg-gray-800 rounded-lg shadow mt-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">{t('profile.preferences')}</h2>
                        <div className="flex items-center justify-between">
                            <span className="font-medium">{t('profile.language')}</span>
                            <LanguageSelector />
                        </div>
                    </div>

                    {/* Goals Section */}
                    <div className="profile-goals-section">
                        <h2>{t('profile.calculatedGoals')}</h2>

                        {hasGoals ? (
                            <div className="goals-grid">
                                <div className="goal-card">
                                    <div className="goal-icon">🔥</div>
                                    <div className="goal-value">{profile ? Math.round(profile.dailyCalorieGoal!) : 0}</div>
                                    <div className="goal-label">{t('breakdown.table.calories')}/day</div>
                                </div>

                                <div className="goal-card">
                                    <div className="goal-icon">🥩</div>
                                    <div className="goal-value">{profile ? Math.round(profile.dailyProteinGoal!) : 0}g</div>
                                    <div className="goal-label">{t('breakdown.macros.protein')}</div>
                                </div>

                                <div className="goal-card">
                                    <div className="goal-icon">🍞</div>
                                    <div className="goal-value">{profile ? Math.round(profile.dailyCarbsGoal!) : 0}g</div>
                                    <div className="goal-label">{t('breakdown.macros.carbohydrates')}</div>
                                </div>

                                <div className="goal-card">
                                    <div className="goal-icon">🥑</div>
                                    <div className="goal-value">{profile ? Math.round(profile.dailyFatsGoal!) : 0}g</div>
                                    <div className="goal-label">{t('breakdown.macros.fats')}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="goals-empty">
                                <p>{t('profile.goalsEmpty')}</p>
                            </div>
                        )}

                        {profile?.age && (
                            <div className="profile-info">
                                <p><strong>{t('profile.age')}:</strong> {profile.age} {t('profile.years')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;
