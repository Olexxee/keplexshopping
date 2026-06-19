import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, UserCircle, Menu, X, Search } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useMe } from "../../hooks/useAuth";
import { useLogout } from "../../hooks/useAuth";

export const StoreHeader = () => {
  const { data: user } = useMe();
  const { data: cart } = useCart();
  const cartCount = cart?.totalItems ?? 0;
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const badgeCount = cartCount > 99 ? "99+" : cartCount.toString();


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMobileSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        {/* Main Header Row */}
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 h-16">
            {/* Logo - Left */}
            <Link to="/shop" className="flex items-center gap-3 group shrink-0">
              <div className="h-9 w-9 rounded-lg bg-gradient-amber flex items-center justify-center shadow-amber group-hover:shadow-glow transition-all duration-300">
                <span className="text-white font-display font-bold text-lg">
                  K
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="font-display font-semibold text-xl tracking-tight text-foreground group-hover:text-amber transition-colors duration-300">
                  Keplex
                </p>
                <p className="text-xs text-muted-foreground">
                  Modern Marketplace
                </p>
              </div>
            </Link>

            {/* Search Bar - Desktop (Centered) */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-xl mx-8"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2.5 pl-11 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted-foreground hover:text-amber hover:bg-muted transition-colors"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search Icon - Mobile */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted hover:text-amber transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative group p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ShoppingCart
                  size={22}
                  className="text-foreground group-hover:text-amber transition-colors duration-200"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-amber text-white text-[10px] flex items-center justify-center font-medium shadow-amber">
                    {badgeCount}
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
                  <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-lg py-1.5 z-50 animate-zoom-in">
                    <div className="p-4 border-b border-border bg-gradient-subtle">
                      <h3 className="font-display font-semibold text-foreground">
                        {user?.fullName || "Guest User"}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {user?.email || "Not signed in"}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-amber transition-colors duration-200"
                    >
                      <UserCircle size={15} />
                      Profile
                    </Link>

                    <button
                      onClick={() => logout()}
                      disabled={loggingOut}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-200 disabled:opacity-50"
                    >
                      <LogOut size={15} />
                      {loggingOut ? "Signing out..." : "Sign out"}
                    </button>
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

          {/* Mobile Search Bar */}
          {mobileSearchOpen && (
            <div className="md:hidden py-3 border-t border-border animate-slide-in">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2.5 pl-10 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber text-white rounded-full hover:bg-amber-light transition-colors font-medium"
                >
                  Search
                </button>
              </form>
            </div>
          )}
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
                  <div className="px-4 py-3 mb-2">
                    <p className="font-display font-semibold text-foreground">
                      {user.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted hover:text-amber transition-colors"
                  >
                    <UserCircle size={20} />
                    Profile
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