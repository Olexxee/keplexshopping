import { useNavigate } from "react-router-dom";
import { MapPin, Plus, ArrowRight, Home, Building } from "lucide-react";
import type { Address } from "../../types/address.types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

interface Props {
  addresses: Address[];
}

const getAddressIcon = (label?: string) => {
  switch (label?.toLowerCase()) {
    case "home":
      return <Home size={14} />;
    case "office":
    case "work":
      return <Building size={14} />;
    default:
      return <MapPin size={14} />;
  }
};

export const DefaultAddressCard = ({ addresses }: Props) => {
  const navigate = useNavigate();
  const address = addresses.find((a) => a.isDefault);
  const hasAddresses = addresses.length > 0;

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-display-sm text-foreground">
          Default Address
        </h2>
        {hasAddresses && (
          <button
            onClick={() => navigate("/addresses")}
            className="text-sm font-medium text-amber hover:text-amber-light transition-colors flex items-center gap-1 group"
          >
            Manage
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {!hasAddresses ? (
        <div className="text-center py-8">
          <div className="h-12 w-12 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-3">
            <MapPin size={24} className="text-amber" />
          </div>
          <p className="text-sm text-muted-foreground">No saved addresses yet</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/addresses")}
            className="mt-4"
          >
            <Plus size={14} className="mr-1" />
            Add Address
          </Button>
        </div>
      ) : !address ? (
        <div className="text-center py-8">
          <div className="h-12 w-12 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-3">
            <MapPin size={24} className="text-amber" />
          </div>
          <p className="text-sm text-muted-foreground mb-3">No default address set</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/addresses")}
          >
            Set Default Address
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
              {getAddressIcon(address.label)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-display font-semibold text-foreground">
                  {address.label}
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber text-white">
                  Default
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {address.street}
              </p>
              <p className="text-sm text-muted-foreground">
                {address.city}, {address.state}
              </p>
              <p className="text-sm text-muted-foreground">
                {address.country}
              </p>
            </div>
          </div>
          
          <div className="pt-3 border-t border-border">
            <button
              onClick={() => navigate("/addresses")}
              className="text-sm text-amber hover:text-amber-light transition-colors flex items-center gap-1 group"
            >
              Manage Addresses
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};