import { NavLink } from "react-router-dom";

export const AccountTabs = () => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex gap-6 overflow-x-auto">
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `pb-3 text-sm font-medium ${
              isActive ? "text-black border-b-2 border-black" : "text-gray-500"
            }`
          }
        >
          Orders
        </NavLink>

        <NavLink
          to="/addresses"
          className={({ isActive }) =>
            `pb-3 text-sm font-medium ${
              isActive ? "text-black border-b-2 border-black" : "text-gray-500"
            }`
          }
        >
          Addresses
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `pb-3 text-sm font-medium ${
              isActive ? "text-black border-b-2 border-black" : "text-gray-500"
            }`
          }
        >
          Profile
        </NavLink>
      </div>
    </div>
  );
};
