import { Metadata } from 'next';

export const DEFAULT_SEO = {
  siteName: 'ApparelCast',
  title: 'ApparelCast | South African Clothing Store',
  description: 'Shop the latest fashion trends in South Africa. Quality clothing for men and women at affordable prices. Retail and wholesale orders available with nationwide delivery.',
  url: 'https://apparelcast.shop',
  locale: 'en_ZA',
  type: 'website',
  images: {
    url: '/images/og-default.jpg',
    width: 1200,
    height: 630,
    alt: 'ApparelCast - South African Clothing Store'
  }
};

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function generateMetadata({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage,
  noIndex = false,
  keywords = []
}: SEOProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${DEFAULT_SEO.siteName}` : DEFAULT_SEO.title;
  const pageDescription = description || DEFAULT_SEO.description;
  const canonicalUrl = canonical ? `${DEFAULT_SEO.url}${canonical}` : DEFAULT_SEO.url;
  const imageUrl = ogImage || DEFAULT_SEO.images.url;

  const defaultKeywords = [
    'South African fashion',
    'clothing store SA',
    'online shopping South Africa',
    'fashion trends',
    'affordable clothing',
    'wholesale clothing',
    'mens fashion',
    'womens fashion',
    'Johannesburg fashion',
    'SA clothing brands'
  ];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [...defaultKeywords, ...keywords].join(', '),
    
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    
    alternates: {
      canonical: canonicalUrl
    },

    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: DEFAULT_SEO.siteName,
      locale: DEFAULT_SEO.locale,
      type: ogType as any,
      images: [
        {
          url: imageUrl,
          width: DEFAULT_SEO.images.width,
          height: DEFAULT_SEO.images.height,
          alt: title || DEFAULT_SEO.images.alt
        }
      ]
    },

    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
      creator: '@fashioncenter'
    },

    other: {
      'theme-color': '#1a56db', // primary-600
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no'
    }
  };
}

// Product-specific metadata
export function generateProductMetadata(product: {
  name: string;
  description: string;
  price: number;
  images?: string[];
  category?: string;
  on_sale?: boolean;
  sale_price?: number;
}): Metadata {
  const price = product.on_sale && product.sale_price ? product.sale_price : product.price;
  const currency = 'ZAR';
  
  return {
    ...generateMetadata({
      title: product.name,
      description: product.description,
      canonical: `/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`,
      ogType: 'product',
      ogImage: product.images?.[0],
      keywords: [
        product.name,
        product.category || '',
        'buy online',
        'South Africa',
        product.on_sale ? 'on sale' : '',
        'fashion'
      ].filter(Boolean)
    }),
    
    openGraph: {
      type: 'product',
      title: product.name,
      description: product.description,
      images: product.images?.map(img => ({
        url: img,
        width: 800,
        height: 800,
        alt: product.name
      })) || [],
      siteName: DEFAULT_SEO.siteName
    },

    other: {
      'product:price:amount': price.toString(),
      'product:price:currency': currency,
      'product:availability': 'in stock',
      'product:condition': 'new',
      'product:retailer_item_id': product.name.toLowerCase().replace(/\s+/g, '-')
    }
  };
}

// Blog/Article metadata
export function generateArticleMetadata(article: {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  image?: string;
}): Metadata {
  return {
    ...generateMetadata({
      title: article.title,
      description: article.description,
      ogType: 'article',
      ogImage: article.image,
      keywords: article.tags || []
    }),

    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      publishedTime: article.publishedTime,
      modifiedTime: article.modifiedTime,
      authors: article.author ? [article.author] : undefined,
      tags: article.tags
    }
  };
}

// Organization JSON-LD structured data
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: DEFAULT_SEO.siteName,
    description: DEFAULT_SEO.description,
    url: DEFAULT_SEO.url,
    logo: `${DEFAULT_SEO.url}/images/logo.png`,
    image: DEFAULT_SEO.images.url,
    telephone: '+27-123-456-789',
    email: 'info@fashioncenter.co.za',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Johannesburg',
      addressRegion: 'Gauteng',
      addressCountry: 'ZA'
    },
    sameAs: [
      'https://facebook.com/fashioncenter',
      'https://instagram.com/fashioncenter',
      'https://twitter.com/fashioncenter'
    ],
    priceRange: 'R50 - R5000',
    currenciesAccepted: 'ZAR',
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'PayStack']
  };
}

// Product JSON-LD structured data
export function generateProductSchema(product: {
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  on_sale?: boolean;
  images?: string[];
  category?: string;
  sku?: string;
}) {
  const price = product.on_sale && product.sale_price ? product.sale_price : product.price;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images || [],
    sku: product.sku || product.name.toLowerCase().replace(/\s+/g, '-'),
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'ZAR',
      availability: 'https://schema.org/InStock',
      url: `${DEFAULT_SEO.url}/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`,
      seller: {
        '@type': 'Organization',
        name: DEFAULT_SEO.siteName
      }
    },
    brand: {
      '@type': 'Brand',
      name: DEFAULT_SEO.siteName
    }
  };
}

// Breadcrumb JSON-LD
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${DEFAULT_SEO.url}${item.url}`
    }))
  };
}

export default {
  generateMetadata,
  generateProductMetadata,
  generateArticleMetadata,
  generateOrganizationSchema,
  generateProductSchema,
  generateBreadcrumbSchema
};

