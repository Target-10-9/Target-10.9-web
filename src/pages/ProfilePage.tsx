import React, { useEffect, useState } from "react";
import { getUser, updateUser, deleteUser } from "../features/profiles/profileAPI";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {PrivateHeader} from "../components/PrivateHeader.tsx";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    licenseNumber: string;
}

export const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<User | null>(null);
    const [showWeapons, setShowWeapons] = useState(false);
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");

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
                console.error("Erreur lors de la récupération du profil :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, navigate]);

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
            console.error("Erreur lors de la mise à jour :", err);
        }
    };

    const handleDelete = async () => {
        if (!userId) return;
        if (!window.confirm("Voulez-vous vraiment supprimer votre compte ?")) return;

        try {
            await deleteUser(userId);
            localStorage.clear();
            navigate("/login");
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    if (loading) return(
        <>
            <PrivateHeader />
            <p className="text-center mt-10">Chargement...</p>;

        </>
    );

    if (!user) return(
        <>
            <PrivateHeader />
            <p className="text-center mt-10">Utilisateur introuvable</p>;

        </>
    );

    return (
        <>
            <PrivateHeader />
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-6 overflow-x-hidden">
                <div className="relative flex w-full max-w-7xl h-[700px] gap-6">

                    {/* Formulaire Profil */}
                    <motion.div
                        className={`bg-white p-6 rounded-2xl shadow-lg z-10`}
                        animate={{
                            x: showWeapons ? -50 : 0,
                            width: showWeapons ? "45%" : "60%"
                        }}
                        transition={{ type: "spring", stiffness: 90 }}
                    >
                        <h1 className="text-2xl font-bold mb-6 text-center">Mon Profil</h1>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData?.email || ""}
                                    disabled
                                    className="mt-1 block w-full border rounded-lg p-2 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Prénom</label>
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
                                <label className="block text-sm font-medium text-gray-600">Nom</label>
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
                                <label className="block text-sm font-medium text-gray-600">Numéro de licence</label>
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
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Voir mes armes
                            </button>
                        </div>
                    </motion.div>

                    {/* Formulaire Armes */}
                    {showWeapons && (
                        <motion.div
                            className="bg-white p-6 rounded-2xl shadow-lg z-20"
                            initial={{ x: 300, width: "0%" }}
                            animate={{ x: 0, width: "45%" }}
                            transition={{ type: "spring", stiffness: 90 }}
                        >
                            <h1 className="text-2xl font-bold mb-6 text-center">Mes Armes</h1>
                            <p className="text-center text-gray-500">
                                Ici tu pourras afficher les armes de l'utilisateur.
                            </p>
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setShowWeapons(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Retour au profil
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
};
