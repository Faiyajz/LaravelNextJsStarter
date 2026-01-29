import type { ReactNode } from "react";
import Pagination from "@/modules/shared/components/Pagination";

export interface Column<T> {
  id?: string; // stable key (recommended)
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => ReactNode;

  currentPage?: number;
  lastPage?: number;
  total?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No data found",
  onRowClick,
  actions,
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  onPerPageChange,
}: DataTableProps<T>) {
  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === "function") return column.accessor(row);
    return row[column.accessor] as ReactNode;
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="p-8 text-center">Loading...</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="p-8 text-center text-gray-500">{emptyMessage}</div>
      </div>
    );
  }

  const isClickable = Boolean(onRowClick);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id ?? column.header}
                  className={
                    column.headerClassName ??
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  }
                >
                  {column.header}
                </th>
              ))}

              {actions ? (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => (
              <tr
                key={row.id}
                className={
                  isClickable
                    ? "hover:bg-gray-50 cursor-pointer"
                    : "hover:bg-gray-50"
                }
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={`${row.id}-${column.id ?? column.header}`}
                    className={
                      column.className ??
                      "px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    }
                  >
                    {getCellValue(row, column)}
                  </td>
                ))}

                {actions ? (
                  <td
                    className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actions(row)}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {currentPage &&
      lastPage &&
      total !== undefined &&
      perPage &&
      onPageChange &&
      onPerPageChange ? (
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          total={total}
          perPage={perPage}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
        />
      ) : null}
    </div>
  );
}
