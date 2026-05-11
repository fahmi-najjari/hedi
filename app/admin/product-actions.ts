"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProductUnit, StockStatus } from "@/generated/prisma/enums";
import { requireAdmin } from "@/lib/admin-auth";
import { catalogImages } from "@/lib/catalog";
import { getPrisma } from "@/lib/prisma";

const categorySeeds = [
  {
    slug: "whole",
    name: "Poulet entier",
    imageUrl: catalogImages.chicken,
    sortOrder: 1,
  },
  {
    slug: "cuts",
    name: "Morceaux de poulet",
    imageUrl: catalogImages.chickenPieces,
    sortOrder: 2,
  },
  { slug: "eggs", name: "Oeufs", imageUrl: catalogImages.eggs, sortOrder: 3 },
  {
    slug: "chicks",
    name: "Poussins",
    imageUrl: catalogImages.chicks,
    sortOrder: 4,
  },
  { slug: "feed", name: "Aliments", imageUrl: catalogImages.feed, sortOrder: 5 },
] as const;

type ProductSeed = {
  categorySlug: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  price: string;
  unit: ProductUnit;
  imageUrl: string;
  isOrganic?: boolean;
  isFreeRange?: boolean;
  isFeatured?: boolean;
  featuredSortOrder?: number;
};

const productSeeds: ProductSeed[] = [
  {
    categorySlug: "whole",
    name: "Poulet fermier",
    nameAr: "دجاج المزرعة",
    slug: "farm-chicken",
    description: "Poulet entier frais pour les repas familiaux et les commandes locales.",
    descriptionAr: "دجاج كامل طازج للبيت والمطاعم والطلبات العائلية.",
    price: "24.00",
    unit: ProductUnit.PIECE,
    imageUrl: catalogImages.chicken,
    isFeatured: true,
    featuredSortOrder: 1,
  },
  {
    categorySlug: "whole",
    name: "Poulet plein air",
    nameAr: "دجاج حر",
    slug: "free-range-chicken",
    description: "Une option plus riche pour les clients qui veulent un gout naturel.",
    descriptionAr: "اختيار طبيعي أكثر للزبائن الذين يريدون مذاق المزرعة.",
    price: "31.00",
    unit: ProductUnit.PIECE,
    imageUrl: catalogImages.chicken,
    isFreeRange: true,
  },
  {
    categorySlug: "whole",
    name: "Poulet biologique",
    nameAr: "دجاج عضوي",
    slug: "organic-chicken",
    description: "Poulet entier premium pour les clients qui veulent une qualite biologique.",
    descriptionAr: "دجاج كامل بجودة أعلى للطلبات الخاصة.",
    price: "38.00",
    unit: ProductUnit.PIECE,
    imageUrl: catalogImages.chicken,
    isOrganic: true,
    isFeatured: true,
    featuredSortOrder: 2,
  },
  {
    categorySlug: "cuts",
    name: "Blanc de poulet",
    nameAr: "صدر دجاج",
    slug: "chicken-breast",
    description: "Morceaux tendres et maigres pour repas rapides, grillades et cuisine legere.",
    descriptionAr: "قطع طرية وخفيفة للطبخ السريع والشوي.",
    price: "18.00",
    unit: ProductUnit.KG,
    imageUrl: catalogImages.chickenPieces,
    isFeatured: true,
    featuredSortOrder: 3,
  },
  {
    categorySlug: "cuts",
    name: "Cuisses de poulet",
    nameAr: "أفخاذ دجاج",
    slug: "legs-thighs",
    description: "Morceaux savoureux pour repas familiaux et cuisine traditionnelle.",
    descriptionAr: "قطع لذيذة للطبخ العائلي والأكلات التقليدية.",
    price: "13.50",
    unit: ProductUnit.KG,
    imageUrl: catalogImages.chicken,
  },
  {
    categorySlug: "cuts",
    name: "Ailes de poulet",
    nameAr: "أجنحة دجاج",
    slug: "chicken-wings",
    description: "Ideales pour les grillades, les snacks et les commandes restaurant.",
    descriptionAr: "مناسبة للشوي والوجبات الخفيفة وطلبات المطاعم.",
    price: "12.00",
    unit: ProductUnit.KG,
    imageUrl: catalogImages.chickenPieces,
  },
  {
    categorySlug: "eggs",
    name: "Oeufs frais de ferme",
    nameAr: "بيض طازج من المزرعة",
    slug: "farm-fresh-eggs",
    description: "Oeufs du jour selon la production actuelle de la ferme.",
    descriptionAr: "بيض يومي حسب إنتاج المزرعة المتوفر.",
    price: "8.00",
    unit: ProductUnit.TRAY,
    imageUrl: catalogImages.eggs,
  },
  {
    categorySlug: "eggs",
    name: "Oeufs biologiques",
    nameAr: "بيض عضوي",
    slug: "organic-eggs",
    description: "Oeufs premium selon la disponibilite et la production.",
    descriptionAr: "بيض بجودة أعلى حسب التوفر والإنتاج.",
    price: "12.00",
    unit: ProductUnit.TRAY,
    imageUrl: catalogImages.eggs,
    isOrganic: true,
    isFeatured: true,
    featuredSortOrder: 4,
  },
  {
    categorySlug: "chicks",
    name: "Poussins de chair",
    nameAr: "كتاكيت لحم",
    slug: "broiler-chicks",
    description: "Poussins destines a l'elevage de poulets de chair.",
    descriptionAr: "كتاكيت مخصصة لتربية دجاج اللحم.",
    price: "2.50",
    unit: ProductUnit.PIECE,
    imageUrl: catalogImages.chicks,
  },
  {
    categorySlug: "chicks",
    name: "Poussins pondeuses",
    nameAr: "كتاكيت بياضة",
    slug: "layer-chicks",
    description: "Poussins destines a l'elevage de poules pondeuses.",
    descriptionAr: "كتاكيت مخصصة لتربية الدجاج البياض.",
    price: "3.00",
    unit: ProductUnit.PIECE,
    imageUrl: catalogImages.chicks,
  },
  {
    categorySlug: "feed",
    name: "Aliment demarrage",
    nameAr: "علف بداية",
    slug: "starter-feed",
    description: "Aliment pour la premiere phase de croissance des poussins.",
    descriptionAr: "علف للمرحلة الأولى من نمو الكتاكيت.",
    price: "22.00",
    unit: ProductUnit.BAG,
    imageUrl: catalogImages.feed,
  },
  {
    categorySlug: "feed",
    name: "Aliment pondeuses",
    nameAr: "علف بياض",
    slug: "layer-feed",
    description: "Aliment concu pour soutenir les poules pondeuses.",
    descriptionAr: "علف مخصص لدعم الدجاج البياض.",
    price: "25.00",
    unit: ProductUnit.BAG,
    imageUrl: catalogImages.feed,
  },
] as const;

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getEnumValue<T extends Record<string, string>>(
  enumObject: T,
  value: string,
  fallback: T[keyof T],
) {
  const values = Object.values(enumObject);

  return values.includes(value) ? (value as T[keyof T]) : fallback;
}

export async function seedStarterCatalog() {
  await requireAdmin();
  const prisma = getPrisma();

  const categories = new Map<string, string>();

  for (const category of categorySeeds) {
    const result = await prisma.productCategory.upsert({
      where: { slug: category.slug },
      create: category,
      update: {
        name: category.name,
        imageUrl: category.imageUrl,
        sortOrder: category.sortOrder,
        showOnHome: true,
        isActive: true,
      },
    });
    categories.set(category.slug, result.id);
  }

  for (const product of productSeeds) {
    const categoryId = categories.get(product.categorySlug);

    if (!categoryId) {
      continue;
    }

    const savedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        categoryId,
        name: product.name,
        slug: product.slug,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        unit: product.unit,
        stockStatus: StockStatus.AVAILABLE,
        isOrganic: product.isOrganic ?? false,
        isFreeRange: product.isFreeRange ?? false,
        isFeatured: product.isFeatured ?? false,
        featuredSortOrder: product.featuredSortOrder ?? 0,
      },
      update: {
        categoryId,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        unit: product.unit,
        stockStatus: StockStatus.AVAILABLE,
        isOrganic: product.isOrganic ?? false,
        isFreeRange: product.isFreeRange ?? false,
        isFeatured: product.isFeatured ?? false,
        featuredSortOrder: product.featuredSortOrder ?? 0,
        isActive: true,
      },
    });

    await Promise.all([
      prisma.productTranslation.upsert({
        where: {
          productId_locale: {
            productId: savedProduct.id,
            locale: "fr",
          },
        },
        create: {
          productId: savedProduct.id,
          locale: "fr",
          name: product.name,
          description: product.description,
        },
        update: {
          name: product.name,
          description: product.description,
        },
      }),
      prisma.productTranslation.upsert({
        where: {
          productId_locale: {
            productId: savedProduct.id,
            locale: "ar",
          },
        },
        create: {
          productId: savedProduct.id,
          locale: "ar",
          name: product.nameAr,
          description: product.descriptionAr,
        },
        update: {
          name: product.nameAr,
          description: product.descriptionAr,
        },
      }),
    ]);
  }

  revalidatePath("/[locale]/shop", "page");
  revalidatePath("/[locale]", "page");
  redirect("/admin?seeded=1");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const categoryId = getString(formData, "categoryId");
  const nameFr = getString(formData, "nameFr");
  const nameAr = getString(formData, "nameAr");
  const descriptionFr = getString(formData, "descriptionFr");
  const descriptionAr = getString(formData, "descriptionAr");
  const price = getString(formData, "price");
  const imageUrl = getString(formData, "imageUrl") || null;
  const unit = getEnumValue(ProductUnit, getString(formData, "unit"), ProductUnit.PIECE);
  const stockStatus = getEnumValue(
    StockStatus,
    getString(formData, "stockStatus"),
    StockStatus.AVAILABLE,
  );

  if (!categoryId || !nameFr || !descriptionFr || !price || Number(price) <= 0) {
    redirect("/admin?error=product");
  }

  const product = await getPrisma().product.create({
    data: {
      categoryId,
      name: nameFr,
      slug: slugify(nameFr),
      description: descriptionFr,
      imageUrl,
      price,
      unit,
      stockStatus,
      isOrganic: formData.get("isOrganic") === "on",
      isFreeRange: formData.get("isFreeRange") === "on",
      isActive: formData.get("isActive") === "on",
    },
  });

  await Promise.all([
    getPrisma().productTranslation.create({
      data: {
        productId: product.id,
        locale: "fr",
        name: nameFr,
        description: descriptionFr,
      },
    }),
    nameAr || descriptionAr
      ? getPrisma().productTranslation.create({
          data: {
            productId: product.id,
            locale: "ar",
            name: nameAr || nameFr,
            description: descriptionAr || descriptionFr,
          },
        })
      : Promise.resolve(),
  ]);

  revalidatePath("/[locale]/shop", "page");
  revalidatePath("/[locale]", "page");
  redirect("/admin?created=1");
}

export async function toggleProductActive(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");
  const isActive = getString(formData, "isActive") === "true";

  if (!id) {
    redirect("/admin");
  }

  await getPrisma().product.update({
    where: { id },
    data: { isActive: !isActive },
  });

  revalidatePath("/[locale]/shop", "page");
  revalidatePath("/[locale]", "page");
  redirect("/admin");
}
