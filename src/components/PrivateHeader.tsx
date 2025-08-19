import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export const PrivateHeader: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    return (
        <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
            <div className="flex items-center gap-4">
                <Link to="/home"><img src={logo} alt="Logo" className="h-14 w-14 rounded-full object-cover" /></Link>
            </div>

            <nav className="flex gap-8">
                <Link to="/home" className="text-gray-800 hover:text-[#123189] font-semibold">Accueil</Link>
                <Link to="/sessions" className="text-gray-800 hover:text-[#123189] font-semibold">Mes sessions</Link>
                <Link to="/profile" className="text-gray-800 hover:text-[#123189] font-semibold">Profil</Link>
            </nav>

            <button
                onClick={handleLogout}
                className="bg-[#123189] text-white px-6 py-2 rounded-full hover:bg-[#58628a] transition"
            >
                Se déconnecter
            </button>
        </header>
    );
};
