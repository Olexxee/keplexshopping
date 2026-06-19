import { AccountHero } from "../../components/account/AccountHero";
import { AccountStats } from "../../components/account/AccountStats";
import { AccountMenuItem } from "../../components/account/AccountMenuItem";
import { DangerZone } from "../../components/account/DangerZone";
import { AccountLayout } from "../../components/account/AccountLayout";

import { useMe } from "../../hooks/useAuth";
import { useOrders } from "../../hooks/useOrders";
import { useAddresses } from "../../hooks/useAddresses";
import { useLogout } from "../../hooks/useLogout";
import type { LucideIcon } from "lucide-react";
import { 
  Package, 
  MapPin, 
  User, 
  Shield, 
  CreditCard, 
  Bell,
  ShoppingBag
} from "lucide-react";

interface MenuItem {
  title: string;
  subtitle: string;
  to: string;
  icon: LucideIcon;
}

export const ProfilePage = () => {
  const { data: user } = useMe();
  const { data: orders } = useOrders();
  const { data: addresses = [] } = useAddresses();

  const { mutate: logout, isPending: loggingOut } = useLogout();

  if (!user) return null;

  const ordersCount = orders?.pagination?.total ?? 0;
  const addressesCount = addresses.length;

  const menuItems: MenuItem[] = [
    {
      title: "Order History",
      subtitle: `${ordersCount} order${ordersCount !== 1 ? 's' : ''} placed`,
      to: "/orders",
      icon: Package,
    },
    {
      title: "Addresses",
      subtitle: `${addressesCount} saved address${addressesCount !== 1 ? 's' : ''}`,
      to: "/addresses",
      icon: MapPin,
    },
    {
      title: "Personal Information",
      subtitle: user.email,
      to: "/profile/edit",
      icon: User,
    },
    {
      title: "Security",
      subtitle: "Change password",
      to: "/profile/password",
      icon: Shield,
    },
    {
      title: "Payment Methods",
      subtitle: "Manage cards",
      to: "/profile/payment-methods",
      icon: CreditCard,
    },
    {
      title: "Notifications",
      subtitle: "Manage alerts",
      to: "/profile/notifications",
      icon: Bell,
    },
  ];

  return (
    <AccountLayout>
      <div className="space-y-8 py-8">
        {/* Hero Section */}
        <AccountHero user={user} />

        {/* Stats Section */}
        <AccountStats
          ordersCount={ordersCount}
          addressesCount={addressesCount}
        />

        {/* Account Menu Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-display-sm text-foreground">
              Account Settings
            </h2>
            <span className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
              {menuItems.length} items
            </span>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden">
            {menuItems.map((item, _index) => (
              <AccountMenuItem 
                key={item.title} 
                {...item} 
              />
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <DangerZone onLogout={() => logout()} loading={loggingOut} />
      </div>
    </AccountLayout>
  );
};