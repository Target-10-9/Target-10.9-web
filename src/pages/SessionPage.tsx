import React, { useEffect, useState } from 'react';
import { getSessions } from '../features/sessions/sessionsAPI';
import { SessionCard } from '../features/sessions/SessionCard';
import ShootImage from '../assets/ShootImageLogin.jpg';
import { PrivateHeader } from '../components/PrivateHeader';
import {AddSessionModal} from "../components/AddSessionModal.tsx";

export const SessionPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    const [sessions, setSessions] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [filterDay, setFilterDay] = useState<string | null>(null);
    const [filterEventType, setFilterEventType] = useState<string | null>(null);

    const [showDayDropdown, setShowDayDropdown] = useState(false);
    const [showEventTypeDropdown, setShowEventTypeDropdown] = useState(false);

    const [availableDays, setAvailableDays] = useState<string[]>([]);

    const eventTypes = ['Entraînement', 'Compétition'];

    const getWeekDay = (dateStr: string): string => {
        return new Date(dateStr)
            .toLocaleDateString('fr-FR', { weekday: 'long' })
            .toLowerCase();
    };

    useEffect(() => {
        getSessions()
            .then((data) => {
                setSessions(data);

                const days = Array.from(
                    new Set(data.map((s: any) => getWeekDay(s.dateStart)))
                );
                setAvailableDays(days as string[]);
            })
            .catch((err) => {
                console.error(err);
                setError("Échec du chargement des sessions.");
            });
    }, []);

    function removeAccents(str: string) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const filteredSessions = sessions.filter((s) => {
        const sessionDay = getWeekDay(s.dateStart);
        const dayMatches = filterDay ? sessionDay === filterDay : true;

        const sessionTypeNormalized = removeAccents(s.name?.toString().toLowerCase().trim() || "");
        const filterTypeNormalized = removeAccents(filterEventType?.toLowerCase().trim() || "");

        const eventTypeMatches = filterEventType ? sessionTypeNormalized === filterTypeNormalized : true;

        return dayMatches && eventTypeMatches;
    });

    const capitalize = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <>
            <PrivateHeader />

            <div className="items-center min-h-screen flex flex-col overflow-hidden">
                <div className="relative flex flex-col md:flex-row items-center justify-between w-full max-w-7xl">
                    <div className="flex-1 text-center md:text-left z-10">
                        <h1 className="text-6xl font-extrabold italic bg-gradient-to-r from-[#58628a] to-[#123189] bg-clip-text text-transparent">
                            MES SESSIONS
                        </h1>
                    </div>
                    <div className="flex-1 flex justify-center mt-6 md:mt-0">
                        <img
                            src={ShootImage}
                            alt="Tir à l’arc"
                            className="max-w-[600px] rounded-full z-0"
                        />
                    </div>
                </div>

                <div className="mt-20 w-full max-w-7xl px-4">
                    <button
                        className="bg-[#be7c49] text-white px-4 mb-2 py-2 w-2/12 rounded-full text-sm"
                        onClick={() => setShowModal(true)}
                    >
                        Ajouter
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                        <h2 className="text-3xl font-semibold text-[#123189]">
                            SESSIONS À VENIR
                        </h2>

                        <div className="flex flex-wrap gap-4">
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowDayDropdown(!showDayDropdown);
                                        setShowEventTypeDropdown(false);
                                    }}
                                    className="bg-[#123189] text-white px-4 py-2 rounded-full text-sm"
                                >
                                    {filterDay
                                        ? capitalize(filterDay)
                                        : 'Jours de la semaine'}
                                </button>
                                {showDayDropdown && (
                                    <ul className="absolute left-0 mt-2 bg-white border rounded shadow-md z-10 w-48 max-h-60 overflow-auto">
                                        {availableDays.map((day, i) => (
                                            <li
                                                key={i}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setFilterDay(day);
                                                    setShowDayDropdown(false);
                                                }}
                                            >
                                                {capitalize(day)}
                                            </li>
                                        ))}
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                                            onClick={() => {
                                                setFilterDay(null);
                                                setShowDayDropdown(false);
                                            }}
                                        >
                                            Réinitialiser le filtre
                                        </li>
                                    </ul>
                                )}
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowEventTypeDropdown(!showEventTypeDropdown);
                                        setShowDayDropdown(false);
                                    }}
                                    className="bg-[#123189] text-white px-4 py-2 rounded-full text-sm"
                                >
                                    {filterEventType ?? "Type d'événement"}
                                </button>
                                {showEventTypeDropdown && (
                                    <ul className="absolute left-0 mt-2 bg-white border rounded shadow-md z-10 w-48 max-h-40 overflow-auto">
                                        {eventTypes.map((type, i) => (
                                            <li
                                                key={i}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setFilterEventType(type);
                                                    setShowEventTypeDropdown(false);
                                                }}
                                            >
                                                {type}
                                            </li>
                                        ))}
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                                            onClick={() => {
                                                setFilterEventType(null);
                                                setShowEventTypeDropdown(false);
                                            }}
                                        >
                                            Réinitialiser le filtre
                                        </li>
                                    </ul>
                                )}
                            </div>

                            <button className="bg-[#123189] text-white px-4 py-2 rounded-full text-sm cursor-not-allowed opacity-60">
                                Toutes catégories
                            </button>
                        </div>
                    </div>

                    {error ? (
                        <p className="text-red-500 text-sm">{error}</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {filteredSessions.map((session, i) => (
                                <SessionCard
                                    key={i}
                                    title={session.name}
                                    description={new Date(session.dateStart).toLocaleString('fr-FR', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    })}
                                />
                            ))}
                        </div>
                    )}
                </div>
                {showModal && (
                    <AddSessionModal
                        onClose={() => setShowModal(false)}
                        onSessionCreated={() => {
                            getSessions().then((data) => setSessions(data));
                        }}
                    />
                )}
            </div>
        </>
    );
};
