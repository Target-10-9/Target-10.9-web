import React from 'react';
import { useParams } from 'react-router-dom';
import { TargetPage } from './TargetPage';

export const TargetPageWrapper: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();

    if (!sessionId) {
        return <div>Session ID manquant dans l'URL</div>;
    }

    return <TargetPage sessionId={sessionId} />;
};
