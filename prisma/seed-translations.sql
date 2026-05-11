INSERT INTO "CategoryTranslation" ("id", "categoryId", "locale", "name", "description")
SELECT
  'cat_tr_fr_' || "id",
  "id",
  'fr',
  "name",
  "description"
FROM "ProductCategory"
ON CONFLICT ("categoryId", "locale") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description";

INSERT INTO "ProductTranslation" ("id", "productId", "locale", "name", "description")
SELECT
  'prod_tr_fr_' || "id",
  "id",
  'fr',
  "name",
  "description"
FROM "Product"
ON CONFLICT ("productId", "locale") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description";

INSERT INTO "CategoryTranslation" ("id", "categoryId", "locale", "name", "description")
SELECT
  'cat_tr_ar_' || c."id",
  c."id",
  'ar',
  v."name",
  v."description"
FROM "ProductCategory" c
JOIN (
  VALUES
    ('whole', 'دجاج كامل', 'دجاج كامل من المزرعة للطلبات العائلية.'),
    ('cuts', 'قطع دجاج', 'صدور، أجنحة، أفخاذ وقطع حسب التوفر.'),
    ('eggs', 'بيض', 'بيض طازج من المزرعة حسب الإنتاج.'),
    ('chicks', 'كتاكيت', 'كتاكيت للتربية وإنتاج اللحم أو البيض.'),
    ('feed', 'أعلاف', 'أعلاف للدواجن حسب مرحلة النمو.')
) AS v("slug", "name", "description") ON v."slug" = c."slug"
ON CONFLICT ("categoryId", "locale") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description";

INSERT INTO "ProductTranslation" ("id", "productId", "locale", "name", "description")
SELECT
  'prod_tr_ar_' || p."id",
  p."id",
  'ar',
  v."name",
  v."description"
FROM "Product" p
JOIN (
  VALUES
    ('farm-chicken', 'دجاج المزرعة', 'دجاج كامل طازج للبيت والمطاعم والطلبات العائلية.'),
    ('free-range-chicken', 'دجاج حر', 'اختيار طبيعي أكثر للزبائن الذين يريدون مذاق المزرعة.'),
    ('organic-chicken', 'دجاج عضوي', 'دجاج كامل بجودة أعلى للطلبات الخاصة.'),
    ('chicken-breast', 'صدر دجاج', 'قطع طرية وخفيفة للطبخ السريع والشوي.'),
    ('legs-thighs', 'أفخاذ دجاج', 'قطع لذيذة للطبخ العائلي والأكلات التقليدية.'),
    ('chicken-wings', 'أجنحة دجاج', 'مناسبة للشوي والوجبات الخفيفة وطلبات المطاعم.'),
    ('farm-fresh-eggs', 'بيض طازج من المزرعة', 'بيض يومي حسب إنتاج المزرعة المتوفر.'),
    ('organic-eggs', 'بيض عضوي', 'بيض بجودة أعلى حسب التوفر والإنتاج.'),
    ('broiler-chicks', 'كتاكيت لحم', 'كتاكيت مخصصة لتربية دجاج اللحم.'),
    ('layer-chicks', 'كتاكيت بياضة', 'كتاكيت مخصصة لتربية الدجاج البياض.'),
    ('starter-feed', 'علف بداية', 'علف للمرحلة الأولى من نمو الكتاكيت.'),
    ('layer-feed', 'علف بياض', 'علف مخصص لدعم الدجاج البياض.')
) AS v("slug", "name", "description") ON v."slug" = p."slug"
ON CONFLICT ("productId", "locale") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description";
