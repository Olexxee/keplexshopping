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
} from "lucide-react";
import { useItemById } from "../../hooks/useItems";
import { useAddToCart } from "../../hooks/useCart";
import { getErrorMessage } from "../../utils/error";

const META_LABELS: Record<string, { label: string; icon: React.ElementType }> =
  {
    duration: { label: "Duration", icon: Clock },
    location: { label: "Location", icon: MapPin },
    sessions: { label: "Sessions", icon: CalendarCheck },
  };

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
    <div className="space-y-4">
      <Link
        to="/shop"
        className="text-sm text-gray-500 hover:text-gray-900 transition inline-block"
      >
        ← Back to catalog
      </Link>

      {/* Booking toast */}
      {bookingToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg z-50 flex items-center gap-2">
          <CalendarCheck size={16} />
          Contact us to book this service
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {getErrorMessage(error)}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading item...</p>
      ) : !item ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <h2 className="text-lg font-semibold">Item not found</h2>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Images */}
          <section>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-[420px] bg-gray-100">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                    {isService ? <Wrench size={40} /> : <Package size={40} />}
                    <span className="text-sm">No image</span>
                  </div>
                )}
              </div>
            </div>

            {item.media && item.media.length > 1 && (
              <div className="grid grid-cols-5 gap-3 mt-4">
                {item.media.map((m: { id: string; url: string }) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedImage(m.url)}
                    className={`h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      displayImage === m.url
                        ? "border-black"
                        : "border-transparent"
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
          </section>

          {/* Details */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  isService
                    ? "bg-violet-50 text-violet-700 border-violet-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {isService ? <Wrench size={11} /> : <Package size={11} />}
                {isService ? "Service" : "Product"}
              </span>
              <span className="text-sm text-gray-400">
                {item.category?.name}
              </span>
            </div>

            <h1 className="text-3xl font-bold mt-3 leading-tight">
              {item.name}
            </h1>

            <div className="flex items-center gap-3 mt-5">
              <p className="text-3xl font-bold">
                ₦{Number(item.price).toLocaleString()}
              </p>
              {item.itemType === "PRODUCT" && item.compareAtPrice && (
                <p className="text-gray-400 line-through text-lg">
                  ₦{Number(item.compareAtPrice).toLocaleString()}
                </p>
              )}
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {isService ? "What to expect" : "Description"}
              </p>
              <p className="text-gray-600 leading-relaxed text-sm">
                {item.description || "No description provided."}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-1">Status</p>
                <p className="font-semibold capitalize">
                  {item.status.toLowerCase()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                {isService ? (
                  <>
                    <p className="text-gray-500 text-xs mb-1">Availability</p>
                    <p className="font-semibold text-emerald-600">Available</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-xs mb-1">Stock</p>
                    <p
                      className={`font-semibold ${item.stock === 0 ? "text-red-500" : ""}`}
                    >
                      {item.stock === 0 ? "Out of stock" : item.stock}
                    </p>
                  </>
                )}
              </div>
            </div>

            {item.metadata && (
              <div className="mt-4 bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-sm mb-3">Details</p>
                <div className="space-y-2 text-sm">
                  {Object.entries(item.metadata).map(([key, value]) => {
                    const meta = META_LABELS[key];
                    const Icon = meta?.icon;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-4"
                      >
                        <span className="text-gray-500 flex items-center gap-1.5">
                          {Icon && <Icon size={13} />}
                          {meta?.label ?? key}
                        </span>
                        <span className="font-medium">
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

            <div className="mt-6">
              {isService ? (
                <button
                  onClick={handleBookNow}
                  disabled={item.status !== "ACTIVE"}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 font-semibold disabled:opacity-60 transition"
                >
                  <CalendarCheck size={18} />
                  Book Now
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-full">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-3 hover:bg-gray-50 rounded-full transition"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="px-4 font-semibold text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-3 hover:bg-gray-50 rounded-full transition"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={
                      cartLoading || isOutOfStock || item.status !== "ACTIVE"
                    }
                    className="flex-1 bg-black hover:bg-gray-800 text-white rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 font-semibold disabled:opacity-60 transition"
                  >
                    <ShoppingCart size={18} />
                    {isOutOfStock
                      ? "Out of stock"
                      : cartLoading
                        ? "Adding..."
                        : "Add to cart"}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
