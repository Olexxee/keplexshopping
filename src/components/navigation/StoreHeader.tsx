import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { 
  ShoppingCart, User, LogOut, UserCircle, Menu, X, 
  Heart, LayoutDashboard, Settings, Bell, Shield, Award,
  Package, MapPin, CreditCard, CheckCircle, XCircle,
  AlertCircle, Loader2
} from "lucide-react";
import { useMe } from "../../hooks/useAuth";
import { useLogout } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { 
  useNotifications, 
  useUnreadNotifications,  // Changed from useUnreadCount
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification
} from "../../hooks/useNotifications";
import { getErrorMessage } from "../../utils/error";

export const StoreHeader = () => {
  const { data: user } = useMe();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { data: cart } = useCart();
  
  // Notification hooks - use the correct names
  const { data: notifications = [], isLoading: notificationsLoading } = useNotifications();
  const { data: unreadCount = 0, refetch: refetchUnread } = useUnreadNotifications(); // Changed from useUnreadCount
  const { mutate: markRead, isPending: markingRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: markingAllRead } = useMarkAllNotificationsRead();
  const { mutate: deleteNotif, isPending: deletingNotif } = useDeleteNotification();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const cartCount = cart?.totalItems ?? 0;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Refetch unread count when notifications are opened
  useEffect(() => {
    if (notificationsOpen) {
      refetchUnread();
    }
  }, [notificationsOpen, refetchUnread]);

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case "success":
      case "order_delivered":
      case "payment_received":
        return <CheckCircle size={14} className="text-green-500" />;
      case "info":
        return <AlertCircle size={14} className="text-blue-500" />;
      case "promo":
      case "flash_sale":
        return <Shield size={14} className="text-amber" />;
      case "warning":
        return <AlertCircle size={14} className="text-orange-500" />;
      case "error":
        return <XCircle size={14} className="text-red-500" />;
      default:
        return <Bell size={14} className="text-muted-foreground" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch(type) {
      case "success":
      case "order_delivered":
      case "payment_received":
        return "bg-green-500/10";
      case "info":
        return "bg-blue-500/10";
      case "promo":
      case "flash_sale":
        return "bg-amber/10";
      case "warning":
        return "bg-orange-500/10";
      case "error":
        return "bg-red-500/10";
      default:
        return "bg-muted/30";
    }
  };

  const handleMarkRead = (id: string) => {
    markRead(id, {
      onSuccess: () => {
        refetchUnread();
      },
      onError: (err) => {
        console.error("Failed to mark notification as read:", err);
      }
    });
  };

  const handleMarkAllRead = () => {
    markAllRead(undefined, {
      onSuccess: () => {
        refetchUnread();
      },
      onError: (err) => {
        console.error("Failed to mark all notifications as read:", err);
      }
    });
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotif(id, {
      onSuccess: () => {
        refetchUnread();
      },
      onError: (err) => {
        console.error("Failed to delete notification:", err);
      }
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 h-16">
            {/* Logo - Left */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="h-9 w-9 rounded-lg bg-gradient-amber flex items-center justify-center shadow-amber group-hover:shadow-glow transition-all duration-300">
                <span className="text-white font-display font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                  K
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="font-display font-semibold text-xl tracking-tight text-foreground group-hover:text-amber transition-colors duration-300">
                  Keplex
                </p>
                <p className="text-xs text-muted-foreground group-hover:text-amber/70 transition-colors">
                  Modern Marketplace
                </p>
              </div>
            </Link>

            {/* Navigation - Center */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink 
                to="/shop" 
                className={({ isActive }) => 
                  `font-medium transition-all duration-200 ${
                    isActive 
                      ? "text-amber border-b-2 border-amber pb-1" 
                      : "text-foreground hover:text-amber hover:border-b-2 hover:border-amber/50 pb-1"
                  }`
                }
              >
                Shop
              </NavLink>
              <NavLink 
                to="/cart" 
                className={({ isActive }) => 
                  `font-medium transition-all duration-200 ${
                    isActive 
                      ? "text-amber border-b-2 border-amber pb-1" 
                      : "text-foreground hover:text-amber hover:border-b-2 hover:border-amber/50 pb-1"
                  }`
                }
              >
                Cart
              </NavLink>
              <NavLink 
                to="/orders" 
                className={({ isActive }) => 
                  `font-medium transition-all duration-200 ${
                    isActive 
                      ? "text-amber border-b-2 border-amber pb-1" 
                      : "text-foreground hover:text-amber hover:border-b-2 hover:border-amber/50 pb-1"
                  }`
                }
              >
                Orders
              </NavLink>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative hidden md:block" ref={notificationRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={20} className="text-foreground hover:text-amber transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-medium animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 max-h-[500px] bg-card border border-border rounded-xl shadow-lg z-50 animate-zoom-in overflow-hidden">
                    <div className="p-4 border-b border-border bg-gradient-subtle">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-semibold text-foreground">Notifications</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={handleMarkAllRead}
                            disabled={markingAllRead}
                            className="text-xs text-amber hover:text-amber-light transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {markingAllRead ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : null}
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-[350px] overflow-y-auto">
                      {notificationsLoading ? (
                        <div className="p-8 text-center">
                          <Loader2 size={32} className="mx-auto text-amber animate-spin mb-3" />
                          <p className="text-sm text-muted-foreground">Loading notifications...</p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell size={32} className="mx-auto text-muted-foreground mb-3" />
                          <p className="text-sm text-muted-foreground">No notifications yet</p>
                          <p className="text-xs text-muted-foreground mt-1">We'll notify you when something happens</p>
                        </div>
                      ) : (
                        notifications.map((notif: any) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer group ${
                              !notif.read ? "bg-amber/5" : ""
                            }`}
                            onClick={() => {
                              if (!notif.read) {
                                handleMarkRead(notif.id);
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`h-8 w-8 rounded-full ${getNotificationColor(notif.type)} flex items-center justify-center shrink-0`}>
                                {getNotificationIcon(notif.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm font-semibold text-foreground">
                                    {notif.title}
                                  </p>
                                  {!notif.read && (
                                    <span className="h-2 w-2 rounded-full bg-amber shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {notif.message}
                                </p>
                                <div className="flex items-center justify-between mt-1.5">
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(notif.createdAt)}
                                  </p>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNotification(notif.id);
                                    }}
                                    disabled={deletingNotif}
                                    className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                  >
                                    <XCircle size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="p-3 border-t border-border bg-muted/30">
                      <Link
                        to="/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="block text-center text-sm text-amber hover:text-amber-light transition-colors"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Icon */}
              <Link to="/cart" className="relative group p-2 rounded-lg hover:bg-muted transition-colors">
                <ShoppingCart size={22} className="text-foreground group-hover:text-amber transition-colors duration-200" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber text-white text-[10px] flex items-center justify-center font-medium shadow-amber animate-zoom-in">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* User Avatar + Dropdown (Desktop) */}
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="h-10 w-10 rounded-full bg-gradient-amber text-white font-display font-semibold shadow-amber hover:shadow-glow hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  {user?.fullName ? (
                    user.fullName.charAt(0).toUpperCase()
                  ) : (
                    <User size={18} />
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-lg py-1.5 z-50 animate-zoom-in">
                    {/* User Info Section */}
                    <div className="p-4 border-b border-border bg-gradient-subtle">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-amber flex items-center justify-center shadow-amber">
                          <span className="text-white font-display font-bold text-lg">
                            {user?.fullName?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display font-semibold text-foreground">
                            {user?.fullName || "Guest User"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {user?.email || "Not signed in"}
                          </p>
                          {user?.isVerified && (
                            <span className="inline-flex items-center gap-1 mt-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                              <Shield size={10} />
                              Verified Account
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Account Navigation */}
                    <div className="py-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-amber transition-colors duration-200"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-amber transition-colors duration-200"
                      >
                        <UserCircle size={16} />
                        Profile
                      </Link>
                      
                      <Link
                        to="/wishlist"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-amber transition-colors duration-200"
                      >
                        <Heart size={16} />
                        Wishlist
                      </Link>
                      
                      <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-amber transition-colors duration-200"
                      >
                        <Package size={16} />
                        My Orders
                      </Link>
                      
                      <Link
                        to="/addresses"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-amber transition-colors duration-200"
                      >
                        <MapPin size={16} />
                        Addresses
                      </Link>
                    </div>

                    <div className="border-t border-border my-1" />

                    {/* Settings & Logout */}
                    <div className="py-2">
                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-amber transition-colors duration-200"
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                      
                      <button
                        onClick={() => logout()}
                        disabled={loggingOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-200 disabled:opacity-50"
                      >
                        <LogOut size={16} />
                        {loggingOut ? "Signing out..." : "Sign out"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted hover:text-amber transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background md:hidden animate-slide-in overflow-y-auto">
          <nav className="flex flex-col p-6 space-y-4">
            <NavLink
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-amber/10 text-amber border-l-4 border-amber"
                    : "text-foreground hover:bg-muted hover:text-amber"
                }`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-amber/10 text-amber border-l-4 border-amber"
                    : "text-foreground hover:bg-muted hover:text-amber"
                }`
              }
            >
              Cart
            </NavLink>
            <NavLink
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-amber/10 text-amber border-l-4 border-amber"
                    : "text-foreground hover:bg-muted hover:text-amber"
                }`
              }
            >
              Orders
            </NavLink>

            <div className="border-t border-border my-4 pt-4">
              {/* Mobile User Section */}
              {user ? (
                <>
                  <div className="px-4 py-3 mb-2 bg-gradient-subtle rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-amber flex items-center justify-center">
                        <span className="text-white font-display font-bold">
                          {user.fullName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-display font-semibold text-foreground">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted hover:text-amber transition-colors"
                  >
                    <LayoutDashboard size={20} />
                    Dashboard
                  </Link>
                  
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted hover:text-amber transition-colors"
                  >
                    <UserCircle size={20} />
                    Profile
                  </Link>
                  
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted hover:text-amber transition-colors"
                  >
                    <Heart size={20} />
                    Wishlist
                  </Link>
                  
                  <Link
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted hover:text-amber transition-colors"
                  >
                    <Settings size={20} />
                    Settings
                  </Link>
                  
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    disabled={loggingOut}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                  >
                    <LogOut size={20} />
                    {loggingOut ? "Signing out..." : "Sign out"}
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center bg-amber text-white rounded-lg hover:bg-amber-light transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center border border-amber text-amber rounded-lg hover:bg-amber/10 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};