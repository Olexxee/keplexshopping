import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, LogOut, ChevronRight, Plus } from "lucide-react";

import { AccountTabs } from "../../components/account/AccountTabs";
import { useMe } from "../../hooks/useAuth";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { useChangePassword } from "../../hooks/useChangePassword";
import { useLogout } from "../../hooks/useLogout";
import { useAddresses } from "../../hooks/useAddresses";
import { getErrorMessage } from "../../utils/error";

export const ProfilePage = () => {
  const { data: user } = useMe();
  const { mutate: updateProfile, isPending: updatingProfile } =
    useUpdateProfile();
  const { mutate: changePassword, isPending: changingPassword } =
    useChangePassword();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { data: addresses = [] } = useAddresses();

  const [profileForm, setProfileForm] = useState({ fullName: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!user) return;
    setProfileForm({ fullName: user.fullName ?? "", phone: user.phone ?? "" });
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);
    changePassword(passwordForm, {
      onSuccess: () => {
        setPasswordForm({ currentPassword: "", newPassword: "" });
        setPasswordSuccess(true);
      },
      onError: (error) => setPasswordError(getErrorMessage(error)),
    });
  };

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <AccountTabs />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account information.</p>
        </div>
        <button
          onClick={() => logout()}
          disabled={loggingOut}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
        >
          <LogOut size={15} />
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
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
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="+234 800 000 0000"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              value={user?.email ?? ""}
              disabled
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              Email cannot be changed.
            </p>
          </div>
          <button
            type="submit"
            disabled={updatingProfile}
            className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {updatingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Address Summary */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Delivery Addresses</h2>
          <Link
            to="/addresses"
            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition"
          >
            Manage all
            <ChevronRight size={14} />
          </Link>
        </div>

        {addresses.length === 0 ? (
          <Link
            to="/addresses"
            className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition"
          >
            <Plus size={16} />
            <span className="text-sm">Add a delivery address</span>
          </Link>
        ) : (
          <div className="space-y-3">
            {/* Show default or first address as preview */}
            {defaultAddress && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    {defaultAddress.label ?? "Home"}
                    {defaultAddress.isDefault && (
                      <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">
                    {defaultAddress.street}, {defaultAddress.city},{" "}
                    {defaultAddress.state}
                  </p>
                </div>
              </div>
            )}

            {addresses.length > 1 && (
              <p className="text-xs text-gray-400 pl-1">
                +{addresses.length - 1} more address
                {addresses.length - 1 > 1 ? "es" : ""} —{" "}
                <Link to="/addresses" className="underline hover:text-gray-600">
                  view all
                </Link>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          {passwordError && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl px-4 py-3">
              Password updated successfully.
            </div>
          )}
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
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition"
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
              minLength={8}
              placeholder="Min. 8 characters"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition"
            />
          </div>
          <button
            type="submit"
            disabled={changingPassword}
            className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {changingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};
