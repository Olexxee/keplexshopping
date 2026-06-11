import { AccountLayout } from "../../components/account/AccountLayout";
import { AccountCard } from "../../components/account/AccountCard";
import { EmptyState } from "../../components/account/EmptyState";
import { PageHeader } from "../../components/account/PageHeader";

export const PaymentMethodsPage = () => {

  return (
    <AccountLayout>
      <PageHeader
        title="Payment Methods"
        description="Manage your saved cards and payment options."
      />

      <AccountCard className="p-6">
        <EmptyState
          title="No saved cards"
          description="Save a card during checkout to see it here."
        />
      </AccountCard>
    </AccountLayout>
  );
};
