import { useState } from "react";

import { AccountLayout } from "../../components/account/AccountLayout";
import { AccountCard } from "../../components/account/AccountCard";
import { PageHeader } from "../../components/account/PageHeader";

export const NotificationsPage = () => {
  const [] = useState({
    orderUpdates: true,
    promotions: true,
    restockAlerts: false,
    newsletter: false,
  });


  return (
    <AccountLayout>
      <PageHeader
        title="Notifications"
        description="Choose what updates you want to receive."
      />

      <AccountCard className="divide-y divide-gray-100">
        {[
          {
            key: "orderUpdates",
            label: "Order Updates",
          },
          {
            key: "promotions",
            label: "Promotions",
          },
          {
            key: "restockAlerts",
            label: "Restock Alerts",
          },
          {
            key: "newsletter",
            label: "Newsletter",
          },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-5">
            <span className="text-sm font-medium text-gray-700">
              {item.label}
            </span>

            <div className="flex justify-end p-5">
              <button className="px-5 py-2 rounded-xl bg-black text-white">
                Save Preferences
              </button>
            </div>
          </div>
        ))}
      </AccountCard>
    </AccountLayout>
  );
};
