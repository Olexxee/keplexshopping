import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/product/ProductCard';
import { useBestSellers, useFeaturedProducts } from '@/hooks/useProducts';
import { useActiveCategoriesHierarchyWithCounts } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';
import heroImage from '@/assets/hero-image.jpg';

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

  // Initial load
  useEffect(() => {
    const initial = shuffle();
    if (initial) setDisplayed(initial);
  }, [shuffle]);

  // Animated rotation
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
const ProductCardSkeleton = () => <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
    <Skeleton className="aspect-[3/4] w-full" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-6 w-28 mt-2" />
    </div>
  </div>;
const CategorySkeleton = () => <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
    <Skeleton className="absolute inset-0" />
  </div>;
const Index = () => {
  const {
    data: bestSellers,
    isLoading: loadingBestSellers
  } = useBestSellers();
  const {
    data: featuredProducts,
    isLoading: loadingFeatured
  } = useFeaturedProducts();
  const {
    data: categories,
    isLoading: loadingCategories
  } = useActiveCategoriesHierarchyWithCounts();

  // Shuffle displayed products every 10 seconds
  const { displayed: displayedBestSellers, fading: fadingBest } = useShuffledProducts(bestSellers, 4, 20000);
  const { displayed: displayedFeatured, fading: fadingFeatured } = useShuffledProducts(featuredProducts, 4, 25000);
  return <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] sm:min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="Luxury footwear and fashion" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span className="text-primary text-xs sm:text-sm font-medium tracking-wide">
                Footies & Luxury Wears
              </span>
            </div>
            
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] sm:leading-[1.05] animate-fade-in-up">
              <span className="text-white font-serif">We Sell</span>{' '}
              <span className="luxury-text font-serif">Quality</span>
            </h1>
            
            <p className="text-white text-base sm:text-lg md:text-xl max-w-xl leading-relaxed animate-fade-in-up stagger-2">
              Discover our curated collection of premium footwear and luxury attire, 
              crafted for those who demand excellence in every detail.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 animate-fade-in-up stagger-3">
              <Button variant="luxury" size="lg" className="w-full sm:w-auto group" asChild>
                <Link to="/shop">
                  Shop Now
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="luxuryOutline" size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/shop">Explore Collection</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in stagger-5">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>


      {/* Categories Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            
            <h2 className="font-display text-2xl sm:text-display-sm md:text-display-md font-bold">
              Featured Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {loadingCategories ? Array.from({
            length: 4
          }).map((_, i) => <CategorySkeleton key={i} />) : categories?.map((category, i) => <Link key={category.slug} to={`/shop?category=${category.slug}`} className="group relative aspect-[3/4] bg-secondary rounded-xl sm:rounded-2xl overflow-hidden hover-lift animate-fade-in-up" style={{
            animationDelay: `${i * 0.1}s`
          }}>
                    {category.image_url && <img src={category.image_url} alt={category.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <h3 className="font-display text-base sm:text-xl font-semibold text-white group-hover:text-primary transition-colors duration-300 mb-0.5 sm:mb-1">
                        {category.name}
                      </h3>
                      
                      <span className="text-xs sm:text-sm text-white/80 flex items-center gap-1 sm:gap-2 group-hover:text-primary transition-colors duration-300">
                        Explore 
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>)}
          </div>
          <div className="flex justify-center mt-8 sm:mt-12">
            <Button variant="luxuryOutline" size="default" asChild className="group">
              <Link to="/shop">
                View All Categories
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-16 gap-4 sm:gap-6">
            <div>
              <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium uppercase tracking-widest mb-3 sm:mb-4">
                Popular
              </span>
              <h2 className="font-display text-2xl sm:text-display-sm md:text-display-md font-bold">Best Sales</h2>
            </div>
            <Button variant="luxuryOutline" size="sm" asChild className="group">
              <Link to="/shop">
                View All
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 transition-all duration-500 ease-in-out ${fadingBest ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            {loadingBestSellers ? Array.from({
            length: 4
          }).map((_, i) => <ProductCardSkeleton key={i} />) : displayedBestSellers.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-16 gap-4 sm:gap-6">
            <div>
              <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium uppercase tracking-widest mb-3 sm:mb-4">
                New Arrivals
              </span>
              <h2 className="font-display text-2xl sm:text-display-sm md:text-display-md font-bold">Featured Collection</h2>
            </div>
            <Button variant="luxuryOutline" size="sm" asChild className="group">
              <Link to="/shop">
                View All
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 transition-all duration-500 ease-in-out ${fadingFeatured ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            {loadingFeatured ? Array.from({
            length: 4
          }).map((_, i) => <ProductCardSkeleton key={i} />) : displayedFeatured.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

    </Layout>;
};
export default Index;