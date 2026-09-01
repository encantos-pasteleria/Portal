export const operationalMenu = {
  items: [
    { path: '/', label: 'Inicio', end: true, icon: 'home' },
    { path: '/compras', label: 'Compras', icon: 'cart' },
    { path: '/produccion', label: 'Producción', icon: 'factory' },
  ],
  footerLink: { to: '/catalogo', label: 'Parámetros', icon: 'grid' },
}

export const catalogMenu = {
  items: [
    { path: '/catalogo/ingredientes', label: 'Ingredientes', icon: 'leaf' },
    { path: '/catalogo/proveedores', label: 'Proveedores', icon: 'users' },
    { path: '/catalogo/bases', label: 'Bases', icon: 'book' },
    { path: '/catalogo/recetas', label: 'Recetas', icon: 'recipe' },
  ],
  footerLink: { to: '/', label: 'Operación', end: true, icon: 'swap' },
}
