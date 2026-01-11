'use client'

import Link from 'next/link'
import { ShoppingCart, Star, Shield, Truck, RefreshCw, ChevronRight } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

const testimonials = [
  { name: 'Rahul Sharma', city: 'Mumbai', rating: 5, quote: 'Best quality earbuds I\'ve ever used! Fast delivery too.' },
  { name: 'Priya Patel', city: 'Delhi', rating: 5, quote: 'Charged my phone in 30 minutes. Authentic product!' },
  { name: 'Amit Kumar', city: 'Bangalore', rating: 5, quote: 'Screen protector fits perfectly. Great price.' },
  { name: 'Sneha Reddy', city: 'Hyderabad', rating: 5, quote: 'No more fake products from Amazon. Dinoxe is trustworthy!' },
]

const featuredProducts = [
  { id: 'iphone-15-fast-charger-20w', name: 'iPhone 15 Fast Charger 20W', price: 599, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1625517407072-3939519532f5?w=500&q=80' },
  { id: 'wireless-bluetooth-earbuds', name: 'Wireless Bluetooth Earbuds', price: 1499, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80' },
  { id: 'premium-iphone-15-case', name: 'Premium iPhone 15 Case', price: 699, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1601593094911-37d4f954005b?w=500&q=80' },
  { id: 'gaming-phone-cooler', name: 'Gaming Phone Cooler', price: 1199, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80' },
]

export default function Home() {
  const { getCartCount } = useCart()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
              DINOXE
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/products" className="text-gray-600 hover:text-primary font-medium transition-colors">
                Products
              </Link>
              <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
              Premium Smart <span className="text-primary">Accessories</span> for Your Digital Life.
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Discover authentic, high-quality chargers, earbuds, cases and more. Fast delivery across India and hassle-free returns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="btn-blue text-lg px-8 py-4 flex items-center justify-center gap-2">
                Shop Now <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="/products?category=Earbuds" className="btn-secondary text-lg px-8 py-4 flex items-center justify-center">
                View Earbuds
              </Link>
            </div>
          </div>
          <div className="hidden md:block animate-slide-up">
            <img 
              src="https://images.unsplash.com/photo-1468495244123-6c6c332eeede?w=800&q=80" 
              alt="Tech accessories" 
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">100% Authentic</h3>
                <p className="text-sm text-gray-500">Genuine products guaranteed</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">30-Day Refund</h3>
                <p className="text-sm text-gray-500">Easy returns if not satisfied</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Fast Delivery</h3>
                <p className="text-sm text-gray-500">Quick dispatch within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-500">Hand-picked essentials for your digital life.</p>
            </div>
            <Link href="/products" className="text-primary font-bold hover:underline flex items-center gap-1">
              Shop All Products <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="card group"
              >
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-900 font-mono">₹{product.price}</div>
                    <div className="flex items-center gap-1 text-sm bg-gray-50 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-700">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4 text-yellow-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{t.quote}"</p>
                <div>
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto bg-primary rounded-[32px] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">
            Ready to Upgrade Your Tech?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">
            Join 50,000+ happy customers. Get the best accessories with free shipping and cash on delivery.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link href="/products" className="bg-white text-primary hover:bg-gray-100 font-bold px-10 py-4 rounded-xl transition-all shadow-xl">
              Start Shopping
            </Link>
            <a href="https://wa.me/919876543210" className="bg-blue-600/50 hover:bg-blue-600/70 border border-white/20 text-white font-bold px-10 py-4 rounded-xl transition-all">
              Chat with Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">DINOXE</h2>
            <p className="max-w-sm mb-8 leading-relaxed">
              India's most trusted destination for authentic smart accessories. We bring you the latest tech at prices that make sense.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?category=Earbuds" className="hover:text-white transition-colors">Earbuds</Link></li>
              <li><Link href="/products?category=Chargers" className="hover:text-white transition-colors">Chargers</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="/track" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><a href="mailto:support@dinoxe.com" className="hover:text-white transition-colors">support@dinoxe.com</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto pt-12 mt-12 border-t border-gray-800 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} DINOXE INDIA. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  )
}
