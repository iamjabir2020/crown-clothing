import { Product, OrderTelemetry, BespokeLead, DeliveryZone } from '../types';

import heroFashionImg from '../assets/images/hero_crown_fashion_1790417371860.jpg';
import overcoatImg from '../assets/images/product_tailored_overcoat_1790417384963.jpg';
import silkDressImg from '../assets/images/product_silk_dress_1790417400989.jpg';
import merinoKnitImg from '../assets/images/product_merino_knitwear_1790417419287.jpg';
import courierFleetImg from '../assets/images/courier_fleet_tracking_1790417434344.jpg';
import bespokeSuitImg from '../assets/images/product_bespoke_suit_1790419434059.jpg';
import empressCapeImg from '../assets/images/product_empress_cape_1790419446512.jpg';
import silkScarfImg from '../assets/images/product_silk_scarf_1790419461191.jpg';
import craftsmanshipImg from '../assets/images/craftsmanship_atelier_1790419480360.jpg';
import flagshipImg from '../assets/images/flagship_boutique_1790419496331.jpg';

export {
  heroFashionImg,
  overcoatImg,
  silkDressImg,
  merinoKnitImg,
  courierFleetImg,
  bespokeSuitImg,
  empressCapeImg,
  silkScarfImg,
  craftsmanshipImg,
  flagshipImg,
};

export const PRODUCTS: Product[] = [
  {
    id: 'crw-01',
    name: 'The Sovereign Cashmere Double-Breasted Overcoat',
    category: 'Outerwear',
    gender: 'Men',
    price: 89000,
    originalPrice: 95000,
    image: overcoatImg,
    secondaryImage: heroFashionImg,
    description: 'Crafted from ultra-dense 620gsm Scottish cashmere and superfine virgin wool. Finished with handcrafted natural horn buttons and bespoke silk-cupro jacquard lining featuring our royal insignia. Ideal for grand North Indian winter evenings and international gala travel.',
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
    price: 54000,
    originalPrice: 58000,
    image: silkDressImg,
    secondaryImage: heroFashionImg,
    description: 'Cut on the true bias from fluid 28mm Grade 6A mulberry silk charmeuse for an effortlessly sculpted silhouette. Accented with subtle French seam finishing and delicate adjustable rouleau straps. A sublime choice for royal cocktail receptions and luxury festive soirees.',
    composition: '100% Grade 6A Pure Mulberry Silk.',
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
    price: 32000,
    originalPrice: 35000,
    image: merinoKnitImg,
    secondaryImage: overcoatImg,
    description: 'Spun from 19.5-micron extrafine Australian merino wool with a tactile heritage cable weave. Breathable, temperature-regulating, and soft against bare skin. A timeless staple for royal hill retreats and winter leisure.',
    composition: '100% Extrafine Australian Merino Wool.',
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
    price: 125000,
    originalPrice: 135000,
    image: bespokeSuitImg,
    secondaryImage: overcoatImg,
    description: 'Woven in Biella, Italy from 100% Super 150s worsted wool. Features a half-canvas construction that contours to your body over time, pick-stitched peak lapels, and side adjusters on flat-front trousers. The pinnacle of boardroom authority and royal wedding receptions.',
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
    price: 78000,
    originalPrice: 84000,
    image: empressCapeImg,
    secondaryImage: silkDressImg,
    description: 'A regal silhouette tailored with a structured high collar, hidden front placket, and hand-embroidered royal crest monogram inside the lapel facing with fine zari stitching.',
    composition: '75% Fine Wool, 25% Inner Cashmere.',
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
    price: 19500,
    originalPrice: 22000,
    image: silkScarfImg,
    secondaryImage: merinoKnitImg,
    description: 'Printed in Lake Como on heavyweight 16mm pure silk twill with hand-rolled and hand-sewn edges. Features the historical Crown fleur-de-lis geometric tapestry motif. An exquisite drape for sherwanis, bandhgalas, and evening capes.',
    composition: '100% Pure Italian Silk Twill. Hand-rolled hems.',
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
    customerName: 'Gayatri Devi Singhania',
    customerPhone: '+91 98200 45890',
    deliveryAddress: 'Flat 14A, Sea Face Towers, Worli Sea Face',
    deliveryCity: 'Mumbai',
    postalCode: '400018',
    status: 'Out for Delivery',
    estimatedDelivery: '35 mins (by 2:45 PM)',
    courierName: 'Vikram Rathore',
    courierId: 'RC-042',
    courierPhone: '+91 98201 88412',
    courierVehicle: 'Mercedes EQE Royal Fleet #09',
    courierCoords: { lat: 18.998, lng: 72.815 },
    destinationCoords: { lat: 19.014, lng: 72.817 },
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
    subtotal: 121000,
    shippingFee: 0,
    total: 121000,
    paymentMethod: 'UPI (GPay / PhonePe / Paytm)',
    createdAt: 'Today, 09:15 AM',
    timeline: [
      {
        status: 'Order Placed',
        time: '09:15 AM',
        description: 'Order confirmed and registered via UPI (Google Pay / PhonePe verified).',
        completed: true,
      },
      {
        status: 'Quality Check',
        time: '10:30 AM',
        description: 'Garments hand-steamed, inspected by master tailor, and placed in breathable royal cedar garment bags.',
        completed: true,
      },
      {
        status: 'Dispatched',
        time: '11:45 AM',
        description: 'Dispatched from South Mumbai Flagship Hub into Royal Electric Fleet #09.',
        completed: true,
      },
      {
        status: 'Out for Delivery',
        time: '01:20 PM',
        description: 'Royal Courier Vikram Rathore is approaching Worli Sea Face corridor.',
        completed: true,
      },
      {
        status: 'Delivered',
        time: 'Estimated 02:45 PM',
        description: 'Direct white-glove handoff with royal seal signature confirmation.',
        completed: false,
      }
    ]
  },
  {
    orderId: 'CRW-77402',
    customerName: 'Maharaj Samarjit Singh',
    customerPhone: '+91 98111 67290',
    deliveryAddress: '12 Golf Links, Heritage Bungalow',
    deliveryCity: 'New Delhi',
    postalCode: '110003',
    status: 'Quality Check',
    estimatedDelivery: 'Today by 5:30 PM',
    courierName: 'Arjun Nair',
    courierId: 'RC-018',
    courierPhone: '+91 98112 44319',
    courierVehicle: 'BMW i7 Royal Electric Escort #03',
    courierCoords: { lat: 28.598, lng: 77.234 },
    destinationCoords: { lat: 28.601, lng: 77.238 },
    routeProgressPercent: 32,
    items: [
      {
        product: PRODUCTS[3],
        selectedColor: 'Deep Royal Navy',
        selectedSize: '42R',
        quantity: 1,
      }
    ],
    subtotal: 125000,
    shippingFee: 0,
    total: 125000,
    paymentMethod: 'Cash on Delivery',
    createdAt: 'Today, 11:20 AM',
    timeline: [
      {
        status: 'Order Placed',
        time: '11:20 AM',
        description: 'Order received with Pay on Delivery (₹1,25,000 cash or doorstep UPI on handoff).',
        completed: true,
      },
      {
        status: 'Quality Check',
        time: '12:05 PM',
        description: 'Hand pressing lapels and final master stitch certification.',
        completed: true,
      },
      {
        status: 'Dispatched',
        time: 'Pending 02:15 PM',
        description: 'Awaiting scheduled Lutyens corridor courier departure wave.',
        completed: false,
      },
      {
        status: 'Out for Delivery',
        time: 'Pending 03:30 PM',
        description: 'Route optimization active across Central Delhi.',
        completed: false,
      },
      {
        status: 'Delivered',
        time: 'Estimated 05:30 PM',
        description: 'White-glove delivery & doorstep verification.',
        completed: false,
      }
    ]
  }
];

export const DELIVERY_ZONES: DeliveryZone[] = [
  { zipCodePrefix: '400', zoneName: 'South Mumbai & Worli Sea Face', city: 'Mumbai', sameDayEligible: true, radiusMiles: 8.0, radiusKm: 12.8, estimatedTime: '90 Minutes', cutoffHour: '6:30 PM' },
  { zipCodePrefix: '40005', zoneName: 'Bandra West, Pali Hill & BKC Corridor', city: 'Mumbai', sameDayEligible: true, radiusMiles: 10.0, radiusKm: 16.0, estimatedTime: '2 Hours', cutoffHour: '6:00 PM' },
  { zipCodePrefix: '110', zoneName: 'Lutyens Delhi, Golf Links & Chanakyapuri', city: 'New Delhi', sameDayEligible: true, radiusMiles: 7.5, radiusKm: 12.0, estimatedTime: '90 Minutes', cutoffHour: '6:30 PM' },
  { zipCodePrefix: '11003', zoneName: 'Mehrauli Couture District & Vasant Vihar', city: 'New Delhi', sameDayEligible: true, radiusMiles: 12.0, radiusKm: 19.3, estimatedTime: '2 - 3 Hours', cutoffHour: '5:00 PM' },
  { zipCodePrefix: '560', zoneName: 'Central Bengaluru, UB City & Indiranagar', city: 'Bengaluru', sameDayEligible: true, radiusMiles: 11.0, radiusKm: 17.7, estimatedTime: '2 Hours', cutoffHour: '5:30 PM' },
  { zipCodePrefix: '500', zoneName: 'Jubilee Hills & Banjara Hills', city: 'Hyderabad', sameDayEligible: true, radiusMiles: 9.5, radiusKm: 15.2, estimatedTime: '2 Hours', cutoffHour: '5:00 PM' },
  { zipCodePrefix: '302', zoneName: 'Jaipur Royal Palace Enclave & C-Scheme', city: 'Jaipur', sameDayEligible: true, radiusMiles: 8.5, radiusKm: 13.6, estimatedTime: '90 Minutes', cutoffHour: '6:00 PM' },
  { zipCodePrefix: '700', zoneName: 'Alipore, Ballygunge & Park Street', city: 'Kolkata', sameDayEligible: true, radiusMiles: 10.5, radiusKm: 16.8, estimatedTime: '2 Hours', cutoffHour: '5:00 PM' },
  { zipCodePrefix: '600', zoneName: 'Boat Club Road, R.A. Puram & Poes Garden', city: 'Chennai', sameDayEligible: true, radiusMiles: 9.0, radiusKm: 14.5, estimatedTime: '2 Hours', cutoffHour: '5:30 PM' }
];

export const INITIAL_LEADS: BespokeLead[] = [
  {
    id: 'lead-101',
    fullName: 'Rani Priyadarshini Scindia',
    email: 'priyadarshini@heritage-rajasthan.org',
    phone: '+91 98290 11482',
    serviceType: 'Wedding & Formal',
    preferredDate: '2026-10-15',
    notes: 'Require bespoke royal velvet bandhgala sherwani and pure silk embroidered cape for Winter Royal Wedding Gala in Udaipur.',
    status: 'Consultation Scheduled',
    createdAt: 'Yesterday, 4:12 PM',
  },
  {
    id: 'lead-102',
    fullName: 'Devansh Singhania',
    email: 'devansh@singhaniagroup.in',
    phone: '+91 98201 99044',
    serviceType: 'Bespoke Tailoring',
    preferredDate: '2026-10-04',
    notes: 'Inquiry for three Super 180s Italian wool bespoke suits with custom monogramming for South Mumbai boardroom.',
    status: 'New',
    createdAt: 'Today, 8:40 AM',
  },
  {
    id: 'lead-103',
    fullName: 'Meera Oberoi',
    email: 'meera.oberoi@oberoicollection.com',
    phone: '+91 98100 33812',
    serviceType: 'VIP Private Wardrobe',
    preferredDate: '2026-10-20',
    notes: 'Seasonal wardrobe refresh. Interested in Scottish cashmere overcoats and mulberry silk festive evening capsule.',
    status: 'Contacted',
    createdAt: '2 days ago',
  }
];
