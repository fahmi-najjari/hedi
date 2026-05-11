INSERT INTO "ProductCategory" ("id", "name", "slug", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES
  ('cat_whole', 'Poulet entier', 'whole', 1, true, NOW(), NOW()),
  ('cat_cuts', 'Morceaux de poulet', 'cuts', 2, true, NOW(), NOW()),
  ('cat_eggs', 'Oeufs', 'eggs', 3, true, NOW(), NOW()),
  ('cat_chicks', 'Poussins', 'chicks', 4, true, NOW(), NOW()),
  ('cat_feed', 'Aliments', 'feed', 5, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "sortOrder" = EXCLUDED."sortOrder",
  "isActive" = true,
  "updatedAt" = NOW();

INSERT INTO "Product" (
  "id",
  "categoryId",
  "name",
  "slug",
  "description",
  "imageUrl",
  "price",
  "unit",
  "stockStatus",
  "isOrganic",
  "isFreeRange",
  "isActive",
  "createdAt",
  "updatedAt"
)
VALUES
  ('prod_farm_chicken', 'cat_whole', 'Poulet fermier', 'farm-chicken', 'Poulet entier frais pour les repas familiaux et les commandes locales.', 'https://images.unsplash.com/photo-1672787153652-b3b9d92f3e8c?auto=format&fit=crop&w=1200&q=80', 24.00, 'PIECE', 'AVAILABLE', false, false, true, NOW(), NOW()),
  ('prod_free_range_chicken', 'cat_whole', 'Poulet plein air', 'free-range-chicken', 'Une option plus riche pour les clients qui veulent un gout naturel.', 'https://images.unsplash.com/photo-1672787153652-b3b9d92f3e8c?auto=format&fit=crop&w=1200&q=80', 31.00, 'PIECE', 'AVAILABLE', false, true, true, NOW(), NOW()),
  ('prod_organic_chicken', 'cat_whole', 'Poulet biologique', 'organic-chicken', 'Poulet entier premium pour les clients qui veulent une qualite biologique.', 'https://images.unsplash.com/photo-1672787153652-b3b9d92f3e8c?auto=format&fit=crop&w=1200&q=80', 38.00, 'PIECE', 'AVAILABLE', true, false, true, NOW(), NOW()),
  ('prod_chicken_breast', 'cat_cuts', 'Blanc de poulet', 'chicken-breast', 'Morceaux tendres et maigres pour repas rapides, grillades et cuisine legere.', 'https://images.unsplash.com/photo-1642497394469-188b0f4bcae6?auto=format&fit=crop&w=1200&q=80', 18.00, 'KG', 'AVAILABLE', false, false, true, NOW(), NOW()),
  ('prod_legs_thighs', 'cat_cuts', 'Cuisses de poulet', 'legs-thighs', 'Morceaux savoureux pour repas familiaux et cuisine traditionnelle.', 'https://images.unsplash.com/photo-1642497394469-188b0f4bcae6?auto=format&fit=crop&w=1200&q=80', 13.50, 'KG', 'AVAILABLE', false, false, true, NOW(), NOW()),
  ('prod_wings', 'cat_cuts', 'Ailes de poulet', 'chicken-wings', 'Ideales pour les grillades, les snacks et les commandes restaurant.', 'https://images.unsplash.com/photo-1642497394469-188b0f4bcae6?auto=format&fit=crop&w=1200&q=80', 12.00, 'KG', 'AVAILABLE', false, false, true, NOW(), NOW()),
  ('prod_farm_fresh_eggs', 'cat_eggs', 'Oeufs frais de ferme', 'farm-fresh-eggs', 'Oeufs du jour selon la production actuelle de la ferme.', 'https://images.unsplash.com/photo-1635843086739-624d71f440b3?auto=format&fit=crop&w=1200&q=80', 8.00, 'TRAY', 'AVAILABLE', false, false, true, NOW(), NOW()),
  ('prod_organic_eggs', 'cat_eggs', 'Oeufs biologiques', 'organic-eggs', 'Oeufs premium selon la disponibilite et la production.', 'https://images.unsplash.com/photo-1635843086739-624d71f440b3?auto=format&fit=crop&w=1200&q=80', 12.00, 'TRAY', 'AVAILABLE', true, false, true, NOW(), NOW()),
  ('prod_broiler_chicks', 'cat_chicks', 'Poussins de chair', 'broiler-chicks', 'Poussins destines a l''elevage de poulets de chair.', 'https://images.unsplash.com/photo-1749852090392-c4bf8ae15d92?auto=format&fit=crop&w=1200&q=80', 2.50, 'PIECE', 'AVAILABLE', false, false, true, NOW(), NOW()),
  ('prod_layer_chicks', 'cat_chicks', 'Poussins pondeuses', 'layer-chicks', 'Poussins destines a l''elevage de poules pondeuses.', 'https://images.unsplash.com/photo-1749852090392-c4bf8ae15d92?auto=format&fit=crop&w=1200&q=80', 3.00, 'PIECE', 'AVAILABLE', false, false, true, NOW(), NOW()),
  ('prod_starter_feed', 'cat_feed', 'Aliment demarrage', 'starter-feed', 'Aliment pour la premiere phase de croissance des poussins.', 'https://images.unsplash.com/photo-1645331465778-eb409d112198?auto=format&fit=crop&w=1200&q=80', 22.00, 'BAG', 'AVAILABLE', false, false, true, NOW(), NOW()),
  ('prod_layer_feed', 'cat_feed', 'Aliment pondeuses', 'layer-feed', 'Aliment concu pour soutenir les poules pondeuses.', 'https://images.unsplash.com/photo-1645331465778-eb409d112198?auto=format&fit=crop&w=1200&q=80', 25.00, 'BAG', 'AVAILABLE', false, false, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET
  "categoryId" = EXCLUDED."categoryId",
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "imageUrl" = EXCLUDED."imageUrl",
  "price" = EXCLUDED."price",
  "unit" = EXCLUDED."unit",
  "stockStatus" = EXCLUDED."stockStatus",
  "isOrganic" = EXCLUDED."isOrganic",
  "isFreeRange" = EXCLUDED."isFreeRange",
  "isActive" = true,
  "updatedAt" = NOW();
