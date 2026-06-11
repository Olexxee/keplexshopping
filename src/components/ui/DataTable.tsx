interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string;
}

export const DataTable = <T,>({
  columns,
  data,
  isLoading,
  emptyMessage = "No records found.",
  keyExtractor,
}: DataTableProps<T>) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-200 shadow-md p-10 text-center">
        <p className="text-sm text-purple-600 font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-200 shadow-md p-10 text-center">
        <p className="text-sm text-purple-600 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-200 shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-5 py-3.5 text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-widest ${col.width ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100">
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 text-purple-700 font-medium">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
