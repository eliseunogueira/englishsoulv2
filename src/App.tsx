// src/App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom'; // ✅ Troquei BrowserRouter por HashRouter
import { LessonListPage } from './pages/LessonListPage';
import { LessonViewPage } from './pages/LessonViewPage';

function App() {
    return (
        <HashRouter> {/* ✅ Troquei aqui também */}
            <Routes>
                <Route path="/" element={<LessonListPage />} />
                <Route path="/lesson/:id" element={<LessonViewPage />} />
            </Routes>
        </HashRouter>
    );
}

export default App;