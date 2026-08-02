import type { Alergeno, Familia, PlatoConAlergenos, Restaurante, Sugerencia } from '../types/database'

const alergenos: Alergeno[] = [
  { id: 'al-1', nombre: 'Gluten', sigla: 'GLU', descripcion: 'Cereales con gluten: trigo, centeno, cebada, avena' },
  { id: 'al-2', nombre: 'Crustáceos', sigla: 'CRU', descripcion: 'Crustáceos y productos a base de crustáceos' },
  { id: 'al-3', nombre: 'Huevo', sigla: 'HUE', descripcion: 'Huevos y productos a base de huevo' },
  { id: 'al-4', nombre: 'Pescado', sigla: 'PES', descripcion: 'Pescado y productos a base de pescado' },
  { id: 'al-5', nombre: 'Cacahuetes', sigla: 'CAC', descripcion: 'Cacahuetes y productos a base de cacahuetes' },
  { id: 'al-6', nombre: 'Soja', sigla: 'SOJ', descripcion: 'Soja y productos a base de soja' },
  { id: 'al-7', nombre: 'Lácteos', sigla: 'LAC', descripcion: 'Leche y sus derivados incluida lactosa' },
  { id: 'al-8', nombre: 'Frutos secos', sigla: 'FSE', descripcion: 'Frutos de cáscara: almendras, avellanas, nueces, anacardos, pistachos, piñones' },
  { id: 'al-9', nombre: 'Apio', sigla: 'API', descripcion: 'Apio y productos derivados' },
  { id: 'al-10', nombre: 'Mostaza', sigla: 'MOS', descripcion: 'Mostaza y productos derivados' },
  { id: 'al-11', nombre: 'Sésamo', sigla: 'SES', descripcion: 'Granos de sésamo y productos derivados' },
  { id: 'al-12', nombre: 'Sulfitos', sigla: 'SUL', descripcion: 'Dióxido de azufre y sulfitos en concentraciones superiores a 10mg/kg' },
  { id: 'al-13', nombre: 'Altramuces', sigla: 'ALT', descripcion: 'Altramuces y productos a base de altramuces' },
  { id: 'al-14', nombre: 'Moluscos', sigla: 'MOL', descripcion: 'Moluscos y productos a base de moluscos' },
]

const restaurante: Restaurante = {
  id: 'rest-1',
  nombre: 'Cervecería Tapería Camborio',
  logo_url: null,
  color_principal: '#c8a96e',
  descripcion: 'Auténtica cervecería tapería en el corazón de la ciudad',
  direccion: 'Plaza Mayor, 18, Centro',
  telefono: '+34 955 000 111',
  redes_sociales: {
    instagram: 'https://instagram.com/camborio',
    facebook: 'https://facebook.com/camborio',
    web: 'https://camborio.example.com',
  },
  horario: 'Lunes a Jueves: 12:00-24:00 | Viernes y Sábado: 12:00-01:00 | Domingo: 12:00-23:00',
  qr_url: null,
  dominio: 'camborio.example.com',
  activo: true,
  created_at: new Date().toISOString(),
}

const familias: Familia[] = [
  { id: 'fam-1', restaurante_id: 'rest-1', nombre: 'Entrantes Fríos', descripcion: 'Selección de chacinas, salazones y clásicos fríos para compartir.', activo: true, orden: 1, created_at: new Date().toISOString() },
  { id: 'fam-2', restaurante_id: 'rest-1', nombre: 'Entrantes Calientes', descripcion: 'El picoteo más apetecible recién hecho.', activo: true, orden: 2, created_at: new Date().toISOString() },
  { id: 'fam-3', restaurante_id: 'rest-1', nombre: 'Tapas de la Casa', descripcion: 'Bocados imprescindibles de la cocina Camborio.', activo: true, orden: 3, created_at: new Date().toISOString() },
  { id: 'fam-4', restaurante_id: 'rest-1', nombre: 'Carnes a la Brasa', descripcion: 'Cortes seleccionados con el toque de la parrilla.', activo: true, orden: 4, created_at: new Date().toISOString() },
  { id: 'fam-5', restaurante_id: 'rest-1', nombre: 'Pescados y Mariscos', descripcion: 'Frescura del mar con recetas tradicionales.', activo: true, orden: 5, created_at: new Date().toISOString() },
  { id: 'fam-6', restaurante_id: 'rest-1', nombre: 'Arroces', descripcion: 'Arroces melosos y paellas para disfrutar sin prisas.', activo: true, orden: 6, created_at: new Date().toISOString() },
  { id: 'fam-7', restaurante_id: 'rest-1', nombre: 'Postres', descripcion: 'Final dulce con sabor casero.', activo: true, orden: 7, created_at: new Date().toISOString() },
  { id: 'fam-8', restaurante_id: 'rest-1', nombre: 'Cervezas', descripcion: 'La mejor selección para maridar cada plato.', activo: true, orden: 8, created_at: new Date().toISOString() },
  { id: 'fam-9', restaurante_id: 'rest-1', nombre: 'Vinos y Cavas', descripcion: 'Copas y botellas para brindar.', activo: true, orden: 9, created_at: new Date().toISOString() },
  { id: 'fam-10', restaurante_id: 'rest-1', nombre: 'Bebidas', descripcion: 'Refrescos, cafés y opciones sin alcohol.', activo: true, orden: 10, created_at: new Date().toISOString() },
]

const alergenosBySigla = Object.fromEntries(alergenos.map((alergeno) => [alergeno.sigla, alergeno]))
const familiaByNombre = Object.fromEntries(familias.map((familia) => [familia.nombre, familia]))

type PlatoSeed = {
  id: string
  familia: string
  nombre: string
  descripcion: string
  precio: number
  orden: number
  alergenos?: string[]
}

const platosSeed: PlatoSeed[] = [
  { id: 'pla-1', familia: 'Entrantes Fríos', nombre: 'Jamón ibérico de bellota', descripcion: 'Corte fino acompañado de pan cristal y tomate rallado.', precio: 18.5, orden: 1, alergenos: ['GLU'] },
  { id: 'pla-2', familia: 'Entrantes Fríos', nombre: 'Queso manchego curado', descripcion: 'Tabla de queso manchego D.O. con aceite virgen extra y almendras.', precio: 9.5, orden: 2, alergenos: ['LAC', 'FSE'] },
  { id: 'pla-3', familia: 'Entrantes Fríos', nombre: 'Boquerones en vinagre', descripcion: 'Boquerón marinado en casa con ajo, perejil y aceite suave.', precio: 8, orden: 3, alergenos: ['PES'] },
  { id: 'pla-4', familia: 'Entrantes Fríos', nombre: 'Anchoas del Cantábrico', descripcion: 'Lomos seleccionados servidos sobre tosta crujiente.', precio: 12, orden: 4, alergenos: ['GLU', 'PES'] },
  { id: 'pla-5', familia: 'Entrantes Fríos', nombre: 'Ensaladilla rusa', descripcion: 'Receta cremosa con ventresca y encurtidos.', precio: 7.5, orden: 5, alergenos: ['HUE', 'PES'] },
  { id: 'pla-6', familia: 'Entrantes Calientes', nombre: 'Croquetas de jamón ibérico', descripcion: 'Croquetas cremosas con bechamel suave y jamón de bellota.', precio: 8.5, orden: 1, alergenos: ['GLU', 'LAC'] },
  { id: 'pla-7', familia: 'Entrantes Calientes', nombre: 'Calamares a la romana', descripcion: 'Aro de calamar rebozado y crujiente con limón.', precio: 10.5, orden: 2, alergenos: ['GLU', 'PES', 'MOL'] },
  { id: 'pla-8', familia: 'Entrantes Calientes', nombre: 'Gambas al ajillo', descripcion: 'Salteadas al momento con ajo laminado y guindilla.', precio: 12, orden: 3, alergenos: ['CRU'] },
  { id: 'pla-9', familia: 'Entrantes Calientes', nombre: 'Pimientos de Padrón', descripcion: 'Salteados con escamas de sal.', precio: 6.5, orden: 4 },
  { id: 'pla-10', familia: 'Entrantes Calientes', nombre: 'Tortilla española', descripcion: 'Jugosa y hecha al momento, con patata confitada.', precio: 8, orden: 5, alergenos: ['HUE'] },
  { id: 'pla-11', familia: 'Tapas de la Casa', nombre: 'Patatas bravas', descripcion: 'Dados de patata crujiente con salsa brava y alioli suave.', precio: 6.5, orden: 1, alergenos: ['HUE'] },
  { id: 'pla-12', familia: 'Tapas de la Casa', nombre: 'Pulpo a la gallega', descripcion: 'Pulpo cocido, cachelos y pimentón de la Vera.', precio: 14, orden: 2, alergenos: ['MOL'] },
  { id: 'pla-13', familia: 'Tapas de la Casa', nombre: 'Mejillones a la marinera', descripcion: 'Mejillón gallego con salsa de tomate y vino blanco.', precio: 9, orden: 3, alergenos: ['MOL', 'SUL'] },
  { id: 'pla-14', familia: 'Tapas de la Casa', nombre: 'Almejas al vapor', descripcion: 'Almeja fina con ajo, perejil y un toque cítrico.', precio: 13, orden: 4, alergenos: ['MOL'] },
  { id: 'pla-15', familia: 'Tapas de la Casa', nombre: 'Berberechos', descripcion: 'Berberecho al vapor con laurel y limón.', precio: 11, orden: 5, alergenos: ['MOL'] },
  { id: 'pla-16', familia: 'Carnes a la Brasa', nombre: 'Solomillo de ternera', descripcion: 'Pieza premium marcada a la parrilla con patata panadera.', precio: 22, orden: 1 },
  { id: 'pla-17', familia: 'Carnes a la Brasa', nombre: 'Secreto ibérico', descripcion: 'Carne jugosa a la brasa con chimichurri suave.', precio: 18, orden: 2 },
  { id: 'pla-18', familia: 'Carnes a la Brasa', nombre: 'Costillas de cerdo', descripcion: 'Lacadas con salsa barbacoa casera.', precio: 16, orden: 3 },
  { id: 'pla-19', familia: 'Carnes a la Brasa', nombre: 'Pollo al chilindrón', descripcion: 'Muslos deshuesados con salsa de pimientos y cebolla.', precio: 14, orden: 4 },
  { id: 'pla-20', familia: 'Carnes a la Brasa', nombre: 'Hamburguesa artesana', descripcion: 'Ternera madurada, queso cheddar y pan brioche.', precio: 14.5, orden: 5, alergenos: ['GLU', 'LAC'] },
  { id: 'pla-21', familia: 'Pescados y Mariscos', nombre: 'Lubina a la sal', descripcion: 'Lubina entera cocinada a la costra de sal.', precio: 24, orden: 1, alergenos: ['PES'] },
  { id: 'pla-22', familia: 'Pescados y Mariscos', nombre: 'Merluza en salsa verde', descripcion: 'Lomo de merluza con almejas, ajo y perejil.', precio: 18, orden: 2, alergenos: ['PES', 'MOL'] },
  { id: 'pla-23', familia: 'Pescados y Mariscos', nombre: 'Bacalao a la vizcaína', descripcion: 'Lomo confitado con salsa tradicional de pimientos.', precio: 19, orden: 3, alergenos: ['PES'] },
  { id: 'pla-24', familia: 'Pescados y Mariscos', nombre: 'Gambas a la plancha', descripcion: 'Gamba seleccionada con punto de sal.', precio: 15, orden: 4, alergenos: ['CRU'] },
  { id: 'pla-25', familia: 'Pescados y Mariscos', nombre: 'Pulpo a la brasa', descripcion: 'Pulpo marcado en parrilla con parmentier ligera.', precio: 16, orden: 5, alergenos: ['MOL', 'LAC'] },
  { id: 'pla-26', familia: 'Arroces', nombre: 'Paella valenciana', descripcion: 'Precio por persona, mínimo 2 personas.', precio: 16, orden: 1, alergenos: ['GLU'] },
  { id: 'pla-27', familia: 'Arroces', nombre: 'Arroz negro', descripcion: 'Con sepia, alioli suave y fondo marino.', precio: 17, orden: 2, alergenos: ['MOL', 'CRU', 'HUE'] },
  { id: 'pla-28', familia: 'Arroces', nombre: 'Arroz caldoso de mariscos', descripcion: 'Meloso, intenso y con producto del día.', precio: 18, orden: 3, alergenos: ['CRU', 'MOL'] },
  { id: 'pla-29', familia: 'Postres', nombre: 'Tarta de queso al horno', descripcion: 'Cremosa, con coulis de frutos rojos.', precio: 6.5, orden: 1, alergenos: ['LAC', 'HUE'] },
  { id: 'pla-30', familia: 'Postres', nombre: 'Crema catalana', descripcion: 'Con azúcar caramelizado al momento.', precio: 5.5, orden: 2, alergenos: ['LAC', 'HUE'] },
  { id: 'pla-31', familia: 'Postres', nombre: 'Brownie con helado', descripcion: 'Brownie templado con helado de vainilla.', precio: 6, orden: 3, alergenos: ['GLU', 'LAC', 'HUE', 'FSE'] },
  { id: 'pla-32', familia: 'Postres', nombre: 'Fruta de temporada', descripcion: 'Selección de fruta fresca cortada al momento.', precio: 4, orden: 4 },
  { id: 'pla-33', familia: 'Postres', nombre: 'Helado artesano', descripcion: 'Dos bolas a elegir según disponibilidad.', precio: 5, orden: 5, alergenos: ['LAC'] },
  { id: 'pla-34', familia: 'Cervezas', nombre: 'Caña', descripcion: 'Cerveza de grifo bien tirada.', precio: 2.5, orden: 1 },
  { id: 'pla-35', familia: 'Cervezas', nombre: 'Jarra', descripcion: 'Jarra fría ideal para compartir.', precio: 4.5, orden: 2 },
  { id: 'pla-36', familia: 'Cervezas', nombre: 'Botellín de tercio', descripcion: 'Selección nacional servida muy fría.', precio: 3.5, orden: 3 },
  { id: 'pla-37', familia: 'Cervezas', nombre: 'Cerveza sin gluten', descripcion: 'Botella apta para intolerancia al gluten.', precio: 3.5, orden: 4 },
  { id: 'pla-38', familia: 'Cervezas', nombre: 'Cerveza artesana del mes', descripcion: 'Rotación mensual de cervezas locales.', precio: 4, orden: 5, alergenos: ['GLU'] },
  { id: 'pla-39', familia: 'Vinos y Cavas', nombre: 'Copa de vino tinto de la casa', descripcion: 'Tempranillo joven de fácil trago.', precio: 3, orden: 1, alergenos: ['SUL'] },
  { id: 'pla-40', familia: 'Vinos y Cavas', nombre: 'Botella Rioja Reserva', descripcion: 'Notas especiadas y paso elegante.', precio: 24, orden: 2, alergenos: ['SUL'] },
  { id: 'pla-41', familia: 'Vinos y Cavas', nombre: 'Copa de vino blanco', descripcion: 'Verdejo fresco y afrutado.', precio: 3, orden: 3, alergenos: ['SUL'] },
  { id: 'pla-42', familia: 'Vinos y Cavas', nombre: 'Cava Brut Nature', descripcion: 'Burbuja fina ideal para aperitivo.', precio: 5.5, orden: 4, alergenos: ['SUL'] },
  { id: 'pla-43', familia: 'Vinos y Cavas', nombre: 'Vino rosado', descripcion: 'Rosado seco con frutas rojas.', precio: 3, orden: 5, alergenos: ['SUL'] },
  { id: 'pla-44', familia: 'Bebidas', nombre: 'Agua mineral', descripcion: 'Agua mineral natural fría.', precio: 2, orden: 1 },
  { id: 'pla-45', familia: 'Bebidas', nombre: 'Refresco', descripcion: 'Cola, limón o naranja.', precio: 2.5, orden: 2 },
  { id: 'pla-46', familia: 'Bebidas', nombre: 'Zumo natural', descripcion: 'Zumo exprimido al momento.', precio: 4, orden: 3 },
  { id: 'pla-47', familia: 'Bebidas', nombre: 'Café solo', descripcion: 'Café espresso intenso.', precio: 1.8, orden: 4 },
  { id: 'pla-48', familia: 'Bebidas', nombre: 'Café con leche', descripcion: 'Espresso con leche cremosa.', precio: 2.2, orden: 5, alergenos: ['LAC'] },
]

const platos: PlatoConAlergenos[] = platosSeed.map((plato) => ({
  id: plato.id,
  restaurante_id: restaurante.id,
  familia_id: familiaByNombre[plato.familia].id,
  nombre: plato.nombre,
  descripcion: plato.descripcion,
  precio: plato.precio,
  foto_url: null,
  activo: true,
  agotado: false,
  orden: plato.orden,
  created_at: new Date().toISOString(),
  familia: familiaByNombre[plato.familia],
  alergenos: (plato.alergenos || []).map((sigla) => alergenosBySigla[sigla]),
}))

const sugerencias: Sugerencia[] = [
  {
    id: 'sug-1',
    restaurante_id: restaurante.id,
    plato_id: 'pla-12',
    nombre: 'Pulpo a la gallega',
    descripcion: 'Nuestro plato estrella, ideal para compartir.',
    precio: 14,
    activo: true,
    orden: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sug-2',
    restaurante_id: restaurante.id,
    plato_id: 'pla-27',
    nombre: 'Arroz negro',
    descripcion: 'Perfecto para dos personas con alioli casero.',
    precio: 17,
    activo: true,
    orden: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sug-3',
    restaurante_id: restaurante.id,
    plato_id: null,
    nombre: 'Tosta del chef',
    descripcion: 'Sugerencia temporal fuera de carta con producto fresco del día.',
    precio: 8.5,
    activo: true,
    orden: 3,
    created_at: new Date().toISOString(),
  },
]

export const demoData = {
  restaurante,
  familias,
  alergenos,
  platos,
  sugerencias,
}
