

import { useState } from "react";
import {
  ShoppingCart,
  CalendarCheck,
  Package,
  Wrench,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useItems } from "../../hooks/useItems";
import { useCategories } from "../../hooks/useCategories";
import { useAddToCart } from "../../hooks/useCart";

import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";

import { getErrorMessage } from "../../utils/error";

const TYPE_TABS: { value: string; label: string; icon?: typeof Package }[] = [
  { value: "", label: "All" },
  { value: "PRODUCT", label: "Products", icon: Package },
  { value: "SERVICE", label: "Services", icon: Wrench },
];

// Filter chip component for active filters
const FilterChip = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
    {label}
    <button
      onClick={onRemove}
      className="hover:text-gray-900 transition-colors"
      aria-label="Remove filter"
    >
      <X size={12} />
    </button>
  </span>
);

const CatalogSkeleton = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div
        key={i}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-pulse"
      >
        <div className="h-52 bg-gray-100" />
        <div className="p-4 space-y-3">
          <div className="h-3 w-20 bg-gray-100 rounded" />
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-3 w-3/4 bg-gray-100 rounded" />
          <div className="flex justify-between items-center mt-4">
            <div className="h-5 w-24 bg-gray-100 rounded" />
            <div className="h-9 w-9 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

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

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedType("");
    setSearch("");
    setSearchInput("");
  };

  const hasActiveFilters = selectedCategory || selectedType || search;

  return (
    <div className="space-y-6">
      <PageHeader
        label="Catalog"
        title="Browse our products & services"
        description="Discover our collection of products and services tailored for you"
      />

      {/* Type tabs */}
      <div className="flex gap-2 flex-wrap">
        {TYPE_TABS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setSelectedType(value)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium 
              border transition-all duration-200
              ${
                selectedType === value
                  ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            {Icon && <Icon size={14} />}
            {label}
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <Card padding="md">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search items..."
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all duration-200"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all duration-200 cursor-pointer"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <Button type="submit" variant="primary" size="md">
            Search
          </Button>
        </form>
      </Card>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-gray-500">Active filters:</span>
          {selectedCategory && (
            <FilterChip
              label={
                categories.find((c) => c.id === selectedCategory)?.name ||
                selectedCategory
              }
              onRemove={() => setSelectedCategory("")}
            />
          )}
          {selectedType && (
            <FilterChip
              label={selectedType === "PRODUCT" ? "Products" : "Services"}
              onRemove={() => setSelectedType("")}
            />
          )}
          {search && (
            <FilterChip
              label={`Search: ${search}`}
              onRemove={() => {
                setSearch("");
                setSearchInput("");
              }}
            />
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {getErrorMessage(error)}
        </div>
      )}

      {/* Items grid */}
      {isLoading ? (
        <CatalogSkeleton />
      ) : items.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
              <Package className="h-8 w-8 text-gray-300" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              No items found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Try another category or search term.
            </p>
            {hasActiveFilters && (
              <Button
                variant="secondary"
                size="sm"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear all filters
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => {
            const image = item.media?.[0]?.url ?? null;
            const isService = item.itemType === "SERVICE";
            const isAddingThis = cartPending && cartVars?.itemId === item.id;
            const isOutOfStock = !isService && item.stock === 0;

            return (
              <Card
                key={item.id}
                hoverable
                padding="none"
                className="overflow-hidden group"
              >
                <Link
                  to={`/shop/${item.id}`}
                  className="block relative h-52 bg-gray-100 overflow-hidden"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-300">
                      {isService ? <Wrench size={40} /> : <Package size={40} />}
                    </div>
                  )}

                  <span
                    className={`
                      absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full 
                      text-xs font-semibold border backdrop-blur-sm
                      ${
                        isService
                          ? "bg-violet-50/90 text-violet-700 border-violet-200"
                          : "bg-blue-50/90 text-blue-700 border-blue-200"
                      }
                    `}
                  >
                    {isService ? <Wrench size={12} /> : <Package size={12} />}
                    {isService ? "Service" : "Product"}
                  </span>
                </Link>

                <div className="p-4">
                  {item.category && (
                    <p className="text-xs text-gray-500 mb-1">
                      {item.category.name}
                    </p>
                  )}

                  <Link to={`/shop/${item.id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-gray-700 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>

                  <p className="text-gray-500 text-xs line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-2">
                    <div>
                      <p className="font-bold text-gray-900">
                        ₦{Number(item.price).toLocaleString()}
                      </p>
                      {isOutOfStock && (
                        <p className="text-xs text-red-500 mt-0.5">
                          Out of stock
                        </p>
                      )}
                    </div>

                    {isService ? (
                      <Link to={`/shop/${item.id}`}>
                        <Button variant="primary" size="sm" className="gap-1.5">
                          <CalendarCheck size={14} />
                          Book
                        </Button>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        disabled={isAddingThis || isOutOfStock}
                        className={`
                          rounded-full p-2.5 transition-all duration-200
                          ${
                            isOutOfStock
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-900 text-white hover:bg-gray-700 active:bg-gray-800 shadow-sm"
                          }
                        `}
                        aria-label="Add to cart"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
