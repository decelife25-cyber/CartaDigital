WITH restaurante AS (
  INSERT INTO configuracion_restaurante (
    nombre,
    color_principal,
    descripcion,
    horario,
    direccion,
    telefono,
    redes_sociales,
    activo
  )
  VALUES (
    'Cervecería Tapería Camborio',
    '#c8a96e',
    'Auténtica cervecería tapería en el corazón de la ciudad',
    'Lunes a Jueves: 12:00-24:00 | Viernes y Sábado: 12:00-01:00 | Domingo: 12:00-23:00',
    'Plaza Mayor, 18, Centro',
    '+34 955 000 111',
    '{"instagram":"https://instagram.com/camborio","facebook":"https://facebook.com/camborio","web":"https://camborio.example.com"}'::jsonb,
    true
  )
  RETURNING id
), familias_base(nombre, descripcion, orden) AS (
  VALUES
    ('Entrantes Fríos', 'Clásicos fríos de barra y chacina para compartir.', 1),
    ('Entrantes Calientes', 'Picoteo recién hecho para abrir boca.', 2),
    ('Tapas de la Casa', 'Los imprescindibles de Camborio.', 3),
    ('Carnes a la Brasa', 'Cortes seleccionados con sabor a parrilla.', 4),
    ('Pescados y Mariscos', 'Producto del mar en recetas tradicionales.', 5),
    ('Arroces', 'Arroces melosos y paellas para disfrutar sin prisas.', 6),
    ('Postres', 'Postres caseros y opciones ligeras.', 7),
    ('Cervezas', 'Selección clásica y artesana bien fría.', 8),
    ('Vinos y Cavas', 'Copas y botellas para cada ocasión.', 9),
    ('Bebidas', 'Refrescos, zumos y cafés.', 10)
), familias_insert AS (
  INSERT INTO familias (configuracion_restaurante_id, nombre, descripcion, orden, activo)
  SELECT restaurante.id, fb.nombre, fb.descripcion, fb.orden, true
  FROM restaurante, familias_base fb
  RETURNING id, nombre, configuracion_restaurante_id
), productos_base(familia, nombre, precio, descripcion, alergenos, orden) AS (
  VALUES
    ('Entrantes Fríos', 'Jamón ibérico de bellota', 18.50, 'Corte fino acompañado de pan cristal y tomate rallado.', 'GLU', 1),
    ('Entrantes Fríos', 'Queso manchego curado', 9.50, 'Tabla de queso manchego D.O. con aceite virgen extra.', 'LAC', 2),
    ('Entrantes Fríos', 'Boquerones en vinagre', 8.00, 'Boquerones marinados en casa con ajo y perejil.', 'PES', 3),
    ('Entrantes Fríos', 'Anchoas del Cantábrico', 12.00, 'Lomos seleccionados servidos sobre tosta crujiente.', 'GLU;PES', 4),
    ('Entrantes Fríos', 'Ensaladilla rusa', 7.50, 'Receta cremosa con ventresca y encurtidos.', 'HUE;PES', 5),
    ('Entrantes Calientes', 'Croquetas de jamón ibérico', 8.50, 'Croquetas cremosas con bechamel suave y jamón de bellota.', 'GLU;LAC', 1),
    ('Entrantes Calientes', 'Calamares a la romana', 10.50, 'Aro de calamar rebozado y crujiente con limón.', 'GLU;PES', 2),
    ('Entrantes Calientes', 'Gambas al ajillo', 12.00, 'Gambas salteadas con ajo laminado y guindilla.', 'CRU', 3),
    ('Entrantes Calientes', 'Pimientos de Padrón', 6.50, 'Salteados con escamas de sal.', '', 4),
    ('Entrantes Calientes', 'Tortilla española', 8.00, 'Jugosa y hecha al momento, con patata confitada.', 'HUE', 5),
    ('Tapas de la Casa', 'Patatas bravas', 6.50, 'Dados de patata crujiente con salsa brava y alioli suave.', 'HUE', 1),
    ('Tapas de la Casa', 'Pulpo a la gallega', 14.00, 'Pulpo cocido, cachelos y pimentón de la Vera.', 'MOL', 2),
    ('Tapas de la Casa', 'Mejillones a la marinera', 9.00, 'Mejillones gallegos con salsa de tomate y vino blanco.', 'MOL;SUL', 3),
    ('Tapas de la Casa', 'Almejas al vapor', 13.00, 'Almeja fina con ajo, perejil y un toque cítrico.', 'MOL', 4),
    ('Tapas de la Casa', 'Berberechos', 11.00, 'Berberechos al vapor con laurel y limón.', 'MOL', 5),
    ('Carnes a la Brasa', 'Solomillo de ternera', 22.00, 'Pieza premium marcada a la parrilla con patata panadera.', '', 1),
    ('Carnes a la Brasa', 'Secreto ibérico', 18.00, 'Carne jugosa a la brasa con chimichurri suave.', '', 2),
    ('Carnes a la Brasa', 'Costillas de cerdo', 16.00, 'Costillas lacadas con salsa barbacoa casera.', '', 3),
    ('Carnes a la Brasa', 'Pollo al chilindrón', 14.00, 'Muslos deshuesados con salsa de pimientos y cebolla.', '', 4),
    ('Carnes a la Brasa', 'Hamburguesa artesana', 14.50, 'Ternera madurada, queso cheddar y pan brioche.', 'GLU', 5),
    ('Pescados y Mariscos', 'Lubina a la sal', 24.00, 'Lubina entera cocinada a la costra de sal.', 'PES', 1),
    ('Pescados y Mariscos', 'Merluza en salsa verde', 18.00, 'Lomo de merluza con almejas, ajo y perejil.', 'PES', 2),
    ('Pescados y Mariscos', 'Bacalao a la vizcaína', 19.00, 'Lomo confitado con salsa tradicional de pimientos.', 'PES', 3),
    ('Pescados y Mariscos', 'Gambas a la plancha', 15.00, 'Gamba seleccionada con punto de sal.', 'CRU', 4),
    ('Pescados y Mariscos', 'Pulpo a la brasa', 16.00, 'Pulpo marcado en parrilla con parmentier ligera.', 'MOL', 5),
    ('Arroces', 'Paella valenciana', 16.00, 'Precio por persona, mínimo 2 personas.', 'GLU', 1),
    ('Arroces', 'Arroz negro', 17.00, 'Con sepia, alioli suave y fondo marino. Precio por persona.', 'MOL;CRU', 2),
    ('Arroces', 'Arroz caldoso de mariscos', 18.00, 'Meloso, intenso y con producto del día. Precio por persona.', 'CRU;MOL', 3),
    ('Postres', 'Tarta de queso al horno', 6.50, 'Cremosa, con coulis de frutos rojos.', 'LAC;HUE', 1),
    ('Postres', 'Crema catalana', 5.50, 'Con azúcar caramelizado al momento.', 'LAC;HUE', 2),
    ('Postres', 'Brownie con helado', 6.00, 'Brownie templado con helado de vainilla.', 'GLU;LAC;HUE;FSE', 3),
    ('Postres', 'Fruta de temporada', 4.00, 'Selección de fruta fresca cortada al momento.', '', 4),
    ('Postres', 'Helado artesano', 5.00, 'Dos bolas a elegir según disponibilidad.', 'LAC', 5),
    ('Cervezas', 'Caña', 2.50, 'Cerveza de grifo bien tirada.', '', 1),
    ('Cervezas', 'Jarra', 4.50, 'Jarra fría ideal para compartir.', '', 2),
    ('Cervezas', 'Botellín de tercio', 3.50, 'Selección nacional servida muy fría.', '', 3),
    ('Cervezas', 'Cerveza sin gluten', 3.50, 'Botella apta para intolerancia al gluten.', '', 4),
    ('Cervezas', 'Cerveza artesana del mes', 4.00, 'Rotación mensual de cervezas locales.', '', 5),
    ('Vinos y Cavas', 'Copa de vino tinto de la casa', 3.00, 'Tempranillo joven de fácil trago.', 'SUL', 1),
    ('Vinos y Cavas', 'Botella Rioja Reserva', 24.00, 'Notas especiadas y paso elegante.', 'SUL', 2),
    ('Vinos y Cavas', 'Copa de vino blanco', 3.00, 'Verdejo fresco y afrutado.', 'SUL', 3),
    ('Vinos y Cavas', 'Cava Brut Nature', 5.50, 'Burbuja fina ideal para aperitivo.', 'SUL', 4),
    ('Vinos y Cavas', 'Vino rosado', 3.00, 'Rosado seco con frutas rojas.', 'SUL', 5),
    ('Bebidas', 'Agua mineral', 2.00, 'Agua mineral natural fría.', '', 1),
    ('Bebidas', 'Refresco', 2.50, 'Cola, limón o naranja.', '', 2),
    ('Bebidas', 'Zumo natural', 4.00, 'Zumo exprimido al momento.', '', 3),
    ('Bebidas', 'Café solo', 1.80, 'Café espresso intenso.', '', 4),
    ('Bebidas', 'Café con leche', 2.20, 'Espresso con leche cremosa.', 'LAC', 5)
), productos_insert AS (
  INSERT INTO productos (configuracion_restaurante_id, familia_id, nombre, descripcion, precio, activo, agotado, orden)
  SELECT fi.configuracion_restaurante_id, fi.id, pb.nombre, pb.descripcion, pb.precio, true, false, pb.orden
  FROM productos_base pb
  JOIN familias_insert fi ON fi.nombre = pb.familia
  RETURNING id, nombre
)
INSERT INTO producto_alergeno (producto_id, alergeno_id)
SELECT pi.id, a.id
FROM productos_insert pi
JOIN productos_base pb ON pb.nombre = pi.nombre
JOIN LATERAL unnest(string_to_array(NULLIF(pb.alergenos, ''), ';')) AS sigla(sigla) ON true
JOIN alergenos a ON a.sigla = sigla.sigla
ON CONFLICT DO NOTHING;
