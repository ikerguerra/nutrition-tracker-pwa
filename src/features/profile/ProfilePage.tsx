import React, { useState, useEffect } from 'react';
import { Layout } from '@components/layout/Layout';
import userProfileService from '@services/userProfileService';
import type { UserProfile, UserProfileUpdateRequest } from '../../types/userProfile';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Button } from '@components/ui/button';
import { Switch } from '@components/ui/switch';
import {
    User,
    Ruler,
    Weight,
    Calendar,
    Activity,
    Utensils,
    Target,
    Flame,
    Beef,
    Wheat,
    Droplet,
    Save,
    Loader2
} from 'lucide-react';


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
                <div className="flex justify-center items-center h-full min-h-[50vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    const hasGoals = profile?.dailyCalorieGoal !== null;
    const userInitial = profile?.id ? profile.id.toString().charAt(0) : 'U';

    const calculateBMI = () => {
        if (profile?.height && profile?.weight) {
            const heightInMeters = profile.height / 100;
            return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
        }
        return null;
    };

    const bmi = calculateBMI();

    return (
        <Layout>
            <div className="container max-w-5xl mx-auto py-8 space-y-8 animate-fadeIn">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                            {t('profile.title')}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {t('profile.preferences')} & {t('profile.personalDetails')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Goals */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Profile Summary Card */}
                        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-card to-background/50">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                                    {userInitial}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg">{profile?.id ? `User #${profile.id}` : 'User'}</h3>
                                    {profile?.age && <div className="text-sm text-muted-foreground">{profile.age} {t('profile.years')}</div>}
                                </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4 pt-4">
                                {bmi && (
                                    <div className="flex flex-col p-3 bg-primary/5 rounded-lg border border-primary/10">
                                        <span className="text-xs text-muted-foreground uppercase font-medium">BMI</span>
                                        <span className="text-xl font-bold text-primary">{bmi}</span>
                                    </div>
                                )}
                                {profile?.weight && (
                                    <div className="flex flex-col p-3 bg-secondary/5 rounded-lg border border-secondary/10">
                                        <span className="text-xs text-muted-foreground uppercase font-medium">{t('profile.weight')}</span>
                                        <span className="text-xl font-bold">{profile.weight}kg</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Nutritional Goals Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-primary" />
                                    {t('profile.calculatedGoals')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {hasGoals ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-card to-secondary/5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-full bg-orange-500/10 text-orange-500">
                                                    <Flame className="h-5 w-5" />
                                                </div>
                                                <span className="font-medium">{t('breakdown.table.calories')}</span>
                                            </div>
                                            <span className="text-xl font-bold">{Math.round(profile?.dailyCalorieGoal || 0)}</span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="flex flex-col items-center p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                                <div className="mb-2 p-1.5 rounded-full bg-green-500/10 text-green-500">
                                                    <Beef className="h-4 w-4" />
                                                </div>
                                                <span className="text-sm font-medium">{Math.round(profile?.dailyProteinGoal || 0)}g</span>
                                                <span className="text-xs text-muted-foreground">{t('breakdown.macros.protein')}</span>
                                            </div>
                                            <div className="flex flex-col items-center p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                                <div className="mb-2 p-1.5 rounded-full bg-blue-500/10 text-blue-500">
                                                    <Wheat className="h-4 w-4" />
                                                </div>
                                                <span className="text-sm font-medium">{Math.round(profile?.dailyCarbsGoal || 0)}g</span>
                                                <span className="text-xs text-muted-foreground">{t('breakdown.macros.carbs')}</span>
                                            </div>
                                            <div className="flex flex-col items-center p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                                <div className="mb-2 p-1.5 rounded-full bg-yellow-500/10 text-yellow-500">
                                                    <Droplet className="h-4 w-4" />
                                                </div>
                                                <span className="text-sm font-medium">{Math.round(profile?.dailyFatsGoal || 0)}g</span>
                                                <span className="text-xs text-muted-foreground">{t('breakdown.macros.fats')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>{t('profile.goalsEmpty')}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Preferences */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">{t('profile.preferences')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>{t('profile.language')}</Label>
                                    <LanguageSelector />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Settings Form */}
                    <div className="md:col-span-2">
                        <form onSubmit={handleSubmit}>
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>{t('profile.personalDetails')}</CardTitle>
                                    <CardDescription>
                                        Manage your biometric data and nutritional preferences
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Physical Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="height" className="flex items-center gap-2">
                                                <Ruler className="h-4 w-4 text-primary" />
                                                {t('profile.height')} (cm)
                                            </Label>
                                            <Input
                                                id="height"
                                                type="number"
                                                min="50"
                                                max="300"
                                                value={formData.height ?? ''}
                                                onChange={(e) => handleChange('height', parseFloat(e.target.value))}
                                                placeholder="175"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="weight" className="flex items-center gap-2">
                                                <Weight className="h-4 w-4 text-primary" />
                                                {t('profile.weight')} (kg)
                                            </Label>
                                            <Input
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
                                        <div className="space-y-2">
                                            <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                {t('profile.dob')}
                                            </Label>
                                            <Input
                                                id="dateOfBirth"
                                                type="date"
                                                className="block" // ensure date input displays correctly
                                                value={formData.dateOfBirth ?? ''}
                                                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="gender" className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-primary" />
                                                {t('profile.gender')}
                                            </Label>
                                            <select
                                                id="gender"
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                value={formData.gender ?? ''}
                                                onChange={(e) => handleChange('gender', e.target.value)}
                                            >
                                                <option value="" className="bg-popover text-popover-foreground">{t('profile.select')}</option>
                                                <option value="MALE" className="bg-popover text-popover-foreground">{t('profile.enums.MALE')}</option>
                                                <option value="FEMALE" className="bg-popover text-popover-foreground">{t('profile.enums.FEMALE')}</option>
                                                <option value="OTHER" className="bg-popover text-popover-foreground">{t('profile.enums.OTHER')}</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Activity & Goals */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-primary" />
                                            {t('profile.activityLevel')}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="activityLevel">{t('profile.activityLevel')}</Label>
                                                <select
                                                    id="activityLevel"
                                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={formData.activityLevel ?? ''}
                                                    onChange={(e) => handleChange('activityLevel', e.target.value)}
                                                >
                                                    <option value="" className="bg-popover text-popover-foreground">{t('profile.select')}</option>
                                                    <option value="SEDENTARY" className="bg-popover text-popover-foreground">{t('profile.enums.SEDENTARY')}</option>
                                                    <option value="LIGHTLY_ACTIVE" className="bg-popover text-popover-foreground">{t('profile.enums.LIGHTLY_ACTIVE')}</option>
                                                    <option value="MODERATELY_ACTIVE" className="bg-popover text-popover-foreground">{t('profile.enums.MODERATELY_ACTIVE')}</option>
                                                    <option value="VERY_ACTIVE" className="bg-popover text-popover-foreground">{t('profile.enums.VERY_ACTIVE')}</option>
                                                    <option value="EXTREMELY_ACTIVE" className="bg-popover text-popover-foreground">{t('profile.enums.EXTREMELY_ACTIVE')}</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="nutritionalGoal">{t('profile.goal')}</Label>
                                                <select
                                                    id="nutritionalGoal"
                                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={formData.nutritionalGoal ?? ''}
                                                    onChange={(e) => handleChange('nutritionalGoal', e.target.value)}
                                                >
                                                    <option value="" className="bg-popover text-popover-foreground">{t('profile.select')}</option>
                                                    <option value="LOSE_WEIGHT" className="bg-popover text-popover-foreground">{t('profile.enums.LOSE_WEIGHT')}</option>
                                                    <option value="MAINTAIN" className="bg-popover text-popover-foreground">{t('profile.enums.MAINTAIN')}</option>
                                                    <option value="GAIN_MUSCLE" className="bg-popover text-popover-foreground">{t('profile.enums.GAIN_MUSCLE')}</option>
                                                    <option value="GAIN_WEIGHT" className="bg-popover text-popover-foreground">{t('profile.enums.GAIN_WEIGHT')}</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="dietType" className="flex items-center gap-2">
                                                    <Utensils className="h-4 w-4 text-primary" />
                                                    {t('profile.dietType')}
                                                </Label>
                                                <select
                                                    id="dietType"
                                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={formData.dietType ?? ''}
                                                    onChange={(e) => handleChange('dietType', e.target.value)}
                                                >
                                                    <option value="" className="bg-popover text-popover-foreground">{t('profile.select')}</option>
                                                    <option value="STANDARD" className="bg-popover text-popover-foreground">{t('profile.enums.STANDARD')}</option>
                                                    <option value="KETOGENIC" className="bg-popover text-popover-foreground">{t('profile.enums.KETOGENIC')}</option>
                                                    <option value="HIGH_PROTEIN" className="bg-popover text-popover-foreground">{t('profile.enums.HIGH_PROTEIN')}</option>
                                                    <option value="LOW_CARB" className="bg-popover text-popover-foreground">{t('profile.enums.LOW_CARB')}</option>
                                                    <option value="VEGAN" className="bg-popover text-popover-foreground">{t('profile.enums.VEGAN')}</option>
                                                    <option value="VEGETARIAN" className="bg-popover text-popover-foreground">{t('profile.enums.VEGETARIAN')}</option>
                                                    <option value="PALEO" className="bg-popover text-popover-foreground">{t('profile.enums.PALEO')}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Custom Macros */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">{t('profile.useCustomMacros')}</Label>
                                                <CardDescription>
                                                    {t('profile.useCustomMacrosDesc')}
                                                </CardDescription>
                                            </div>
                                            <Switch
                                                checked={formData.useCustomMacros ?? false}
                                                onCheckedChange={(checked) => handleChange('useCustomMacros', checked)}
                                            />
                                        </div>

                                        {formData.useCustomMacros && (
                                            <div className="space-y-6 pt-2 animate-fadeIn duration-300">
                                                <div className="flex h-8 w-full overflow-hidden rounded-full border border-border">
                                                    <div className="bg-green-500 transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white uppercase" style={{ width: `${formData.customProteinPercentage ?? 20}%` }}>Prot</div>
                                                    <div className="bg-blue-500 transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white uppercase" style={{ width: `${formData.customCarbsPercentage ?? 50}%` }}>Carb</div>
                                                    <div className="bg-yellow-500 transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white uppercase" style={{ width: `${formData.customFatsPercentage ?? 30}%` }}>Fat</div>
                                                </div>

                                                <div className="grid gap-6 sm:grid-cols-3">
                                                    <div className="space-y-2">
                                                        <Label>{t('breakdown.macros.protein')} (%)</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                type="number"
                                                                value={formData.customProteinPercentage ?? 20}
                                                                onChange={(e) => handleChange('customProteinPercentage', parseFloat(e.target.value))}
                                                                className="font-bold text-green-600"
                                                                min="0" max="100"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>{t('breakdown.macros.carbs')} (%)</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                type="number"
                                                                value={formData.customCarbsPercentage ?? 50}
                                                                onChange={(e) => handleChange('customCarbsPercentage', parseFloat(e.target.value))}
                                                                className="font-bold text-blue-600"
                                                                min="0" max="100"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>{t('breakdown.macros.fat')} (%)</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                type="number"
                                                                value={formData.customFatsPercentage ?? 30}
                                                                onChange={(e) => handleChange('customFatsPercentage', parseFloat(e.target.value))}
                                                                className="font-bold text-yellow-600"
                                                                min="0" max="100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {(() => {
                                                    const sum = (formData.customProteinPercentage ?? 20) +
                                                        (formData.customCarbsPercentage ?? 50) +
                                                        (formData.customFatsPercentage ?? 30);
                                                    const isValid = Math.abs(sum - 100) < 0.01;
                                                    return !isValid && (
                                                        <div className="text-sm font-medium text-destructive text-center p-2 bg-destructive/10 rounded-md">
                                                            ⚠️ Total: {sum.toFixed(0)}% (Debes sumar 100%)
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={saving} className="w-full md:w-auto gap-2">
                                            {saving ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Save className="h-4 w-4" />
                                            )}
                                            {saving ? t('profile.saving') : t('profile.save')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;
