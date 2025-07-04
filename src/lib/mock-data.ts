import type { Product } from "./types";

export const initialProducts: Product[] = [
  {
    id: "prod_001",
    name: "Quantum Run Sneakers",
    description:
      "Ultra-lightweight running shoes with responsive cushioning. Perfect for marathons or daily jogs. Feel the energy return with every step.",
    price: 1999,
    oldPrice: 2499,
    stock: 150,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop",
    category: "Footwear",
    promoCopy:
      "Experience the next generation of running with Quantum Run Sneakers. Lightweight, responsive, and built for speed. Now available in three new colors!",
    isNew: true,
    tagline: "Run Faster, Feel Lighter"
  },
  {
    id: "prod_002",
    name: "CyberGlow LED Jacket",
    description:
      "A stylish, weather-resistant jacket with customizable LED lighting. Syncs with your music to create a dynamic light show.",
    price: 4999,
    oldPrice: 5999,
    stock: 75,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=400&fit=crop",
    category: "Apparel",
    promoCopy:
      "Light up your night with the CyberGlow LED Jacket. Weather-resistant, stylish, and connected to your favorite tunes. Be the life of the party.",
    tagline: "Light Up Your Style"
  },
  {
    id: "prod_003",
    name: "EchoSphere VR Headset",
    description:
      "Immersive virtual reality headset with 4K resolution per eye and integrated spatial audio. Lightweight design for extended comfort.",
    price: 8999,
    stock: 40,
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&h=400&fit=crop",
    category: "Electronics",
    promoCopy:
      "Step into new worlds with the EchoSphere VR Headset. Stunning 4K visuals and spatial audio for ultimate immersion. The future is here.",
    isNew: true,
    tagline: "Enter New Realities"
  },
  {
    id: "prod_004",
    name: "HydroBot Water Bottle",
    description:
      "Insulated water bottle that keeps your drinks cold for 24 hours or hot for 12. New leak-proof cap and durable finish.",
    price: 799,
    stock: 300,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=400&fit=crop",
    category: "Accessories",
    promoCopy:
      "Stay hydrated in style with the HydroBot Water Bottle. Your perfect companion for any adventure. Now with a lifetime warranty!",
    tagline: "Hydration Meets Style"
  },
  {
    id: "prod_005",
    name: "ZenFlow Yoga Mat",
    description:
      "Premium eco-friendly yoga mat with perfect grip and cushioning. Made from natural rubber and sustainable materials.",
    price: 1299,
    oldPrice: 1599,
    stock: 200,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
    category: "Fitness",
    promoCopy:
      "Find your inner peace with the ZenFlow Yoga Mat. Premium grip, eco-friendly materials, and perfect cushioning for every pose.",
    tagline: "Find Your Balance"
  },
  {
    id: "prod_006",
    name: "SmartHome Hub Pro",
    description:
      "Central control hub for all your smart home devices. Voice control, automation, and seamless integration with 100+ devices.",
    price: 3499,
    stock: 60,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    category: "Electronics",
    promoCopy:
      "Transform your home with SmartHome Hub Pro. Control everything with your voice and create the perfect automated environment.",
    isNew: true,
    tagline: "Smart Living Made Simple"
  },
  {
    id: "prod_007",
    name: "Artisan Coffee Maker",
    description:
      "Professional-grade coffee maker with built-in grinder and temperature control. Brew barista-quality coffee at home.",
    price: 2499,
    oldPrice: 2999,
    stock: 85,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    category: "Kitchen",
    promoCopy:
      "Brew perfection with the Artisan Coffee Maker. Professional-grade quality meets home convenience. Your daily ritual just got better.",
    tagline: "Brew Perfection Daily"
  },
  {
    id: "prod_008",
    name: "Adventure Backpack",
    description:
      "Durable 40L backpack with weather-resistant material and smart organization. Perfect for hiking, travel, and everyday use.",
    price: 1799,
    stock: 120,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop",
    category: "Travel",
    promoCopy:
      "Pack your adventures with the Adventure Backpack. Durable, organized, and ready for any journey. Your perfect travel companion.",
    tagline: "Pack Your Adventures"
  },
  {
    id: "prod_009",
    name: "Wireless Earbuds Pro",
    description:
      "Premium wireless earbuds with active noise cancellation and 24-hour battery life. Crystal clear sound quality.",
    price: 2999,
    oldPrice: 3999,
    stock: 45,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop",
    category: "Electronics",
    promoCopy:
      "Experience premium sound with Wireless Earbuds Pro. Active noise cancellation and 24-hour battery life. Limited stock!",
    tagline: "Premium Sound Experience"
  },
  {
    id: "prod_010",
    name: "Designer Watch",
    description:
      "Elegant designer watch with premium materials and precise movement. Perfect for any occasion.",
    price: 8999,
    oldPrice: 12999,
    stock: 25,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=400&fit=crop",
    category: "Accessories",
    promoCopy:
      "Elevate your style with our Designer Watch. Premium materials and precise movement. Only 25 left in stock!",
    tagline: "Timeless Elegance"
  },
  {
    id: "prod_011",
    name: "Gaming Laptop",
    description:
      "High-performance gaming laptop with RTX graphics and 144Hz display. Perfect for gamers and creators.",
    price: 89999,
    oldPrice: 109999,
    stock: 15,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=400&fit=crop",
    category: "Electronics",
    promoCopy:
      "Dominate the game with our Gaming Laptop. RTX graphics and 144Hz display. Only 15 units available!",
    tagline: "Game Like a Pro"
  },
  {
    id: "prod_012",
    name: "Smartphone Ultra",
    description:
      "Latest smartphone with advanced camera system and all-day battery life. Revolutionary technology.",
    price: 49999,
    oldPrice: 59999,
    stock: 30,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
    category: "Electronics",
    promoCopy:
      "Capture life's moments with Smartphone Ultra. Advanced camera system and all-day battery. Limited time offer!",
    tagline: "Capture Everything"
  },
  {
    id: "prod_013",
    name: "Premium Headphones",
    description:
      "Studio-quality headphones with noise cancellation and premium sound. Perfect for music lovers.",
    price: 12999,
    oldPrice: 15999,
    stock: 8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
    category: "Electronics",
    promoCopy:
      "Experience studio-quality sound with Premium Headphones. Only 8 units remaining!",
    tagline: "Studio Quality Sound"
  },
  {
    id: "prod_014",
    name: "Limited Edition Watch",
    description:
      "Exclusive limited edition watch with premium craftsmanship. Only a few pieces available worldwide.",
    price: 29999,
    oldPrice: 39999,
    stock: 3,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
    category: "Accessories",
    promoCopy:
      "Own a piece of exclusivity with Limited Edition Watch. Only 3 pieces left worldwide!",
    tagline: "Exclusive Luxury"
  },
  {
    id: "prod_015",
    name: "Gaming Console Pro",
    description:
      "Next-generation gaming console with 4K graphics and lightning-fast loading times.",
    price: 59999,
    oldPrice: 69999,
    stock: 12,
    image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=600&h=400&fit=crop",
    category: "Electronics",
    promoCopy:
      "Level up your gaming with Gaming Console Pro. Only 12 units in stock!",
    tagline: "Next-Gen Gaming"
  }
];

export const sampleProducts = [
  {
    id: "sample_001",
    name: "T-Shirt",
    price: 19.99,
    description: "Comfortable cotton t-shirt",
    category: "Apparel",
    stock: 100,
    imageUrl: "https://example.com/tshirt.jpg"
  },
  {
    id: "sample_002",
    name: "Sneakers",
    price: 49.99,
    description: "Running sneakers",
    category: "Footwear",
    stock: 50,
    imageUrl: "https://example.com/sneakers.jpg"
  }
];
