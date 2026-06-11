import { Card } from "./Card";

interface Props {
  label?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader = ({ label, title, description, action }: Props) => {
  return (
    <Card padding="md" className="mb-6 bg-gradient-to-r from-purple-50 via-pink-50 to-cyan-50 border-purple-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {label && (
            <p className="text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {label}
            </p>
          )}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mt-1">{title}</h1>
          {description && (
            <p className="text-sm text-purple-600 mt-2">{description}</p>
          )}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
    </Card>
  );
};
