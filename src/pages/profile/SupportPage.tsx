import { MessageCircle, Mail, HelpCircle } from "lucide-react";

import { AccountLayout } from "../../components/account/AccountLayout";
import { AccountCard } from "../../components/account/AccountCard";
import { PageHeader } from "../../components/account/PageHeader";

export const SupportPage = () => {
  return (
    <AccountLayout>
      <PageHeader
        title="Help & Support"
        description="Need help? We're here to assist you."
      />

      <div className="space-y-4">
        <AccountCard>
          <div className="flex items-start gap-4">
            <HelpCircle className="shrink-0" />

            <div>
              <h3 className="font-semibold text-gray-900">
                Frequently Asked Questions
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Find answers to common questions about orders, training
                programs, payments, and your account.
              </p>
            </div>
          </div>
        </AccountCard>

        <AccountCard>
          <div className="flex items-start gap-4">
            <Mail className="shrink-0" />

            <div>
              <h3 className="font-semibold text-gray-900">Email Support</h3>

              <p className="text-sm text-gray-500 mt-1">support@keplex.com</p>
            </div>
          </div>
        </AccountCard>

        <AccountCard>
          <div className="flex items-start gap-4">
            <MessageCircle className="shrink-0" />

            <div>
              <h3 className="font-semibold text-gray-900">WhatsApp Support</h3>

              <p className="text-sm text-gray-500 mt-1">
                Chat with our support team directly.
              </p>
            </div>
          </div>
        </AccountCard>
      </div>
    </AccountLayout>
  );
};
