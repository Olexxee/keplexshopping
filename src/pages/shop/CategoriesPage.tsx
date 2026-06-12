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
  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber text-white shadow-amber">
    {label}
    <button
      onClick={onRemove}
      className="hover:opacity-80 transition-opacity"
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
        className="bg-card rounded-xl border border-border shadow-md overflow-hidden animate-pulse"
      >
        <div className="h-56 bg-muted/50" />
        <div className="p-5 space-y-3">
          <div className="h-3 w-16 bg-muted/50 rounded" />
          <div className="h-4 w-full bg-muted/50 rounded" />
          <div className="h-3 w-3/4 bg-muted/50 rounded" />
          <div className="flex justify-between items-center mt-5">
            <div className="h-5 w-20 bg-muted/50 rounded" />
            <div className="h-10 w-10 bg-muted/50 rounded-lg" />
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
      <PageHeader
        label="Shop"
        title="Browse Products & Services"
        description="Discover our full collection of premium products and professional services"
      />

      {/* Type tabs */}
      <div className="flex gap-3 flex-wrap">
        {TYPE_TABS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setSelectedType(value)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm
              border-2 transition-all duration-200
              ${
                selectedType === value
                  ? "bg-amber text-white border-amber shadow-amber"
                  : "bg-card text-foreground border-border hover:border-amber/50 hover:text-amber"
              }
            `}
          >
            {Icon && <Icon size={16} />}
            {label}
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <Card padding="lg">
        <form className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products and services..."
              className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-input bg-background px-4 py-2.5 text-foreground outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200 cursor-pointer font-medium"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <Button onClick={handleSearch} variant="primary" size="md">
            <Search size={16} className="mr-2" />
            Search
          </Button>
        </form>
      </Card>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex gap-3 flex-wrap items-center bg-amber/5 p-4 rounded-lg border border-amber/10">
          <span className="text-xs font-bold text-amber uppercase tracking-wider">Active filters:</span>
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
            className="text-xs font-bold text-amber hover:text-amber-light transition-colors ml-auto"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-6 py-4 font-medium">
          {getErrorMessage(error)}
        </div>
      )}

      {/* Items grid */}
      {isLoading ? (
        <CatalogSkeleton />
      ) : items.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="py-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber/10">
              <Package className="h-10 w-10 text-amber" />
            </div>
            <h2 className="font-display text-display-sm text-foreground">
              No items found
            </h2>
            <p className="mt-3 text-muted-foreground">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="lg"
                onClick={clearFilters}
                className="mt-6"
              >
                Clear Filters
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
                className="overflow-hidden flex flex-col"
              >
                {/* Product Image */}
                <Link
                  to={`/shop/${item.id}`}
                  className="block relative h-56 bg-muted/30 overflow-hidden group"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-card">
                      {isService ? (
                        <Wrench size={48} className="text-muted-foreground" />
                      ) : (
                        <Package size={48} className="text-muted-foreground" />
                      )}
                    </div>
                  )}

                  {/* Type Badge */}
                  <span
                    className={`
                      absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold shadow-md
                      ${
                        isService
                          ? "bg-amber text-white"
                          : "bg-amber-dark text-white"
                      }
                    `}
                  >
                    {isService ? <Wrench size={12} /> : <Package size={12} />}
                    {isService ? "Service" : "Product"}
                  </span>
                </Link>

                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col">
                  {item.category && (
                    <p className="text-xs font-bold text-amber uppercase tracking-wider mb-2">
                      {item.category.name}
                    </p>
                  )}

                  <Link to={`/shop/${item.id}`}>
                    <h3 className="font-display font-semibold text-foreground hover:text-amber transition-colors line-clamp-2 text-base">
                      {item.name}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground text-sm line-clamp-2 mt-2 leading-relaxed flex-1">
                    {item.description}
                  </p>

                  {/* Footer with price and action */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                    <div>
                      <p className="font-display font-bold text-lg text-amber">
                        ₦{Number(item.price).toLocaleString()}
                      </p>
                      {isOutOfStock && (
                        <p className="text-xs text-destructive font-bold mt-1">
                          Out of stock
                        </p>
                      )}
                    </div>

                    {isService ? (
                      <Link to={`/shop/${item.id}`}>
                        <Button variant="primary" size="sm" className="gap-1.5 shadow-amber hover:shadow-glow">
                          <CalendarCheck size={14} />
                          Book
                        </Button>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        disabled={isAddingThis || isOutOfStock}
                        className={`
                          rounded-lg p-2.5 transition-all duration-200 flex items-center justify-center
                          ${
                            isOutOfStock
                              ? "bg-muted text-muted-foreground cursor-not-allowed"
                              : "bg-amber text-white hover:bg-amber-light hover:shadow-glow active:scale-95"
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