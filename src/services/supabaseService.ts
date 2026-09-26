import { supabase } from '../lib/supabase';
import { Product, OrderTelemetry, BespokeLead, OrderStatus, DeliveryZone } from '../types';

/**
 * Fetch and subscribe to products from Supabase
 */
export const fetchSupabaseProducts = async (): Promise<Product[] | null> => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.warn('Supabase fetch products error:', error.message);
      return null;
    }
    return (data as any[]).map((d) => ({
      ...d,
      stockCount: d.stock_count,
      inStock: d.in_stock,
      reviewCount: d.review_count,
      originalPrice: d.original_price,
      secondaryImage: d.secondary_image,
      isNew: d.is_new,
      isBestseller: d.is_bestseller,
    })) as Product[];
  } catch (err) {
    console.warn('Supabase error:', err);
    return null;
  }
};

export const subscribeSupabaseProducts = (onUpdate: (products: Product[]) => void) => {
  const channel = supabase
    .channel('products-all')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      async () => {
        const fresh = await fetchSupabaseProducts();
        if (fresh) onUpdate(fresh);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Fetch and subscribe to orders from Supabase
 */
export const fetchSupabaseOrders = async (): Promise<OrderTelemetry[] | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch orders error:', error.message);
      return null;
    }

    return (data as any[]).map((d) => ({
      orderId: d.id,
      customerName: d.customer_name,
      customerPhone: d.customer_phone,
      deliveryAddress: d.delivery_address,
      deliveryCity: d.delivery_city,
      postalCode: d.postal_code,
      status: d.status,
      estimatedDelivery: d.estimated_delivery,
      courierName: d.courier_name,
      courierId: d.courier_id,
      courierPhone: d.courier_phone,
      courierVehicle: d.courier_vehicle,
      courierCoords: { lat: Number(d.courier_lat), lng: Number(d.courier_lng) },
      destinationCoords: { lat: 40.778, lng: -73.955 },
      routeProgressPercent: d.route_progress_percent,
      items: d.items || [],
      subtotal: Number(d.subtotal),
      shippingFee: Number(d.shipping_fee || 0),
      total: Number(d.total),
      paymentMethod: d.payment_method,
      createdAt: d.created_at,
      timeline: d.timeline || [],
    })) as OrderTelemetry[];
  } catch (err) {
    console.warn('Supabase order fetch error:', err);
    return null;
  }
};

export const subscribeSupabaseOrders = (onUpdate: (orders: OrderTelemetry[]) => void) => {
  const channel = supabase
    .channel('orders-all')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      async () => {
        const fresh = await fetchSupabaseOrders();
        if (fresh) onUpdate(fresh);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Insert or update an order in Supabase
 */
export const insertSupabaseOrder = async (order: OrderTelemetry) => {
  try {
    const { error } = await supabase.from('orders').upsert({
      id: order.orderId,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      delivery_address: order.deliveryAddress,
      delivery_city: order.deliveryCity,
      postal_code: order.postalCode,
      status: order.status,
      estimated_delivery: order.estimatedDelivery,
      courier_name: order.courierName,
      courier_id: order.courierId,
      courier_phone: order.courierPhone,
      courier_vehicle: order.courierVehicle,
      courier_lat: order.courierCoords.lat,
      courier_lng: order.courierCoords.lng,
      route_progress_percent: order.routeProgressPercent,
      items: order.items,
      subtotal: order.subtotal,
      shipping_fee: order.shippingFee,
      total: order.total,
      payment_method: order.paymentMethod,
      timeline: order.timeline,
    });
    if (error) console.warn('Supabase insert order error:', error.message);
  } catch (e) {
    console.warn('Supabase error:', e);
  }
};

export const updateSupabaseOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    if (error) console.warn('Supabase update order status error:', error.message);
  } catch (e) {
    console.warn('Supabase error:', e);
  }
};

/**
 * Update product stock and price in Supabase
 */
export const updateSupabaseProductStock = async (productId: string, newStock: number) => {
  try {
    const { error } = await supabase
      .from('products')
      .update({
        stock_count: newStock,
        in_stock: newStock > 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);
    if (error) console.warn('Supabase update stock error:', error.message);
  } catch (e) {
    console.warn('Supabase error:', e);
  }
};

export const updateSupabaseProductPrice = async (productId: string, newPrice: number) => {
  try {
    const { error } = await supabase
      .from('products')
      .update({ price: newPrice, updated_at: new Date().toISOString() })
      .eq('id', productId);
    if (error) console.warn('Supabase update price error:', error.message);
  } catch (e) {
    console.warn('Supabase error:', e);
  }
};

/**
 * VIP Bespoke leads
 */
export const insertSupabaseLead = async (lead: BespokeLead) => {
  try {
    const { error } = await supabase.from('bespoke_leads').upsert({
      id: lead.id,
      full_name: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      service_type: lead.serviceType,
      preferred_date: lead.preferredDate,
      notes: lead.notes,
      status: lead.status,
    });
    if (error) console.warn('Supabase lead insert error:', error.message);
  } catch (e) {
    console.warn('Supabase error:', e);
  }
};

export const updateSupabaseLeadStatus = async (
  leadId: string,
  newStatus: BespokeLead['status']
) => {
  try {
    const { error } = await supabase
      .from('bespoke_leads')
      .update({ status: newStatus })
      .eq('id', leadId);
    if (error) console.warn('Supabase lead status update error:', error.message);
  } catch (e) {
    console.warn('Supabase error:', e);
  }
};
