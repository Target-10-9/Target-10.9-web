import React, { useEffect, useState } from 'react';
import { createSession } from '../features/sessions/sessionsAPI';
import { getSessionModes } from '../features/sessionModes/sessionModeAPI';

interface SessionMode {
    id: string;
    name: string;
}

interface AddSessionModalProps {
    onClose: () => void;
    onSessionCreated: () => void;
}

export const AddSessionModal: React.FC<AddSessionModalProps> = ({ onClose, onSessionCreated }) => {
    const [name, setName] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [type, setType] = useState(''); // sessionModeId
    const [loading, setLoading] = useState(false);

    const [sessionModes, setSessionModes] = useState<SessionMode[]>([]);
    const [loadingModes, setLoadingModes] = useState(false);
    const [errorModes, setErrorModes] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSessionModes() {
            setLoadingModes(true);
            setErrorModes(null);
            try {
                const data = await getSessionModes();
                setSessionModes(data);
            } catch (err: any) {
                setErrorModes(err.message || 'Erreur lors du chargement des types de sessions');
            } finally {
                setLoadingModes(false);
            }
        }
        fetchSessionModes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!type) {
            alert('Veuillez sélectionner un type de session valide.');
            return;
        }

        setLoading(true);
        try {
            await createSession({
                name,
                dateStart,
                dateEnd,
                sessionModeId: type,
            });
            onSessionCreated();
            onClose();
        } catch (error: any) {
            alert(`Erreur lors de la création : ${error.message || error}`);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                    aria-label="Fermer la modal"
                >
                    ✕
                </button>
                <h3 className="text-xl font-semibold mb-4 text-[#123189]">Nouvelle session</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="name">Nom de la session</label>
                        <input
                            id="name"
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Ex: Entraînement carabine"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="dateStart">Date et heure début</label>
                        <input
                            id="dateStart"
                            type="datetime-local"
                            className="w-full border rounded px-3 py-2"
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="dateEnd">Date et heure fin</label>
                        <input
                            id="dateEnd"
                            type="datetime-local"
                            className="w-full border rounded px-3 py-2"
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="type">Type</label>
                        {loadingModes ? (
                            <p>Chargement des types...</p>
                        ) : errorModes ? (
                            <p className="text-red-600">{errorModes}</p>
                        ) : (
                            <select
                                id="type"
                                className="w-full border rounded px-3 py-2"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                            >
                                <option value="">Sélectionner</option>
                                {sessionModes.map((mode) => (
                                    <option key={mode.id} value={mode.id}>
                                        {mode.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded bg-[#123189] text-white hover:bg-[#0f276e]"
                        >
                            {loading ? "Création..." : "Créer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};