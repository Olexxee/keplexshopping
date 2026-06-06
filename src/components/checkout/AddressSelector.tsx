import type { Address } from "../../types/address.types";

interface Props {
  addresses: Address[];
  selectedAddressId: string;
  onSelect: (id: string) => void;
}

export const AddressSelector = ({
  addresses,
  selectedAddressId,
  onSelect,
}: Props) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-bold mb-4">Delivery Address</h2>

      <div className="space-y-3">
        {addresses.map((address) => (
          <button
            key={address.id}
            type="button"
            onClick={() => onSelect(address.id)}
            className={`
              w-full text-left rounded-xl border p-4 transition
              ${
                selectedAddressId === address.id
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{address.label}</p>

                <p className="text-sm text-gray-500 mt-1">{address.street}</p>

                <p className="text-sm text-gray-500">
                  {address.city}, {address.state}
                </p>

                <p className="text-sm text-gray-500">{address.country}</p>
              </div>

              {address.isDefault && (
                <span className="text-xs bg-black text-white px-2 py-1 rounded-full">
                  Default
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
