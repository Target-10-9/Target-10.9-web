import React, { useEffect, useState } from 'react';
import { getSessions } from '../features/sessions/sessionsAPI';
import { SessionCard } from '../components/SessionCard.tsx';
import ShootImage from '../assets/ShootImageLogin.jpg';
import { PrivateHeader } from '../components/PrivateHeader';
import {Link} from "react-router-dom";

export const HomePage: React.FC = () => {
    const [sessions, setSessions] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSessions()
            .then((data) => {
                const now = new Date();
                const upcoming = data
                    .filter((s: any) => new Date(s.dateStart) > now)
                    .sort((a: any, b: any) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime())
                    .slice(0, 2);
                setSessions(upcoming);
            })
            .catch((err) => {
                console.error(err);
                setError("Échec du chargement des sessions. Veuillez vous reconnecter.");
            });
    }, []);

    return (
        <>
            <PrivateHeader />
            <div className="min-h-screen flex flex-col overflow-hidden">
                <div className="relative grid grid-cols-3 justify-items-center w-full min-h-[500px] px-12">
                    <div className="z-10 flex items-center h-full">
                        <h1 className="text-7xl font-extrabold italic bg-gradient-to-r from-[#58628a] to-[#123189] bg-clip-text text-transparent">
                            TARGET–10.9
                        </h1>
                    </div>

                    <div className="z-0 flex items-center h-full">
                        <img
                            src={ShootImage}
                            alt="Target"
                            className="h-auto rounded-full max-w-[600px]"
                        />
                    </div>

                    <div className="pl-20 pt-20 z-10 w-full">
                        <h3 className="text-lg font-semibold mb-4 text-[#123189]">Prochainements</h3>
                        {error ? (
                            <p className="text-red-500 text-sm">{error}</p>
                        ) : (
                            sessions.map((session, i) => (
                                <SessionCard
                                    key={i}
                                    sessionId={session.id}
                                    title={session.name}
                                    description={session.dateStart}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-4 pl-12 absolute bottom-10 left-0">
                    <Link to={"/sessions"} className="bg-[#123189] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#58628a] transition">
                        MES SESSIONS
                    </Link>
                </div>
            </div>
        </>
    );
};
