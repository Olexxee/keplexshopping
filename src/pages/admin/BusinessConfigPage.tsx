import { PageHeader } from "../../components/ui/PageHeader";
import { useBusinessConfig } from "../../hooks/useBusinessConfig";
import { TrainingProgramsCard } from "../../components/admin/TrainingProgramsCard";
import { ImportationSettingsCard } from "../../components/admin/ImportationSettingsCard";
import { PricingRulesCard } from "../../components/admin/PricingRulesCard";
import { StoreSettingsCard } from "../../components/admin/StoreSettingsCard";
import { FAQSettingsCard } from "../../components/admin/FAQSettingsCard";

export const BusinessConfigPage = () => {
  const { data, isLoading } = useBusinessConfig();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader label="Admin" title="Business Config" />

      <TrainingProgramsCard programs={data.training_programs} />

      <ImportationSettingsCard settings={data.importation_settings} />

      <PricingRulesCard rules={data.pricing_rules} />

      <StoreSettingsCard settings={data.store_settings} />

      <FAQSettingsCard faq={data.training_faq} />
    </div>
  );
};
