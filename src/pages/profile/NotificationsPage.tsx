import { useState } from "react";
import { Bell, ShoppingBag, Megaphone, Package, Mail } from "lucide-react";

import { AccountLayout } from "../../components/account/AccountLayout";
import { AccountCard } from "../../components/account/AccountCard";
import { PageHeader } from "../../components/account/PageHeader";

export const NotificationsPage = () => {
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotions: true,
    restockAlerts: false,
    newsletter: false,
  });

  const notifications = [
    {
      key: "orderUpdates",
      icon: ShoppingBag,
      title: "Order Updates",
      description:
        "Receive updates when orders are confirmed, shipped or delivered.",
    },
    {
      key: "promotions",
      icon: Megaphone,
      title: "Promotions",
      description: "Special offers, discounts and seasonal promotions.",
    },
    {
      key: "restockAlerts",
      icon: Package,
      title: "Restock Alerts",
      description: "Get notified when out-of-stock products become available.",
    },
    {
      key: "newsletter",
      icon: Mail,
      title: "Newsletter",
      description: "Monthly updates, announcements and company news.",
    },
  ];

  return (
    <AccountLayout>
      <PageHeader
        title="Notifications"
        description="Control how and when we contact you."
      />

      <AccountCard className="overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Bell size={18} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Notification Preferences
            </h2>

            <p className="text-sm text-gray-500">
              Choose the updates you would like to receive.
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {notifications.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <Icon size={18} className="text-gray-600" />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 max-w-md">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof prev],
                    }))
                  }
                  className={`relative h-7 w-12 rounded-full transition-all ${
                    preferences[item.key as keyof typeof preferences]
                      ? "bg-black"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                      preferences[item.key as keyof typeof preferences]
                        ? "right-1"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-100 p-5 flex justify-end">
          <button className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition">
            Save Preferences
          </button>
        </div>
      </AccountCard>
    </AccountLayout>
  );
};
