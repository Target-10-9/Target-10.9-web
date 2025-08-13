import React from 'react';

type Props = {
    score: number;
    onClose: () => void;
};

export const SessionEndModal: React.FC<Props> = ({ score, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000,
        }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 12, minWidth: 300, textAlign: 'center' }}>
                <h2>Session terminée</h2>
                <p>Score final : {score}</p>
                <button onClick={onClose} style={{ marginTop: 16, padding: '8px 16px' }}>Fermer</button>
            </div>
        </div>
    );
};
