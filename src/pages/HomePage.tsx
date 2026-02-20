/**
 * HomePage - Main landing page with search and compose tabs
 *
 * Route: /home
 *
 * Features:
 * - Sidebar (left) for song/playlist/artist navigation
 * - Main area with "検索" and "作曲" tabs
 * - Search tab: U-Fret search with preview and save
 * - Compose tab: Manual song entry form
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { AddSongModal } from '@/components/AddSongModal';
import { ChordDiagramModal } from '@/components/ChordDiagramModal';
import { CreatePlaylistModal } from '@/components/CreatePlaylistModal';
import { ChordDefaultsSettings } from '@/components/ChordDefaultsSettings';
import { SearchTab } from '@/components/home/SearchTab';
import { ComposeTab } from '@/components/home/ComposeTab';
import { useContainerScale, useTheme } from '@/hooks';
import { Sun, Moon } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';

type HomeTab = 'search' | 'compose';

export function HomePage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scale } = useContainerScale(containerRef);

  const { toggleTheme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<HomeTab>('search');
  const [, setSidebarWidth] = useState(288);

  const {
    isDbReady,
    songs,
    selectedSongId,
    handleSaveSong,
    handleDeleteSong,
    isAddModalOpen,
    handleAddClick,
    handleModalClose,
    isChordSettingsOpen,
    setIsChordSettingsOpen,
    selectedChord,
    handleChordModalClose,
    playlists,
    selectedPlaylistId,
    handlePlaylistSelect,
    handleCreatePlaylistClick,
    handleCreatePlaylistSave,
    handleCreatePlaylistModalClose,
    isCreatePlaylistModalOpen,
    handlePlaylistExpand,
    handleAddSongToPlaylist,
    handleRemoveSongFromPlaylist,
    expandedPlaylistId,
    expandedPlaylistSongs,
    artists,
    expandedArtistId,
    artistSongs,
    handleArtistExpand,
  } = useAppData();

  // Song select handler - navigates to song view
  const handleSongSelect = (id: string) => {
    navigate(`/songs?id=${id}`);
  };

  // Edit song handler - navigates to edit mode
  const handleEditSong = (id: string) => {
    navigate(`/songs/edit?id=${id}`);
  };

  // Loading state
  if (!isDbReady) {
    return (
      <div className="h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen overflow-visible">
        {/* Left side: Sidebar */}
        <Sidebar
          songs={songs}
          selectedSongId={selectedSongId}
          onSongSelect={handleSongSelect}
          onAddClick={handleAddClick}
          onDeleteSong={handleDeleteSong}
          onEditSong={handleEditSong}
          playlists={playlists}
          selectedPlaylistId={selectedPlaylistId}
          onPlaylistSelect={handlePlaylistSelect}
          onCreatePlaylist={handleCreatePlaylistClick}
          onAddSongToPlaylist={handleAddSongToPlaylist}
          expandedPlaylistId={expandedPlaylistId}
          expandedPlaylistSongs={expandedPlaylistSongs}
          onPlaylistExpand={handlePlaylistExpand}
          onRemoveSongFromPlaylist={handleRemoveSongFromPlaylist}
          artists={artists}
          expandedArtistId={expandedArtistId}
          artistSongs={artistSongs}
          onArtistExpand={handleArtistExpand}
          onWidthChange={setSidebarWidth}
          scale={scale}
          onOpenChordSettings={() => setIsChordSettingsOpen(true)}
        />

        {/* Main content area */}
        <div ref={containerRef} className="flex flex-1 flex-col min-w-0 h-full">
          <div className="flex-1 overflow-y-auto bg-background-primary">
            {/* Tab bar */}
            <div className="sticky top-0 z-10 border-b border-white/10 bg-background-primary/80 backdrop-blur-md">
              <div className="max-w-2xl mx-auto flex items-center">
                <button
                  className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'search'
                      ? 'text-accent-primary border-accent-primary'
                      : 'text-text-secondary border-transparent hover:text-text-primary'
                  }`}
                  onClick={() => setActiveTab('search')}
                >
                  検索
                </button>
                <button
                  className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'compose'
                      ? 'text-accent-primary border-accent-primary'
                      : 'text-text-secondary border-transparent hover:text-text-primary'
                  }`}
                  onClick={() => setActiveTab('compose')}
                >
                  作曲
                </button>
                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="ml-4 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-[var(--btn-glass-hover)] transition-colors"
                  title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="max-w-2xl mx-auto p-6">
              {activeTab === 'search' ? (
                <SearchTab />
              ) : (
                <ComposeTab />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveSong}
        onSaveAndEdit={(songId) => {
          navigate(`/songs/edit?id=${songId}`);
        }}
      />

      <ChordDiagramModal chord={selectedChord} onClose={handleChordModalClose} />

      <CreatePlaylistModal
        isOpen={isCreatePlaylistModalOpen}
        onClose={handleCreatePlaylistModalClose}
        onSave={handleCreatePlaylistSave}
      />

      <ChordDefaultsSettings
        isOpen={isChordSettingsOpen}
        onClose={() => setIsChordSettingsOpen(false)}
      />
    </>
  );
}
