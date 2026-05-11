export const catalogImages = {
  chicken:
    "https://images.unsplash.com/photo-1672787153652-b3b9d92f3e8c?auto=format&fit=crop&w=1200&q=80",
  chickenPieces:
    "https://images.unsplash.com/photo-1642497394469-188b0f4bcae6?auto=format&fit=crop&w=1200&q=80",
  eggs:
    "https://images.unsplash.com/photo-1635843086739-624d71f440b3?auto=format&fit=crop&w=1200&q=80",
  chicks:
    "https://images.unsplash.com/photo-1749852090392-c4bf8ae15d92?auto=format&fit=crop&w=1200&q=80",
  feed:
    "https://images.unsplash.com/photo-1645331465778-eb409d112198?auto=format&fit=crop&w=1200&q=80",
} as const;

export const catalogCategories = [
  { key: "whole", image: catalogImages.chicken },
  { key: "cuts", image: catalogImages.chickenPieces },
  { key: "eggs", image: catalogImages.eggs },
  { key: "chicks", image: catalogImages.chicks },
  { key: "feed", image: catalogImages.feed },
] as const;

export type CatalogCategoryKey = (typeof catalogCategories)[number]["key"];

type CatalogProduct = {
  key: string;
  category: CatalogCategoryKey;
  badge: string;
  image: string;
};

export const catalogProducts = [
  {
    key: "farmChicken",
    category: "whole",
    badge: "fresh",
    image: catalogImages.chicken,
  },
  {
    key: "freeRangeChicken",
    category: "whole",
    badge: "premium",
    image: catalogImages.chicken,
  },
  {
    key: "organicChicken",
    category: "whole",
    badge: "organic",
    image: catalogImages.chicken,
  },
  {
    key: "chickenBreast",
    category: "cuts",
    badge: "lean",
    image: catalogImages.chickenPieces,
  },
  {
    key: "legsThighs",
    category: "cuts",
    badge: "family",
    image: catalogImages.chicken,
  },
  {
    key: "wings",
    category: "cuts",
    badge: "grill",
    image: catalogImages.chickenPieces,
  },
  {
    key: "mixedPieces",
    category: "cuts",
    badge: "family",
    image: catalogImages.chickenPieces,
  },
  {
    key: "farmFreshEggs",
    category: "eggs",
    badge: "daily",
    image: catalogImages.eggs,
  },
  {
    key: "freeRangeEggs",
    category: "eggs",
    badge: "premium",
    image: catalogImages.eggs,
  },
  {
    key: "organicEggs",
    category: "eggs",
    badge: "organic",
    image: catalogImages.eggs,
  },
  {
    key: "eggTray",
    category: "eggs",
    badge: "bulk",
    image: catalogImages.eggs,
  },
  {
    key: "broilerChicks",
    category: "chicks",
    badge: "starter",
    image: catalogImages.chicks,
  },
  {
    key: "layerChicks",
    category: "chicks",
    badge: "layers",
    image: catalogImages.chicks,
  },
  {
    key: "starterFeed",
    category: "feed",
    badge: "starter",
    image: catalogImages.feed,
  },
  {
    key: "growerFeed",
    category: "feed",
    badge: "grower",
    image: catalogImages.feed,
  },
  {
    key: "layerFeed",
    category: "feed",
    badge: "layers",
    image: catalogImages.feed,
  },
  {
    key: "broilerFeed",
    category: "feed",
    badge: "broiler",
    image: catalogImages.feed,
  },
] satisfies CatalogProduct[];

export const featuredProductKeys = [
  "organicChicken",
  "chickenBreast",
  "organicEggs",
  "broilerChicks",
] as const;

export const featuredProducts = catalogProducts.filter((product) =>
  featuredProductKeys.includes(
    product.key as (typeof featuredProductKeys)[number],
  ),
);
