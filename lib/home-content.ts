import { catalogImages } from "@/lib/catalog";

export const defaultHomeContent = {
  id: "home",
  heroBadge: "Direct ferme",
  heroTitle: "Volaille fraiche pour votre table",
  heroHighlight: "chaque semaine",
  heroIntro:
    "Commandez poulet fermier, oeufs, poussins et aliments avec une livraison simple et locale.",
  heroImageUrl: catalogImages.chickenPieces,
  heroVisualTitle: "Produits frais de la ferme",
  heroVisualText: "Selection locale selon la disponibilite.",
  categoriesEyebrow: "Categories",
  categoriesTitle: "Acheter par categorie",
  categoriesIntro:
    "Retrouvez rapidement les produits principaux de la ferme.",
  productsEyebrow: "Selection",
  productsTitle: "Produits mis en avant",
  productsIntro:
    "Les produits choisis par l'administrateur pour la page d'accueil.",
  paymentTitle: "Paiement simple",
  paymentText:
    "Envoyez votre commande, puis nous confirmons la disponibilite, la livraison et le paiement.",
  paymentCta: "Voir le panier",
} as const;
