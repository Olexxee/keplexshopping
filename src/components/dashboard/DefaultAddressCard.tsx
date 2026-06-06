import { useNavigate } from "react-router-dom";
import type { Address } from "../../types/address.types";

interface Props {
  addresses: Address[];
}

export const DefaultAddressCard = ({ addresses }: Props) => {
  const navigate = useNavigate();

  const address = addresses.find((a) => a.isDefault);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6">
      <h2 className="font-semibold text-lg mb-5">Default Address</h2>

      {!address ? (
        <>
          <p className="text-sm text-slate-400">No default address set.</p>

          <button
            onClick={() => navigate("/addresses")}
            className="mt-4 text-sm font-medium"
          >
            Add Address
          </button>
        </>
      ) : (
        <>
          <p className="font-medium">{address.label}</p>

          <p className="text-sm text-slate-500 mt-2">{address.street}</p>

          <p className="text-sm text-slate-500">
            {address.city}, {address.state}
          </p>

          <p className="text-sm text-slate-500">{address.country}</p>
        </>
      )}
    </div>
  );
};
