import { api, withSkipErrorToast } from "@/modules/shared";
import type { Note, NoteFormData, ApiResponse } from "@/modules/shared";

export const noteService = {
  /**
   * Create a new note
   */
  async create(noteData: NoteFormData): Promise<Note> {
    const { data } = await api.post<ApiResponse<Note>>(
      "/notes",
      noteData,
      withSkipErrorToast(),
    );
    return data.data;
  },
};
