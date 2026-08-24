import { DemoRepository } from '@/lib/demoRepository';
import { PredefinedMenuItem, MetalCategory } from '@/types';

export const itemService = {
  async getPredefinedMenu(): Promise<PredefinedMenuItem[]> {
    return await DemoRepository.getPredefinedItems();
  },

  async getByCategory(category: MetalCategory): Promise<PredefinedMenuItem[]> {
    const items = await DemoRepository.getPredefinedItems();
    return items.filter((i) => i.category === category);
  },

  async addItem(item: Omit<PredefinedMenuItem, 'id'>): Promise<PredefinedMenuItem> {
    return await DemoRepository.addPredefinedItem(item);
  },

  async updateItem(id: string, updates: Partial<PredefinedMenuItem>): Promise<PredefinedMenuItem> {
    return await DemoRepository.updatePredefinedItem(id, updates);
  },

  async getSpotPrices() {
    return await DemoRepository.getSpotPrices();
  },
};
