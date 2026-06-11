import type { User } from "../../types/auth.types";

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
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-black text-white flex items-center justify-center text-lg font-semibold">
          {initials}
        </div>

        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-gray-900">
            {user.fullName}
          </h1>

          <p className="text-sm text-gray-500">{user.email}</p>

          {memberSince && (
            <p className="text-xs text-gray-400 mt-1">
              Member since {memberSince}
              <span className="inline-flex mt-2 px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                {user.status}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
