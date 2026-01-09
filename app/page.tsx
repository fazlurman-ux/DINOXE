'use client'

import Link from 'next/link'
import { ShoppingCart, Star, Shield, Truck, RefreshCw } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

const testimonials = [
  { name: 'Rahul Sharma', city: 'Mumbai', rating: 5, quote: 'Best quality earbuds I\'ve ever used! Fast delivery too.' },
  { name: 'Priya Patel', city: 'Delhi', rating: 5, quote: 'Charged my phone in 30 minutes. Authentic product!' },
  { name: 'Amit Kumar', city: 'Bangalore', rating: 5, quote: 'Screen protector fits perfectly. Great price.' },
  { name: 'Sneha Reddy', city: 'Hyderabad', rating: 5, quote: 'No more fake products from Amazon. Dinoxe is trustworthy!' },
]

const featuredProducts = [
  { id: 'iphone-15-fast-charger-20w', name: 'iPhone 15 Fast Charger 20W', price: 599, rating: 4.5 },
  { id: 'wireless-bluetooth-earbuds', name: 'Wireless Bluetooth Earbuds', price: 1499, rating: 4.5 },
  { id: 'premium-iphone-15-case', name: 'Premium iPhone 15 Case', price: 699, rating: 4.5 },
  { id: 'gaming-phone-cooler', name: 'Gaming Phone Cooler', price: 1199, rating: 4.7 },
]

export default function Home() {
  const { getCartCount } = useCart()

  return (
    <div className="min-h-screen bg-mesh-gradient">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-black tracking-tighter text-accent flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-background rounded-sm"></div>
              </div>
              DINOXE
            </Link>
            <nav className="hidden md:flex items-center gap-8 font-medium">
              <Link href="/products" className="text-gray-400 hover:text-accent transition-all">
                Products
              </Link>
              <Link href="/cart" className="relative group p-2 text-gray-400 hover:text-accent transition-all">
                <ShoppingCart className="w-6 h-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-background text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-background">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-accent/10 blur-[120px] rounded-full -z-10 animate-pulse-slow"></div>
        <div className="container mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-8 animate-fade-in uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-accent animate-ping"></div>
            New Collection 2024
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight animate-slide-up leading-tight">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Tech Style</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto animate-fade-in leading-relaxed">
            Experience the future of smart accessories. Premium quality, unbeatable prices, and lightning-fast delivery across India.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/products" className="btn-primary text-lg px-10 py-4 shadow-[0_0_30px_rgba(0,217,217,0.3)] hover:shadow-[0_0_50px_rgba(0,217,217,0.5)]">
              Explore Store
            </Link>
            <Link href="/products?category=Earbuds" className="btn-secondary text-lg px-10 py-4">
              Shop Earbuds
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 text-sm">
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent/50 group-hover:bg-accent/5 transition-all">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <span className="font-bold text-gray-400 group-hover:text-text">100% Genuine</span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent/50 group-hover:bg-accent/5 transition-all">
                <RefreshCw className="w-6 h-6 text-accent" />
              </div>
              <span className="font-bold text-gray-400 group-hover:text-text">30-Day Returns</span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent/50 group-hover:bg-accent/5 transition-all">
                <Truck className="w-6 h-6 text-accent" />
              </div>
              <span className="font-bold text-gray-400 group-hover:text-text">Fast Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges / Stats */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-black text-white mb-1">50K+</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1">100%</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">Authentic Quality</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1">24/7</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">Customer Support</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1">1000+</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">Products Sold</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black mb-4">Trending Now</h2>
              <p className="text-gray-400">Hand-picked essentials for your digital life.</p>
            </div>
            <Link href="/products" className="text-accent font-bold hover:underline hidden md:block">
              View All Products →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group relative"
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/5 overflow-hidden group-hover:border-accent/30 transition-all duration-500">
                  <div className="absolute inset-0 flex items-center justify-center p-12 opacity-40 group-hover:scale-110 transition-transform duration-700">
                    <ShoppingCart className="w-full h-full text-gray-700" />
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent text-background text-[10px] font-black uppercase tracking-wider">
                    Featured
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-background to-transparent">
                    <div className="btn-primary w-full py-2 text-sm text-center">View Details</div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-accent transition-colors truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-xl font-black text-white">₹{product.price}</div>
                    <div className="flex items-center gap-1 text-sm bg-white/5 px-2 py-0.5 rounded-lg">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Reversal Section - Modernized */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-accent/5">
        <div className="container mx-auto bg-gray-900/50 border border-white/5 rounded-[40px] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-3xl -z-10"></div>
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Ready to Upgrade Your Experience?
            </h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              Join thousands of satisfied customers across India. We offer genuine products with a rock-solid 30-day money-back guarantee.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/products" className="btn-primary px-8">Start Shopping</Link>
              <a href="https://wa.me/919876543210" className="btn-secondary px-8">Chat with Support</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Modernized */}
      <footer className="pt-24 pb-12 px-4 border-t border-white/5">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="text-2xl font-black tracking-tighter text-accent flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-background rounded-sm"></div>
                </div>
                DINOXE
              </Link>
              <p className="text-gray-400 max-w-sm mb-8 leading-relaxed text-sm">
                India's most trusted destination for authentic smart accessories. We bring you the latest tech at prices that make sense.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-background transition-all cursor-pointer">
                  <span className="font-bold">f</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-background transition-all cursor-pointer">
                  <span className="font-bold">in</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-background transition-all cursor-pointer">
                  <span className="font-bold">𝕏</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Navigation</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/products" className="text-gray-400 hover:text-accent transition-colors">All Products</Link></li>
                <li><Link href="/products?category=Earbuds" className="text-gray-400 hover:text-accent transition-colors">Earbuds</Link></li>
                <li><Link href="/products?category=Chargers" className="text-gray-400 hover:text-accent transition-colors">Chargers</Link></li>
                <li><Link href="/cart" className="text-gray-400 hover:text-accent transition-colors">Shopping Cart</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Support</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="#" className="text-gray-400 hover:text-accent transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-accent transition-colors">Refund Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-accent transition-colors">Track Order</Link></li>
                <li><a href="mailto:support@dinoxe.com" className="text-gray-400 hover:text-accent transition-colors">support@dinoxe.com</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} DINOXE INDIA. ALL RIGHTS RESERVED. DESIGNED FOR THE MODERN ERA.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
