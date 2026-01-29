import { useState } from "react";
import { Formik, Form, type FormikHelpers } from "formik";
import { format } from "date-fns";
import { notify } from "@/modules/shared";

import { noteSchema } from "@/modules/shared";
import { noteService } from "@/modules/admin/notes/services/note.service";
import { Button } from "@/modules/shared";
import type { Note } from "@/modules/shared";
import { TextAreaField } from "@/modules/shared";

interface NotesListProps {
  noteableType: string;
  noteableId: string;
  notes: Note[];
  onNoteAdded: () => void;
}

type NoteFormValues = { note: string };
const INITIAL_VALUES: NoteFormValues = { note: "" };

export default function NotesList({
  noteableType,
  noteableId,
  notes,
  onNoteAdded,
}: NotesListProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (
    values: NoteFormValues,
    helpers: FormikHelpers<NoteFormValues>,
  ) => {
    try {
      await noteService.create({
        noteable_type: noteableType,
        noteable_id: noteableId,
        note: values.note,
      });

      notify.success("Note added successfully");
      helpers.resetForm();
      setIsAdding(false);
      onNoteAdded();
    } catch {
      notify.error("Failed to add note");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notes</h3>
        <Button onClick={() => setIsAdding((v) => !v)} size="sm">
          {isAdding ? "Cancel" : "Add Note"}
        </Button>
      </div>

      {isAdding && (
        <Formik<NoteFormValues>
          initialValues={INITIAL_VALUES}
          validationSchema={noteSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <TextAreaField
                name="note"
                label="Note"
                rows={3}
                placeholder="Enter your note..."
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Note"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}

      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-gray-500 text-sm">No notes yet</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {note.note}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {format(new Date(note.created_at), "PPp")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
