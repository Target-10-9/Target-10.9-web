import React from 'react';
import { LoginForm } from '../features/auth/LoginForm';
import { AppHeader } from '../components/AppHeader';
import ShootImage from '../assets/ShootImageLogin.jpg';

export const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <AppHeader
                title="Login"
                rightButton={
                    <button className="bg-[#123189] text-white px-6 py-2 text-sm rounded-full hover:bg-[#123189] transition">
                        S'inscrire
                    </button>
                }
            />

            <div className="flex flex-1">
                <div className="w-1/2 flex p-10">
                    <img
                        src={ShootImage}
                        alt="Shooter Image"
                        className="w-full h-full object-cover rounded-[185px]"
                    />
                </div>

                <div className="w-1/2 flex items-center justify-center px-10">
                    <div className="w-full max-w-md px-10 ">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
};
