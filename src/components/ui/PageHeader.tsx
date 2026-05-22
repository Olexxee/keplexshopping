interface PageHeaderProps {
  label: string;
  title: string;
  action?: React.ReactNode;
}

export const PageHeader = ({ label, title, action }: PageHeaderProps) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between gap-4">
    <div>
      <p className="text-sm uppercase tracking-wide text-gray-400">{label}</p>
      <h1 className="text-2xl font-bold mt-1">{title}</h1>
    </div>
    {action && <div>{action}</div>}
  </div>
);
