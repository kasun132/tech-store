import type { Product } from "./catalog";

export function canSaveProduct(uploadingImage: boolean, uploadPending: boolean, savePending: boolean) {
  return !uploadingImage && !uploadPending && !savePending;
}

export function replaceSavedProduct(catalog: Product[], draft: Product, saved: Product) {
  const exists = catalog.some(product => product.id === draft.id);
  return exists ? catalog.map(product => product.id === draft.id ? saved : product) : [...catalog, saved];
}
