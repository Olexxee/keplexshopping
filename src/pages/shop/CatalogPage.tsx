import { useState } from "react";
import { ShoppingCart, CalendarCheck, Package, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { useItems } from "../../hooks/useItems";
import { useCategories } from "../../hooks/useCategories";
import { useAddToCart } from "../../hooks/useCart";
import { getErrorMessage } from "../../utils/error";

const TYPE_TABS = [
  { value: "", label: "All", icon: undefined },
  { value: "PRODUCT", label: "Products", icon: Package },
  { value: "SERVICE", label: "Services", icon: Wrench },
] as const;

export const CatalogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data: categories = [] } = useCategories();

  const {
    data: items = [],
    isLoading,
    error,
  } = useItems({
    status: "ACTIVE",
    ...(selectedCategory && { categoryId: selectedCategory }),
    ...(selectedType && { itemType: selectedType }),
    ...(search && { search }),
  });

  const {
    mutate: addToCart,
    isPending: cartPending,
    variables: cartVars,
  } = useAddToCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleAddToCart = (itemId: string) => {
    addToCart(
      { itemId, quantity: 1 },
      { onError: (err) => alert(getErrorMessage(err)) },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm uppercase tracking-wide text-gray-400">Catalog</p>
        <h1 className="text-3xl font-bold mt-2">
          Browse our products & services
        </h1>
      </div>

      {/* Type tabs */}
      <div className="flex gap-2 flex-wrap">
        {TYPE_TABS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setSelectedType(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              selectedType === value
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {Icon && <Icon size={14} />}
            {label}
          </button>
        ))}
      </div>

      {/* Search + category filter */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row gap-3"
      >
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search items..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-black text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-gray-800 transition"
        >
          Search
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {getErrorMessage(error)}
        </div>
      )}

      {/* Items grid */}
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading catalog...</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No items found
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Try another category or search term.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => {
            const image = item.media?.[0]?.url ?? null;
            const isService = item.itemType === "SERVICE";
            const isAddingThis = cartPending && cartVars?.itemId === item.id;

            return (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link
                  to={`/shop/${item.id}`}
                  className="block relative h-52 bg-gray-100"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-300">
                      {isService ? <Wrench size={32} /> : <Package size={32} />}
                    </div>
                  )}
                  <span
                    className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${
                      isService
                        ? "bg-violet-50/90 text-violet-700 border-violet-200"
                        : "bg-blue-50/90 text-blue-700 border-blue-200"
                    }`}
                  >
                    {isService ? <Wrench size={11} /> : <Package size={11} />}
                    {isService ? "Service" : "Product"}
                  </span>
                </Link>

                <div className="p-4">
                  <p className="text-xs text-gray-400">{item.category?.name}</p>
                  <Link to={`/shop/${item.id}`}>
                    <h2 className="font-semibold text-base mt-1 hover:underline leading-tight">
                      {item.name}
                    </h2>
                  </Link>
                  <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="font-bold text-gray-900">
                        ₦{Number(item.price).toLocaleString()}
                      </p>
                      {!isService && item.stock === 0 && (
                        <p className="text-xs text-red-500 mt-0.5">
                          Out of stock
                        </p>
                      )}
                    </div>

                    {isService ? (
                      <Link
                        to={`/shop/${item.id}`}
                        className="flex items-center gap-1.5 bg-violet-600 text-white rounded-full px-4 py-2 text-xs font-semibold hover:bg-violet-700 transition"
                      >
                        <CalendarCheck size={14} />
                        Book
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        disabled={isAddingThis || item.stock === 0}
                        className="bg-black text-white rounded-full p-2.5 disabled:opacity-50 hover:bg-gray-800 transition"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
