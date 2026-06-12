import { AccountHero } from "../../components/account/AccountHero";
import { AccountStats } from "../../components/account/AccountStats";
import { AccountMenuItem } from "../../components/account/AccountMenuItem";
import { DangerZone } from "../../components/account/DangerZone";
import { AccountLayout } from "../../components/account/AccountLayout";

import { useMe } from "../../hooks/useAuth";
import { useOrders } from "../../hooks/useOrders";
import { useAddresses } from "../../hooks/useAddresses";
import { useLogout } from "../../hooks/useLogout";

export const ProfilePage = () => {
  const { data: user } = useMe();
  const { data: orders } = useOrders();
  const { data: addresses = [] } = useAddresses();

  const { mutate: logout, isPending: loggingOut } = useLogout();

  if (!user) return null;

  const ordersCount = orders?.pagination?.total ?? 0;
  const addressesCount = addresses.length;

  const menuItems = [
    {
      title: "Order History",
      subtitle: `${ordersCount} orders`,
      to: "/orders",
    },
    {
      title: "Addresses",
      subtitle: `${addressesCount} saved`,
      to: "/addresses",
    },
    {
      title: "Personal Information",
      subtitle: user.email,
      to: "/profile/edit",
    },
    {
      title: "Security",
      subtitle: "Change password",
      to: "/profile/password",
    },
    {
      title: "Payment Methods",
      subtitle: "Manage cards",
      to: "/profile/payment-methods",
    },
    {
      title: "Notifications",
      subtitle: "Manage alerts",
      to: "/profile/notifications",
    },
  ];

  return (
    <AccountLayout>

      <AccountHero user={user} />

      <AccountStats
        ordersCount={ordersCount}
        addressesCount={addressesCount}
      />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Account</h2>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {menuItems.map((item) => (
            <AccountMenuItem key={item.title} {...item} />
          ))}
        </div>
      </section>

      <DangerZone onLogout={() => logout()} loading={loggingOut} />
    </AccountLayout>
  );
};
