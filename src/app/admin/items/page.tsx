'use client';

import React, { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { itemService } from '@/services';
import { PredefinedMenuItem, MetalCategory } from '@/types';
import { Package, Plus, Edit2, Search, Sparkles, Scale, X } from 'lucide-react';

export default function AdminItemsPage() {
  const [items, setItems] = useState<PredefinedMenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [query, setQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PredefinedMenuItem | null>(null);

  const [itemForm, setItemForm] = useState({
    name: '',
    category: 'Gold' as MetalCategory,
    defaultMaterial: '14K Yellow Gold',
    defaultPurity: '14K (58.5%)',
    typicalUnit: 'g' as const,
    estPricePerUnit: 52.0,
    description: '',
  });

  const loadItems = async () => {
    const data = await itemService.getPredefinedMenu();
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesQuery = !query.trim() || item.name.toLowerCase().includes(query.toLowerCase()) || item.defaultMaterial.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await itemService.addItem(itemForm);
      setIsAddModalOpen(false);
      loadItems();
      alert(`Added ${itemForm.name} to predefined catalog.`);
    } catch (err: any) {
      alert(err.message || 'Could not add item');
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await itemService.updateItem(editingItem.id, editingItem);
      setEditingItem(null);
      loadItems();
      alert(`Updated ${editingItem.name}`);
    } catch (err: any) {
      alert(err.message || 'Could not update item');
    }
  };

  const categories: MetalCategory[] = [
    'Gold',
    'Silver',
    'Diamond',
    'Platinum',
    'Watches',
    'Coins & Currency',
    'Collectibles',
    'Other',
  ];

  return (
    <PortalLayout>
      <div className="space-y-6 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-tgb-gold font-bold uppercase tracking-wider">
              <Package className="w-4 h-4" /> Predefined Appraisal Catalog
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Item Menu & Assay Benchmarks
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage standard menu items, default materials, karat purities, and base appraisal benchmarks
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2.5 px-4 bg-tgb-gold hover:bg-tgb-goldlight text-tgb-darknavy font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> + ADD CATALOG ITEM
          </button>
        </div>

        {/* Filters */}
        <div className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-4 shadow-xl space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-tgb-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter menu items by name, material, alloy..."
              className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-xl pl-10 pr-4 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'ALL' ? 'bg-tgb-gold text-tgb-darknavy' : 'bg-tgb-darknavy text-gray-300 hover:text-white'
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === c ? 'bg-tgb-gold text-tgb-darknavy' : 'bg-tgb-darknavy text-gray-300 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-tgb-navy border border-tgb-navyborder rounded-2xl p-5 space-y-3 shadow-xl hover:border-tgb-gold/40 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-tgb-gold bg-tgb-gold/10 px-2 py-0.5 rounded border border-tgb-gold/20">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    ${item.estPricePerUnit?.toLocaleString()}/{item.typicalUnit}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-display">{item.name}</h3>
                <div className="text-xs text-gray-300 space-y-0.5">
                  <div><strong>Material:</strong> {item.defaultMaterial}</div>
                  <div><strong>Purity:</strong> <span className="font-mono text-emerald-300">{item.defaultPurity}</span></div>
                </div>
              </div>

              <div className="pt-3 border-t border-tgb-navyborder flex items-center justify-between">
                <span className="text-[11px] font-mono text-gray-400">{item.id}</span>
                <button
                  onClick={() => setEditingItem({ ...item })}
                  className="px-2.5 py-1 bg-tgb-darknavy hover:bg-tgb-navylight text-tgb-gold border border-tgb-navyborder rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD ITEM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-tgb-navy border border-tgb-gold/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-tgb-navyborder">
              <h3 className="text-lg font-bold text-white font-display">Add Catalog Item</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="e.g. Gold Figaro Chain"
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Category *</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value as MetalCategory })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Typical Unit</label>
                  <select
                    value={itemForm.typicalUnit}
                    onChange={(e) => setItemForm({ ...itemForm, typicalUnit: e.target.value as any })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  >
                    <option value="g">Grams (g)</option>
                    <option value="oz">Troy Oz (oz)</option>
                    <option value="dwt">Pennyweight (dwt)</option>
                    <option value="ct">Carats (ct)</option>
                    <option value="pcs">Pieces (pcs)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Default Material</label>
                  <input
                    type="text"
                    value={itemForm.defaultMaterial}
                    onChange={(e) => setItemForm({ ...itemForm, defaultMaterial: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Default Purity</label>
                  <input
                    type="text"
                    value={itemForm.defaultPurity}
                    onChange={(e) => setItemForm({ ...itemForm, defaultPurity: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Benchmark Price / Unit ($)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Enter price"
                  value={itemForm.estPricePerUnit === 0 ? '' : itemForm.estPricePerUnit}
                  onChange={(e) => setItemForm({ ...itemForm, estPricePerUnit: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-tgb-gold text-tgb-darknavy font-bold text-xs rounded-lg uppercase"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ITEM MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-tgb-navy border border-tgb-gold/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-tgb-navyborder">
              <h3 className="text-lg font-bold text-white font-display">Edit: {editingItem.name}</h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateItem} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Benchmark Price ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Enter price"
                    value={editingItem.estPricePerUnit === 0 ? '' : editingItem.estPricePerUnit}
                    onChange={(e) => setEditingItem({ ...editingItem, estPricePerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Purity</label>
                  <input
                    type="text"
                    value={editingItem.defaultPurity}
                    onChange={(e) => setEditingItem({ ...editingItem, defaultPurity: e.target.value })}
                    className="w-full bg-tgb-darknavy border border-tgb-navyborder rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-tgb-gold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-tgb-gold text-tgb-darknavy font-bold text-xs rounded-lg uppercase"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
