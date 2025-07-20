import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export const SuccessIndicator: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-6 right-6 flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-xl shadow-lg"
        >
            <CheckCircle className="w-5 h-5" />
            <span>Inscription réussie !</span>
        </motion.div>
    );
};