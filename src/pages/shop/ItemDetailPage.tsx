import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Minus,
  Plus,
  ShoppingCart,
  CalendarCheck,
  Package,
  Wrench,
  Clock,
  MapPin,
  ChevronLeft,
  CheckCircle,
  Truck,
  Shield,
} from "lucide-react";
import { useItemById } from "../../hooks/useItems";
import { useAddToCart } from "../../hooks/useCart";
import { getErrorMessage } from "../../utils/error";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const META_LABELS: Record<string, { label: string; icon: React.ElementType }> =
  {
    duration: { label: "Duration", icon: Clock },
    location: { label: "Location", icon: MapPin },
    sessions: { label: "Sessions", icon: CalendarCheck },
  };

const features = [
  { icon: Truck, text: "Free Shipping on orders over ₦50,000" },
  { icon: Shield, text: "Secure Payment Guaranteed" },
  { icon: CheckCircle, text: "30-Day Return Policy" },
];

export const ItemDetailPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { data: item, isLoading, error } = useItemById(itemId ?? "");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [bookingToast, setBookingToast] = useState(false);

  const { mutate: addToCart, isPending: cartLoading } = useAddToCart();

  const isService = item?.itemType === "SERVICE";
  const isOutOfStock = item?.itemType === "PRODUCT" && (item?.stock ?? 0) <= 0;
  const displayImage = selectedImage ?? item?.media?.[0]?.url ?? null;

  const handleQuantityChange = (next: number) => {
    if (next < 1) return;
    if (item?.itemType === "PRODUCT" && item.stock && next > item.stock) return;
    setQuantity(next);
  };

  const handleAddToCart = () => {
    if (!item) return;
    addToCart(
      { itemId: item.id, quantity },
      { onError: (err) => alert(getErrorMessage(err)) },
    );
  };

  const handleBookNow = () => {
    setBookingToast(true);
    setTimeout(() => setBookingToast(false), 3000);
  };

  return (
    <div className="space-y-6 py-8">
      {/* Back Button */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-amber transition-colors duration-200 group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Back to catalog</span>
      </Link>

      {/* Booking toast */}
      {bookingToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-amber text-white text-sm px-5 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-slide-in">
          <CalendarCheck size={16} />
          Contact us to book this service
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-6 py-4">
          {getErrorMessage(error)}
        </div>
      )}

      {isLoading ? (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <div className="h-[420px] rounded-xl bg-muted animate-pulse" />
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          </div>
          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="h-6 w-24 bg-muted rounded animate-pulse" />
            <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-muted rounded animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      ) : !item ? (
        <Card className="py-16 text-center">
          <div className="mx-auto max-w-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber/10">
              <Package size={32} className="text-amber" />
            </div>
            <h2 className="font-display text-display-sm text-foreground">
              Item not found
            </h2>
            <p className="text-muted-foreground mt-2">
              The item you're looking for doesn't exist or has been removed.
            </p>
            <Button variant="primary" asChild className="mt-6">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden">
              <div className="h-[420px] bg-muted/30">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                    {isService ? <Wrench size={48} /> : <Package size={48} />}
                    <span className="text-sm">No image available</span>
                  </div>
                )}
              </div>
            </div>

            {item.media && item.media.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {item.media.map((m: { id: string; url: string }) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedImage(m.url)}
                    className={`h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      displayImage === m.url
                        ? "border-amber shadow-amber"
                        : "border-border hover:border-amber/50"
                    }`}
                  >
                    <img
                      src={m.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <Card className="p-6">
              {/* Type Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    isService
                      ? "bg-amber/10 text-amber border border-amber/20"
                      : "bg-amber/10 text-amber border border-amber/20"
                  }`}
                >
                  {isService ? <Wrench size={12} /> : <Package size={12} />}
                  {isService ? "Service" : "Product"}
                </span>
                {item.category && (
                  <span className="text-xs text-muted-foreground">
                    {item.category.name}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-display text-display-md text-foreground mt-2 leading-tight">
                {item.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mt-5">
                <p className="font-display text-3xl font-bold text-amber">
                  ₦{Number(item.price).toLocaleString()}
                </p>
                {item.itemType === "PRODUCT" && item.compareAtPrice && (
                  <p className="text-muted-foreground line-through text-lg">
                    ₦{Number(item.compareAtPrice).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mt-6">
                <p className="text-xs font-semibold text-amber uppercase tracking-wider mb-2">
                  {isService ? "What to expect" : "Description"}
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {item.description || "No description provided."}
                </p>
              </div>

              {/* Status & Stock */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-1">Status</p>
                  <p className="font-semibold text-foreground capitalize">
                    {item.status.toLowerCase()}
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  {isService ? (
                    <>
                      <p className="text-muted-foreground text-xs mb-1">Availability</p>
                      <p className="font-semibold text-green-600">Available</p>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground text-xs mb-1">Stock</p>
                      <p
                        className={`font-semibold ${
                          item.stock === 0 ? "text-destructive" : "text-foreground"
                        }`}
                      >
                        {item.stock === 0 ? "Out of stock" : `${item.stock} units`}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Metadata Details */}
              {item.metadata && Object.keys(item.metadata).length > 0 && (
                <div className="mt-4 bg-muted/30 rounded-lg p-4">
                  <p className="font-semibold text-sm text-foreground mb-3">Details</p>
                  <div className="space-y-2 text-sm">
                    {Object.entries(item.metadata).map(([key, value]) => {
                      const meta = META_LABELS[key];
                      const Icon = meta?.icon;
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-4"
                        >
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            {Icon && <Icon size={13} />}
                            {meta?.label ?? key}
                          </span>
                          <span className="font-medium text-foreground">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6">
                {isService ? (
                  <Button
                    onClick={handleBookNow}
                    disabled={item.status !== "ACTIVE"}
                    fullWidth
                    size="lg"
                    className="gap-2"
                  >
                    <CalendarCheck size={18} />
                    Book Now
                  </Button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-full bg-card">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="p-3 hover:bg-muted rounded-full transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus size={15} className="text-foreground" />
                      </button>
                      <span className="px-4 font-semibold text-sm text-foreground min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="p-3 hover:bg-muted rounded-full transition-colors"
                        disabled={isOutOfStock || (item.stock ? quantity >= item.stock : false)}
                      >
                        <Plus size={15} className="text-foreground" />
                      </button>
                    </div>
                    <Button
                      onClick={handleAddToCart}
                      disabled={
                        cartLoading || isOutOfStock || item.status !== "ACTIVE"
                      }
                      fullWidth
                      size="lg"
                      className="gap-2"
                    >
                      <ShoppingCart size={18} />
                      {isOutOfStock
                        ? "Out of stock"
                        : cartLoading
                          ? "Adding..."
                          : "Add to cart"}
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Features Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border"
                >
                  <feature.icon size={18} className="text-amber shrink-0" />
                  <p className="text-xs text-muted-foreground">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};