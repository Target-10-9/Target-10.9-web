import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../features/auth/RegisterForm';
import { AppHeader } from '../components/AppHeader';
import ShootImage from '../assets/ShootImageLogin.jpg';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">
            <AppHeader
                title="Inscription"
                rightButton={
                    <button className="bg-[#123189] text-white px-6 py-2 text-sm rounded-full hover:bg-[#123189] transition"
                            onClick={() => navigate('/login')}
                    >
                        Se connecter
                    </button>
                }
            />

            <div className="flex flex-1">
                <div className="w-1/2 flex items-center justify-center px-10">
                    <div className="w-full max-w-md px-10">
                        <RegisterForm />
                    </div>
                </div>

                <div className="w-1/2 p-10">
                    <img
                        src={ShootImage}
                        alt="Shooter Image"
                        className="w-full h-[85%] object-cover rounded-[150px]"
                    />
                </div>
            </div>
        </div>
    );
};