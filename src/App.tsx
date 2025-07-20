import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {LoginPage} from './pages/LoginPage';
// plus tard, d'autres pages comme Dashboard, Sessions, etc.

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Router>
    );
}

export default App;
