
import { useCallback, useState } from 'react';

type UpdateGameStatusFn = (userGameId: string, status?: any, note?: string) => Promise<void>;
type GetUserGamesFn = (userId: string, page: number, limit: number, status?: string, search?: string) => Promise<void>;

interface UseGameNoteModalParams {
  userId?: string;
  statusFilter?: string;
  search: string;
  updateGameStatus: UpdateGameStatusFn;
  getUserGames: GetUserGamesFn;
}

export function useGameNoteModal({
  userId,
  statusFilter,
  search,
  updateGameStatus,
  getUserGames
}: UseGameNoteModalParams) {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedUserGameId, setSelectedUserGameId] = useState<string | null>(null);
  const [noteBody, setNoteBody] = useState('');

  const openNoteModal = useCallback((userGameId: string, note: string | null) => {
    setNoteBody(note ?? '');
    setSelectedUserGameId(userGameId);
    setNoteModalOpen(true);
  }, []);

  const closeNoteModal = useCallback(() => {
    setNoteModalOpen(false);
    setNoteBody('');
    setSelectedUserGameId(null);
  }, []);

  const handleSaveNote = useCallback(async () => {
    if (!selectedUserGameId || !userId) return;

    closeNoteModal();

    await updateGameStatus(selectedUserGameId, undefined, noteBody);
    await getUserGames(userId, 1, 10, statusFilter, search);
  }, [selectedUserGameId, userId, noteBody, updateGameStatus, getUserGames, statusFilter, search, closeNoteModal]);

  return {
    noteModalOpen,
    noteBody,
    setNoteBody,
    openNoteModal,
    closeNoteModal,
    handleSaveNote
  };
}
