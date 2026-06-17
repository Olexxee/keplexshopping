import type { User } from "../../types/auth.types";
import { Mail, Calendar } from "lucide-react";
import { Card } from "../ui/Card";

interface AccountHeroProps {
  user: User;
}

export const AccountHero = ({ user }: AccountHeroProps) => {
  const initials =
    user.fullName
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U";

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-gradient-amber flex items-center justify-center shadow-amber shrink-0">
          <span className="text-white font-display font-bold text-2xl">
            {initials}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-display text-display-sm text-foreground">
            {user.fullName}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 mt-1 text-sm">
            <p className="text-muted-foreground flex items-center gap-1.5">
              <Mail size={14} className="text-amber" />
              {user.email}
            </p>
            
            {memberSince && (
              <p className="text-muted-foreground flex items-center gap-1.5">
                <Calendar size={14} className="text-amber" />
                Member since {memberSince}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              {user.status || "Active"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};