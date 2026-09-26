export type ProductCategory = 'All' | 'Outerwear' | 'Tailoring' | 'Knitwear' | 'Dresses' | 'Accessories';
export type GenderCategory = 'All' | 'Men' | 'Women' | 'Unisex';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  gender: GenderCategory;
  price: number;
  originalPrice?: number;
  image: string;
  secondaryImage?: string;
  description: string;
  composition: string;
  fit: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export type OrderStatus = 'Order Placed' | 'Quality Check' | 'Dispatched' | 'Out for Delivery' | 'Delivered';

export interface OrderTelemetry {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  postalCode: string;
  status: OrderStatus;
  estimatedDelivery: string;
  courierName: string;
  courierId: string;
  courierPhone: string;
  courierVehicle: string;
  courierCoords: { lat: number; lng: number };
  destinationCoords: { lat: number; lng: number };
  routeProgressPercent: number;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'Credit Card' | 'Apple Pay' | 'Cash on Delivery';
  createdAt: string;
  timeline: {
    status: OrderStatus;
    time: string;
    description: string;
    completed: boolean;
  }[];
}

export interface BespokeLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  serviceType: 'Bespoke Tailoring' | 'Wedding & Formal' | 'VIP Private Wardrobe' | 'Corporate Gifting';
  preferredDate: string;
  notes: string;
  status: 'New' | 'Contacted' | 'Consultation Scheduled' | 'Completed';
  createdAt: string;
}

export interface DeliveryZone {
  zipCodePrefix: string;
  zoneName: string;
  sameDayEligible: boolean;
  radiusMiles: number;
  estimatedTime: string;
  cutoffHour: string;
}
