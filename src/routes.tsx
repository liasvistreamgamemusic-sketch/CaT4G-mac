/**
 * CaT4G - Application Routes
 *
 * Route structure:
 * - /home       - Home page (search & compose)
 * - /songs      - Song view (play mode)
 * - /songs/edit - Song view (edit mode)
 * - /           - Redirect to /home
 * - *           - Redirect to /home
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { SongPage } from '@/pages/SongPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/songs" element={<SongPage />} />
      <Route path="/songs/edit" element={<SongPage />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
