"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { defaultHomeContent } from "@/lib/home-content";
import { getPrisma } from "@/lib/prisma";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getOptionalString(formData: FormData, key: string) {
  return getString(formData, key) || null;
}

function getNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(getString(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function revalidatePublicPages() {
  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/shop", "page");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = getString(formData, "name");
  const nameAr = getString(formData, "nameAr");
  const description = getOptionalString(formData, "description");
  const descriptionAr = getOptionalString(formData, "descriptionAr");
  const imageUrl = getOptionalString(formData, "imageUrl");
  const sortOrder = getNumber(formData, "sortOrder");

  if (!name) {
    redirect("/admin/categories?error=category");
  }

  const category = await getPrisma().productCategory.create({
    data: {
      name,
      slug: slugify(name),
      description,
      imageUrl,
      sortOrder,
      showOnHome: formData.get("showOnHome") === "on",
      isActive: formData.get("isActive") === "on",
    },
  });

  await Promise.all([
    getPrisma().categoryTranslation.create({
      data: {
        categoryId: category.id,
        locale: "fr",
        name,
        description,
      },
    }),
    nameAr || descriptionAr
      ? getPrisma().categoryTranslation.create({
          data: {
            categoryId: category.id,
            locale: "ar",
            name: nameAr || name,
            description: descriptionAr || description,
          },
        })
      : Promise.resolve(),
  ]);

  revalidatePublicPages();
  redirect("/admin/categories?category=created");
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");
  const name = getString(formData, "nameFr");
  const nameAr = getString(formData, "nameAr");
  const description = getOptionalString(formData, "descriptionFr");
  const descriptionAr = getOptionalString(formData, "descriptionAr");

  if (!id || !name) {
    redirect("/admin/categories?error=category");
  }

  await getPrisma().productCategory.update({
    where: { id },
    data: {
      name,
      description,
      imageUrl: getOptionalString(formData, "imageUrl"),
      sortOrder: getNumber(formData, "sortOrder"),
      showOnHome: formData.get("showOnHome") === "on",
      isActive: formData.get("isActive") === "on",
    },
  });

  await Promise.all([
    getPrisma().categoryTranslation.upsert({
      where: {
        categoryId_locale: {
          categoryId: id,
          locale: "fr",
        },
      },
      create: {
        categoryId: id,
        locale: "fr",
        name,
        description,
      },
      update: {
        name,
        description,
      },
    }),
    getPrisma().categoryTranslation.upsert({
      where: {
        categoryId_locale: {
          categoryId: id,
          locale: "ar",
        },
      },
      create: {
        categoryId: id,
        locale: "ar",
        name: nameAr || name,
        description: descriptionAr || description,
      },
      update: {
        name: nameAr || name,
        description: descriptionAr || description,
      },
    }),
  ]);

  revalidatePublicPages();
  redirect("/admin/categories?category=updated");
}

export async function updateHomeContent(formData: FormData) {
  await requireAdmin();

  await getPrisma().homeContent.upsert({
    where: { id: "home" },
    create: {
      ...defaultHomeContent,
      heroBadge: getString(formData, "heroBadge") || defaultHomeContent.heroBadge,
      heroTitle: getString(formData, "heroTitle") || defaultHomeContent.heroTitle,
      heroHighlight:
        getString(formData, "heroHighlight") || defaultHomeContent.heroHighlight,
      heroIntro: getString(formData, "heroIntro") || defaultHomeContent.heroIntro,
      heroImageUrl: getOptionalString(formData, "heroImageUrl"),
      heroVisualTitle:
        getString(formData, "heroVisualTitle") ||
        defaultHomeContent.heroVisualTitle,
      heroVisualText:
        getString(formData, "heroVisualText") || defaultHomeContent.heroVisualText,
      categoriesEyebrow:
        getString(formData, "categoriesEyebrow") ||
        defaultHomeContent.categoriesEyebrow,
      categoriesTitle:
        getString(formData, "categoriesTitle") ||
        defaultHomeContent.categoriesTitle,
      categoriesIntro:
        getString(formData, "categoriesIntro") ||
        defaultHomeContent.categoriesIntro,
      productsEyebrow:
        getString(formData, "productsEyebrow") ||
        defaultHomeContent.productsEyebrow,
      productsTitle:
        getString(formData, "productsTitle") || defaultHomeContent.productsTitle,
      productsIntro:
        getString(formData, "productsIntro") || defaultHomeContent.productsIntro,
      paymentTitle:
        getString(formData, "paymentTitle") || defaultHomeContent.paymentTitle,
      paymentText:
        getString(formData, "paymentText") || defaultHomeContent.paymentText,
      paymentCta: getString(formData, "paymentCta") || defaultHomeContent.paymentCta,
    },
    update: {
      heroBadge: getString(formData, "heroBadge") || defaultHomeContent.heroBadge,
      heroTitle: getString(formData, "heroTitle") || defaultHomeContent.heroTitle,
      heroHighlight:
        getString(formData, "heroHighlight") || defaultHomeContent.heroHighlight,
      heroIntro: getString(formData, "heroIntro") || defaultHomeContent.heroIntro,
      heroImageUrl: getOptionalString(formData, "heroImageUrl"),
      heroVisualTitle:
        getString(formData, "heroVisualTitle") ||
        defaultHomeContent.heroVisualTitle,
      heroVisualText:
        getString(formData, "heroVisualText") || defaultHomeContent.heroVisualText,
      categoriesEyebrow:
        getString(formData, "categoriesEyebrow") ||
        defaultHomeContent.categoriesEyebrow,
      categoriesTitle:
        getString(formData, "categoriesTitle") ||
        defaultHomeContent.categoriesTitle,
      categoriesIntro:
        getString(formData, "categoriesIntro") ||
        defaultHomeContent.categoriesIntro,
      productsEyebrow:
        getString(formData, "productsEyebrow") ||
        defaultHomeContent.productsEyebrow,
      productsTitle:
        getString(formData, "productsTitle") || defaultHomeContent.productsTitle,
      productsIntro:
        getString(formData, "productsIntro") || defaultHomeContent.productsIntro,
      paymentTitle:
        getString(formData, "paymentTitle") || defaultHomeContent.paymentTitle,
      paymentText:
        getString(formData, "paymentText") || defaultHomeContent.paymentText,
      paymentCta: getString(formData, "paymentCta") || defaultHomeContent.paymentCta,
    },
  });

  revalidatePublicPages();
  redirect("/admin/home?home=updated");
}

export async function updateFeaturedProducts(formData: FormData) {
  await requireAdmin();

  const prisma = getPrisma();
  const productIds = formData.getAll("featuredProductIds").map(String);

  await prisma.product.updateMany({
    data: {
      isFeatured: false,
      featuredSortOrder: 0,
    },
  });

  await Promise.all(
    productIds.map((id, index) =>
      prisma.product.update({
        where: { id },
        data: {
          isFeatured: true,
          featuredSortOrder: index + 1,
        },
      }),
    ),
  );

  revalidatePublicPages();
  redirect("/admin/home?featured=updated");
}
