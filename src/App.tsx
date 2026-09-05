// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LessonListPage } from './pages/LessonListPage';
import { LessonViewPage } from './pages/LessonViewPage';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LessonListPage />} />
          <Route path="/lesson/:id" element={<LessonViewPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;