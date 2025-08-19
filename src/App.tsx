import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import {SessionPage} from "./pages/SessionPage.tsx";
import {SessionDetailPage} from "./pages/SessionDetailPage.tsx";
import {TargetPageWrapper} from "./pages/TargetPageWrapper.tsx";
import {ProfilePage} from "./pages/ProfilePage.tsx";
import {ProtectedRoute} from "./components/ProtectRoute.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/home" element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>}
                />
                <Route path="/sessions" element={
                    <ProtectedRoute>
                        <SessionPage />
                    </ProtectedRoute>}
                />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>}
                />
                <Route path="/session/:id" element={
                    <ProtectedRoute>
                        <SessionDetailPage />
                    </ProtectedRoute>}
                />
                <Route path="/sessions/:sessionId" element={
                    <ProtectedRoute>
                        <TargetPageWrapper/>
                    </ProtectedRoute>}
                />
            </Routes>
        </Router>
    );
}

export default App;
