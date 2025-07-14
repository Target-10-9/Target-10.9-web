import React, { useState } from 'react';
import { login } from './authAPI';

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await login(email, password);
            localStorage.setItem('token', response.token);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la connexion');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail :</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#b1283f] focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe :</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#b1283f] focus:outline-none"
                />
            </div>
            <div className="text-sm text-right">
                <a href="#" className="text-blue-600 hover:underline">Mot de passe oubliée</a>
            </div>
            <button
                type="submit"
                className="w-full py-2 rounded-md bg-[#b1283f] text-white font-semibold hover:bg-[#991d35] shadow transition"
            >
                se connecter
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
    );
};

export default LoginForm;
