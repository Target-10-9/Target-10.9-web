import { useNavigate } from 'react-router-dom';
import React from 'react';
import ShootingTraining from '../../assets/ShootingTraining.jpg';
import CompetitiveShooting from '../../assets/CompetitiveShooting.jpg';

interface SessionCardProps {
    sessionId: string;
    title: string;
    description: string;
}

export const SessionCard: React.FC<SessionCardProps> = ({ sessionId, title, description }) => {
    const navigate = useNavigate();

    let backgroundImage = '';

    function removeAccents(str: string) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const normalizedTitle = removeAccents(title.toLowerCase());

    if (normalizedTitle.includes('entrainement')) {
        backgroundImage = ShootingTraining;
    } else if (normalizedTitle.includes('competition')) {
        backgroundImage = CompetitiveShooting;
    }

    const handleClick = () => {
        navigate(`/session/${sessionId}`);
    };
    
    return (
        <div
            onClick={handleClick}
            className="rounded-xl shadow-lg w-full max-w-xs overflow-hidden bg-white mb-6 cursor-pointer hover:shadow-xl transition-shadow"
        >
            <div className="relative h-40 w-full">
                <img
                    src={backgroundImage}
                    alt={title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-b from-transparent to-white" />
            </div>

            <div className="px-5 pt-4 pb-6 min-h-[100px] flex flex-col justify-center">
                <h4 className="text-base font-bold text-gray-900 mb-1">{title}</h4>
                <p className="text-sm text-gray-600 italic">{description}</p>
            </div>
        </div>
    );
};
