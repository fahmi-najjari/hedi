UPDATE "Product"
SET
  "imageUrl" = CASE "slug"
    WHEN 'farm-chicken' THEN 'https://images.unsplash.com/photo-1672787153652-b3b9d92f3e8c?auto=format&fit=crop&w=1200&q=80'
    WHEN 'free-range-chicken' THEN 'https://images.unsplash.com/photo-1672787153652-b3b9d92f3e8c?auto=format&fit=crop&w=1200&q=80'
    WHEN 'organic-chicken' THEN 'https://images.unsplash.com/photo-1672787153652-b3b9d92f3e8c?auto=format&fit=crop&w=1200&q=80'
    WHEN 'chicken-breast' THEN 'https://images.unsplash.com/photo-1642497394469-188b0f4bcae6?auto=format&fit=crop&w=1200&q=80'
    WHEN 'legs-thighs' THEN 'https://images.unsplash.com/photo-1642497394469-188b0f4bcae6?auto=format&fit=crop&w=1200&q=80'
    WHEN 'chicken-wings' THEN 'https://images.unsplash.com/photo-1642497394469-188b0f4bcae6?auto=format&fit=crop&w=1200&q=80'
    WHEN 'farm-fresh-eggs' THEN 'https://images.unsplash.com/photo-1635843086739-624d71f440b3?auto=format&fit=crop&w=1200&q=80'
    WHEN 'organic-eggs' THEN 'https://images.unsplash.com/photo-1635843086739-624d71f440b3?auto=format&fit=crop&w=1200&q=80'
    WHEN 'broiler-chicks' THEN 'https://images.unsplash.com/photo-1749852090392-c4bf8ae15d92?auto=format&fit=crop&w=1200&q=80'
    WHEN 'layer-chicks' THEN 'https://images.unsplash.com/photo-1749852090392-c4bf8ae15d92?auto=format&fit=crop&w=1200&q=80'
    WHEN 'starter-feed' THEN 'https://images.unsplash.com/photo-1645331465778-eb409d112198?auto=format&fit=crop&w=1200&q=80'
    WHEN 'layer-feed' THEN 'https://images.unsplash.com/photo-1645331465778-eb409d112198?auto=format&fit=crop&w=1200&q=80'
    ELSE "imageUrl"
  END,
  "updatedAt" = NOW()
WHERE "slug" IN (
  'farm-chicken',
  'free-range-chicken',
  'organic-chicken',
  'chicken-breast',
  'legs-thighs',
  'chicken-wings',
  'farm-fresh-eggs',
  'organic-eggs',
  'broiler-chicks',
  'layer-chicks',
  'starter-feed',
  'layer-feed'
);
