import { useEffect, useState } from "react";

import { AccountTabs } from "../../components/account/AccountTabs";

import { useMe } from "../../hooks/useAuth";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { useChangePassword } from "../../hooks/useChangePassword";

import { getErrorMessage } from "../../utils/error";

export const ProfilePage = () => {
  const { data: user } = useMe();

  const { mutate: updateProfile, isPending: updatingProfile } = useUpdateProfile();

  const { mutate: changePassword, isPending: changingPassword } =
    useChangePassword();

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      fullName: user.fullName ?? "",
      phone: user.phone ?? "",
    });
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateProfile(profileForm);
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    changePassword(passwordForm, {
      onSuccess: () => {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
        });

        alert("Password updated successfully");
      },

      onError: (error) => {
        alert(getErrorMessage(error));
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <AccountTabs />

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

        <p className="text-gray-500 mt-1">Manage your account information.</p>
      </div>

      {/* Profile Information */}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Personal Information</h2>

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>

            <input
              value={profileForm.fullName}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>

            <input
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              value={user?.email ?? ""}
              disabled
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={updatingProfile}
            className="bg-black text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50"
          >
            {updatingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Password */}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Change Password</h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Password
            </label>

            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>

            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="bg-black text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50"
          >
            {changingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};
