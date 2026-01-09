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
      imageUrl: '/products/iphone-15-charger.jpg',
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
      imageUrl: '/products/samsung-25w-charger.jpg',
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
      imageUrl: '/products/usb-c-65w-charger.jpg',
      specifications: '65W Power, USB-C PD, Universal Compatibility',
      warranty: '1 Year',
      stock: 30,
      rating: 4.7,
    },
    {
      name: 'Wireless Phone Charger',
      category: 'Chargers',
      price: 699,
      description: 'Fast wireless charging pad for Qi-enabled devices. 15W max output.',
      imageUrl: '/products/wireless-charger.jpg',
      specifications: '15W Wireless, Qi Compatible, LED Indicator',
      warranty: '1 Year',
      stock: 40,
      rating: 4.4,
    },
    // CABLES
    {
      name: 'iPhone Lightning Cable 1.5m',
      category: 'Cables',
      price: 299,
      description: 'Durable 1.5m Lightning cable for iPhone charging and data transfer.',
      imageUrl: '/products/lightning-cable.jpg',
      specifications: '1.5m Length, Lightning Connector, MFi Certified',
      warranty: '6 Months',
      stock: 100,
      rating: 4.3,
    },
    {
      name: 'USB-C Cable 3m',
      category: 'Cables',
      price: 349,
      description: 'Extra-long 3m USB-C cable for charging and data sync. Fast charging support.',
      imageUrl: '/products/usb-c-cable-3m.jpg',
      specifications: '3m Length, USB-C to USB-C, 60W Support',
      warranty: '6 Months',
      stock: 80,
      rating: 4.4,
    },
    {
      name: 'Micro USB Cable 2m',
      category: 'Cables',
      price: 199,
      description: 'Standard 2m Micro USB cable for older devices. Braided for durability.',
      imageUrl: '/products/micro-usb-cable.jpg',
      specifications: '2m Length, Micro USB, Braided Design',
      warranty: '6 Months',
      stock: 120,
      rating: 4.2,
    },
    {
      name: 'Nylon Braided USB-C Cable',
      category: 'Cables',
      price: 399,
      description: 'Premium nylon braided USB-C cable. Tangle-free and extra durable.',
      imageUrl: '/products/nylon-braided-cable.jpg',
      specifications: '2m Length, USB-C, Nylon Braided, 100W Support',
      warranty: '1 Year',
      stock: 70,
      rating: 4.6,
    },
    // CASES
    {
      name: 'Premium iPhone 15 Case',
      category: 'Cases',
      price: 699,
      description: 'Premium protective case for iPhone 15. Shock-absorbing design with raised edges.',
      imageUrl: '/products/iphone-15-case.jpg',
      specifications: 'TPU Material, Shock Absorbent, Raised Edges',
      warranty: '6 Months',
      stock: 60,
      rating: 4.5,
    },
    {
      name: 'Samsung Galaxy Case',
      category: 'Cases',
      price: 599,
      description: 'Slim-fit protective case for Samsung Galaxy series. Premium finish with good grip.',
      imageUrl: '/products/samsung-case.jpg',
      specifications: 'Slim Design, Premium Finish, Anti-Slip',
      warranty: '6 Months',
      stock: 55,
      rating: 4.4,
    },
    {
      name: 'Clear Transparent Case',
      category: 'Cases',
      price: 499,
      description: 'Crystal clear case that showcases your phone\'s design. Anti-yellowing material.',
      imageUrl: '/products/clear-case.jpg',
      specifications: 'Clear TPU, Anti-Yellowing, Transparent',
      warranty: '6 Months',
      stock: 90,
      rating: 4.3,
    },
    {
      name: 'Leather Flip Case',
      category: 'Cases',
      price: 899,
      description: 'Premium leather flip case with card slots and stand function.',
      imageUrl: '/products/leather-flip-case.jpg',
      specifications: 'Genuine Leather, Card Slots, Stand Function',
      warranty: '1 Year',
      stock: 35,
      rating: 4.7,
    },
    // SCREEN PROTECTORS
    {
      name: 'Tempered Glass Screen Protector',
      category: 'Screen Protectors',
      price: 399,
      description: '9H hardness tempered glass with anti-fingerprint coating. Easy installation.',
      imageUrl: '/products/tempered-glass.jpg',
      specifications: '9H Hardness, Anti-Fingerprint, Bubble-Free Install',
      warranty: 'No Warranty',
      stock: 150,
      rating: 4.3,
    },
    {
      name: 'Privacy Screen Protector',
      category: 'Screen Protectors',
      price: 499,
      description: 'Privacy glass that blocks side view. 28-degree viewing angle protection.',
      imageUrl: '/products/privacy-screen.jpg',
      specifications: 'Privacy Filter, 28° Viewing Angle, Anti-Spy',
      warranty: 'No Warranty',
      stock: 80,
      rating: 4.5,
    },
    {
      name: 'Matte Screen Protector',
      category: 'Screen Protectors',
      price: 349,
      description: 'Matte finish screen guard that reduces glare and fingerprints.',
      imageUrl: '/products/matte-screen.jpg',
      specifications: 'Matte Finish, Anti-Glare, Fingerprint Resistant',
      warranty: 'No Warranty',
      stock: 100,
      rating: 4.2,
    },
    // EARBUDS
    {
      name: 'Wireless Bluetooth Earbuds',
      category: 'Earbuds',
      price: 1499,
      description: 'True wireless earbuds with touch controls and 24-hour battery life.',
      imageUrl: '/products/wireless-earbuds.jpg',
      specifications: 'TWS, Touch Control, 24H Battery, IPX5',
      warranty: '1 Year',
      stock: 50,
      rating: 4.5,
    },
    {
      name: 'Noise-Canceling Earbuds',
      category: 'Earbuds',
      price: 1899,
      description: 'Active noise-canceling wireless earbuds with premium sound quality.',
      imageUrl: '/products/anc-earbuds.jpg',
      specifications: 'ANC, Premium Sound, 30H Battery, IPX4',
      warranty: '1 Year',
      stock: 40,
      rating: 4.7,
    },
    {
      name: 'Sports Earbuds with Ear Hook',
      category: 'Earbuds',
      price: 1399,
      description: 'Waterproof sports earbuds with secure ear hook design for workouts.',
      imageUrl: '/products/sports-earbuds.jpg',
      specifications: 'Ear Hook Design, IPX7, 18H Battery, Sweat Proof',
      warranty: '1 Year',
      stock: 45,
      rating: 4.4,
    },
    // SPEAKERS
    {
      name: 'Portable Bluetooth Speaker',
      category: 'Speakers',
      price: 1599,
      description: 'Compact portable speaker with 20W output and 12-hour battery.',
      imageUrl: '/products/portable-speaker.jpg',
      specifications: '20W Output, 12H Battery, Bluetooth 5.0, IPX6',
      warranty: '1 Year',
      stock: 35,
      rating: 4.5,
    },
    {
      name: 'Waterproof Bluetooth Speaker',
      category: 'Speakers',
      price: 1799,
      description: 'Fully waterproof outdoor speaker with 30W output and bass boost.',
      imageUrl: '/products/waterproof-speaker.jpg',
      specifications: '30W Output, IPX7, 15H Battery, Bass Boost',
      warranty: '1 Year',
      stock: 30,
      rating: 4.6,
    },
    // COOLING FAN & PHONE COOLER
    {
      name: 'Phone Cooling Fan USB',
      category: 'Cooling Fan',
      price: 799,
      description: 'USB-powered cooling fan to prevent phone overheating during gaming.',
      imageUrl: '/products/cooling-fan.jpg',
      specifications: 'USB Powered, Low Noise, Universal Fit',
      warranty: '6 Months',
      stock: 60,
      rating: 4.3,
    },
    {
      name: 'Portable Phone Cooler',
      category: 'Phone Cooler',
      price: 999,
      description: 'Portable semiconductor cooler for active phone cooling.',
      imageUrl: '/products/portable-cooler.jpg',
      specifications: 'Semiconductor Cooling, Rechargeable, LED Display',
      warranty: '6 Months',
      stock: 40,
      rating: 4.5,
    },
    {
      name: 'Heat Sink Phone Cooler',
      category: 'Phone Cooler',
      price: 899,
      description: 'Heat sink phone cooler with aluminum radiator for efficient cooling.',
      imageUrl: '/products/heat-sink-cooler.jpg',
      specifications: 'Aluminum Heat Sink, Passive Cooling, Universal',
      warranty: '6 Months',
      stock: 50,
      rating: 4.4,
    },
    {
      name: 'Gaming Phone Cooler',
      category: 'Phone Cooler',
      price: 1199,
      description: 'Professional gaming cooler with magnetic attachment and RGB lighting.',
      imageUrl: '/products/gaming-cooler.jpg',
      specifications: 'Magnetic Attachment, RGB Lighting, Active Cooling',
      warranty: '1 Year',
      stock: 35,
      rating: 4.7,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        ...product,
        id: product.name.toLowerCase().replace(/\s+/g, '-'),
      },
    })
  }

  // Create sample reviews
  const reviews = [
    { productId: 'iphone-15-fast-charger-20w', customerName: 'Rahul Sharma', city: 'Mumbai', rating: 5, comment: 'Excellent charger! Charges my iPhone 15 super fast.' },
    { productId: 'iphone-15-fast-charger-20w', customerName: 'Priya Patel', city: 'Delhi', rating: 4, comment: 'Good quality, works as expected.' },
    { productId: 'wireless-bluetooth-earbuds', customerName: 'Amit Kumar', city: 'Bangalore', rating: 5, comment: 'Best earbuds in this price range! Amazing sound quality.' },
    { productId: 'wireless-bluetooth-earbuds', customerName: 'Sneha Reddy', city: 'Hyderabad', rating: 4, comment: 'Great battery life and comfortable fit.' },
    { productId: 'premium-iphone-15-case', customerName: 'Vikram Singh', city: 'Chennai', rating: 5, comment: 'Perfect fit and excellent protection.' },
    { productId: 'noise-canceling-earbuds', customerName: 'Anjali Gupta', city: 'Pune', rating: 5, comment: 'The ANC is incredible! No more noise on my commute.' },
    { productId: 'portable-bluetooth-speaker', customerName: 'Rajesh Kumar', city: 'Ahmedabad', rating: 4, comment: 'Great sound, very portable.' },
    { productId: 'gaming-phone-cooler', customerName: 'Mohit Verma', city: 'Noida', rating: 5, comment: 'My phone stays cool even after hours of gaming!' },
  ]

  for (const review of reviews) {
    await prisma.review.upsert({
      where: { id: `${review.productId}-${review.customerName.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        ...review,
        id: `${review.productId}-${review.customerName.toLowerCase().replace(/\s+/g, '-')}`,
        isApproved: true,
      },
    })
  }

  console.log('Created products and reviews')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
