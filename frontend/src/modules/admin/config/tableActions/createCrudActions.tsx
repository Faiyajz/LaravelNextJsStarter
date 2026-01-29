import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type CrudActionsConfig<T extends { id: string | number }> = {
  getViewPath: (row: T) => string;
  getEditPath: (row: T) => string;

  onDeleteRequest: (id: string) => void;

  isDeleting?: boolean;

  labels?: {
    view?: string;
    edit?: string;
    delete?: string;
  };
};

export function createCrudActions<T extends { id: string | number }>({
  getViewPath,
  getEditPath,
  onDeleteRequest,
  isDeleting = false,
  labels = {},
}: CrudActionsConfig<T>) {
  const {
    view = "View",
    edit = "Edit",
    delete: deleteLabel = "Delete",
  } = labels;

  return (row: T): ReactNode => (
    <div className="flex items-center justify-center gap-3">
      <Link
        to={getViewPath(row)}
        className="text-blue-600 hover:text-blue-900 font-medium"
      >
        {view}
      </Link>

      <span className="text-gray-300">|</span>

      <Link
        to={getEditPath(row)}
        className="text-indigo-600 hover:text-indigo-900 font-medium"
      >
        {edit}
      </Link>

      <span className="text-gray-300">|</span>

      <button
        type="button"
        onClick={() => onDeleteRequest(String(row.id))}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
      >
        {isDeleting ? "Deleting..." : deleteLabel}
      </button>
    </div>
  );
}
