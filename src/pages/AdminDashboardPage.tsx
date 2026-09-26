import React, { useState } from 'react';
import { DollarSign, Truck, Package, Users, ShieldAlert, ArrowUpRight, CheckCircle2, Clock, AlertTriangle, RefreshCw, Plus, Minus, Search, Database, Copy, Check, Download, FileCode } from 'lucide-react';
import { OrderTelemetry, Product, BespokeLead, OrderStatus } from '../types';
import { SCHEMA_SQL_CODE } from '../data/schemaSql';
import { resolveImageUrl, handleImageError } from '../utils/imageResolver';

interface AdminDashboardPageProps {
  orders: OrderTelemetry[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  products: Product[];
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onUpdateProductPrice: (productId: string, newPrice: number) => void;
  leads: BespokeLead[];
  onUpdateLeadStatus: (leadId: string, newStatus: BespokeLead['status']) => void;
  onNavigateToTracking: (orderId: string) => void;
  onSimulateNewOrder?: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  orders,
  onUpdateOrderStatus,
  products,
  onUpdateProductStock,
  onUpdateProductPrice,
  leads,
  onUpdateLeadStatus,
  onNavigateToTracking,
  onSimulateNewOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'leads' | 'fleet' | 'schema'>('orders');
  const [copiedSql, setCopiedSql] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [orderSearch, setOrderSearch] = useState('');

  // Calculate KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 24200;
  const inTransitCount = orders.filter((o) => o.status !== 'Delivered').length;
  const activeFleetCount = 8;
  const pendingLeadsCount = leads.filter((l) => l.status === 'New').length;

  const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
    'Order Placed': 'Quality Check',
    'Quality Check': 'Dispatched',
    'Dispatched': 'Out for Delivery',
    'Out for Delivery': 'Delivered',
    'Delivered': null,
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderId.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.deliveryAddress.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>Master Operations Console</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
            Crown Atelier Control System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live telemetry, fleet dispatch management, real-time inventory levels, and VIP bespoke client dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onSimulateNewOrder && (
            <button
              onClick={onSimulateNewOrder}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Simulate Live VIP Order</span>
            </button>
          )}
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Node: Regent Hub #01 · Latency: 18ms
          </span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Daily Gross Volume</span>
            <div className="text-2xl font-bold text-slate-950 font-mono mt-1 tabular-nums">
              ${totalRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs yesterday
            </span>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Active In-Transit Dispatches</span>
            <div className="text-2xl font-bold text-slate-950 font-mono mt-1 tabular-nums">
              {inTransitCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Average ETA: 24 mins
            </span>
          </div>
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Fleet Electric Couriers</span>
            <div className="text-2xl font-bold text-slate-950 font-mono mt-1 tabular-nums">
              {activeFleetCount} / {activeFleetCount}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Fleet Readiness
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Pending Bespoke Leads</span>
            <div className="text-2xl font-bold text-slate-950 font-mono mt-1 tabular-nums">
              {pendingLeadsCount}
            </div>
            <span className="text-[11px] text-rose-600 font-medium mt-1 block">
              Requires Concierge Call
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'orders', label: 'Order Stream & Status Control', count: orders.length },
          { id: 'inventory', label: 'Garment SKU & Stock Inventory', count: products.length },
          { id: 'leads', label: 'VIP Bespoke Inquiries', count: leads.length },
          { id: 'fleet', label: 'Delivery Radius & Fleet Engine' },
          { id: 'schema', label: 'Supabase SQL Schema (schema.sql)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  activeTab === tab.id ? 'bg-slate-800 text-rose-300' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: ORDER STREAM */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
              >
                <option value="All">All Statuses ({orders.length})</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Quality Check">Quality Check</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search Order ID, Client, Address..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 w-64 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Client & Address</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Status Pipeline</th>
                    <th className="p-4">Assigned Courier</th>
                    <th className="p-4 text-right">Total</th>
                    <th className="p-4 text-right">Control Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => {
                    const nextStatus = nextStatusMap[order.status];

                    return (
                      <tr key={order.orderId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-mono font-bold text-rose-700">
                          #{order.orderId}
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">{order.customerName}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">
                            {order.deliveryAddress}, {order.postalCode}
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              order.paymentMethod === 'Cash on Delivery'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1.5 ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800'
                                : order.status === 'Out for Delivery'
                                ? 'bg-rose-50 text-rose-800 animate-pulse'
                                : 'bg-sky-50 text-sky-800'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600">
                          <div className="font-medium text-slate-900">{order.courierName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{order.courierId}</div>
                        </td>
                        <td className="p-4 text-right font-bold text-slate-950 font-mono tabular-nums">
                          ${order.total.toLocaleString()}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {nextStatus && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.orderId, nextStatus)}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-medium rounded-lg transition-colors cursor-pointer"
                              title={`Advance to ${nextStatus}`}
                            >
                              Advance → {nextStatus}
                            </button>
                          )}
                          <button
                            onClick={() => onNavigateToTracking(order.orderId)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium rounded-lg transition-colors cursor-pointer"
                          >
                            Live Map
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & SKU MANAGER */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">SKU / Garment</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Unit Price</th>
                    <th className="p-4">Stock In Atelier</th>
                    <th className="p-4">Reorder Status</th>
                    <th className="p-4 text-right">Quick Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => {
                    const isLowStock = product.stockCount <= 8;

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={resolveImageUrl(product.image, product.id)}
                              alt={product.name}
                              loading="lazy"
                              onError={(e) => handleImageError(e, resolveImageUrl(undefined, product.id))}
                              className="w-10 h-12 object-cover rounded-lg bg-slate-100 border border-slate-200"
                            />
                            <div>
                              <div className="font-semibold text-slate-900">{product.name}</div>
                              <div className="text-[11px] font-mono text-slate-400">SKU: {product.id.toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 font-medium">
                          {product.gender} · {product.category}
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-950">
                          ${product.price.toLocaleString()}
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-900 tabular-nums">
                          {product.stockCount} units
                        </td>
                        <td className="p-4">
                          {isLowStock ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3" /> Low Stock Alert
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 w-fit block">
                              Sufficient Reserves
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                            <button
                              onClick={() => onUpdateProductStock(product.id, Math.max(0, product.stockCount - 1))}
                              className="p-1 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"
                              title="Decrease stock"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-mono font-bold">{product.stockCount}</span>
                            <button
                              onClick={() => onUpdateProductStock(product.id, product.stockCount + 1)}
                              className="p-1 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"
                              title="Increase stock"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VIP BESPOKE LEADS */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Dossier ID</th>
                    <th className="p-4">Client Name & Phone</th>
                    <th className="p-4">Service Discipline</th>
                    <th className="p-4">Target Date</th>
                    <th className="p-4">Atelier Notes</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Update Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-700">
                        #{lead.id}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{lead.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{lead.phone}</div>
                        <div className="text-[11px] text-slate-400">{lead.email}</div>
                      </td>
                      <td className="p-4 font-medium text-slate-800">
                        {lead.serviceType}
                      </td>
                      <td className="p-4 font-mono text-slate-600">
                        {lead.preferredDate}
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs truncate" title={lead.notes}>
                        {lead.notes}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            lead.status === 'New'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : lead.status === 'Consultation Scheduled'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={lead.status}
                          onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as any)}
                          className="px-2 py-1 text-[11px] bg-white border border-slate-300 rounded-md font-medium text-slate-800"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Consultation Scheduled">Consultation Scheduled</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FLEET & RADIUS ENGINE SETTINGS */}
      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
              Geofence Radius Engine Settings
            </h3>
            <p className="text-xs text-slate-500">
              Configure parameters governing the automatic qualification of orders for 2-hour electric courier dispatch.
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Perimeter Radius Limit:</span>
                  <span className="font-mono font-bold text-rose-600">15.0 Miles</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  defaultValue="15"
                  className="w-full accent-rose-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <strong className="text-xs text-slate-900 block">Complimentary Shipping Threshold</strong>
                  <span className="text-[11px] text-slate-500">Free delivery on orders exceeding amount</span>
                </div>
                <span className="font-mono font-bold text-xs bg-white px-2.5 py-1 border border-slate-300 rounded">
                  $150.00
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <strong className="text-xs text-slate-900 block">Cash on Delivery (COD) Policy</strong>
                  <span className="text-[11px] text-slate-500">Enable cash payment verification upon courier handoff</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-rose-600 w-4 h-4 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white font-serif-luxury">
              Active Electric Courier Fleet Rosters
            </h3>
            <p className="text-xs text-slate-400">
              Real-time vehicle battery state and active routes assigned.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              {[
                { name: 'Marcus Vance', vehicle: 'Mercedes eVito #09', battery: '92%', status: 'Delivering to 742 Royal Palm', zone: 'Central' },
                { name: 'Julian Croft', vehicle: 'Porsche Taycan #03', battery: '84%', status: 'Staging at Regent Atelier', zone: 'Midtown' },
                { name: 'Sebastian Ward', vehicle: 'Mercedes eVito #12', battery: '95%', status: 'En route to Brooklyn Heights', zone: 'Waterfront' },
                { name: 'Gwendolyn Fox', vehicle: 'Mercedes eVito #04', battery: '78%', status: 'Returning to Regent Hub', zone: 'West' },
              ].map((c) => (
                <div key={c.name} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white block">{c.name}</strong>
                    <span className="text-slate-400 text-[11px]">{c.vehicle} · {c.status}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-emerald-400 font-bold">{c.battery}</span>
                    <span className="block text-[10px] text-slate-500">{c.zone} Zone</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SUPABASE SQL SCHEMA (schema.sql) */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider">
                <Database className="w-4 h-4" />
                <span>Supabase PostgreSQL DDL & Seed Script</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                schema.sql — Database Definition File
              </h2>
              <p className="text-xs text-slate-500">
                File Paths in your project: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">/schema.sql</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">/supabase/schema.sql</code>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(SCHEMA_SQL_CODE);
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2500);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied SQL to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Full schema.sql</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  const blob = new Blob([SCHEMA_SQL_CODE], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'schema.sql';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download .sql File</span>
              </button>
            </div>
          </div>

          {/* Quick Guide Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-rose-600" />
                <span>1. Open Supabase Studio</span>
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Log into your Supabase Dashboard and select your project, or start a new project.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>2. Open SQL Editor</span>
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Click on the <strong>SQL Editor</strong> tab on the left navigation bar and click <strong>New Query</strong>.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>3. Paste & Click "Run"</span>
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Paste the full SQL script from above. It will construct all 7 tables, RLS policies, triggers, and seed records instantly.
              </p>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs font-mono text-slate-400 ml-2">/schema.sql</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">PostgreSQL DDL · Supabase Realtime</span>
            </div>

            <pre className="p-6 text-xs font-mono text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto leading-relaxed select-all">
              <code>{SCHEMA_SQL_CODE}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
