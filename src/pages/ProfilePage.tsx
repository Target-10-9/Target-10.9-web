import React, { useEffect, useState } from "react";
import {
    getUser,
    updateUser,
    deleteUser,
} from "../features/profiles/profilesAPI";
import {
    getWeapons,
    createWeaponDetail,
    updateWeaponDetail,
    deleteWeaponDetail,
} from "../features/weapons/weaponsAPI";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PrivateHeader } from "../components/PrivateHeader";
import { ConfirmModal } from "../components/ConfirmModal"; // <-- ton composant ConfirmModal

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    licenseNumber: string;
}

interface Weapon {
    id: string;
    name: string;
    brand: string;
    description: string;
    serialNumber: string;
}

interface NewWeapon {
    name: string;
    brand: string;
    description: string;
    serialNumber: string;
}

export const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const [weapons, setWeapons] = useState<Weapon[]>([]);
    const [editingWeapon, setEditingWeapon] = useState<string | null>(null);
    const [weaponForm, setWeaponForm] = useState<Partial<Weapon>>({});
    const [showWeapons, setShowWeapons] = useState(false);

    const emptyNewWeapon: NewWeapon = {
        name: "",
        brand: "",
        description: "",
        serialNumber: "",
    };
    const [adding, setAdding] = useState(false);
    const [newWeapon, setNewWeapon] = useState<NewWeapon>(emptyNewWeapon);

    // Pour modales
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    // -------------------- CHARGEMENT --------------------
    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const data = await getUser(userId);
                setUser(data);
                setFormData(data);
            } catch (err) {
                console.error("Erreur profil :", err);
                setErrorMessage("Impossible de charger le profil.");
                setErrorModalOpen(true);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, navigate]);

    useEffect(() => {
        if (!showWeapons) return;

        const fetchWeapons = async () => {
            try {
                const data = await getWeapons();
                setWeapons(data);
            } catch (err) {
                console.error("Erreur armes :", err);
                setErrorMessage("Impossible de charger les armes.");
                setErrorModalOpen(true);
            }
        };

        fetchWeapons();
    }, [showWeapons]);

    // -------------------- PROFIL --------------------
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!userId || !formData) return;
        try {
            const updated = await updateUser(userId, formData);
            setUser(updated);
            setEditing(false);
        } catch (err) {
            console.error("Erreur maj profil :", err);
            setErrorMessage("Impossible de mettre à jour le profil.");
            setErrorModalOpen(true);
        }
    };

    const handleDelete = () => {
        if (!userId) return;
        setConfirmMessage("Voulez-vous vraiment supprimer votre compte ?");
        setOnConfirmAction(() => async () => {
            try {
                await deleteUser(userId);
                localStorage.clear();
                navigate("/login");
            } catch (err) {
                console.error("Erreur suppression compte :", err);
                setErrorMessage("Impossible de supprimer le compte.");
                setErrorModalOpen(true);
            }
        });
        setConfirmOpen(true);
    };

    // -------------------- ARMES --------------------
    const handleWeaponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWeaponForm({ ...weaponForm, [e.target.name]: e.target.value });
    };

    const handleWeaponSave = async (id: string) => {
        try {
            const updated = await updateWeaponDetail(id, weaponForm);
            setWeapons((prev) =>
                prev.map((w) => (w.id === id ? { ...w, ...updated } : w))
            );
            setEditingWeapon(null);
            setWeaponForm({});
        } catch (err) {
            console.error("Erreur maj arme :", err);
            setErrorMessage("Impossible de mettre à jour l'arme.");
            setErrorModalOpen(true);
        }
    };

    const handleWeaponDelete = (id: string) => {
        setConfirmMessage("Voulez-vous vraiment supprimer cette arme ?");
        setOnConfirmAction(() => async () => {
            try {
                await deleteWeaponDetail(id);
                setWeapons((prev) => prev.filter((w) => w.id !== id));
            } catch (err) {
                console.error("Erreur suppression arme :", err);
                setErrorMessage("Impossible de supprimer l'arme.");
                setErrorModalOpen(true);
            }
        });
        setConfirmOpen(true);
    };

    const handleNewWeaponChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setNewWeapon({ ...newWeapon, [e.target.name]: e.target.value });
    };

    const handleCreateWeapon = async () => {
        if (!newWeapon.name || !newWeapon.brand || !newWeapon.serialNumber) {
            setErrorMessage("Nom, Marque et Numéro de série sont requis.");
            setErrorModalOpen(true);
            return;
        }
        try {
            await createWeaponDetail(newWeapon);
            const updatedList = await getWeapons();
            setWeapons(updatedList);
            setNewWeapon(emptyNewWeapon);
            setAdding(false);
        } catch (err) {
            console.error("Erreur création arme :", err);
            setErrorMessage("Impossible de créer l'arme.");
            setErrorModalOpen(true);
        }
    };

    // -------------------- RENDU --------------------
    if (loading)
        return (
            <>
                <PrivateHeader />
                <p className="text-center mt-10">Chargement...</p>
            </>
        );

    if (!user)
        return (
            <>
                <PrivateHeader />
                <p className="text-center mt-10">Utilisateur introuvable</p>
            </>
        );

    return (
        <>
            <PrivateHeader />
            <div className="w-full min-h-screen flex items-start justify-center bg-gray-100 p-6 overflow-x-hidden">
                <div className="relative flex w-full max-w-7xl gap-6">
                    {/* Formulaire Profil */}
                    <motion.div
                        className="bg-white p-6 rounded-2xl shadow-lg z-10 h-fit max-h-[85vh] overflow-y-auto"
                        animate={{
                            x: showWeapons ? -50 : 0,
                            width: showWeapons ? "45%" : "95%",
                        }}
                        transition={{ type: "spring", stiffness: 90 }}
                    >
                        <h1 className="text-2xl font-bold mb-6 text-center">
                            Mon Profil
                        </h1>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData?.email || ""}
                                    disabled
                                    className="mt-1 block w-full border rounded-lg p-2 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Prénom
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData?.firstName || ""}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={`mt-1 block w-full border rounded-lg p-2 ${
                                        editing ? "bg-white" : "bg-gray-100"
                                    }`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData?.lastName || ""}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={`mt-1 block w-full border rounded-lg p-2 ${
                                        editing ? "bg-white" : "bg-gray-100"
                                    }`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Numéro de licence
                                </label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData?.licenseNumber || ""}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={`mt-1 block w-full border rounded-lg p-2 ${
                                        editing ? "bg-white" : "bg-gray-100"
                                    }`}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mt-6 flex-wrap gap-2">
                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Modifier
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Sauvegarder
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFormData(user);
                                            setEditing(false);
                                        }}
                                        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                    >
                                        Annuler
                                    </button>
                                </>
                            )}

                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Supprimer le compte
                            </button>

                            <button
                                onClick={() => setShowWeapons(true)}
                                className="px-4 py-2 bg-[#123189] text-white rounded-lg hover:bg-[#58628a]"
                            >
                                Voir mes armes
                            </button>
                        </div>
                    </motion.div>

                    {/* Gestion Armes */}
                    {showWeapons && (
                        <motion.div
                            className="relative bg-white p-6 rounded-2xl shadow-lg z-20 h-fit max-h-[80vh] overflow-y-auto w-[45%]"
                            initial={{ x: 300 }}
                            animate={{ x: 0 }}
                            exit={{ x: 300 }}
                            transition={{ type: "spring", stiffness: 90 }}
                        >
                            <AnimatePresence mode="wait">
                                {!adding && (
                                    <motion.div
                                        key="weaponsList"
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -50, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h1 className="text-2xl font-bold mb-6 text-center">
                                            Mes Armes
                                        </h1>

                                        {weapons.length === 0 ? (
                                            <p className="text-center text-gray-500">
                                                Aucune arme trouvée.
                                            </p>
                                        ) : (
                                            <div className="space-y-4">
                                                {weapons.map((weapon) => (
                                                    <div
                                                        key={weapon.id}
                                                        className="border p-4 rounded-lg shadow-sm"
                                                    >
                                                        {editingWeapon ===
                                                        weapon.id ? (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    placeholder="Nom"
                                                                    value={
                                                                        weaponForm.name ??
                                                                        weapon.name
                                                                    }
                                                                    onChange={
                                                                        handleWeaponChange
                                                                    }
                                                                    className="w-full mb-2 border rounded p-2"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    name="brand"
                                                                    placeholder="Marque / Modele"
                                                                    value={
                                                                        weaponForm.brand
                                                                    }
                                                                    onChange={
                                                                        handleWeaponChange
                                                                    }
                                                                    className="w-full mb-2 border rounded p-2"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    name="description"
                                                                    placeholder="Description"
                                                                    value={
                                                                        weaponForm.description
                                                                    }
                                                                    onChange={
                                                                        handleWeaponChange
                                                                    }
                                                                    className="w-full mb-2 border rounded p-2"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    name="serialNumber"
                                                                    placeholder="Numéro de serie"
                                                                    value={
                                                                        weaponForm.serialNumber
                                                                    }
                                                                    onChange={
                                                                        handleWeaponChange
                                                                    }
                                                                    className="w-full mb-2 border rounded p-2"
                                                                />
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleWeaponSave(
                                                                                weapon.id
                                                                            )
                                                                        }
                                                                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                                    >
                                                                        Sauvegarder
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            setEditingWeapon(
                                                                                null
                                                                            )
                                                                        }
                                                                        className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                                                    >
                                                                        Annuler
                                                                    </button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p>
                                                                    <span className="font-semibold">
                                                                        Nom :
                                                                    </span>{" "}
                                                                    {weapon.name}
                                                                </p>
                                                                <p>
                                                                    <span className="font-semibold">
                                                                        Marque / Modele :
                                                                    </span>{" "}
                                                                    {weapon.brand}
                                                                </p>
                                                                <p>
                                                                    <span className="font-semibold">
                                                                        Description :
                                                                    </span>{" "}
                                                                    {weapon.description}
                                                                </p>
                                                                <p>
                                                                    <span className="font-semibold">
                                                                        Numero de serie :
                                                                    </span>{" "}
                                                                    {weapon.serialNumber}
                                                                </p>
                                                                <div className="flex gap-2 mt-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingWeapon(
                                                                                weapon.id
                                                                            );
                                                                            setWeaponForm(
                                                                                weapon
                                                                            );
                                                                        }}
                                                                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                                    >
                                                                        Modifier
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleWeaponDelete(
                                                                                weapon.id
                                                                            )
                                                                        }
                                                                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                                    >
                                                                        Supprimer
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex justify-between mt-6">
                                            <button
                                                onClick={() =>
                                                    setShowWeapons(false)
                                                }
                                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                            >
                                                Masquer
                                            </button>
                                            <button
                                                onClick={() => setAdding(true)}
                                                className="px-4 py-2 bg-[#be7c49] text-white rounded-lg"
                                            >
                                                Ajouter une arme
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {adding && (
                                    <motion.div
                                        key="addForm"
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 50, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h1 className="text-2xl font-bold mb-6 text-center">
                                            Ajouter une arme
                                        </h1>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Nom"
                                                value={newWeapon.name}
                                                onChange={handleNewWeaponChange}
                                                className="w-full border rounded p-2"
                                            />
                                            <input
                                                type="text"
                                                name="brand"
                                                placeholder="Marque / Modèle"
                                                value={newWeapon.brand}
                                                onChange={handleNewWeaponChange}
                                                className="w-full border rounded p-2"
                                            />
                                            <textarea
                                                name="description"
                                                placeholder="Description"
                                                value={newWeapon.description}
                                                onChange={handleNewWeaponChange}
                                                className="w-full border rounded p-2"
                                            />
                                            <input
                                                type="text"
                                                name="serialNumber"
                                                placeholder="Numéro de série"
                                                value={newWeapon.serialNumber}
                                                onChange={handleNewWeaponChange}
                                                className="w-full border rounded p-2"
                                            />
                                        </div>
                                        <div className="flex justify-between mt-6">
                                            <button
                                                onClick={handleCreateWeapon}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                Confirmer
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setAdding(false);
                                                    setNewWeapon(emptyNewWeapon);
                                                }}
                                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* ---------- MODALES ---------- */}
            <ConfirmModal
                isOpen={confirmOpen}
                message={confirmMessage}
                onConfirm={() => {
                    setConfirmOpen(false);
                    onConfirmAction();
                }}
                onCancel={() => setConfirmOpen(false)}
            />
            <ConfirmModal
                isOpen={errorModalOpen}
                message={errorMessage}
                title="Erreur"
                confirmText="OK"
                onConfirm={() => setErrorModalOpen(false)}
                onCancel={() => setErrorModalOpen(false)}
                confirmColor="#4ade80"
            />
        </>
    );
};
