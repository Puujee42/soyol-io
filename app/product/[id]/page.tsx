import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import ProductDetailClient from "@/components/ProductDetailClient";
import { CacheTags } from "@/lib/cache-tags";
import { ObjectId } from "mongodb";

export const revalidate = 86400;

type ProductResponse = {
  _id: string | ObjectId;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  image?: string | null;
  images?: string[];
  category?: string;
  stockStatus?: "in-stock" | "pre-order" | string;
  inventory?: number;
  brand?: string;
  model?: string;
  paymentMethods?: string[];
  sections?: string[];
  attributes?: Record<string, string>;
  options?: any[];
  variants?: any[];
  shippingOrigin?: string;
  shippingDestination?: string;
  dispatchTime?: string;
  sizeGuideUrl?: string;
  wholesale?: boolean;
  featured?: boolean;
  isCargo?: boolean;
  deliveryFee?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  rating?: number;
};

async function fetchProductFromDb(id: string): Promise<ProductResponse | null> {
  const { getCollection } = await import("@/lib/mongodb");
  let objectId: InstanceType<typeof ObjectId>;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }
  const products = await getCollection("products");
  const product = await products.findOne({ _id: objectId } as any);
  if (!product) return null;
  return product as unknown as ProductResponse;
}

const getCachedProduct = unstable_cache(
  async (id: string) => fetchProductFromDb(id),
  ['product-detail'],
  { revalidate: 86400 }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const product = await getCachedProduct(id);
    if (!product) return {};
    return {
      title: product.isCargo ? `${product.name} + Карго` : product.name,
      description: product.description || product.name,
      openGraph: {
        title: product.isCargo ? `${product.name} + Карго` : product.name,
        description: product.description || product.name,
        images: product.images?.[0]
          ? [{ url: product.images[0] }]
          : product.image
            ? [{ url: product.image }]
            : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const product = await getCachedProduct(id);

    if (!product) {
      notFound();
    }

    const { getCollection } = await import("@/lib/mongodb");
    const products = await getCollection("products");

    const relatedProducts = await products
      .find({
        category: product.category,
        _id: { $ne: new ObjectId(id) }
      } as any)
      .limit(4)
      .toArray();

    const mappedRelatedProducts = relatedProducts.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      image: p.image || '',
      price: p.price,
      rating: p.rating || 0,
      category: p.category,
      featured: p.featured,
      stockStatus: p.stockStatus,
      isCargo: p.isCargo || false,
      inventory: p.inventory
    }));

    const productData = {
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent,
      image: product.image || null,
      images: product.images || [],
      category: product.category,
      stockStatus: product.stockStatus || 'in-stock',
      inventory: product.inventory ?? 0,
      brand: product.brand || undefined,
      model: product.model || undefined,
      paymentMethods: product.paymentMethods || undefined,
      sections: product.sections || [],
      attributes: product.attributes || {},
      options: product.options || [],
      variants: product.variants || [],
      shippingOrigin: product.shippingOrigin || undefined,
      shippingDestination: product.shippingDestination || undefined,
      dispatchTime: product.dispatchTime || undefined,
      sizeGuideUrl: product.sizeGuideUrl || undefined,
      wholesale: product.wholesale || false,
      featured: product.featured || false,
      isCargo: product.isCargo || false,
      deliveryFee: product.deliveryFee ?? 0,
      createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
      rating: product.rating || 0,
      relatedProducts: mappedRelatedProducts,
    };

    return <ProductDetailClient product={productData as any} initialReviews={[]} />;
  } catch {
    notFound();
  }
}
