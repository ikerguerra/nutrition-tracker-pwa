import { Trophy, Lock, Flame, Scale, ChefHat, Star, Calendar, Target, Zap } from 'lucide-react';
import type { AchievementDto, AchievementType } from '../../types/achievement';
import { useTranslation } from 'react-i18next';

interface AchievementCardProps {
    achievement: AchievementDto;
}

const ACHIEVEMENT_ICONS: Record<AchievementType, React.ElementType> = {
    STREAK_3: Flame,
    STREAK_7: Flame,
    STREAK_30: Flame,
    STREAK_100: Flame,
    FIRST_LOG: Star,
    FIRST_GOAL: Target,
    WEIGHT_LOGGED: Scale,
    WEIGHT_MILESTONE: Scale,
    CONSISTENCY_WEEK: Calendar,
    CONSISTENCY_MONTH: Calendar,
    FIRST_RECIPE: ChefHat,
    FIRST_TEMPLATE: Zap,
    FIRST_RECOMMENDATION: Trophy,
};

const ACHIEVEMENT_COLORS: Record<AchievementType, string> = {
    STREAK_3: '#f59e0b',
    STREAK_7: '#f97316',
    STREAK_30: '#ef4444',
    STREAK_100: '#dc2626',
    FIRST_LOG: '#10b981',
    FIRST_GOAL: '#00e5ff',
    WEIGHT_LOGGED: '#8b5cf6',
    WEIGHT_MILESTONE: '#7c3aed',
    CONSISTENCY_WEEK: '#06b6d4',
    CONSISTENCY_MONTH: '#0284c7',
    FIRST_RECIPE: '#22c55e',
    FIRST_TEMPLATE: '#eab308',
    FIRST_RECOMMENDATION: '#f59e0b',
};

export function AchievementCard({ achievement }: AchievementCardProps) {
    const { t } = useTranslation();
    const Icon = ACHIEVEMENT_ICONS[achievement.type] ?? Trophy;
    const color = ACHIEVEMENT_COLORS[achievement.type] ?? '#00e5ff';
    const isUnlocked = achievement.unlocked;

    return (
        <div className={`achievement-card ${isUnlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'}`}>
            <div className="achievement-icon-wrapper" style={{ '--achievement-color': color } as React.CSSProperties}>
                {isUnlocked ? (
                    <Icon size={28} color={color} />
                ) : (
                    <Lock size={20} color="#64748b" />
                )}
            </div>

            <div className="achievement-info">
                <h3 className="achievement-name">
                    {achievement.displayName}
                </h3>

                {achievement.unlockedAt && (
                    <p className="achievement-date">
                        {t('achievements.unlockedOn', {
                            date: new Date(achievement.unlockedAt).toLocaleDateString()
                        })}
                    </p>
                )}

                {!isUnlocked && (
                    <div className="achievement-progress">
                        <div className="achievement-progress-bar">
                            <div
                                className="achievement-progress-fill"
                                style={{
                                    width: `${achievement.progressPercentage}%`,
                                    backgroundColor: color,
                                }}
                            />
                        </div>
                        <span className="achievement-progress-text">
                            {achievement.progress} / {achievement.target}
                        </span>
                    </div>
                )}
            </div>

            {isUnlocked && (
                <div className="achievement-badge" style={{ color }}>
                    <Trophy size={16} />
                </div>
            )}
        </div>
    );
}
