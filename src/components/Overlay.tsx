import React from 'react';

type OverlayProps = {
    visible: boolean;
    title: string;
    buttonText?: string;
    onButtonClick?: () => void;
    subText?: string;
};

export const Overlay: React.FC<OverlayProps> = ({ visible, title, buttonText, onButtonClick, subText }) => {
    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '3rem',
            zIndex: 20,
        }}>
        <div>{title}</div>
            {subText && <div style={{ fontSize: '1.5rem', marginTop: '1rem' }}>{subText}</div>}
            {buttonText && onButtonClick && (
                <button
                    style={{
                        marginTop: 30,
                        padding: '10px 20px',
                        fontSize: '1rem',
                        borderRadius: 6,
                        backgroundColor: '#4ade80',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#111827',
                    }}
                    onClick={onButtonClick}
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
};
