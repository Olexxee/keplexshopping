import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Shield,
  Truck,
  Star,
  Clock,
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  Gift,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useItems } from '../hooks/useItems';
import { useCategories } from '../hooks/useCategories';
import { Skeleton } from '../components/ui/skeleton';

// Hero images
const heroImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200';
const heroImage2 = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200';

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function useShuffledProducts<T>(products: T[] | undefined, count: number, intervalMs = 20000) {
  const [displayed, setDisplayed] = useState<T[]>([]);
  const [fading, setFading] = useState(false);
  const nextRef = useRef<T[]>([]);

  const shuffle = useCallback(() => {
    if (!products || products.length === 0) return;
    const shuffled = shuffleArray(products);
    return shuffled.slice(0, count);
  }, [products, count]);

  useEffect(() => {
    const initial = shuffle();
    if (initial) setDisplayed(initial);
  }, [shuffle]);

  useEffect(() => {
    if (!products || products.length <= count) return;
    const timer = setInterval(() => {
      const next = shuffle();
      if (!next) return;
      nextRef.current = next;
      setFading(true);
      setTimeout(() => {
        setDisplayed(nextRef.current);
        setFading(false);
      }, 500);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [products, count, intervalMs, shuffle]);

  return { displayed, fading };
}

// Skeletons
const ProductCardSkeleton = () => (
  <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
    <Skeleton className="aspect-[3/4] w-full" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-6 w-28 mt-2" />
    </div>
  </div>
);

const CategorySkeleton = () => (
  <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
    <Skeleton className="absolute inset-0" />
  </div>
);

// ProductCard Component
const ProductCard = ({ product, featured = false }: any) => {
  const image = product.media?.[0]?.url;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/shop/${product.id}`} className="block">
        <div className={`bg-card rounded-xl border border-border/50 overflow-hidden transition-all duration-500 ${
          isHovered ? 'shadow-2xl -translate-y-2' : 'shadow-md hover:shadow-lg'
        }`}>
          {/* Image Container */}
          <div className="relative aspect-[3/4] bg-muted/30 overflow-hidden">
            {featured && (
              <div className="absolute top-3 left-3 z-10">
                <span className="px-3 py-1 text-xs font-bold text-white bg-amber rounded-full shadow-lg">
                  Featured
                </span>
              </div>
            )}
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/20">
                <Package size={48} />
              </div>
            )}
            
            {/* Quick View Button */}
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <Button variant="primary" size="sm" className="shadow-lg">
                Quick View
                <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-amber uppercase tracking-wider">
                {product.category?.name || 'Product'}
              </p>
              <div className="flex items-center gap-0.5">
                <Star size={12} className="fill-amber text-amber" />
                <span className="text-xs text-muted-foreground">4.5</span>
              </div>
            </div>
            <h3 className="font-display font-semibold text-foreground group-hover:text-amber transition-colors line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <p className="font-display font-bold text-lg text-foreground">
                ₦{Number(product.price).toLocaleString()}
              </p>
              {product.compareAtPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  ₦{Number(product.compareAtPrice).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Features data
const features = [
  { icon: Truck, title: "Free Shipping", description: "On orders over ₦50,000" },
  { icon: Shield, title: "Secure Payment", description: "100% secure transactions" },
  { icon: Award, title: "Quality Guarantee", description: "30-day return policy" },
  { icon: TrendingUp, title: "Best Prices", description: "Price match guarantee" },
];

// Stats data
const stats = [
  { label: "Happy Customers", value: "50K+", icon: Users },
  { label: "Products Sold", value: "100K+", icon: ShoppingBag },
  { label: "Total Revenue", value: "₦500M+", icon: DollarSign },
  { label: "5-Star Reviews", value: "4.8/5", icon: Star },
];

// Testimonials
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fashion Enthusiast",
    content: "Absolutely love the quality of their products! The attention to detail is unmatched.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    name: "Michael Okonkwo",
    role: "Business Owner",
    content: "The best online shopping experience in Nigeria. Fast delivery and great customer service.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    name: "Chioma Eze",
    role: "Style Influencer",
    content: "I have been shopping here for years and I am always impressed by the quality and variety.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/2.jpg"
  },
];

export const HomePage = () => {
  const { data: items = [], isLoading: loadingItems } = useItems({ status: 'ACTIVE' });
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { displayed: displayedBestSellers, fading: fadingBest } = useShuffledProducts(items, 4, 20000);
  const { displayed: displayedFeatured, fading: fadingFeatured } = useShuffledProducts(items, 4, 25000);
  const { displayed: displayedNewArrivals, fading: fadingNew } = useShuffledProducts(items, 4, 30000);

  // Hero slides
  const heroSlides = [
    {
      image: heroImage,
      title: "We Sell Quality",
      subtitle: "Premium Footwear & Luxury Attire",
      description: "Discover our curated collection of premium footwear and luxury attire.",
      cta: "Shop Now"
    },
    {
      image: heroImage2,
      title: "New Collection",
      subtitle: "Summer 2024",
      description: "Explore our latest collection of premium footwear and luxury attire.",
      cta: "Explore Now"
    }
  ];

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] sm:min-h-[100vh] flex items-center justify-center overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/60 to-black/70" />
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-8 bg-amber' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber/10 border border-amber/20 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber" />
              <span className="text-amber text-xs sm:text-sm font-medium tracking-wide">
                Footies & Luxury Wears
              </span>
            </div>
            
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] sm:leading-[1.05] animate-fade-in-up">
              <span className="text-white">We Sell</span>{' '}
              <span className="bg-gradient-amber bg-clip-text text-transparent">Quality</span>
            </h1>
            
            <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed animate-fade-in-up stagger-2">
              Discover our curated collection of premium footwear and luxury attire, 
              crafted for those who demand excellence in every detail.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 animate-fade-in-up stagger-3">
              <Button variant="primary" size="lg" className="w-full sm:w-auto group shadow-amber hover:shadow-glow" asChild>
                <Link to="/shop">
                  Shop Now
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20" asChild>
                <Link to="/shop">Explore Collection</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in stagger-5">
          <span className="text-xs uppercase tracking-widest text-white/60">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-amber to-transparent" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-amber/5 border-y border-amber/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="h-5 w-5 text-amber group-hover:scale-110 transition-transform" />
                  <p className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all duration-300 group">
                <div className="h-12 w-12 rounded-full bg-amber/10 flex items-center justify-center group-hover:bg-amber/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-amber" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber/10 text-amber text-xs sm:text-sm font-medium uppercase tracking-widest mb-4">
              Shop by Category
            </span>
            <h2 className="font-display text-2xl sm:text-display-sm md:text-display-md font-bold text-foreground">
              Featured Categories
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Explore our curated collection of premium categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {loadingCategories ? (
              Array.from({ length: 4 }).map((_, i) => <CategorySkeleton key={i} />)
            ) : (
              categories?.slice(0, 8).map((category: any, i: number) => (
                <Link 
                  key={category.slug} 
                  to={`/shop?category=${category.slug}`} 
                  className="group relative aspect-[3/4] bg-card rounded-xl overflow-hidden shadow-md hover:shadow-amber/20 transition-all duration-500 animate-fade-in-up" 
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {category.image_url && (
                    <img 
                      src={category.image_url} 
                      alt={category.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110" 
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h3 className="font-display text-base sm:text-xl font-semibold text-white group-hover:text-amber transition-colors duration-300 mb-0.5 sm:mb-1">
                      {category.name}
                    </h3>
                    {category.product_count !== undefined && (
                      <p className="text-xs text-white/70 mb-2">{category.product_count} products</p>
                    )}
                    <span className="text-xs sm:text-sm text-white/80 flex items-center gap-1 sm:gap-2 group-hover:text-amber transition-colors duration-300">
                      Explore 
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="flex justify-center mt-8 sm:mt-12">
            <Button variant="outline" size="default" asChild className="group">
              <Link to="/shop">
                View All Categories
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-16 gap-4 sm:gap-6">
            <div>
              <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-amber/10 text-amber text-xs sm:text-sm font-medium uppercase tracking-widest mb-3 sm:mb-4">
                Popular
              </span>
              <h2 className="font-display text-2xl sm:text-display-sm md:text-display-md font-bold text-foreground">Best Sellers</h2>
              <p className="text-muted-foreground mt-2">Our most loved products this season</p>
            </div>
            <Button variant="outline" size="sm" asChild className="group">
              <Link to="/shop?sort=bestselling">
                View All
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ml-2" />
              </Link>
            </Button>
          </div>

          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 transition-all duration-500 ease-in-out ${fadingBest ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            {loadingItems ? (
              Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              displayedBestSellers.map((product: any) => <ProductCard key={product.id} product={product} />)
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-16 gap-4 sm:gap-6">
            <div>
              <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-amber/10 text-amber text-xs sm:text-sm font-medium uppercase tracking-widest mb-3 sm:mb-4">
                New Arrivals
              </span>
              <h2 className="font-display text-2xl sm:text-display-sm md:text-display-md font-bold text-foreground">Featured Collection</h2>
              <p className="text-muted-foreground mt-2">Fresh styles just added</p>
            </div>
            <Button variant="outline" size="sm" asChild className="group">
              <Link to="/shop?sort=newest">
                View All
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ml-2" />
              </Link>
            </Button>
          </div>

          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 transition-all duration-500 ease-in-out ${fadingFeatured ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            {loadingItems ? (
              Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              displayedFeatured.map((product: any) => <ProductCard key={product.id} product={product} featured />)
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-16 gap-4 sm:gap-6">
            <div>
              <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-amber/10 text-amber text-xs sm:text-sm font-medium uppercase tracking-widest mb-3 sm:mb-4">
                Just In
              </span>
              <h2 className="font-display text-2xl sm:text-display-sm md:text-display-md font-bold text-foreground">New Arrivals</h2>
              <p className="text-muted-foreground mt-2">The latest additions to our collection</p>
            </div>
            <Button variant="outline" size="sm" asChild className="group">
              <Link to="/shop?sort=newest">
                View All
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ml-2" />
              </Link>
            </Button>
          </div>

          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 transition-all duration-500 ease-in-out ${fadingNew ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            {loadingItems ? (
              Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              displayedNewArrivals.map((product: any) => <ProductCard key={product.id} product={product} />)
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber/10 text-amber text-xs sm:text-sm font-medium uppercase tracking-widest mb-4">
              Testimonials
            </span>
            <h2 className="font-display text-2xl sm:text-display-sm md:text-display-md font-bold text-foreground">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Real reviews from real customers who love our products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} hoverable className="p-6 text-center group">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full overflow-hidden mb-4 ring-2 ring-amber/20 group-hover:ring-amber/40 transition-all">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-amber rounded-full p-1">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} size={16} className="fill-amber text-amber" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <p className="font-semibold text-foreground mt-4">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 sm:py-24 bg-gradient-amber relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:40px_40px]" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur mb-6">
              <Gift size={16} className="text-white" />
              <span className="text-white text-xs font-medium tracking-wide">Exclusive Offers</span>
            </div>
            <h2 className="font-display text-2xl sm:text-display-sm font-bold text-white mb-4">
              Stay in the Loop
            </h2>
            <p className="text-white/90 mb-8">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg px-5 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button variant="primary" className="bg-white text-amber hover:bg-white/90 shadow-lg group">
                Subscribe
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </form>
            <p className="text-white/70 text-xs mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-lg bg-gradient-amber flex items-center justify-center">
                  <span className="text-white font-display font-bold text-lg">K</span>
                </div>
                <span className="font-display font-semibold text-xl text-foreground">Keplex</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium footwear and luxury attire for those who demand excellence.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="#" className="p-2 rounded-lg bg-muted/30 text-muted-foreground hover:text-amber hover:bg-amber/10 transition-colors">
                  <FaFacebookF size={18} />
                </a>
                <a href="#" className="p-2 rounded-lg bg-muted/30 text-muted-foreground hover:text-amber hover:bg-amber/10 transition-colors">
                  <FaTwitter size={18} />
                </a>
                <a href="#" className="p-2 rounded-lg bg-muted/30 text-muted-foreground hover:text-amber hover:bg-amber/10 transition-colors">
                  <FaInstagram size={18} />
                </a>
                <a href="#" className="p-2 rounded-lg bg-muted/30 text-muted-foreground hover:text-amber hover:bg-amber/10 transition-colors">
                  <FaYoutube size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/shop" className="text-muted-foreground hover:text-amber transition-colors flex items-center gap-1 group">Shop <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
                <li><Link to="/about" className="text-muted-foreground hover:text-amber transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-amber transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="text-muted-foreground hover:text-amber transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/returns" className="text-muted-foreground hover:text-amber transition-colors">Returns Policy</Link></li>
                <li><Link to="/shipping" className="text-muted-foreground hover:text-amber transition-colors">Shipping Info</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-amber transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-amber transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="text-amber shrink-0 mt-0.5" />
                  <span>123 Luxury Avenue, Lagos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone size={16} className="text-amber shrink-0 mt-0.5" />
                  <span>+234 800 000 0000</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail size={16} className="text-amber shrink-0 mt-0.5" />
                  <span>info@keplex.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock size={16} className="text-amber shrink-0 mt-0.5" />
                  <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Keplex. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-amber transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-amber transition-colors">Terms</Link>
              <Link to="/cookies" className="hover:text-amber transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};