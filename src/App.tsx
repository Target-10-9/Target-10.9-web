import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import {SessionPage} from "./pages/SessionPage.tsx";
import {SessionDetailPage} from "./pages/SessionDetailPage.tsx";
import {TargetPageWrapper} from "./pages/TargetPageWrapper.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/sessions" element={<SessionPage />} />
                <Route path="/session/:id" element={<SessionDetailPage />} />
                <Route path="/sessions/:sessionId" element={<TargetPageWrapper/>} />
            </Routes>
        </Router>
    );
}

export default App;
