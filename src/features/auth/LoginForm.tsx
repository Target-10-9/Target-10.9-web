import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import { login } from './authAPI';

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await login(email, password);
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.id);
            navigate('/home');
        } catch (err: any) {
            if (err?.errors) {
                const globalError = err.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
                setError(globalError);

            } else if (err?.message) {
                setError(err.message);

            } else {
                setError('Une erreur est survenue');
            }
        }

    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-3xl font-bold text-center text-[#333] mb-4">Connexion</h2>

            <div>
                <label className="block text-sm text-gray-600 mb-1">Adresse e-mail :</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#123189] focus:outline-none transition shadow-sm"
                    placeholder="votre@email.com"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-600 mb-1">Mot de passe :</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#123189] focus:outline-none transition shadow-sm"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#123189] text-white font-semibold hover:bg-[#58628a] shadow-lg transition"
            >
                Se connecter
            </button>

            {error && <p className="text-red-600 text-center text-sm">{error}</p>}
        </form>
    );
};
