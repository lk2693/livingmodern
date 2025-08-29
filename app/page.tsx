"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Menu, X, ShoppingBag, Heart, Star, ArrowRight, Phone, Mail, MapPin, 
  Search, User, Filter, Grid, List, Play, Quote,
  Truck, Shield, RotateCcw, Award, Facebook, Instagram, Twitter,
  ChevronLeft, ChevronRight, Plus, Minus, Eye, Share2, Globe
} from 'lucide-react';

type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isNew: boolean;
  isSale: boolean;
  colors: string[];
  description: string;
  features?: string[];
  dimensions?: string;
  material?: string;
  images?: string[];
};

type CartItem = Product & {
  quantity: number;
  selectedColor: string;
};

type Language = 'de' | 'en';

type Translations = {
  [key: string]: {
    de: string;
    en: string;
  };
};

const translations: Translations = {
  // Navigation
  home: { de: 'Startseite', en: 'Home' },
  products: { de: 'Produkte', en: 'Products' },
  about: { de: 'Über uns', en: 'About' },
  blog: { de: 'Blog', en: 'Blog' },
  contact: { de: 'Kontakt', en: 'Contact' },
  
  // Hero Section
  heroTitle1: { de: 'Nahtlose Möbel mit natürlichen Stoffen', en: 'Seamless furniture with natural fabrics' },
  heroSubtitle1: { de: 'Entdecken Sie unsere Kollektion von durchdacht gestalteten Möbeln', en: 'Discover our collection of thoughtfully designed furniture' },
  shopCollection: { de: 'Kollektion ansehen', en: 'Shop Collection' },
  
  // Features
  freeShipping: { de: 'Kostenloser Versand', en: 'Free Shipping' },
  freeShippingDesc: { de: 'Kostenlose Lieferung ab €200', en: 'Free delivery on orders over €200' },
  warranty: { de: '2 Jahre Garantie', en: '2 Year Warranty' },
  warrantyDesc: { de: 'Umfassende Abdeckung inklusive', en: 'Comprehensive coverage included' },
  easyReturns: { de: 'Einfache Rückgabe', en: 'Easy Returns' },
  easyReturnsDesc: { de: '30-Tage Rückgaberecht', en: '30-day return policy' },
  awardWinning: { de: 'Preisgekrönt', en: 'Award Winning' },
  awardWinningDesc: { de: 'Ausgezeichnet für Design-Exzellenz', en: 'Recognized for design excellence' },
  
  // Products Section
  featuredProducts: { de: 'Unsere empfohlenen Produkte', en: 'Our Featured Products' },
  productsDescription: { de: 'Entdecken Sie unsere sorgfältig kuratierte Kollektion von Möbeln und Wohnaccessoires', en: 'Discover our carefully curated collection of furniture and home accessories' },
  addToCart: { de: 'In den Warenkorb', en: 'Add to Cart' },
  colors: { de: 'Farben:', en: 'Colors:' },
  
  // Cart
  cart: { de: 'Warenkorb', en: 'Cart' },
  cartEmpty: { de: 'Ihr Warenkorb ist leer', en: 'Your cart is empty' },
  quantity: { de: 'Menge', en: 'Quantity' },
  remove: { de: 'Entfernen', en: 'Remove' },
  total: { de: 'Gesamt', en: 'Total' },
  checkout: { de: 'Zur Kasse', en: 'Checkout' },
  continueShopping: { de: 'Weiter einkaufen', en: 'Continue Shopping' },
  
  // Product Details
  productDetails: { de: 'Produktdetails', en: 'Product Details' },
  features: { de: 'Eigenschaften', en: 'Features' },
  dimensions: { de: 'Abmessungen', en: 'Dimensions' },
  material: { de: 'Material', en: 'Material' },
  selectColor: { de: 'Farbe wählen', en: 'Select Color' },
  addedToCart: { de: 'Zum Warenkorb hinzugefügt', en: 'Added to Cart' },
  backToProducts: { de: 'Zurück zu Produkten', en: 'Back to Products' },
  
  // Categories
  all: { de: 'Alle', en: 'All' },
  chairs: { de: 'Stühle', en: 'Chairs' },
  tables: { de: 'Tische', en: 'Tables' },
  storage: { de: 'Aufbewahrung', en: 'Storage' },
  lighting: { de: 'Beleuchtung', en: 'Lighting' },
  sofas: { de: 'Sofas', en: 'Sofas' },
  decor: { de: 'Dekoration', en: 'Decor' },
  
  // About Section
  aboutTitle: { de: 'Unsere Geschichte der nachhaltigen Handwerkskunst', en: 'Our Story of Sustainable Craftsmanship' },
  aboutText1: { de: 'Seit über einem Jahrzehnt setzen wir uns dafür ein, Möbel zu schaffen, die nicht nur schön aussehen, sondern auch unseren Planeten respektieren. Jedes Stück wird mit nachhaltigen Materialien und traditionellen Techniken gefertigt, die über Generationen weitergegeben wurden.', en: 'For over a decade, we\'ve been committed to creating furniture that not only looks beautiful but also respects our planet. Every piece is crafted using sustainable materials and traditional techniques passed down through generations.' },
  yearsExperience: { de: 'Jahre Erfahrung', en: 'Years Experience' },
  happyCustomers: { de: 'Zufriedene Kunden', en: 'Happy Customers' },
  sustainable: { de: 'Nachhaltig', en: 'Sustainable' },
  
  // Testimonials
  customerSay: { de: 'Was unsere Kunden sagen', en: 'What Our Customers Say' },
  
  // Blog
  latestBlog: { de: 'Neueste Beiträge aus unserem Blog', en: 'Latest from Our Blog' },
  blogDescription: { de: 'Einblicke, Tipps und Inspiration für die Gestaltung schöner, nachhaltiger Wohnräume', en: 'Insights, tips, and inspiration for creating beautiful, sustainable living spaces' },
  readMore: { de: 'Mehr lesen', en: 'Read More' },
  viewAllPosts: { de: 'Alle Beiträge ansehen', en: 'View All Posts' },
  
  // Gallery
  interiorInspiration: { de: 'Wohnungs-Inspiration', en: 'Interior Inspiration' },
  galleryDescription: { de: 'Sehen Sie, wie unsere Möbel in echten Häusern aussehen und lassen Sie sich für Ihren eigenen Raum inspirieren', en: 'See how our furniture looks in real homes and get inspired for your own space' },
  viewFullGallery: { de: 'Vollständige Galerie ansehen', en: 'View Full Gallery' },
  
  // FAQ
  faqTitle: { de: 'Häufig gestellte Fragen', en: 'Frequently Asked Questions' },
  faqDescription: { de: 'Alles, was Sie über unsere Produkte und Dienstleistungen wissen müssen', en: 'Everything you need to know about our products and services' },
  
  // Newsletter
  joinCommunity: { de: 'Treten Sie unserer Design-Community bei', en: 'Join Our Design Community' },
  newsletterDescription: { de: 'Erhalten Sie exklusiven Zugang zu neuen Kollektionen, Design-Tipps und Sonderangeboten. Außerdem erhalten Sie 10% Rabatt auf Ihre erste Bestellung, wenn Sie sich anmelden.', en: 'Get exclusive access to new collections, design tips, and special offers. Plus, receive 10% off your first order when you subscribe.' },
  subscribe: { de: 'Abonnieren', en: 'Subscribe' },
  emailPlaceholder: { de: 'Geben Sie Ihre E-Mail-Adresse ein', en: 'Enter your email address' },
  
  // Contact
  getInTouch: { de: 'Kontakt aufnehmen', en: 'Get in Touch' },
  contactDescription: { de: 'Haben Sie Fragen zu unseren Produkten oder benötigen Sie Design-Beratung? Unser Team hilft Ihnen gerne dabei, den perfekten Raum zu schaffen.', en: 'Have questions about our products or need design advice? Our team is here to help you create the perfect space.' },
  phone: { de: 'Telefon', en: 'Phone' },
  email: { de: 'E-Mail', en: 'Email' },
  showroom: { de: 'Showroom', en: 'Showroom' },
  showroomHours: { de: 'Showroom-Öffnungszeiten', en: 'Showroom Hours' },
  sendMessage: { de: 'Nachricht senden', en: 'Send us a Message' },
  firstName: { de: 'Vorname', en: 'First Name' },
  lastName: { de: 'Nachname', en: 'Last Name' },
  emailAddress: { de: 'E-Mail-Adresse', en: 'Email Address' },
  phoneNumber: { de: 'Telefonnummer (Optional)', en: 'Phone Number (Optional)' },
  howCanWeHelp: { de: 'Wie können wir Ihnen helfen?', en: 'How can we help you?' },
  yourMessage: { de: 'Ihre Nachricht', en: 'Your Message' },
  sendMessageButton: { de: 'Nachricht senden', en: 'Send Message' },
  
  // Top bar
  freeShippingOffer: { de: 'Kostenloser Versand ab €200', en: 'Free shipping on orders over €200' },
  followUs: { de: 'Folgen Sie uns:', en: 'Follow us:' },
  
  // Video Section
  watchOurStory: { de: 'Unsere Geschichte ansehen', en: 'Watch Our Story' },
  craftsmanshipVideo: { de: 'Handwerkskunst in Aktion', en: 'Craftsmanship in Action' },
  videoDescription: { de: 'Erleben Sie, wie unsere Möbel mit Leidenschaft und Präzision von Hand gefertigt werden. Jedes Stück erzählt eine Geschichte von traditioneller Handwerkskunst und modernem Design.', en: 'Experience how our furniture is handcrafted with passion and precision. Every piece tells a story of traditional craftsmanship and modern design.' },
  
  // Demo Banner
  demoWebsite: { de: 'Demo-Website', en: 'Demo Website' },
  poweredBy: { de: 'Entwickelt von', en: 'Powered by' },
  demoDescription: { de: 'Dies ist eine Demo-Website von PrintzzDigital', en: 'This is a demo website by PrintzzDigital' },
  orderWebsite: { de: 'Website beauftragen', en: 'Order Website' },
  fullstackSolution: { de: 'Fullstack-Lösung', en: 'Fullstack Solution' },
  techStack: { de: 'Tech-Stack:', en: 'Tech Stack:' },
  getQuote: { de: 'Angebot anfordern', en: 'Get Quote' },
  learnMore: { de: 'Mehr erfahren', en: 'Learn More' },
  
  // Newsletter additional
  privacyPolicy: { de: 'Durch das Abonnieren stimmen Sie unserer Datenschutzrichtlinie zu. Jederzeit abbestellbar.', en: 'By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.' }
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string>(''); // Track which video to play
  const [isVideoActuallyPlaying, setIsVideoActuallyPlaying] = useState(false); // Track if video is actually playing
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [language, setLanguage] = useState<Language>('de');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'de' ? 'en' : 'de');
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const categories = ['all', 'chairs', 'tables', 'storage', 'lighting', 'sofas', 'decor'];

  const getHeroSlides = useCallback(() => [
    {
      title: t('heroTitle1'),
      subtitle: t('heroSubtitle1'),
      image: "/Hero.png",
      cta: t('shopCollection')
    },
    {
      title: language === 'de' ? 'Nachhaltiges Design für modernes Wohnen' : 'Sustainable Design for Modern Living',
      subtitle: language === 'de' ? 'Umweltfreundliche Materialien treffen auf zeitgenössische Ästhetik' : 'Eco-friendly materials meet contemporary aesthetics',
      image: "/wohnzimmer.png",
      cta: language === 'de' ? 'Mehr erfahren' : 'Learn More'
    },
    {
      title: language === 'de' ? 'Handwerkliche Exzellenz' : 'Handcrafted Excellence',
      subtitle: language === 'de' ? 'Jedes Stück erzählt eine Geschichte von Handwerkskunst' : 'Every piece tells a story of artisan craftsmanship',
      image: "/schlafzimmer.png",
      cta: language === 'de' ? 'Handwerkskunst entdecken' : 'Discover Craftsmanship'
    }
  ], [language, t]);

  // Product translations
  const getProductName = (productId: number, englishName: string): string => {
    const translations: { [key: number]: { de: string } } = {
      1: { de: "Native Light Stuhl" },
      2: { de: "Geflochtener Aufbewahrungskorb" },
      3: { de: "Minimalistische Stehlampe" },
      4: { de: "Moderner Beistelltisch" },
      5: { de: "Komfort Sofa" },
      6: { de: "Rattan Hängelampe" },
      7: { de: "Deko-Vase" },
      8: { de: "Holzschrank" }
    };
    return language === 'de' && translations[productId] ? translations[productId].de : englishName;
  };

  const getProductDescription = (productId: number, englishDesc: string): string => {
    const translations: { [key: number]: { de: string } } = {
      1: { de: "Handgefertigter Stuhl mit natürlichem Korbgeflecht" },
      2: { de: "Nachhaltige Rattan-Aufbewahrungslösung" },
      3: { de: "Zeitgenössische Stehlampe mit verstellbarer Höhe" },
      4: { de: "Massivholz-Beistelltisch mit verstecktem Stauraum" },
      5: { de: "Dreisitzer-Sofa mit nachhaltigem Schaumstoff" },
      6: { de: "Handgewobene Rattan-Hängelampe" },
      7: { de: "Keramikvase mit einzigartiger Textur" },
      8: { de: "Multifunktionaler Aufbewahrungsschrank" }
    };
    return language === 'de' && translations[productId] ? translations[productId].de : englishDesc;
  };

  const products: Product[] = [
    {
      id: 1,
      name: "Native Light Chair",
      price: 299,
      originalPrice: 399,
      image: "/stuhl.png",
      category: "chairs",
      rating: 4.8,
      reviews: 124,
      isNew: false,
      isSale: true,
      colors: ['oak', 'walnut', 'ash'],
      description: "Handcrafted chair with natural cane weaving",
      features: ["Handcrafted", "Natural cane weaving", "Ergonomic design", "Sustainable materials"],
      dimensions: "60cm x 55cm x 80cm",
      material: "Solid oak wood with natural cane",
      images: ["/api/placeholder/300/300", "/api/placeholder/400/400", "/api/placeholder/500/500"]
    },
    {
      id: 2,
      name: "Woven Storage Basket",
      price: 89,
      originalPrice: null,
      image: "/koerbe.png",
      category: "storage",
      rating: 4.6,
      reviews: 89,
      isNew: true,
      isSale: false,
      colors: ['natural', 'dark'],
      description: "Sustainable rattan storage solution",
      features: ["Sustainable rattan", "Handwoven", "Large capacity", "Lightweight"],
      dimensions: "40cm x 40cm x 35cm",
      material: "100% natural rattan",
      images: ["/api/placeholder/300/300", "/api/placeholder/400/400"]
    },
    {
      id: 3,
      name: "Minimalist Floor Lamp",
      price: 159,
      originalPrice: null,
      image: "/stehlampe.png",
      category: "lighting",
      rating: 4.9,
      reviews: 203,
      isNew: false,
      isSale: false,
      colors: ['black', 'brass', 'white'],
      description: "Contemporary floor lamp with adjustable height",
      features: ["Adjustable height", "LED compatible", "Modern design", "Stable base"],
      dimensions: "25cm x 25cm x 150cm",
      material: "Metal with fabric shade",
      images: ["/api/placeholder/300/300", "/api/placeholder/400/400", "/api/placeholder/500/500"]
    },
    {
      id: 4,
      name: "Modern Side Table",
      price: 199,
      originalPrice: 249,
      image: "/tisch.png",
      category: "tables",
      rating: 4.7,
      reviews: 156,
      isNew: false,
      isSale: true,
      colors: ['oak', 'walnut'],
      description: "Solid wood side table with hidden storage",
      features: ["Hidden storage", "Solid wood", "Modern design", "Easy assembly"],
      dimensions: "45cm x 35cm x 55cm",
      material: "Solid oak/walnut wood",
      images: ["/api/placeholder/300/300", "/api/placeholder/400/400"]
    },
    {
      id: 5,
      name: "Comfortable Sofa",
      price: 899,
      originalPrice: null,
      image: "/sofa.png",
      category: "sofas",
      rating: 4.8,
      reviews: 78,
      isNew: true,
      isSale: false,
      colors: ['beige', 'charcoal', 'sage'],
      description: "Three-seater sofa with sustainable foam",
      features: ["Three-seater", "Sustainable foam", "Removable covers", "Premium fabric"],
      dimensions: "200cm x 85cm x 75cm",
      material: "Sustainable foam with premium fabric covers",
      images: ["/api/placeholder/300/300", "/api/placeholder/600/400", "/api/placeholder/500/500"]
    },
    {
      id: 6,
      name: "Rattan Pendant Light",
      price: 129,
      originalPrice: null,
      image: "/hängelampe.png",
      category: "lighting",
      rating: 4.5,
      reviews: 92,
      isNew: false,
      isSale: false,
      colors: ['natural', 'black'],
      description: "Handwoven rattan pendant light",
      features: ["Handwoven", "Natural rattan", "Easy installation", "Ambient lighting"],
      dimensions: "35cm diameter x 30cm height",
      material: "Natural rattan with metal fittings",
      images: ["/api/placeholder/300/300", "/api/placeholder/400/400"]
    },
    {
      id: 7,
      name: "Decorative Vase",
      price: 45,
      originalPrice: 65,
      image: "/vase.png",
      category: "decor",
      rating: 4.4,
      reviews: 234,
      isNew: false,
      isSale: true,
      colors: ['white', 'terracotta', 'sage'],
      description: "Ceramic vase with unique texture",
      features: ["Unique texture", "Handcrafted ceramic", "Waterproof", "Decorative"],
      dimensions: "15cm diameter x 25cm height",
      material: "Glazed ceramic",
      images: ["/api/placeholder/300/300", "/api/placeholder/400/400"]
    },
    {
      id: 8,
      name: "Wooden Cabinet",
      price: 449,
      originalPrice: null,
      image: "/schrank.png",
      category: "storage",
      rating: 4.9,
      reviews: 67,
      isNew: true,
      isSale: false,
      colors: ['oak', 'pine', 'walnut'],
      description: "Multi-functional storage cabinet"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Interior Designer",
      text: "Seamless furniture transformed my client's space. The quality and attention to detail is exceptional. Every piece feels like art.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face&auto=format"
    },
    {
      name: "Michael Chen",
      role: "Homeowner",
      text: "I've been searching for sustainable furniture that doesn't compromise on style. Seamless delivered exactly what I was looking for.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emma Rodriguez",
      role: "Architect",
      text: "The craftsmanship is outstanding. I recommend Seamless to all my clients who value both aesthetics and sustainability.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const blogPosts = [
    {
      title: "The Art of Minimalist Living",
      excerpt: "Discover how to create a serene living space with carefully selected furniture pieces.",
      image: "/minimalist.png",
      category: "Lifestyle",
      readTime: "5 min read",
      date: "March 15, 2025"
    },
    {
      title: "Sustainable Materials in Modern Furniture",
      excerpt: "Learn about eco-friendly materials that are revolutionizing furniture design.",
      image: "/moodboard.png",
      category: "Sustainability",
      readTime: "7 min read",
      date: "March 12, 2025"
    }
  ];

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (product: Product, selectedColor?: string) => {
    console.log('Adding to cart:', product.name, selectedColor || product.colors[0]); // Debug log
    
    const existingItem = cart.find(item => item.id === product.id && item.selectedColor === (selectedColor || product.colors[0]));
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id && item.selectedColor === (selectedColor || product.colors[0])
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { 
        ...product, 
        quantity: 1, 
        selectedColor: selectedColor || product.colors[0] 
      }]);
    }
    
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
    console.log('Cart updated:', cart.length + 1, 'items'); // Debug log
  };

  const removeFromCart = (productId: number, selectedColor: string) => {
    setCart(cart.filter(item => !(item.id === productId && item.selectedColor === selectedColor)));
  };

  const updateCartQuantity = (productId: number, selectedColor: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedColor);
    } else {
      setCart(cart.map(item => 
        item.id === productId && item.selectedColor === selectedColor
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Debug useEffect for selectedProduct
  useEffect(() => {
    if (selectedProduct) {
      console.log('Selected product changed:', selectedProduct.name);
    } else {
      console.log('Selected product cleared');
    }
  }, [selectedProduct]);

  useEffect(() => {
    const heroSlides = getHeroSlides();
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => {
      clearInterval(slideInterval);
      clearInterval(testimonialInterval);
    };
  }, [getHeroSlides, testimonials.length]); // Add getHeroSlides as dependency

  return (
    <div className="min-h-screen bg-white">
      {/* Demo Banner - Prominent at the very top */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 relative z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Left: Demo Info */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="font-bold text-lg">{t('demoWebsite')}</span>
                <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">LIVE</span>
              </div>
              <span className="text-white/90 text-sm text-center sm:text-left">{t('demoDescription')}</span>
            </div>
            
            {/* Center: Tech Stack Preview */}
            <div className="hidden md:flex items-center space-x-3">
              <span className="text-white/80 text-sm">{t('techStack')}</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded text-xs">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Next.js</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded text-xs">
                  <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                  <span>Stripe</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded text-xs">
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                  <span>Supabase</span>
                </div>
              </div>
            </div>
            
            {/* Right: PrintzzDigital & CTA */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-white/80 text-sm">{t('poweredBy')}</span>
                <span className="font-bold text-lg">PrintzzDigital</span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => window.open('https://printzzdigital.com/contact', '_blank')}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg"
                >
                  {t('getQuote')}
                </button>
                <button 
                  onClick={() => window.open('https://printzzdigital.com', '_blank')}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm border border-white/30"
                >
                  {t('learnMore')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Bar */}
      <div className="bg-stone-800 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>{t('freeShippingOffer')}</span>
          <div className="flex items-center space-x-4">
            <span>{t('followUs')}</span>
            <Facebook className="w-4 h-4 hover:text-stone-300 cursor-pointer" />
            <Instagram className="w-4 h-4 hover:text-stone-300 cursor-pointer" />
            <Twitter className="w-4 h-4 hover:text-stone-300 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-light text-stone-800">Seamless</h1>
              {/* Debug Info */}
              {selectedProduct && (
                <span className="ml-4 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Selected: {selectedProduct.name}
                </span>
              )}
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-stone-600 hover:text-stone-800 transition-colors">{t('home')}</a>
              <a href="#products" className="text-stone-600 hover:text-stone-800 transition-colors">{t('products')}</a>
              <a href="#about" className="text-stone-600 hover:text-stone-800 transition-colors">{t('about')}</a>
              <a href="#blog" className="text-stone-600 hover:text-stone-800 transition-colors">{t('blog')}</a>
              <a href="#contact" className="text-stone-600 hover:text-stone-800 transition-colors">{t('contact')}</a>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button 
                onClick={toggleLanguage}
                className="items-center space-x-1 text-stone-600 hover:text-stone-800 cursor-pointer transition-colors hidden sm:flex"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </button>
              
              <Search className="w-5 h-5 text-stone-600 hover:text-stone-800 cursor-pointer transition-colors hidden sm:block" />
              <User className="w-5 h-5 text-stone-600 hover:text-stone-800 cursor-pointer transition-colors hidden sm:block" />
              <div className="relative">
                <Heart className="w-5 h-5 text-stone-600 hover:text-stone-800 cursor-pointer transition-colors" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-stone-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <div className="relative">
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative"
                >
                  <ShoppingBag className="w-5 h-5 text-stone-600 hover:text-stone-800 cursor-pointer transition-colors" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-stone-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getCartItemsCount()}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button onClick={toggleMenu} className="text-stone-600 hover:text-stone-800">
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-stone-100">
              <div className="flex flex-col space-y-3">
                <a href="#home" className="text-stone-600 hover:text-stone-800 transition-colors" onClick={toggleMenu}>{t('home')}</a>
                <a href="#products" className="text-stone-600 hover:text-stone-800 transition-colors" onClick={toggleMenu}>{t('products')}</a>
                <a href="#about" className="text-stone-600 hover:text-stone-800 transition-colors" onClick={toggleMenu}>{t('about')}</a>
                <a href="#blog" className="text-stone-600 hover:text-stone-800 transition-colors" onClick={toggleMenu}>{t('blog')}</a>
                <a href="#contact" className="text-stone-600 hover:text-stone-800 transition-colors" onClick={toggleMenu}>{t('contact')}</a>
                
                {/* Mobile Language Toggle */}
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors mt-4 pt-3 border-t border-stone-200"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {language === 'de' ? 'Deutsch' : 'English'} ({language.toUpperCase()})
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Slider */}
      <section id="home" className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {getHeroSlides().map((slide, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-black/30 z-10"></div>
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center text-center text-white">
                <div className="max-w-4xl mx-auto px-4">
                  <h2 className="text-4xl sm:text-6xl lg:text-7xl font-light mb-6 leading-tight">
                    {slide.title.split(' ').slice(0, 1)} <em className="italic">{slide.title.split(' ').slice(1, 2)}</em><br />
                    {slide.title.split(' ').slice(2).join(' ')}
                  </h2>
                  <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                    {slide.subtitle}
                  </p>
                  <button className="bg-white text-stone-800 px-8 py-4 hover:bg-stone-100 transition-colors inline-flex items-center space-x-2">
                    <span>{slide.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {getHeroSlides().map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Slider Arrows */}
        <button 
          onClick={() => {
            const heroSlides = getHeroSlides();
            setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
          }}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button 
          onClick={() => {
            const heroSlides = getHeroSlides();
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
          }}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-stone-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Video Content */}
            <div className="space-y-6">
              <h3 className="text-3xl sm:text-4xl font-light">
                {t('craftsmanshipVideo')}
              </h3>
              <p className="text-stone-300 leading-relaxed">
                {t('videoDescription')}
              </p>
              <button
                onClick={() => {
                  setCurrentVideo('/erstellung.mp4');
                  setIsVideoPlaying(true);
                }}
                className="bg-white text-stone-800 px-8 py-4 hover:bg-stone-100 transition-colors inline-flex items-center space-x-3 group"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{t('watchOurStory')}</span>
              </button>
            </div>

            {/* Video Thumbnail */}
            <div className="relative">
              <div className="aspect-video bg-stone-700 rounded-lg overflow-hidden relative group cursor-pointer"
                   onClick={() => {
                     setCurrentVideo('/erstellung.mp4');
                     setIsVideoPlaying(true);
                   }}>
                {/* Video Thumbnail - Shows first frame of erstellung.mp4 */}
                <video 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  muted
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    e.currentTarget.currentTime = 0.1;
                  }}
                  onError={(e) => {
                    // Hide video if it fails to load, showing the fallback background
                    e.currentTarget.style.display = 'none';
                  }}
                >
                  <source src="/erstellung.mp4" type="video/mp4" />
                  <source src="/erstellung.webm" type="video/webm" />
                </video>
                
                {/* Fallback background with gradient and text when video doesn't load */}
                <div className="absolute inset-0 bg-gradient-to-br from-stone-600 to-stone-800 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <Play className="w-16 h-16 mx-auto mb-4 text-white/70" />
                    <h4 className="text-xl font-light mb-2">{t('craftsmanshipVideo')}</h4>
                    <p className="text-stone-300 text-sm">Click to play video</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                    <Play className="w-8 h-8 text-stone-800 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl">
            <button
              onClick={() => {
                setIsVideoPlaying(false);
                setIsVideoActuallyPlaying(false);
              }}
              className="absolute -top-12 right-0 text-white hover:text-stone-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
              {/* Dynamic video with first frame preview */}
              <video
                className="w-full h-full"
                controls
                playsInline
                preload="metadata"
                key={currentVideo} // Force re-render when video changes
                onLoadedMetadata={(e) => {
                  // Set to first frame for poster effect
                  e.currentTarget.currentTime = 0.1;
                  setIsVideoActuallyPlaying(false);
                }}
                onPlay={() => setIsVideoActuallyPlaying(true)}
                onPause={() => setIsVideoActuallyPlaying(false)}
                onEnded={() => setIsVideoActuallyPlaying(false)}
              >
                <source src={currentVideo} type="video/mp4" />
                <source src={currentVideo.replace('.mp4', '.webm')} type="video/webm" />
                Your browser does not support the video element.
              </video>
              
              {/* Custom play overlay that disappears when video starts */}
              {!isVideoActuallyPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none transition-opacity duration-300">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-stone-800 ml-1" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-stone-600" />
              </div>
              <h3 className="text-lg font-medium text-stone-800 mb-2">{t('freeShipping')}</h3>
              <p className="text-stone-600 text-sm">{t('freeShippingDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-stone-600" />
              </div>
              <h3 className="text-lg font-medium text-stone-800 mb-2">{t('warranty')}</h3>
              <p className="text-stone-600 text-sm">{t('warrantyDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-stone-600" />
              </div>
              <h3 className="text-lg font-medium text-stone-800 mb-2">{t('easyReturns')}</h3>
              <p className="text-stone-600 text-sm">{t('easyReturnsDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-stone-600" />
              </div>
              <h3 className="text-lg font-medium text-stone-800 mb-2">{t('awardWinning')}</h3>
              <p className="text-stone-600 text-sm">{t('awardWinningDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Video Section */}
      <section id="about" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl sm:text-4xl font-light text-stone-800">
                {t('aboutTitle')}
              </h3>
              <p className="text-stone-600 text-lg">
                {t('aboutText1')}
              </p>
              <p className="text-stone-600">
                {language === 'de' 
                  ? 'Unsere Handwerker arbeiten mit zertifiziertem Holz, natürlichen Stoffen und umweltfreundlichen Oberflächen, um Möbel zu schaffen, die Generationen überdauern. Wir glauben an langsames Design - wir nehmen uns die Zeit, jedes Detail zu perfektionieren, anstatt schnell auf den Markt zu drängen.'
                  : 'Our artisans work with certified wood, natural fabrics, and eco-friendly finishes to create furniture that will last for generations. We believe in slow design - taking time to perfect each detail rather than rushing to market.'
                }
              </p>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-light text-stone-800">10+</div>
                  <div className="text-sm text-stone-600">{t('yearsExperience')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-stone-800">50k+</div>
                  <div className="text-sm text-stone-600">{t('happyCustomers')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-stone-800">100%</div>
                  <div className="text-sm text-stone-600">{t('sustainable')}</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-stone-200 rounded-lg overflow-hidden relative">
                {!isVideoPlaying ? (
                  <>
                    {/* Video Thumbnail - Shows first frame */}
                    <video 
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                      onLoadedMetadata={(e) => {
                        // Set video to first frame
                        e.currentTarget.currentTime = 0.1;
                      }}
                      onLoadedData={(e) => {
                        // Ensure we're showing the first frame
                        e.currentTarget.currentTime = 0.1;
                      }}
                    >
                      <source src="/videomoebelhaus.mp4" type="video/mp4" />
                      <source src="/videomoebelhaus.webm" type="video/webm" />
                    </video>
                    {/* Fallback background for when video doesn't load */}
                    <div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-500 flex items-center justify-center opacity-0 group-[.video-error]:opacity-100 transition-opacity">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-4 text-white/70" />
                        <h4 className="text-lg font-light mb-2">Workshop Video</h4>
                        <p className="text-stone-200 text-sm">Our Craftsmanship Story</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setCurrentVideo('/videomoebelhaus.mp4');
                        setIsVideoPlaying(true);
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group z-10"
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-stone-800 ml-1" />
                      </div>
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center text-white">
                    Video Player Placeholder
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-light text-stone-800 mb-4">
              {t('featuredProducts')}
            </h3>
            <p className="text-stone-600 max-w-2xl mx-auto">
              {t('productsDescription')}
            </p>
          </div>

          {/* Filter and View Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-stone-600" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-800"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {t(category)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:text-stone-800'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:text-stone-800'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={`group cursor-pointer ${
                viewMode === 'list' ? 'flex items-center space-x-6' : ''
              }`}>
                <div className={`relative ${
                  viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-square'
                } bg-stone-100 rounded-lg overflow-hidden mb-4 ${viewMode === 'list' ? 'mb-0' : ''}`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.isNew && (
                    <span className="absolute top-4 left-4 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      New
                    </span>
                  )}
                  {product.isSale && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      Sale
                    </span>
                  )}
                  {/* Hover overlay buttons */}
                  <div className="absolute top-4 right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity space-y-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`p-2 rounded-full ${wishlist.includes(product.id) ? 'bg-red-600 text-white' : 'bg-white text-stone-800'} shadow-md z-10`}
                    >
                      <Heart className="w-4 h-4" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Eye button clicked, setting product:', product.name); // Debug log
                        setSelectedProduct(product);
                      }}
                      className="p-2 bg-white text-stone-800 rounded-full shadow-md hover:bg-stone-50 z-10"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-white text-stone-800 rounded-full shadow-md z-10"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Mobile-friendly Add to Cart button - always visible on small screens */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="absolute bottom-4 left-4 right-4 bg-stone-800 text-white py-2 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-stone-700 z-10 text-sm font-medium"
                  >
                    {t('addToCart')}
                  </button>
                </div>
                <div className={`space-y-2 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-stone-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-stone-500">({product.reviews})</span>
                  </div>
                  <span className="text-sm text-stone-500 uppercase tracking-wide">
                    {product.category}
                  </span>
                  <h4 className="text-lg font-light text-stone-800 group-hover:text-stone-600 transition-colors">
                    {getProductName(product.id, product.name)}
                  </h4>
                  {viewMode === 'list' && (
                    <p className="text-stone-600 text-sm">{getProductDescription(product.id, product.description)}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium text-stone-800">€{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-stone-500 line-through">€{product.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-stone-600">{t('colors')}</span>
                    {product.colors.map((color, index) => (
                      <div 
                        key={index}
                        className={`w-4 h-4 rounded-full border-2 border-stone-300 ${
                          color === 'oak' ? 'bg-yellow-700' :
                          color === 'walnut' ? 'bg-amber-800' :
                          color === 'ash' ? 'bg-stone-400' :
                          color === 'natural' ? 'bg-yellow-100' :
                          color === 'dark' ? 'bg-stone-800' :
                          color === 'black' ? 'bg-black' :
                          color === 'brass' ? 'bg-yellow-600' :
                          color === 'white' ? 'bg-white' :
                          color === 'beige' ? 'bg-stone-200' :
                          color === 'charcoal' ? 'bg-stone-700' :
                          color === 'sage' ? 'bg-green-300' :
                          color === 'terracotta' ? 'bg-orange-600' :
                          color === 'pine' ? 'bg-yellow-600' :
                          'bg-stone-400'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Add to Cart button for list view */}
                  {viewMode === 'list' && (
                    <div className="flex items-center space-x-4 mt-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="bg-stone-800 text-white px-6 py-2 rounded-lg hover:bg-stone-700 transition-colors text-sm font-medium"
                      >
                        {t('addToCart')}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('List view product details button clicked:', product.name); // Debug log
                          setSelectedProduct(product);
                        }}
                        className="border border-stone-300 text-stone-800 px-6 py-2 rounded-lg hover:bg-stone-50 transition-colors text-sm font-medium"
                      >
                        {t('productDetails')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-light text-stone-800 mb-12">
            {t('customerSay')}
          </h3>
          
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500" style={{
              transform: `translateX(-${currentTestimonial * 100}%)`
            }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-8">
                  <div className="bg-white rounded-xl p-8 shadow-sm">
                    <div className="flex items-center justify-center mb-6">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-stone-100"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=f5f5f4&color=57534e&size=150`;
                        }}
                      />
                    </div>
                    <Quote className="w-8 h-8 text-stone-300 mx-auto mb-4" />
                    <p className="text-lg text-stone-700 mb-6 leading-relaxed">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div className="text-center">
                      <div className="font-medium text-stone-800 text-lg">{testimonial.name}</div>
                      <div className="text-sm text-stone-600 mb-4">{testimonial.role}</div>
                    </div>
                    <div className="flex items-center justify-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-stone-800' : 'bg-stone-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-light text-stone-800 mb-4">
              {t('latestBlog')}
            </h3>
            <p className="text-stone-600 max-w-2xl mx-auto">
              {t('blogDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="group cursor-pointer">
                <div className="aspect-[4/3] bg-stone-100 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-stone-500">
                    <span className="bg-stone-100 px-3 py-1 rounded-full">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h4 className="text-xl font-light text-stone-800 group-hover:text-stone-600 transition-colors leading-tight">
                    {post.title}
                  </h4>
                  <p className="text-stone-600">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-sm text-stone-500">{post.date}</span>
                    <button className="text-stone-800 hover:text-stone-600 inline-flex items-center space-x-1 text-sm font-medium">
                      <span>{t('readMore')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="border border-stone-800 text-stone-800 px-8 py-3 hover:bg-stone-800 hover:text-white transition-colors">
              {t('viewAllPosts')}
            </button>
          </div>
        </div>
      </section>

      {/* Gallery/Lookbook */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-light text-stone-800 mb-4">
              {t('interiorInspiration')}
            </h3>
            <p className="text-stone-600 max-w-2xl mx-auto">
              {t('galleryDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:row-span-2">
              <div className="aspect-[3/4] bg-stone-200 rounded-lg overflow-hidden">
                <img src="/wohnzimmer.png" alt="Living room inspiration" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
              </div>
            </div>
            <div className="aspect-square bg-stone-200 rounded-lg overflow-hidden">
              <img src="/abendtisch.png" alt="Dining room" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
            </div>
            <div className="aspect-square bg-stone-200 rounded-lg overflow-hidden">
              <img src="/schlafzimmer.png" alt="Schlafzimmer" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
            </div>
            <div className="lg:row-span-2">
              <div className="aspect-[3/4] bg-stone-200 rounded-lg overflow-hidden">
                <img src="/homeoffice.png" alt="Home office" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
              </div>
            </div>
            <div className="aspect-square bg-stone-200 rounded-lg overflow-hidden">
              <img src="/Küche.png" alt="Küche" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
            </div>
            <div className="aspect-square bg-stone-200 rounded-lg overflow-hidden">
              <img src="/Bad.png" alt="Bathroom" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-stone-800 text-white px-8 py-3 hover:bg-stone-700 transition-colors inline-flex items-center space-x-2">
              <span>{t('viewFullGallery')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-light text-stone-800 mb-4">
              {t('faqTitle')}
            </h3>
            <p className="text-stone-600">
              {t('faqDescription')}
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "What materials do you use in your furniture?",
                answer: "We exclusively use sustainably sourced hardwoods, natural fabrics like organic cotton and linen, and eco-friendly finishes. All our wood comes from certified sustainable forests."
              },
              {
                question: "Do you offer custom furniture?",
                answer: "Yes, we offer custom furniture services. Our team of designers and craftspeople can work with you to create bespoke pieces that fit your exact specifications and space requirements."
              },
              {
                question: "What is your return policy?",
                answer: "We offer a 30-day return policy for all purchases. Items must be returned in their original condition. Custom pieces are not eligible for return unless there's a manufacturing defect."
              },
              {
                question: "How long does delivery take?",
                answer: "Standard delivery takes 2-4 weeks depending on your location. Custom pieces typically take 6-8 weeks to complete. We offer white glove delivery service for larger items."
              },
              {
                question: "Do you ship internationally?",
                answer: "Currently, we ship within Europe. For international orders outside Europe, please contact our customer service team for special arrangements."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-stone-200 rounded-lg">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-stone-50 transition-colors">
                  <span className="font-medium text-stone-800">{faq.question}</span>
                  <Plus className="w-5 h-5 text-stone-600 group-open:rotate-45 transition-transform" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-stone-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-stone-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-light mb-4">
            {t('joinCommunity')}
          </h3>
          <p className="text-stone-300 mb-8 max-w-2xl mx-auto">
            {t('newsletterDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <input 
              type="email" 
              placeholder={t('emailPlaceholder')}
              className="flex-1 px-4 py-3 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300"
            />
            <button className="bg-white text-stone-800 px-8 py-3 rounded-lg hover:bg-stone-100 transition-colors font-medium">
              {t('subscribe')}
            </button>
          </div>
          <p className="text-stone-400 text-sm">
            {t('privacyPolicy')}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl sm:text-4xl font-light text-stone-800 mb-4">
                  Get in Touch
                </h3>
                <p className="text-stone-600 text-lg">
                  Have questions about our products or need design advice? 
                  Our team is here to help you create the perfect space.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-stone-800">Phone</div>
                    <div className="text-stone-600">+49 40 1234 5678</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-stone-800">Email</div>
                    <div className="text-stone-600">hello@seamless.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-stone-800">Showroom</div>
                    <div className="text-stone-600">Mönckebergstraße 17<br />20095 Hamburg, Germany</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-stone-800">Showroom Hours</h4>
                <div className="text-stone-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>10:00 - 19:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>12:00 - 17:00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h4 className="text-xl font-medium text-stone-800 mb-6">Send us a Message</h4>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="First Name"
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent"
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name"
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number (Optional)"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent"
                />
                <select className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent">
                  <option>How can we help you?</option>
                  <option>Product Information</option>
                  <option>Custom Furniture</option>
                  <option>Delivery Question</option>
                  <option>Return/Exchange</option>
                  <option>General Inquiry</option>
                </select>
                <textarea 
                  rows={4}
                  placeholder="Your Message"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent resize-none"
                ></textarea>
                <button className="w-full bg-stone-800 text-white py-3 rounded-lg hover:bg-stone-700 transition-colors font-medium">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-2xl font-light">Seamless</h4>
              <p className="text-stone-300 text-sm max-w-md">
                Creating beautiful, sustainable furniture for modern living spaces. 
                Every piece is crafted with attention to detail and respect for the environment.
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-6 h-6 text-stone-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-6 h-6 text-stone-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-6 h-6 text-stone-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h5 className="font-medium">Shop</h5>
              <ul className="space-y-2 text-stone-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sale Items</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium">Company</h5>
              <ul className="space-y-2 text-stone-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium">Support</h5>
              <ul className="space-y-2 text-stone-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Customer Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-700 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-stone-400 text-sm">© 2025 Seamless Furniture. All rights reserved.</p>
              <div className="flex space-x-6 text-stone-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-stone-800 text-white p-3 rounded-full shadow-lg hover:bg-stone-700 transition-colors z-40"
      >
        <ChevronLeft className="w-5 h-5 transform rotate-90" />
      </button>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)}></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-medium text-stone-800">{t('cart')}</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-stone-600 hover:text-stone-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-600">{t('cartEmpty')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.selectedColor}`} className="flex items-center space-x-4 p-4 border border-stone-200 rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-stone-800 truncate">{item.name}</h3>
                          <p className="text-sm text-stone-600">{t('colors')} {item.selectedColor}</p>
                          <p className="text-sm font-medium text-stone-800">€{item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.selectedColor, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.selectedColor, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.selectedColor)}
                          className="text-stone-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="border-t p-6 space-y-4">
                  <div className="flex justify-between items-center text-lg font-medium">
                    <span>{t('total')}</span>
                    <span>€{getCartTotal().toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-stone-800 text-white py-3 rounded-lg hover:bg-stone-700 transition-colors">
                    {t('checkout')}
                  </button>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="w-full border border-stone-300 text-stone-800 py-3 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    {t('continueShopping')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Debug info */}
      {selectedProduct && (
        <div className="fixed top-20 left-4 bg-red-600 text-white px-4 py-2 rounded z-[70] text-sm">
          Modal should show: {selectedProduct.name}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-stone-50"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden">
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.map((img, index) => (
                        <div key={index} className="aspect-square bg-stone-100 rounded overflow-hidden">
                          <img src={img} alt={`${selectedProduct.name} ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-light text-stone-800 mb-2">{getProductName(selectedProduct.id, selectedProduct.name)}</h1>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-current' : 'text-stone-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-stone-500">({selectedProduct.reviews} {language === 'de' ? 'Bewertungen' : 'reviews'})</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-medium text-stone-800">€{selectedProduct.price}</span>
                      {selectedProduct.originalPrice && (
                        <span className="text-lg text-stone-500 line-through">€{selectedProduct.originalPrice}</span>
                      )}
                    </div>
                    <p className="text-stone-600 leading-relaxed">{getProductDescription(selectedProduct.id, selectedProduct.description)}</p>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <h3 className="font-medium text-stone-800 mb-3">{t('selectColor')}</h3>
                    <div className="flex items-center space-x-3">
                      {selectedProduct.colors.map((color) => (
                        <button 
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 border-stone-300 ${
                            color === 'oak' ? 'bg-yellow-700' :
                            color === 'walnut' ? 'bg-amber-800' :
                            color === 'ash' ? 'bg-stone-400' :
                            color === 'natural' ? 'bg-yellow-100' :
                            color === 'dark' ? 'bg-stone-800' :
                            color === 'black' ? 'bg-black' :
                            color === 'brass' ? 'bg-yellow-600' :
                            color === 'white' ? 'bg-white' :
                            color === 'beige' ? 'bg-stone-200' :
                            color === 'charcoal' ? 'bg-stone-700' :
                            color === 'sage' ? 'bg-green-300' :
                            color === 'terracotta' ? 'bg-orange-600' :
                            'bg-stone-400'
                          } hover:scale-110 transition-transform`}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  {selectedProduct.features && (
                    <div>
                      <h3 className="font-medium text-stone-800 mb-3">{t('features')}</h3>
                      <ul className="space-y-1">
                        {selectedProduct.features.map((feature, index) => (
                          <li key={index} className="text-stone-600 flex items-center">
                            <div className="w-1 h-1 bg-stone-400 rounded-full mr-3"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Specifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedProduct.dimensions && (
                      <div>
                        <h4 className="font-medium text-stone-800 text-sm">{t('dimensions')}</h4>
                        <p className="text-stone-600 text-sm">{selectedProduct.dimensions}</p>
                      </div>
                    )}
                    {selectedProduct.material && (
                      <div>
                        <h4 className="font-medium text-stone-800 text-sm">{t('material')}</h4>
                        <p className="text-stone-600 text-sm">{selectedProduct.material}</p>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-full bg-stone-800 text-white py-4 rounded-lg hover:bg-stone-700 transition-colors font-medium"
                  >
                    {t('addToCart')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Added to Cart Notification */}
      {showAddedToCart && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          ✓ {t('addedToCart')}
        </div>
      )}

      {/* PrintzzDigital Footer */}
      <footer className="bg-gradient-to-r from-stone-900 to-stone-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            {/* Demo Info */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-semibold">{t('demoWebsite')}</h3>
              </div>
              <p className="text-stone-300 text-sm leading-relaxed">
                {language === 'de' 
                  ? 'Diese professionelle E-Commerce-Website wurde als Demo von PrintzzDigital entwickelt, um moderne Fullstack-Webentwicklung zu demonstrieren.'
                  : 'This professional e-commerce website was developed as a demo by PrintzzDigital to showcase modern fullstack web development.'
                }
              </p>
            </div>

            {/* Tech Features */}
            <div className="text-center">
              <h4 className="text-lg font-medium mb-4 text-emerald-400">{t('fullstackSolution')}</h4>
              <div className="space-y-2 text-sm text-stone-300">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'de' ? 'Sichere Stripe-Zahlungen' : 'Secure Stripe Payments'}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                  <span>{language === 'de' ? 'Supabase Backend' : 'Supabase Backend'}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span>{language === 'de' ? 'Responsive Design' : 'Responsive Design'}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>{language === 'de' ? 'SEO-optimiert' : 'SEO Optimized'}</span>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="text-center lg:text-right">
              <h4 className="text-lg font-medium mb-4">PrintzzDigital</h4>
              <p className="text-stone-300 text-sm mb-6">
                {language === 'de' 
                  ? 'Benötigen Sie eine professionelle Website? Wir entwickeln moderne, skalierbare Weblösungen für Ihr Unternehmen.'
                  : 'Need a professional website? We develop modern, scalable web solutions for your business.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end">
                <button 
                  onClick={() => window.open('https://printzzdigital.com/contact', '_blank')}
                  className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>{t('getQuote')}</span>
                </button>
                <button 
                  onClick={() => window.open('https://printzzdigital.com', '_blank')}
                  className="border border-stone-600 hover:border-stone-500 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>{t('learnMore')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-stone-700 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-stone-400 text-sm">
              © 2025 PrintzzDigital. {language === 'de' ? 'Demo-Website für Showcasing-Zwecke.' : 'Demo website for showcasing purposes.'}
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <span className="text-stone-500 text-xs">{t('techStack')}</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-xs text-stone-400">Next.js</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-xs text-stone-400">Stripe</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-stone-400">Supabase</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}