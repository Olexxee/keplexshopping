

import { useState } from "react";
import {
  ShoppingCart,
  CalendarCheck,
  Package,
  Wrench,
  Search,
  X,
  Star,
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
  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 border border-brand-200">
    {label}
    <button
      onClick={onRemove}
      className="hover:text-brand-900 transition-colors"
      aria-label="Remove filter"
    >
      <X size={14} />
    </button>
  </span>
);

const CatalogSkeleton = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div
        key={i}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
      >
        <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200" />
        <div className="p-5 space-y-3">
          <div className="h-3 w-16 bg-gray-200 rounded-lg" />
          <div className="h-4 w-full bg-gray-200 rounded-lg" />
          <div className="h-3 w-3/4 bg-gray-200 rounded-lg" />
          <div className="flex justify-between items-center mt-5">
            <div className="h-5 w-20 bg-gray-200 rounded-lg" />
            <div className="h-10 w-10 bg-gray-200 rounded-full" />
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
    <div className="space-y-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-400 via-brand-300 to-brand-200 rounded-3xl p-12 text-white shadow-lg">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-primary">
            Discover Our Collection
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Explore our curated selection of premium products and professional services.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button variant="primary" size="lg">
              Shop Now
            </Button>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <PageHeader
        label="Browse Collection"
        title="Find What You're Looking For"
        description="Filter by type, category, or search for specific items"
      />

      {/* Type tabs */}
      <div className="flex gap-2 flex-wrap">
        {TYPE_TABS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setSelectedType(value)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold
              border-2 transition-all duration-300
              ${
                selectedType === value
                  ? "bg-brand-600 text-white border-brand-600 shadow-lg"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:bg-brand-50"
              }
            `}
          >
            {Icon && <Icon size={16} />}
            {label}
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <Card padding="lg" className="bg-gradient-to-br from-white to-gray-50">
        <form className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 pointer-events-none"
            />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search items by name..."
              className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 text-base outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all duration-200 bg-white"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-4 py-3 text-base bg-white outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all duration-200 cursor-pointer font-medium text-gray-700"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <Button onClick={handleSearch} variant="primary" size="lg" className="md:px-8">
            <Search size={16} className="mr-2" />
            Search
          </Button>
        </form>
      </Card>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex gap-3 flex-wrap items-center bg-brand-50 p-4 rounded-xl border border-brand-200">
          <span className="text-xs font-semibold text-brand-700 uppercase tracking-wide">Active filters:</span>
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
              label={`"${search}"`}
              onRemove={() => {
                setSearch("");
                setSearchInput("");
              }}
            />
          )}
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors ml-auto"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 text-sm rounded-2xl px-6 py-4 font-semibold">
          {getErrorMessage(error)}
        </div>
      )}

      {/* Items grid */}
      {isLoading ? (
        <CatalogSkeleton />
      ) : items.length === 0 ? (
        <Card padding="lg" className="text-center bg-gradient-to-b from-gray-50 to-white">
          <div className="py-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
              <Package className="h-10 w-10 text-brand-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary">
              No items found
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Try adjusting your filters or search for something different.
            </p>
            {hasActiveFilters && (
              <Button
                variant="secondary"
                size="lg"
                onClick={clearFilters}
                className="mt-6"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                className="overflow-hidden group flex flex-col transition-all duration-300 hover:shadow-2xl"
              >
                {/* Product Image */}
                <Link
                  to={`/shop/${item.id}`}
                  className="block relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group-hover:bg-gray-300 transition-colors"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      {isService ? (
                        <Wrench size={48} className="text-gray-300" />
                      ) : (
                        <Package size={48} className="text-gray-300" />
                      )}
                    </div>
                  )}

                  {/* Type Badge */}
                  <span
                    className={`
                      absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                      text-xs font-bold border backdrop-blur-md shadow-lg
                      ${
                        isService
                          ? "bg-brand-100/95 text-brand-700 border-brand-300"
                          : "bg-blue-100/95 text-blue-700 border-blue-300"
                      }
                    `}
                  >
                    {isService ? <Wrench size={14} /> : <Package size={14} />}
                    {isService ? "Service" : "Product"}
                  </span>

                  {/* Star Rating */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-full shadow-lg">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-gray-700">4.8</span>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col">
                  {item.category && (
                    <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-2">
                      {item.category.name}
                    </p>
                  )}

                  <Link to={`/shop/${item.id}`}>
                    <h3 className="font-bold text-primary hover:text-brand-600 transition-colors line-clamp-2 text-base">
                      {item.name}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-xs line-clamp-2 mt-2 leading-relaxed flex-1">
                    {item.description}
                  </p>

                  {/* Footer with price and action */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                    <div>
                      <p className="font-bold text-lg text-brand-600">
                        ₦{Number(item.price).toLocaleString()}
                      </p>
                      {isOutOfStock && (
                        <p className="text-xs text-red-600 font-semibold mt-1">
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
                          rounded-full p-3 transition-all duration-300 transform hover:scale-110
                          ${
                            isOutOfStock
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-lg hover:shadow-xl"
                          }
                        `}
                        aria-label="Add to cart"
                      >
                        <ShoppingCart size={18} />
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
