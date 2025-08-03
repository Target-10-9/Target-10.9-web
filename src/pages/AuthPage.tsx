import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from '../features/auth/LoginForm';
import { RegisterForm } from '../features/auth/RegisterForm';
import { AppHeader } from '../components/AppHeader';
import { SuccessIndicator } from '../components/SuccessIndicator';
import ShootImage from '../assets/ShootImageLogin.jpg';

export const AuthPage: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [success, setSuccess] = useState(false);

    const toggleMode = () => {
        setMode(prev => (prev === 'login' ? 'register' : 'login'));
    };

    const handleSuccess = () => {
        setSuccess(true);
        setMode('login');
        setTimeout(() => {
            setSuccess(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen flex flex-col overflow-hidden">
            <AppHeader
                title={mode === 'login' ? 'Connexion' : 'Inscription'}
                rightButton={
                    <button
                        onClick={toggleMode}
                        className="bg-[#123189] text-white px-6 py-2 text-sm rounded-full hover:bg-[#58628a] transition"
                    >
                        {mode === 'login' ? "S'inscrire" : 'Se connecter'}
                    </button>
                }
            />

            <div className="flex flex-1 overflow-hidden relative">
                <motion.div
                    key={mode}
                    initial={{ x: mode === 'login' ? '100%' : '-100%' }}
                    animate={{ x: '0%' }}
                    exit={{ x: mode === 'login' ? '-100%' : '100%' }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className={`absolute top-0 bottom-0 w-1/2 p-10 ${
                        mode === 'login' ? 'left-0' : 'right-0'
                    }`}
                >
                    <img
                        src={ShootImage}
                        alt="Shooter Image"
                        className="w-full h-full object-cover rounded-[150px]"
                    />
                </motion.div>

                <div
                    className={`w-1/2 flex items-center justify-center px-10 z-10 ${
                        mode === 'login' ? 'ml-auto' : 'mr-auto'
                    }`}
                >
                    <div className="w-full max-w-md px-10">
                        <AnimatePresence mode="wait">
                            {mode === 'login' ? (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <LoginForm />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="register"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0.2 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <RegisterForm onSuccess={handleSuccess} />

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            {success && (
                <AnimatePresence>
                    <SuccessIndicator />
                </AnimatePresence>
            )}
        </div>
    );
};
