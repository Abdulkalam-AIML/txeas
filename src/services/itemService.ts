import { createClient } from '@/utils/supabase/client';
import { PredefinedMenuItem, MetalCategory } from '@/types';
import { DemoRepository } from '@/lib/demoRepository';

function mapDbItem(row: any): PredefinedMenuItem {
  return {
    id: row.id,
    category: row.category as MetalCategory,
    name: row.name,
    defaultMaterial: row.material,
    defaultPurity: row.default_purity,
    typicalUnit: row.typical_unit as any,
    estPricePerUnit: Number(row.est_price_per_unit) || 0,
    description: row.description || undefined,
  };
}

export const itemService = {
  async getPredefinedMenu(): Promise<PredefinedMenuItem[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('active', true)
      .order('category', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map(mapDbItem);
    }
    return await DemoRepository.getPredefinedItems();
  },

  async getByCategory(category: MetalCategory): Promise<PredefinedMenuItem[]> {
    const all = await this.getPredefinedMenu();
    return all.filter((i) => i.category === category);
  },

  async addItem(item: Omit<PredefinedMenuItem, 'id'>): Promise<PredefinedMenuItem> {
    const supabase = createClient();
    const itemCode = `CAT-${Date.now().toString().slice(-4)}`;

    const { data, error } = await supabase
      .from('items')
      .insert({
        item_code: itemCode,
        name: item.name,
        category: item.category,
        material: item.defaultMaterial,
        default_purity: item.defaultPurity,
        typical_unit: item.typicalUnit,
        est_price_per_unit: item.estPricePerUnit || 0,
        description: item.description || null,
        active: true,
      })
      .select()
      .single();

    if (!error && data) {
      const created = mapDbItem(data);
      await DemoRepository.addPredefinedItem({ ...item, id: created.id } as any);
      return created;
    }

    return await DemoRepository.addPredefinedItem(item);
  },

  async updateItem(id: string, updates: Partial<PredefinedMenuItem>): Promise<PredefinedMenuItem> {
    const supabase = createClient();
    const dbPayload: any = {};
    if (updates.name) dbPayload.name = updates.name;
    if (updates.category) dbPayload.category = updates.category;
    if (updates.defaultMaterial) dbPayload.material = updates.defaultMaterial;
    if (updates.defaultPurity) dbPayload.default_purity = updates.defaultPurity;
    if (updates.typicalUnit) dbPayload.typical_unit = updates.typicalUnit;
    if (updates.estPricePerUnit !== undefined) dbPayload.est_price_per_unit = updates.estPricePerUnit;
    if (updates.description !== undefined) dbPayload.description = updates.description;
    dbPayload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('items')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      const updated = mapDbItem(data);
      await DemoRepository.updatePredefinedItem(id, updates);
      return updated;
    }

    return await DemoRepository.updatePredefinedItem(id, updates);
  },

  async getSpotPrices() {
    return await DemoRepository.getSpotPrices();
  },
};
