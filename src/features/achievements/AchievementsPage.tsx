import { useEffect, useState } from 'react';
import { Trophy, Award } from 'lucide-react';
import { achievementService } from '../../services/achievementService';
import { AchievementCard } from './AchievementCard';
import { Layout } from '../../components/layout/Layout';
import type { AchievementDto, AchievementsSummary } from '../../types/achievement';
import { useTranslation } from 'react-i18next';
import './achievements.css';

export function AchievementsPage() {
    const { t } = useTranslation();
    const [achievements, setAchievements] = useState<AchievementDto[]>([]);
    const [summary, setSummary] = useState<AchievementsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [achievementsData, summaryData] = await Promise.all([
                    achievementService.getAll(),
                    achievementService.getSummary(),
                ]);
                setAchievements(achievementsData);
                setSummary(summaryData);
            } catch (err) {
                console.error('Error loading achievements:', err);
                setError('Error al cargar los logros');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const unlocked = achievements.filter(a => a.unlocked);
    const locked = achievements.filter(a => !a.unlocked);

    return (
        <Layout>
            <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Trophy size={24} color="var(--color-primary)" />
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                            {t('achievements.title')}
                        </h1>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                            {t('achievements.subtitle')}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                        {t('common.loading')}
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Summary */}
                        {summary && (
                            <div className="achievements-summary">
                                <div className="achievements-summary-card">
                                    <span className="achievements-summary-value">{summary.unlockedCount}</span>
                                    <p className="achievements-summary-label">{t('achievements.unlocked')}</p>
                                </div>
                                <div className="achievements-summary-card">
                                    <span className="achievements-summary-value">{summary.totalCount}</span>
                                    <p className="achievements-summary-label">{t('achievements.total')}</p>
                                </div>
                                <div className="achievements-summary-card">
                                    <span className="achievements-summary-value">{summary.completionPercentage}%</span>
                                    <p className="achievements-summary-label">{t('achievements.completion')}</p>
                                </div>
                            </div>
                        )}

                        {/* Unlocked achievements */}
                        {unlocked.length > 0 && (
                            <>
                                <p className="achievements-section-title">
                                    <Award size={14} style={{ display: 'inline', marginRight: '0.35rem' }} />
                                    {t('achievements.sectionUnlocked')} ({unlocked.length})
                                </p>
                                <div className="achievements-grid">
                                    {unlocked.map(achievement => (
                                        <AchievementCard key={achievement.id} achievement={achievement} />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Locked achievements */}
                        {locked.length > 0 && (
                            <>
                                <p className="achievements-section-title">
                                    {t('achievements.sectionLocked')} ({locked.length})
                                </p>
                                <div className="achievements-grid">
                                    {locked.map(achievement => (
                                        <AchievementCard key={achievement.id} achievement={achievement} />
                                    ))}
                                </div>
                            </>
                        )}

                        {achievements.length === 0 && (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem',
                                color: 'var(--color-text-secondary)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem',
                            }}>
                                <Trophy size={48} style={{ opacity: 0.3 }} />
                                <p>{t('achievements.empty')}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}
