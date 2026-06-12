import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMe } from "../../hooks/useAuth";
import {useUpdateProfile} from "../../hooks/useProfile"

import { AccountLayout } from "../../components/account/AccountLayout";
import { AccountCard } from "../../components/account/AccountCard";
import { PageHeader } from "../../components/account/PageHeader";

export const EditProfilePage = () => {
  const navigate = useNavigate();

  const { data: user } = useMe();

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!user) return;

    setFullName(user.fullName ?? "");
    setPhone(user.phone ?? "");
  }, [user]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile(
      {
        fullName,
        phone,
      },
      {
        onSuccess: () => {
          navigate("/profile");
        },
      },
    );
  };

  return (
    <AccountLayout>
      <PageHeader
        title="Personal Information"
        description="Update your account details"
      />

      <AccountCard className="p-6">
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium">Full Name</label>

            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone Number</label>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>

            <input
              disabled
              value={user?.email ?? ""}
              className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-400"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-4 py-2 rounded-xl border border-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-xl bg-black text-white"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </AccountCard>
    </AccountLayout>
  );
};
