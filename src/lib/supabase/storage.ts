import { supabase, isSupabaseConfigured } from './client';

export type StorageBucket = 
  | 'transaction-images' 
  | 'customer-documents' 
  | 'invoice-files' 
  | 'report-files' 
  | 'quote-images';

export const storageHelper = {
  /**
   * Uploads an image or file to Supabase Storage with structured folder path:
   * e.g. transaction-images/2026/08/TGB-2026-000001/item-01-front.webp
   */
  async uploadFile(
    bucket: StorageBucket,
    filePath: string,
    file: File | Blob
  ): Promise<{ path: string; publicUrl?: string; signedUrl?: string; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      // Fallback for browser preview / demo simulation
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      return { path: filePath, signedUrl: dataUrl };
    }

    try {
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (error) throw error;

      // Generate signed URL (expires in 24 hours)
      const { data: signedData } = await supabase.storage
        .from(bucket)
        .createSignedUrl(data.path, 86400);

      return {
        path: data.path,
        signedUrl: signedData?.signedUrl,
      };
    } catch (err: any) {
      console.error('Supabase storage upload error:', err);
      return { path: '', error: err.message || 'Storage upload failed' };
    }
  },

  /**
   * Retrieves a signed URL for a protected file in Supabase Storage
   */
  async getSignedUrl(bucket: StorageBucket, filePath: string, expiresInSeconds = 3600): Promise<string | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }
    const { data } = await supabase.storage.from(bucket).createSignedUrl(filePath, expiresInSeconds);
    return data?.signedUrl || null;
  },
};
