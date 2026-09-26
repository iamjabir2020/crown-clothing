import { Product, OrderTelemetry, BespokeLead, DeliveryZone } from '../types';

import heroFashionImg from '../assets/images/hero_crown_fashion_1790417371860.jpg';
import overcoatImg from '../assets/images/product_tailored_overcoat_1790417384963.jpg';
import silkDressImg from '../assets/images/product_silk_dress_1790417400989.jpg';
import merinoKnitImg from '../assets/images/product_merino_knitwear_1790417419287.jpg';
import courierFleetImg from '../assets/images/courier_fleet_tracking_1790417434344.jpg';

export { heroFashionImg, overcoatImg, silkDressImg, merinoKnitImg, courierFleetImg };

export const PRODUCTS: Product[] = [
  {
    id: 'crw-01',
    name: 'The Sovereign Cashmere Double-Breasted Overcoat',
    category: 'Outerwear',
    gender: 'Men',
    price: 890,
    originalPrice: 950,
    image: overcoatImg,
    secondaryImage: heroFashionImg,
    description: 'Crafted from ultra-dense 620gsm Scottish cashmere and superfine virgin wool. Finished with handcrafted natural horn buttons and bespoke silk-cupro jacquard lining featuring our royal insignia.',
    composition: '85% Virgin Wool, 15% Inner Mongolian Cashmere. 100% Cupro Lining.',
    fit: 'Tailored architectural drape. Structured shoulder canvas with gentle suppression at the waist.',
    colors: [
      { name: 'Royal Navy', hex: '#1e3a8a' },
      { name: 'Midnight Charcoal', hex: '#1e293b' },
      { name: 'Camel Vicuña', hex: '#b45309' },
    ],
    sizes: ['38R', '40R', '42R', '44R', '46R'],
    inStock: true,
    stockCount: 14,
    rating: 4.9,
    reviewCount: 38,
    isBestseller: true,
  },
  {
    id: 'crw-02',
    name: 'Aurelia Silk Charmeuse Bias-Cut Evening Slip',
    category: 'Dresses',
    gender: 'Women',
    price: 540,
    image: silkDressImg,
    secondaryImage: heroFashionImg,
    description: 'Cut on the true bias from fluid 28mm mulberry silk charmeuse for an effortlessly sculpted silhouette. Accented with subtle French seam finishing and delicate adjustable rouleau straps.',
    composition: '100% Grade 6A Mulberry Silk.',
    fit: 'Fluid bias silhouette. Skims hips naturally with a graceful floor-sweeping pooling hem.',
    colors: [
      { name: 'Royal Sapphire', hex: '#1d4ed8' },
      { name: 'Emerald Forest', hex: '#064e3b' },
      { name: 'Champagne Pearl', hex: '#fef3c7' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stockCount: 8,
    rating: 4.8,
    reviewCount: 29,
    isNew: true,
  },
  {
    id: 'crw-03',
    name: 'Westminster Fine-Gauge Merino Cable Sweater',
    category: 'Knitwear',
    gender: 'Unisex',
    price: 320,
    image: merinoKnitImg,
    secondaryImage: overcoatImg,
    description: 'Spun from 19.5-micron extrafine Australian merino wool with a tactile heritage cable weave. Breathable, temperature-regulating, and soft against bare skin.',
    composition: '100% Extrafine Merino Wool.',
    fit: 'Relaxed classic fit. Ribbed neck, hem, and cuffs for shape retention.',
    colors: [
      { name: 'Ivory Cream', hex: '#f8fafc' },
      { name: 'Navy Melange', hex: '#1e3a8a' },
      { name: 'Slate Heather', hex: '#475569' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 22,
    rating: 4.95,
    reviewCount: 52,
    isBestseller: true,
  },
  {
    id: 'crw-04',
    name: 'Windsor Bespoke Two-Piece Super 150s Suit',
    category: 'Tailoring',
    gender: 'Men',
    price: 1250,
    image: overcoatImg,
    secondaryImage: heroFashionImg,
    description: 'Woven in Biella, Italy from 100% Super 150s worsted wool. Features a half-canvas construction that contours to your body over time, pick-stitched peak lapels, and side adjusters on flat-front trousers.',
    composition: '100% Super 150s Italian Worsted Wool. Horn buttons.',
    fit: 'Modern tailored cut. Light chest canvas with natural drape.',
    colors: [
      { name: 'Deep Royal Navy', hex: '#1e3a8a' },
      { name: 'Monarch Charcoal', hex: '#334155' },
    ],
    sizes: ['38R', '40R', '42R', '44R'],
    inStock: true,
    stockCount: 9,
    rating: 5.0,
    reviewCount: 19,
    isNew: true,
  },
  {
    id: 'crw-05',
    name: 'Empress Sculpted Wool & Cashmere Cape',
    category: 'Outerwear',
    gender: 'Women',
    price: 780,
    image: silkDressImg,
    secondaryImage: merinoKnitImg,
    description: 'A regal silhouette tailored with a structured high collar, hidden front placket, and hand-embroidered crest monogram inside the lapel facing.',
    composition: '75% Wool, 25% Cashmere.',
    fit: 'Generous architectural sweep with belted interior harness.',
    colors: [
      { name: 'Crown Crimson', hex: '#991b1b' },
      { name: 'Obsidian Black', hex: '#0f172a' },
    ],
    sizes: ['S/M', 'L/XL'],
    inStock: true,
    stockCount: 6,
    rating: 4.7,
    reviewCount: 14,
  },
  {
    id: 'crw-06',
    name: 'Highland Pure Silk Twill Monogram Scarf',
    category: 'Accessories',
    gender: 'Unisex',
    price: 195,
    image: merinoKnitImg,
    secondaryImage: silkDressImg,
    description: 'Printed in Lake Como on heavyweight 16mm silk twill with hand-rolled and hand-sewn edges. Features the historical Crown fleur-de-lis geometric tapestry motif.',
    composition: '100% Italian Silk Twill. Hand-rolled hems.',
    fit: '90cm x 90cm square grand format.',
    colors: [
      { name: 'Royal Blue & Crimson', hex: '#1e3a8a' },
      { name: 'Antique Gold & Sable', hex: '#b45309' },
    ],
    sizes: ['One Size'],
    inStock: true,
    stockCount: 35,
    rating: 4.9,
    reviewCount: 41,
    isBestseller: true,
  }
];

export const INITIAL_ORDERS: OrderTelemetry[] = [
  {
    orderId: 'CRW-88219',
    customerName: 'Eleanor Vance',
    customerPhone: '+1 (555) 234-8901',
    deliveryAddress: '742 Royal Palm Boulevard, Suite 12B',
    deliveryCity: 'Metropolis',
    postalCode: '10021',
    status: 'Out for Delivery',
    estimatedDelivery: '35 mins (by 2:45 PM)',
    courierName: 'Marcus Vance',
    courierId: 'RC-042',
    courierPhone: '+1 (555) 890-4412',
    courierVehicle: 'Mercedes eVito Royal Fleet #09',
    courierCoords: { lat: 40.768, lng: -73.964 },
    destinationCoords: { lat: 40.778, lng: -73.955 },
    routeProgressPercent: 78,
    items: [
      {
        product: PRODUCTS[0],
        selectedColor: 'Royal Navy',
        selectedSize: '40R',
        quantity: 1,
      },
      {
        product: PRODUCTS[2],
        selectedColor: 'Ivory Cream',
        selectedSize: 'M',
        quantity: 1,
      }
    ],
    subtotal: 1210,
    shippingFee: 0,
    total: 1210,
    paymentMethod: 'Credit Card',
    createdAt: 'Today, 09:15 AM',
    timeline: [
      {
        status: 'Order Placed',
        time: '09:15 AM',
        description: 'Order confirmed and registered in Royal Concierge system.',
        completed: true,
      },
      {
        status: 'Quality Check',
        time: '10:30 AM',
        description: 'Garments steamed, lint-inspected, and placed in breathable garment bags.',
        completed: true,
      },
      {
        status: 'Dispatched',
        time: '11:45 AM',
        description: 'Dispatched from Regent Flagship Hub into Royal Electric Fleet #09.',
        completed: true,
      },
      {
        status: 'Out for Delivery',
        time: '01:20 PM',
        description: 'Courier Marcus Vance is 1.4 miles away approaching your boulevard.',
        completed: true,
      },
      {
        status: 'Delivered',
        time: 'Estimated 02:45 PM',
        description: 'Direct handoff with royal seal signature confirmation.',
        completed: false,
      }
    ]
  },
  {
    orderId: 'CRW-77402',
    customerName: 'Lord Alistair Sterling',
    customerPhone: '+1 (555) 671-9982',
    deliveryAddress: '18 Grosvenor Terrace, Penthouse 4',
    deliveryCity: 'Metropolis',
    postalCode: '10022',
    status: 'Quality Check',
    estimatedDelivery: 'Today by 5:30 PM',
    courierName: 'Julian Croft',
    courierId: 'RC-018',
    courierPhone: '+1 (555) 431-7721',
    courierVehicle: 'Porsche Taycan Royal Escort #03',
    courierCoords: { lat: 40.755, lng: -73.972 },
    destinationCoords: { lat: 40.762, lng: -73.968 },
    routeProgressPercent: 32,
    items: [
      {
        product: PRODUCTS[3],
        selectedColor: 'Deep Royal Navy',
        selectedSize: '42R',
        quantity: 1,
      }
    ],
    subtotal: 1250,
    shippingFee: 0,
    total: 1250,
    paymentMethod: 'Cash on Delivery',
    createdAt: 'Today, 11:20 AM',
    timeline: [
      {
        status: 'Order Placed',
        time: '11:20 AM',
        description: 'Order received with Cash On Delivery ($1,250.00 cash on handoff).',
        completed: true,
      },
      {
        status: 'Quality Check',
        time: '12:05 PM',
        description: 'Hand pressing lapels and final stitch certification.',
        completed: true,
      },
      {
        status: 'Dispatched',
        time: 'Pending 02:15 PM',
        description: 'Awaiting scheduled courier departure wave.',
        completed: false,
      },
      {
        status: 'Out for Delivery',
        time: 'Pending 03:30 PM',
        description: 'Route optimization active.',
        completed: false,
      },
      {
        status: 'Delivered',
        time: 'Estimated 05:30 PM',
        description: 'Cash payment verification on delivery.',
        completed: false,
      }
    ]
  }
];

export const DELIVERY_ZONES: DeliveryZone[] = [
  { zipCodePrefix: '100', zoneName: 'Central Royal Core (Manhattan)', sameDayEligible: true, radiusMiles: 5.5, estimatedTime: '1 - 2 Hours', cutoffHour: '6:00 PM' },
  { zipCodePrefix: '101', zoneName: 'Midtown & Upper East Corridor', sameDayEligible: true, radiusMiles: 8.0, estimatedTime: '2 - 3 Hours', cutoffHour: '5:00 PM' },
  { zipCodePrefix: '112', zoneName: 'Brooklyn Heights & Waterfront', sameDayEligible: true, radiusMiles: 12.0, estimatedTime: '3 - 4 Hours', cutoffHour: '4:00 PM' },
  { zipCodePrefix: '111', zoneName: 'Long Island City & Queens', sameDayEligible: true, radiusMiles: 14.5, estimatedTime: '3 - 5 Hours', cutoffHour: '3:30 PM' },
  { zipCodePrefix: '070', zoneName: 'Hudson Waterfront / Jersey Gold Coast', sameDayEligible: true, radiusMiles: 15.0, estimatedTime: '4 - 5 Hours', cutoffHour: '2:30 PM' },
  { zipCodePrefix: '900', zoneName: 'Beverly Hills & West Hollywood Hub', sameDayEligible: true, radiusMiles: 10.0, estimatedTime: '2 - 3 Hours', cutoffHour: '5:00 PM' },
  { zipCodePrefix: 'SW1', zoneName: 'Mayfair & Belgravia Royal Ward', sameDayEligible: true, radiusMiles: 6.0, estimatedTime: '90 Minutes', cutoffHour: '6:30 PM' }
];

export const INITIAL_LEADS: BespokeLead[] = [
  {
    id: 'lead-101',
    fullName: 'Lady Vivienne Montgomery',
    email: 'v.montgomery@sovereign-arts.org',
    phone: '+1 (555) 492-1184',
    serviceType: 'Wedding & Formal',
    preferredDate: '2026-10-15',
    notes: 'Require matching bespoke velvet tuxedos and evening gown for Autumn Charity Gala.',
    status: 'Consultation Scheduled',
    createdAt: 'Yesterday, 4:12 PM',
  },
  {
    id: 'lead-102',
    fullName: 'Harrison Sterling Esq.',
    email: 'harrison@sterlingcapital.co',
    phone: '+1 (555) 902-8833',
    serviceType: 'Bespoke Tailoring',
    preferredDate: '2026-10-04',
    notes: 'Inquiry for three Super 180s wool bespoke business suits with custom monogramming.',
    status: 'New',
    createdAt: 'Today, 8:40 AM',
  },
  {
    id: 'lead-103',
    fullName: 'Clara Dubois',
    email: 'clara@duboisinteriors.com',
    phone: '+1 (555) 310-7744',
    serviceType: 'VIP Private Wardrobe',
    preferredDate: '2026-10-20',
    notes: 'Seasonal wardrobe refresh. Interested in cashmere knitwear capsule and tailored overcoats.',
    status: 'Contacted',
    createdAt: '2 days ago',
  }
];
