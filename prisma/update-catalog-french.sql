UPDATE "ProductCategory"
SET
  "name" = CASE "slug"
    WHEN 'whole' THEN 'Poulet entier'
    WHEN 'cuts' THEN 'Morceaux de poulet'
    WHEN 'eggs' THEN 'Oeufs'
    WHEN 'chicks' THEN 'Poussins'
    WHEN 'feed' THEN 'Aliments'
    ELSE "name"
  END,
  "updatedAt" = NOW()
WHERE "slug" IN ('whole', 'cuts', 'eggs', 'chicks', 'feed');

UPDATE "Product"
SET
  "name" = CASE "slug"
    WHEN 'farm-chicken' THEN 'Poulet fermier'
    WHEN 'free-range-chicken' THEN 'Poulet plein air'
    WHEN 'organic-chicken' THEN 'Poulet biologique'
    WHEN 'chicken-breast' THEN 'Blanc de poulet'
    WHEN 'legs-thighs' THEN 'Cuisses de poulet'
    WHEN 'chicken-wings' THEN 'Ailes de poulet'
    WHEN 'farm-fresh-eggs' THEN 'Oeufs frais de ferme'
    WHEN 'organic-eggs' THEN 'Oeufs biologiques'
    WHEN 'broiler-chicks' THEN 'Poussins de chair'
    WHEN 'layer-chicks' THEN 'Poussins pondeuses'
    WHEN 'starter-feed' THEN 'Aliment demarrage'
    WHEN 'layer-feed' THEN 'Aliment pondeuses'
    ELSE "name"
  END,
  "description" = CASE "slug"
    WHEN 'farm-chicken' THEN 'Poulet entier frais pour les repas familiaux et les commandes locales.'
    WHEN 'free-range-chicken' THEN 'Une option plus riche pour les clients qui veulent un gout naturel.'
    WHEN 'organic-chicken' THEN 'Poulet entier premium pour les clients qui veulent une qualite biologique.'
    WHEN 'chicken-breast' THEN 'Morceaux tendres et maigres pour repas rapides, grillades et cuisine legere.'
    WHEN 'legs-thighs' THEN 'Morceaux savoureux pour repas familiaux et cuisine traditionnelle.'
    WHEN 'chicken-wings' THEN 'Ideales pour les grillades, les snacks et les commandes restaurant.'
    WHEN 'farm-fresh-eggs' THEN 'Oeufs du jour selon la production actuelle de la ferme.'
    WHEN 'organic-eggs' THEN 'Oeufs premium selon la disponibilite et la production.'
    WHEN 'broiler-chicks' THEN 'Poussins destines a l''elevage de poulets de chair.'
    WHEN 'layer-chicks' THEN 'Poussins destines a l''elevage de poules pondeuses.'
    WHEN 'starter-feed' THEN 'Aliment pour la premiere phase de croissance des poussins.'
    WHEN 'layer-feed' THEN 'Aliment concu pour soutenir les poules pondeuses.'
    ELSE "description"
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
