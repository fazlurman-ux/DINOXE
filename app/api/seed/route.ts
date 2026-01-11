import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dinoxe.com' },
    update: {},
    create: {
      email: 'admin@dinoxe.com',
      password: hashedPassword,
    },
  })

  console.log('Created admin user:', admin.email)

  // Create products
  const products = [
    // CHARGERS
    {
      name: 'iPhone 15 Fast Charger 20W',
      category: 'Chargers',
      price: 599,
      description: 'Fast charging adapter compatible with iPhone 15 series. 20W output for quick charging.',
      imageUrl: 'https://images.unsplash.com/photo-1625517407072-3939519532f5?w=800&q=80',
      specifications: '20W Power, USB-C Port, Fast Charge Support',
      warranty: '1 Year',
      stock: 50,
      rating: 4.5,
    },
    {
      name: 'Samsung Galaxy Charger 25W',
      category: 'Chargers',
      price: 499,
      description: 'Super Fast Charging adapter for Samsung Galaxy devices. 25W output for rapid charging.',
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
      specifications: '25W Power, USB-C Port, AFC Support',
      warranty: '1 Year',
      stock: 45,
      rating: 4.6,
    },
    {
      name: 'Universal USB-C Charger 65W',
      category: 'Chargers',
      price: 799,
      description: 'High-power 65W USB-C charger compatible with laptops, phones, and tablets.',
      imageUrl: 'https://images.unsplash.com/photo-1619130541315-779895089f81?w=800&q=80',
      specifications: '65W Power, USB-C Port, PPS Support',
      warranty: '1 Year',
      stock: 30,
      rating: 4.4,
    },
    {
      name: 'iPhone 15 Pro Max Fast Charger 30W',
      category: 'Chargers',
      price: 899,
      description: 'Official 30W fast charger for iPhone 15 Pro Max. Rapid charging in 30 minutes.',
      imageUrl: 'https://images.unsplash.com/photo-1633209265213-e5c3757f0fb1?w=800&q=80',
      specifications: '30W Power, USB-C Port, MagSafe Compatible',
      warranty: '1 Year',
      stock: 25,
      rating: 4.8,
    },
    {
      name: 'Multi-Port USB Charger 100W',
      category: 'Chargers',
      price: 1299,
      description: '4-port USB charging station with 100W total output. Charge multiple devices simultaneously.',
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
      specifications: '100W Total, 4 USB Ports, Smart Detect',
      warranty: '1 Year',
      stock: 20,
      rating: 4.7,
    },

    // CABLES
    {
      name: 'USB-C to Lightning Cable 2m',
      category: 'Cables',
      price: 399,
      description: 'MFi certified 2-meter USB-C to Lightning cable for iPhone charging and data transfer.',
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
      specifications: '2m Length, USB-C to Lightning, MFi Certified',
      warranty: '6 Months',
      stock: 60,
      rating: 4.5,
    },
    {
      name: 'USB-C to USB-C Cable 1.5m Fast Charging',
      category: 'Cables',
      price: 299,
      description: 'High-quality USB-C cable supporting 100W fast charging and 480Mbps data transfer.',
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
      specifications: '1.5m Length, USB-C to USB-C, 100W Support',
      warranty: '6 Months',
      stock: 70,
      rating: 4.6,
    },
    {
      name: 'Braided USB-C Cable 2m',
      category: 'Cables',
      price: 499,
      description: 'Premium braided nylon USB-C cable. Extra durable with reinforced connector ends.',
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
      specifications: '2m Length, Braided Nylon, Reinforced Ends',
      warranty: '1 Year',
      stock: 45,
      rating: 4.7,
    },
    {
      name: 'Micro USB to USB-C Cable 1m',
      category: 'Cables',
      price: 199,
      description: 'Universal charging cable for older Android devices and accessories.',
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
      specifications: '1m Length, Micro USB to USB-C, 2A Output',
      warranty: '6 Months',
      stock: 80,
      rating: 4.3,
    },
    {
      name: 'Triple USB Charging Cable 3-in-1',
      category: 'Cables',
      price: 599,
      description: '3-in-1 charging cable with Lightning, USB-C, and Micro USB connectors.',
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
      specifications: '1.2m Length, 3 Connectors, 2.4A Max',
      warranty: '6 Months',
      stock: 55,
      rating: 4.4,
    },

    // CASES
    {
      name: 'Premium iPhone 15 Case',
      category: 'Cases',
      price: 699,
      description: 'Premium silicone case with MagSafe compatibility for iPhone 15. Soft-touch finish.',
      imageUrl: 'https://images.unsplash.com/photo-1601593094911-37d4f954005b?w=800&q=80',
      specifications: 'iPhone 15, Silicone, MagSafe Compatible',
      warranty: '6 Months',
      stock: 40,
      rating: 4.6,
    },
    {
      name: 'Clear iPhone 14 Pro Max Case',
      category: 'Cases',
      price: 499,
      description: 'Crystal clear protective case showing off your phone design. Shock-absorbent corners.',
      imageUrl: 'https://images.unsplash.com/photo-1601593094911-37d4f954005b?w=800&q=80',
      specifications: 'iPhone 14 Pro Max, Clear TPU, Shock Absorbent',
      warranty: '6 Months',
      stock: 50,
      rating: 4.5,
    },
    {
      name: 'Rugged Armor Case Samsung S24',
      category: 'Cases',
      price: 799,
      description: 'Heavy-duty protection case with built-in screen protector. Military-grade protection.',
      imageUrl: 'https://images.unsplash.com/photo-1601593094911-37d4f954005b?w=800&q=80',
      specifications: 'Samsung S24, Rugged, Military Grade',
      warranty: '1 Year',
      stock: 35,
      rating: 4.8,
    },
    {
      name: 'Slim Profile Case OnePlus 12',
      category: 'Cases',
      price: 449,
      description: 'Ultra-thin case that adds minimal bulk while protecting against scratches and drops.',
      imageUrl: 'https://images.unsplash.com/photo-1601593094911-37d4f954005b?w=800&q=80',
      specifications: 'OnePlus 12, Slim Design, Matte Finish',
      warranty: '6 Months',
      stock: 45,
      rating: 4.4,
    },
    {
      name: 'Leather Wallet Case iPhone',
      category: 'Cases',
      price: 999,
      description: 'Premium leather case with card slot and stand function. RFID blocking protection.',
      imageUrl: 'https://images.unsplash.com/photo-1601593094911-37d4f954005b?w=800&q=80',
      specifications: 'iPhone 13/14/15, Genuine Leather, Card Slot',
      warranty: '1 Year',
      stock: 25,
      rating: 4.7,
    },

    // SCREEN PROTECTORS
    {
      name: 'Tempered Glass iPhone 15 Pro Max',
      category: 'Screen Protectors',
      price: 299,
      description: '9H hardness tempered glass screen protector with bubble-free installation kit.',
      imageUrl: 'https://images.unsplash.com/photo-1601593094911-37d4f954005b?w=800&q=80',
      specifications: 'iPhone 15 Pro Max, 9H Hardness, Bubble Free',
      warranty: '6 Months',
      stock: 90,
      rating: 4.5,
    },
    {
      name: 'Privacy Screen Protector Samsung S24',
      category: 'Screen Protectors',
      price: 499,
      description: 'Anti-spy privacy screen protector. Visible only from direct viewing angle.',
      imageUrl: 'https://images.unsplash.com/photo-1601593094911-37d4f954005b?w=800&q=80',
      specifications: 'Samsung S24, Privacy Filter, 28° Viewing Angle',
      warranty: '6 Months',
      stock: 60,
      rating: 4.6,
    },
    {
      name: 'UV Curable Screen Protector',
      category: 'Screen Protectors',
      price: 699,
      description: 'Professional-grade UV cured screen protector with installation lamp included.',
      imageUrl: 'https://images.unsplash.com/photo-1601593094911-37d4f954005b?w=800&q=80',
      specifications: 'Universal, UV Curable, Installation Kit',
      warranty: '1 Year',
      stock: 40,
      rating: 4.8,
    },
    {
      name: 'Matte Screen Protector Anti-Glare',
      category: 'Screen Protectors',
      price: 349,
      description: 'Matte finish screen protector reducing fingerprints and glare for outdoor use.',
      imageUrl: 'https://images.unsplash.com/photo-1601593094911-37d4f954005b?w=800&q=80',
      specifications: 'Universal, Matte Finish, Anti-Glare',
      warranty: '6 Months',
      stock: 70,
      rating: 4.4,
    },
    {
      name: 'Curved Edge Screen Protector',
      category: 'Screen Protectors',
      price: 449,
      description: 'Full coverage curved edge screen protector for phones with curved displays.',
      imageUrl: 'https://images.unsplash.com/photo-1601593094911-37d4f954005b?w=800&q=80',
      specifications: 'Curved Displays, Full Coverage, 9H Hardness',
      warranty: '6 Months',
      stock: 55,
      rating: 4.5,
    },

    // EARBUDS
    {
      name: 'Wireless Bluetooth Earbuds',
      category: 'Earbuds',
      price: 1499,
      description: 'True wireless earbuds with active noise cancellation and 30 hours battery life.',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      specifications: 'TWS, ANC, 30h Battery, IPX5',
      warranty: '1 Year',
      stock: 40,
      rating: 4.7,
    },
    {
      name: 'Sports Wireless Earbuds',
      category: 'Earbuds',
      price: 999,
      description: 'Sweat-resistant sports earbuds with secure ear hooks and bass boost technology.',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      specifications: 'Sports, Ear Hooks, IPX7, Bass Boost',
      warranty: '1 Year',
      stock: 50,
      rating: 4.5,
    },
    {
      name: 'Premium ANC Earbuds Pro',
      category: 'Earbuds',
      price: 2499,
      description: 'High-end earbuds with hybrid ANC, Hi-Res audio, and wireless charging case.',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      specifications: 'Hybrid ANC, Hi-Res Audio, Wireless Charging',
      warranty: '1 Year',
      stock: 25,
      rating: 4.9,
    },
    {
      name: 'Mini In-Ear Earbuds',
      category: 'Earbuds',
      price: 799,
      description: 'Ultra-compact earbuds that fit discreetly. Perfect for calls and casual listening.',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      specifications: 'Compact, 20h Battery, Touch Controls',
      warranty: '6 Months',
      stock: 60,
      rating: 4.3,
    },
    {
      name: 'Bone Conduction Headphones',
      category: 'Earbuds',
      price: 1999,
      description: 'Open-ear bone conduction headphones. Safe for outdoor activities and situational awareness.',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      specifications: 'Bone Conduction, IP67, 10h Battery',
      warranty: '1 Year',
      stock: 30,
      rating: 4.6,
    },

    // SPEAKERS
    {
      name: 'Portable Bluetooth Speaker',
      category: 'Speakers',
      price: 1299,
      description: 'Compact waterproof speaker with 12 hours playback and powerful bass.',
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
      specifications: '10W, IPX7, 12h Battery, Bluetooth 5.3',
      warranty: '1 Year',
      stock: 45,
      rating: 4.5,
    },
    {
      name: 'Party Speaker with Lights',
      category: 'Speakers',
      price: 3499,
      description: 'High-power party speaker with RGB lights, microphone input, and 20 hours battery.',
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
      specifications: '50W, RGB Lights, Mic Input, 20h Battery',
      warranty: '1 Year',
      stock: 20,
      rating: 4.7,
    },
    {
      name: 'Smart Speaker with Alexa',
      category: 'Speakers',
      price: 2999,
      description: 'Smart speaker with built-in Alexa voice assistant. Multi-room music support.',
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
      specifications: 'Smart Assistant, 20W, WiFi, Bluetooth',
      warranty: '1 Year',
      stock: 30,
      rating: 4.6,
    },
    {
      name: 'Mini Desktop Speaker',
      category: 'Speakers',
      price: 699,
      description: 'Compact USB-powered speakers for desktop and laptop use.',
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
      specifications: '5W x 2, USB Powered, Volume Control',
      warranty: '6 Months',
      stock: 55,
      rating: 4.3,
    },
    {
      name: 'Waterproof Shower Speaker',
      category: 'Speakers',
      price: 899,
      description: 'IPX7 waterproof speaker with suction cup. Perfect for shower and bathroom use.',
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
      specifications: '8W, IPX7, Suction Cup, 6h Battery',
      warranty: '6 Months',
      stock: 50,
      rating: 4.4,
    },

    // COOLING FAN
    {
      name: 'Magnetic Phone Cooler',
      category: 'Cooling Fan',
      price: 1199,
      description: 'Magnetic cooling fan for gaming phones. Reduces temperature by 15°C.',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      specifications: 'Magnetic, 15°C Cooling, RGB, Quiet',
      warranty: '6 Months',
      stock: 40,
      rating: 4.7,
    },
    {
      name: 'Clip-on Phone Fan',
      category: 'Cooling Fan',
      price: 499,
      description: 'Universal clip-on cooling fan for all smartphones. USB-C rechargeable.',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      specifications: 'Clip-on, Universal, 4h Battery, Quiet',
      warranty: '6 Months',
      stock: 60,
      rating: 4.4,
    },
    {
      name: 'RGB Gaming Cooler Pro',
      category: 'Cooling Fan',
      price: 1599,
      description: 'High-performance RGB cooler with Peltier technology for rapid cooling.',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      specifications: 'Peltier, RGB, 20°C Cooling, Display',
      warranty: '1 Year',
      stock: 25,
      rating: 4.8,
    },
    {
      name: 'Mini USB Phone Fan',
      category: 'Cooling Fan',
      price: 299,
      description: 'Compact USB-powered mini fan. Great for travel and office use.',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      specifications: 'USB Powered, Mini Size, Adjustable',
      warranty: '3 Months',
      stock: 80,
      rating: 4.2,
    },
    {
      name: 'Wireless Charging Cooler',
      category: 'Cooling Fan',
      price: 1999,
      description: '2-in-1 wireless charger with built-in cooling fan. Charges and cools simultaneously.',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      specifications: '15W Wireless, Cooling Fan, Qi Compatible',
      warranty: '1 Year',
      stock: 30,
      rating: 4.6,
    },

    // PHONE COOLER
    {
      name: 'Gaming Phone Cooler RGB',
      category: 'Phone Cooler',
      price: 999,
      description: 'RGB phone cooler with silent fan. Perfect for mobile gaming and PUBG.',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      specifications: 'RGB, Silent Fan, Universal Fit',
      warranty: '6 Months',
      stock: 45,
      rating: 4.5,
    },
    {
      name: 'Turbo Phone Cooler',
      category: 'Phone Cooler',
      price: 1299,
      description: 'High-speed turbo cooler with dual fans. Maximum cooling performance.',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      specifications: 'Dual Fan, Turbo Speed, LED Display',
      warranty: '6 Months',
      stock: 35,
      rating: 4.7,
    },
    {
      name: 'Compact Phone Cooler',
      category: 'Phone Cooler',
      price: 699,
      description: 'Ultra-compact phone cooler that fits in your pocket. Great for travel.',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      specifications: 'Compact, Pocket Size, USB-C',
      warranty: '6 Months',
      stock: 50,
      rating: 4.3,
    },
    {
      name: 'Phone Cooler Stand',
      category: 'Phone Cooler',
      price: 1499,
      description: 'Phone cooler with adjustable stand. Cool and watch at the same time.',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      specifications: 'Adjustable Stand, Cooling, Phone Holder',
      warranty: '1 Year',
      stock: 30,
      rating: 4.6,
    },
    {
      name: 'Smart Phone Cooler Auto',
      category: 'Phone Cooler',
      price: 1799,
      description: 'Smart cooler with temperature sensor and auto-adjust speed.',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      specifications: 'Temp Sensor, Auto Speed, Smart Control',
      warranty: '1 Year',
      stock: 25,
      rating: 4.8,
    },
  ]

  for (const product of products) {
    // Check if product already exists
    const existing = await prisma.product.findFirst({
      where: { name: product.name }
    })

    if (!existing) {
      await prisma.product.create({
        data: product
      })
    }
  }

  console.log('Created products:', products.length)
}

export async function POST() {
  try {
    // Check if already seeded
    const existingProducts = await prisma.product.count()
    const existingUsers = await prisma.user.count()

    if (existingProducts > 0 && existingUsers > 0) {
      return NextResponse.json({ 
        message: 'Database already seeded',
        stats: {
          products: existingProducts,
          users: existingUsers
        }
      })
    }

    // Seed the database
    await main()

    const finalProductCount = await prisma.product.count()
    const finalUserCount = await prisma.user.count()

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      stats: {
        products: finalProductCount,
        users: finalUserCount
      }
    })
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const products = await prisma.product.count()
    const users = await prisma.user.count()

    return NextResponse.json({
      seeded: products > 0 && users > 0,
      stats: {
        products,
        users
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check database status' },
      { status: 500 }
    )
  }
}
