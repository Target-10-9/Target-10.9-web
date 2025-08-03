import React, { useState } from 'react';
import { register } from './authAPI';

type RegisterFormProps = {
    onSuccess?: () => void;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        licenseNumber: '',
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await register(form);
            onSuccess?.();
        } catch (err: any) {
            const message = err.message || 'Erreur lors de l’inscription';
            setError(message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-3xl font-bold text-center text-[#333] mb-4">Créer un compte</h2>

            <div>
                <label className="block text-sm text-gray-600 mb-1">Prénom</label>
                <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#123189] focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-600 mb-1">Nom</label>
                <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#123189] focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-600 mb-1">Adresse e-mail</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#123189] focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-600 mb-1">Mot de passe</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#123189] focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-600 mb-1">Numéro de licence</label>
                <input
                    type="text"
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#123189] focus:outline-none"
                />
            </div>

            <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#123189] text-white font-semibold hover:bg-[#58628a] shadow-lg transition"
            >
                S'inscrire
            </button>

            {error && <p className="text-red-600 text-center text-sm">{error}</p>}
        </form>
    );
};