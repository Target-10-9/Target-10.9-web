import React from 'react';
import { LoginForm } from '../features/auth/LoginForm';
import logo from '../assets/logo.png'; // logo rond en haut à gauche
import csgoImage from '../assets/image-csgo.jpg'; // l'image de l’archer

export const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#eae9dd] flex flex-col">
            {/* HEADER */}
            <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
                <img src={logo} alt="Logo" className="h-12 w-12 rounded-full object-cover" />
                <span className="text-gray-800 text-lg font-medium">Login</span>
                <button className="bg-[#b1283f] text-white px-4 py-2 rounded-md hover:bg-[#991d35] transition">
                    S'inscrire
                </button>
            </header>

            {/* CONTENU PRINCIPAL */}
            <div className="flex flex-1">
                {/* IMAGE A GAUCHE */}
                <div className="w-1/2">
                    <img
                        src={csgoImage}
                        alt="Archer"
                        className="w-full h-full object-cover rounded-l-[100px]"
                    />
                </div>

                {/* FORMULAIRE A DROITE */}
                <div className="w-1/2 flex items-center justify-center">
                    <div className="w-full max-w-md p-8">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
};
