import { ItemImage } from '@/types';

export const fileService = {
  /**
   * Reads a user-uploaded File object (camera, file picker, or drag-and-drop)
   * and generates a preview/persistent data URL for the demo storage layer.
   * Ready for Cloudflare R2 / S3 signed URL upload in production.
   */
  async processUploadedFile(file: File, tag: ItemImage['tag'] = 'General'): Promise<ItemImage> {
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validExtensions.includes(file.type)) {
      throw new Error('Invalid file format. Please upload JPG, PNG, or WEBP images.');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB limit.');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({
          id: `IMG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          url: dataUrl,
          tag,
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  /**
   * Production signature placeholder for Cloudflare R2 / S3 direct multipart upload
   */
  async getPresignedUploadUrl(fileName: string, contentType: string): Promise<{ uploadUrl: string; finalCdnUrl: string }> {
    // In production, this calls FastAPI /api/v1/storage/presigned-url
    return {
      uploadUrl: `https://storage.texasgoldbuyers.com/upload/${Date.now()}_${fileName}`,
      finalCdnUrl: `https://cdn.texasgoldbuyers.com/items/${Date.now()}_${fileName}`,
    };
  },
};
