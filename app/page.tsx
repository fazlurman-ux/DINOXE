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
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-accent">
              DINOXE
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/products" className="text-text hover:text-accent transition-colors">
                Products
              </Link>
              <Link href="/cart" className="text-text hover:text-accent transition-colors flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Cart
                {getCartCount() > 0 && (
                  <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Genuine Smart Accessories
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8">
            Authentic. Affordable. Fast Delivery.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm md:text-base">
            <div className="flex items-center gap-2 text-success">
              <Shield className="w-5 h-5" />
              <span>100% Authentic</span>
            </div>
            <div className="flex items-center gap-2 text-success">
              <RefreshCw className="w-5 h-5" />
              <span>30-Day Refund</span>
            </div>
            <div className="flex items-center gap-2 text-success">
              <Truck className="w-5 h-5" />
              <span>Same-Day Dispatch</span>
            </div>
          </div>
          <Link href="/products" className="btn-primary text-lg inline-block">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Dinoxe?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                problem: 'Knockoffs die in 2 weeks',
                solution: '1-year warranty on all products',
              },
              {
                problem: 'Amazon returns take 15 days',
                solution: '30-day instant refund policy',
              },
              {
                problem: 'Can\'t trust product images',
                solution: 'Real customer reviews & ratings',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="card p-6 text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-error mb-4 text-lg">{item.problem}</div>
                <div className="text-success font-medium text-lg">{item.solution}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
                <div className="font-medium">{testimonial.name}</div>
                <div className="text-sm text-gray-400">{testimonial.city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Featured Products
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="card group"
              >
                <div className="aspect-square bg-gray-800 flex items-center justify-center text-gray-600">
                  <ShoppingCart className="w-16 h-16" />
                </div>
                <div className="p-4">
                  <div className="text-xs text-accent mb-2">Featured</div>
                  <h3 className="font-medium mb-2 group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-lg font-bold">₹{product.price}</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {product.rating}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/products" className="btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Risk Reversal */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Shop with Zero Risk
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <div className="text-left">
                <div className="font-medium">Verified Authentic</div>
                <div className="text-sm text-gray-400">100% genuine products</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-success" />
              </div>
              <div className="text-left">
                <div className="font-medium">30-Day Guarantee</div>
                <div className="text-sm text-gray-400">Easy refund policy</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <Truck className="w-6 h-6 text-success" />
              </div>
              <div className="text-left">
                <div className="font-medium">Fast Delivery</div>
                <div className="text-sm text-gray-400">1-2 days across India</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-gray-900">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-accent mb-4">DINOXE</div>
              <p className="text-gray-400 text-sm">
                Your trusted destination for genuine smart accessories.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/products" className="hover:text-accent">Products</Link></li>
                <li><Link href="/cart" className="hover:text-accent">Cart</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-accent">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-accent">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-accent">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>WhatsApp: +91 98765 43210</li>
                <li>Email: support@dinoxe.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2024 Dinoxe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
