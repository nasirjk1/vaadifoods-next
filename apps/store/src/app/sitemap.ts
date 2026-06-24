import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const baseUrl = 'https://vaadi-foods.com'; // Replace with actual domain
  
  let products: any[] | null = null;
  let categories: any[] | null = null;

  try {
    const { data: pData } = await supabase.from('products').select('id, created_at');
    const { data: cData } = await supabase.from('categories').select('name');
    products = pData;
    categories = cData;
  } catch (err) {
    console.error("Sitemap Supabase fetch error:", err);
  }

  const productEntries: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.created_at ? new Date(product.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
    url: `${baseUrl}/categories/${cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categoryEntries,
    ...productEntries,
  ];
}
