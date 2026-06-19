import { Card } from "./Card";

interface Props {
  label?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  image?: string;
}

export const PageHeader = ({ label, title, description, action, image }: Props) => {
  return (
    <Card padding="none" className="mb-6 overflow-hidden relative">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" className="w-full h-full object-cover opacity-10" />
        </div>
      )}
      
      <div className={`relative z-10 p-6 ${image ? 'bg-gradient-amber/20' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            {label && (
              <p className="text-xs font-semibold uppercase tracking-wider text-amber">
                {label}
              </p>
            )}
            <h1 className="font-display text-display-md text-foreground mt-1">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </Card>
  );
};