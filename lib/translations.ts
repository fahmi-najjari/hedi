type Translation = {
  locale: string;
  name: string;
  description?: string | null;
};

type Translatable = {
  name: string;
  description?: string | null;
  translations?: Translation[];
};

export function getLocalizedFields<T extends Translatable>(
  item: T,
  locale: string,
) {
  const translation =
    item.translations?.find((entry) => entry.locale === locale) ??
    item.translations?.find((entry) => entry.locale === "fr");

  return {
    name: translation?.name || item.name,
    description: translation?.description ?? item.description ?? "",
  };
}
