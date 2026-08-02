export function formatPrice(precio: number | null | undefined) {
  if (precio === null || precio === undefined) return 'Consultar'
  return `${precio.toFixed(2)} €`
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
