import React, { useState } from 'react';
import { RecommendationItem, MEAL_TYPE_ICONS } from '../../../types/recommendation';
import { Button } from '@components/ui/Button';
import './RecommendedEntryCard.css';
import { toast } from 'react-hot-toast';
import recommendationService from '@services/recommendationService';

interface RecommendedEntryCardProps {
    item: RecommendationItem;
    onAccept: () => void;
    onReject: () => void;
}

const RecommendedEntryCard: React.FC<RecommendedEntryCardProps> = ({ item, onAccept, onReject }) => {
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        // Since backend doesn't support accepting individual items efficiently yet in this flow without full plan accept,
        // we might implementation depends on backend capabilities. 
        // Assuming we want to accept just this item or visually trigger 'accept' logic.
        // For now, let's assume acceptance is handled by parent or we call a specific endpoint if exists.
        // The implementation_plan mentioned "Accept entire plan" or individual. 
        // Let's implement visual interaction first.
        setLoading(true);
        try {
            // If we have an endpoint for single item accept:
            // await recommendationService.acceptItem(item.id);
            // Or if we just simulate it locally until full plan accept:
            onAccept();
        } catch (e) {
            toast.error('Error accepting item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recommended-entry-card">
            <div className="rec-card-header">
                <div className="rec-info">
                    <span className="rec-badge">✨ Sugerido</span>
                    <h4 className="rec-food-name">{item.foodName}</h4>
                    <span className="rec-quantity">{item.suggestedQuantity} {item.unit || 'g'}</span>
                </div>
                <div className="rec-macros">
                    <span className="rec-macro cals">{item.nutritionalInfo?.calories?.toFixed(0) || 0} kcal</span>
                    <span className="rec-macro prot">{item.nutritionalInfo?.protein?.toFixed(1) || 0} P</span>
                    <span className="rec-macro carbs">{item.nutritionalInfo?.carbs?.toFixed(1) || 0} C</span>
                    <span className="rec-macro fats">{item.nutritionalInfo?.fats?.toFixed(1) || 0} G</span>
                </div>
            </div>

            {item.reason && (
                <div className="rec-reason">
                    <small>💡 {item.reason}</small>
                </div>
            )}

            <div className="rec-actions">
                <Button
                    size="sm"
                    variant="secondary"
                    className="btn-reject"
                    onClick={onReject}
                    disabled={loading}
                >
                    ✕ Rechazar
                </Button>
                <Button
                    size="sm"
                    variant="primary"
                    className="btn-accept"
                    onClick={handleAccept}
                    disabled={loading}
                >
                    ✓ Aceptar
                </Button>
            </div>
        </div>
    );
};

export default RecommendedEntryCard;
