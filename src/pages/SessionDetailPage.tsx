import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PrivateHeader } from '../components/PrivateHeader';
import { ConfirmModal } from '../components/ConfirmModal';
import ShootingTraining from '../assets/ShootingTraining.jpg';
import CompetitiveShooting from '../assets/CompetitiveShooting.jpg';
import {
    getSessionById,
    updateSession,
    deleteSession
} from '../features/sessions/sessionsAPI';
import {
    getSessionModes,
    addWeaponToSessionMode,
    deleteWeaponFromSessionMode
} from '../features/sessionModes/sessionModesAPI.ts';
import { getWeapons } from '../features/weapons/weaponsAPI.ts';

export const SessionDetailPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [session, setSession] = useState<any>(null);
    const [sessionModes, setSessionModes] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [weapons, setWeapons] = useState<any[]>([]);
    const [newWeapon, setNewWeapon] = useState({ weaponId: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingWeapon, setIsAddingWeapon] = useState(false);
    const [isDeletingWeaponId, setIsDeletingWeaponId] = useState<string | null>(null);

    const [deleteSessionModal, setDeleteSessionModal] = useState(false);
    const [deleteWeaponModal, setDeleteWeaponModal] = useState<{
        isOpen: boolean;
        weaponId: string | null;
        weaponName: string;
    }>({
        isOpen: false,
        weaponId: null,
        weaponName: ''
    });
    const [startSessionModal, setStartSessionModal] = useState(false);

    const isoToLocalInput = (iso?: string) => {
        if (!iso) return '';
        const d = new Date(iso);
        const off = d.getTimezoneOffset();
        const local = new Date(d.getTime() - off * 60000);
        return local.toISOString().slice(0, 16);
    };

    const localInputToIso = (local?: string) => {
        if (!local) return null;
        const d = new Date(local);
        return d.toISOString();
    };

    useEffect(() => {
        if (!id) return;
        Promise.all([
            getSessionById(id),
            getSessionModes(),
            getWeapons()
        ])
            .then(([sessionData, modesData, weaponsData]) => {
                setSession(sessionData);
                setFormData({
                    name: sessionData.name,
                    dateStart: isoToLocalInput(sessionData.dateStart),
                    dateEnd: isoToLocalInput(sessionData.dateEnd),
                    sessionModeId: sessionData.sessionModeId ?? sessionData.sessionModes?.id ?? '',
                });
                setSessionModes(modesData);
                setWeapons(weaponsData);
            })
            .catch(console.error);
    }, [id]);

    const getBackgroundImage = (title: string) => {
        const normalized = (title || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        if (normalized.includes('entrainement')) return ShootingTraining;
        if (normalized.includes('competition')) return CompetitiveShooting;
        return '';
    };

    const handleEditToggle = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setFormData({
            name: session.name,
            dateStart: isoToLocalInput(session.dateStart),
            dateEnd: isoToLocalInput(session.dateEnd),
            sessionModeId: session.sessionModeId ?? session.sessionModes?.id ?? '',
        });
        setIsEditing(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        if (!id) return;
        setIsSaving(true);
        try {
            const payload: any = {
                name: formData.name,
                dateStart: localInputToIso(formData.dateStart) ?? session.dateStart,
                dateEnd: localInputToIso(formData.dateEnd) ?? session.dateEnd,
                sessionModeId: formData.sessionModeId || null,
            };

            await updateSession(id!, payload);

            const updated = await getSessionById(id!);
            setSession(updated);
            setFormData({
                name: updated.name,
                dateStart: isoToLocalInput(updated.dateStart),
                dateEnd: isoToLocalInput(updated.dateEnd),
                sessionModeId: updated.sessionModeId ?? updated.sessionModes?.id ?? '',
            });
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSessionClick = () => {
        setDeleteSessionModal(true);
    };

    const confirmDeleteSession = async () => {
        if (!id) return;
        try {
            await deleteSession(id);
            navigate('/sessions');
        } catch (err) {
            console.error(err);
        } finally {
            setDeleteSessionModal(false);
        }
    };

    const handleDeleteWeaponClick = (weaponId: string, weaponName: string) => {
        setDeleteWeaponModal({
            isOpen: true,
            weaponId,
            weaponName
        });
    };

    const confirmDeleteWeapon = async () => {
        if (!session?.sessionModes || !deleteWeaponModal.weaponId) return;
        const sessionModeId = session.sessionModes.id;
        setIsDeletingWeaponId(deleteWeaponModal.weaponId);
        try {
            await deleteWeaponFromSessionMode(sessionModeId, deleteWeaponModal.weaponId);
            const updated = await getSessionById(id!);
            setSession(updated);
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeletingWeaponId(null);
            setDeleteWeaponModal({ isOpen: false, weaponId: null, weaponName: '' });
        }
    };

    const handleAddWeapon = async () => {
        if (!session?.sessionModes || !newWeapon.weaponId) return;
        setIsAddingWeapon(true);
        try {
            await addWeaponToSessionMode(session.sessionModes.id, { weaponDetailId: newWeapon.weaponId });

            const updated = await getSessionById(id!);
            setSession(updated);
            setNewWeapon({ weaponId: '' });
        } catch (err) {
            console.error(err);
        } finally {
            setIsAddingWeapon(false);
        }
    };

    const handleStartClick = () => {
        setStartSessionModal(true);
    };

    const confirmStartSession = () => {
        if (!id) return;
        navigate(`/sessions/${id}`);
        setStartSessionModal(false);
    };

    if (!session) return <div className="p-6">Chargement...</div>;

    const image = getBackgroundImage(session.name);

    return (
        <>
            <PrivateHeader />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
            >
                <motion.img
                    layoutId={`session-image-${session.id}`}
                    src={image}
                    alt={session.name}
                    className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-white/90" />
                <div className="absolute bottom-4 left-6 text-white">
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                                className="text-3xl font-bold text-black p-2 rounded flex-shrink-0"
                                style={{ minWidth: '300px' }}
                            />
                            <div className="flex items-center space-x-2">
                                <input
                                    type="datetime-local"
                                    name="dateStart"
                                    value={formData.dateStart || ''}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-auto text-black"
                                />
                                <span className="text-white">→</span>
                                <input
                                    type="datetime-local"
                                    name="dateEnd"
                                    value={formData.dateEnd || ''}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-auto text-black"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold">{session.name}</h1>
                            <p className="text-sm italic">
                                Du {new Date(session.dateStart).toLocaleDateString()} au {new Date(session.dateEnd).toLocaleDateString()}
                            </p>
                        </>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={handleEditToggle}
                                    className="bg-[#123189] hover:bg-[#58628a] transition-colors text-white px-4 py-2 rounded-md shadow"
                                >
                                    Modifier
                                </button>

                                <button
                                    onClick={handleStartClick}
                                    className="bg-green-600 hover:bg-green-700 transition-colors text-white px-4 py-2 rounded-md shadow"
                                >
                                    Commencer la session
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-green-600 disabled:opacity-60 hover:bg-green-700 transition-colors text-white px-4 py-2 rounded-md shadow"
                                >
                                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="bg-gray-300 hover:bg-gray-350 transition-colors text-gray-800 px-4 py-2 rounded-md shadow"
                                >
                                    Annuler
                                </button>
                            </>
                        )}

                        <button
                            onClick={handleDeleteSessionClick}
                            className="bg-red-600 hover:bg-red-700 transition-colors text-white px-4 py-2 rounded-md shadow"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="px-6 py-8 space-y-8"
            >
                <section className="flex flex-col md:flex-row md:gap-12">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Mode de session</h2>

                        {isEditing ? (
                            <div className="space-y-2">
                                <label className="block text-sm text-gray-600">Mode associé</label>
                                <select
                                    name="sessionModeId"
                                    value={formData.sessionModeId || ''}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full md:w-1/2"
                                >
                                    <option value="">-- Sélectionner un mode --</option>
                                    {sessionModes.map(mode => (
                                        <option key={mode.id} value={mode.id}>
                                            {mode.name} - {mode.discipline}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <>
                                {session.sessionModes ? (
                                    <>
                                        <p className="text-md text-gray-600 font-bold">{session.sessionModes.name}</p>
                                        <p className="text-sm text-gray-500">Discipline : {session.sessionModes.discipline}</p>
                                        <p className="text-sm text-gray-500">
                                            Temps limite : {session.sessionModes.timeLimits} | Échauffement : {session.sessionModes.warmUp}
                                        </p>

                                        {session.sessionModes.modeDetails && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                <p>Limite de tirs : {session.sessionModes.modeDetails.shootLimit}</p>
                                                <p>Temps de tir : {session.sessionModes.modeDetails.shootingTime}</p>
                                                <p>Temps de repos : {session.sessionModes.modeDetails.restTime}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm italic text-gray-500">Mode de session non disponible</p>
                                )}
                            </>
                        )}
                    </div>

                    <aside className="w-full md:w-64 bg-gray-50 p-4 rounded-md shadow-md flex flex-col justify-center items-center mt-6 md:mt-0 md:mr-24">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Points réalisés</h3>
                        {session.pointsTotal != null ? (
                            <p className="text-4xl font-bold text-indigo-600">{session.pointsTotal} pts</p>
                        ) : (
                            <p className="text-gray-500 italic text-center">
                                {new Date(session.dateStart) > new Date()
                                    ? 'Session pas commencée'
                                    : 'Aucun point enregistré'}
                            </p>
                        )}
                    </aside>
                </section>

                <section>
                    <div className="flex items-center mb-2">
                        <h2 className="text-xl font-semibold text-gray-800">Armes autorisées</h2>
                        {isEditing && (
                            <div className="flex gap-2 items-center ml-4">
                                <select
                                    value={newWeapon.weaponId}
                                    onChange={(e) => setNewWeapon({ weaponId: e.target.value })}
                                    className="border p-2 rounded"
                                >
                                    <option value="">-- Choisissez une arme --</option>
                                    {weapons.map((weapon) => (
                                        <option key={weapon.id} value={weapon.id}>
                                            {weapon.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleAddWeapon}
                                    disabled={isAddingWeapon || !newWeapon.weaponId}
                                    className="bg-blue-500 disabled:opacity-60 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    {isAddingWeapon ? 'Ajout...' : 'Ajouter'}
                                </button>
                            </div>
                        )}
                    </div>

                    {session.sessionModes?.sessionModeWeaponDetails && session.sessionModes.sessionModeWeaponDetails.length > 0 ? (
                        <ul className="space-y-2">
                            {session.sessionModes.sessionModeWeaponDetails.map((detail: any) => (
                                <li key={detail.id} className="bg-gray-100 p-4 rounded-md shadow-sm flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{detail.weaponDetails.name}</p>
                                        <p className="text-sm italic text-gray-600">Marque : {detail.weaponDetails.brand}</p>
                                        {detail.weaponDetails.description && (
                                            <p className="text-sm italic text-gray-600">{detail.weaponDetails.description}</p>
                                        )}
                                        {detail.weaponDetails.serialNumber && (
                                            <p className="text-sm italic text-gray-600">N° de série : {detail.weaponDetails.serialNumber}</p>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <button
                                            onClick={() => handleDeleteWeaponClick(detail.weaponDetails.id, detail.weaponDetails.name)}
                                            className="text-red-500 hover:text-red-700 ml-4"
                                            title="Supprimer arme autorisée"
                                            disabled={isDeletingWeaponId === detail.weaponDetails.id}
                                        >
                                            {isDeletingWeaponId === detail.weaponDetails.id ? 'Suppression...' : '🗑'}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm italic text-gray-500">Aucune arme autorisée renseignée</p>
                    )}
                </section>
            </motion.div>

            {/* Modales de confirmation */}
            <ConfirmModal
                isOpen={deleteSessionModal}
                title="Supprimer la session"
                message="Êtes-vous sûr de vouloir supprimer cette session ? Cette action est irréversible."
                onConfirm={confirmDeleteSession}
                onCancel={() => setDeleteSessionModal(false)}
                confirmText="Supprimer"
                cancelText="Annuler"
            />

            <ConfirmModal
                isOpen={deleteWeaponModal.isOpen}
                title="Supprimer l'arme autorisée"
                message={`Êtes-vous sûr de vouloir supprimer "${deleteWeaponModal.weaponName}" de la liste des armes autorisées ?`}
                onConfirm={confirmDeleteWeapon}
                onCancel={() => setDeleteWeaponModal({ isOpen: false, weaponId: null, weaponName: '' })}
                confirmText="Supprimer"
                cancelText="Annuler"
            />

            <ConfirmModal
                isOpen={startSessionModal}
                title="Commencer la session"
                message="Voulez-vous vraiment commencer cette session de tir ?"
                onConfirm={confirmStartSession}
                onCancel={() => setStartSessionModal(false)}
                confirmText="Commencer"
                confirmColor="#16a34a" // vert
                cancelText="Annuler"
            />
        </>
    );
};