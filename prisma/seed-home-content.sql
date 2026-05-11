UPDATE "ProductCategory"
SET
  "imageUrl" = CASE "slug"
    WHEN 'whole' THEN 'https://images.unsplash.com/photo-1672787153652-b3b9d92f3e8c?auto=format&fit=crop&w=1200&q=80'
    WHEN 'cuts' THEN 'https://images.unsplash.com/photo-1642497394469-188b0f4bcae6?auto=format&fit=crop&w=1200&q=80'
    WHEN 'eggs' THEN 'https://images.unsplash.com/photo-1635843086739-624d71f440b3?auto=format&fit=crop&w=1200&q=80'
    WHEN 'chicks' THEN 'https://images.unsplash.com/photo-1749852090392-c4bf8ae15d92?auto=format&fit=crop&w=1200&q=80'
    WHEN 'feed' THEN 'https://images.unsplash.com/photo-1645331465778-eb409d112198?auto=format&fit=crop&w=1200&q=80'
    ELSE "imageUrl"
  END,
  "showOnHome" = true,
  "updatedAt" = NOW()
WHERE "slug" IN ('whole', 'cuts', 'eggs', 'chicks', 'feed');

UPDATE "Product"
SET
  "isFeatured" = CASE "slug"
    WHEN 'farm-chicken' THEN true
    WHEN 'organic-chicken' THEN true
    WHEN 'chicken-breast' THEN true
    WHEN 'organic-eggs' THEN true
    ELSE false
  END,
  "featuredSortOrder" = CASE "slug"
    WHEN 'farm-chicken' THEN 1
    WHEN 'organic-chicken' THEN 2
    WHEN 'chicken-breast' THEN 3
    WHEN 'organic-eggs' THEN 4
    ELSE 0
  END,
  "updatedAt" = NOW();

INSERT INTO "HomeContent" (
  "id",
  "heroBadge",
  "heroTitle",
  "heroHighlight",
  "heroIntro",
  "heroImageUrl",
  "heroVisualTitle",
  "heroVisualText",
  "categoriesEyebrow",
  "categoriesTitle",
  "categoriesIntro",
  "productsEyebrow",
  "productsTitle",
  "productsIntro",
  "paymentTitle",
  "paymentText",
  "paymentCta",
  "updatedAt"
)
VALUES (
  'home',
  'Direct ferme',
  'Volaille fraiche pour votre table',
  'chaque semaine',
  'Commandez poulet fermier, oeufs, poussins et aliments avec une livraison simple et locale.',
  'https://images.unsplash.com/photo-1642497394469-188b0f4bcae6?auto=format&fit=crop&w=1200&q=80',
  'Produits frais de la ferme',
  'Selection locale selon la disponibilite.',
  'Categories',
  'Acheter par categorie',
  'Retrouvez rapidement les produits principaux de la ferme.',
  'Selection',
  'Produits mis en avant',
  'Les produits choisis par l''administrateur pour la page d''accueil.',
  'Paiement simple',
  'Envoyez votre commande, puis nous confirmons la disponibilite, la livraison et le paiement.',
  'Voir le panier',
  NOW()
)
ON CONFLICT ("id") DO NOTHING;
