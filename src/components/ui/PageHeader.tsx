import { Card } from "./Card";

interface Props {
  label?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader = ({ label, title, description, action }: Props) => {
  return (
    <Card padding="md" className="mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {label && (
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {label}
            </p>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{title}</h1>
          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
    </Card>
  );
};
