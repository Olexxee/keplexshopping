import { useMe } from "../../hooks/useAuth";

export const CheckoutCustomerCard = () => {
  const { data: user } = useMe();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-bold mb-4">Customer Information</h2>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-400 uppercase">Name</p>
          <p className="font-medium">{user?.fullName}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>

        {user?.phone && (
          <div>
            <p className="text-xs text-gray-400 uppercase">Phone</p>
            <p className="font-medium">{user.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
};
