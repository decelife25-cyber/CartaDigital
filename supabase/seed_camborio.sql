WITH restaurante AS (
  INSERT INTO restaurantes (
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
    ('Entrantes Fríos', 'Selección de chacinas, salazones y clásicos fríos para compartir.', 1),
    ('Entrantes Calientes', 'El picoteo más apetecible recién hecho.', 2),
    ('Tapas de la Casa', 'Bocados imprescindibles de la cocina Camborio.', 3),
    ('Carnes a la Brasa', 'Cortes seleccionados con el toque de la parrilla.', 4),
    ('Pescados y Mariscos', 'Frescura del mar con recetas tradicionales.', 5),
    ('Arroces', 'Arroces melosos y paellas para disfrutar sin prisas.', 6),
    ('Postres', 'Final dulce con sabor casero.', 7),
    ('Cervezas', 'La mejor selección para maridar cada plato.', 8),
    ('Vinos y Cavas', 'Copas y botellas para brindar.', 9),
    ('Bebidas', 'Refrescos, cafés y opciones sin alcohol.', 10)
), familias_insert AS (
  INSERT INTO familias (restaurante_id, nombre, descripcion, orden, activo)
  SELECT restaurante.id, fb.nombre, fb.descripcion, fb.orden, true
  FROM restaurante, familias_base fb
  RETURNING id, nombre, restaurante_id
)
INSERT INTO platos (restaurante_id, familia_id, nombre, descripcion, precio, activo, agotado, orden)
SELECT
  fi.restaurante_id,
  fi.id,
  datos.nombre,
  datos.descripcion,
  datos.precio,
  true,
  false,
  datos.orden
FROM familias_insert fi
JOIN (
  VALUES
    ('Entrantes Fríos', 'Jamón ibérico de bellota', 'Corte fino acompañado de pan cristal y tomate rallado.', 18.50, 1),
    ('Entrantes Fríos', 'Queso manchego curado', 'Tabla de queso manchego D.O. con aceite virgen extra y almendras.', 9.50, 2),
    ('Entrantes Fríos', 'Boquerones en vinagre', 'Boquerón marinado en casa con ajo, perejil y aceite suave.', 8.00, 3),
    ('Entrantes Fríos', 'Anchoas del Cantábrico', 'Lomos seleccionados servidos sobre tosta crujiente.', 12.00, 4),
    ('Entrantes Fríos', 'Ensaladilla rusa', 'Receta cremosa con ventresca y encurtidos.', 7.50, 5),
    ('Entrantes Calientes', 'Croquetas de jamón ibérico', 'Croquetas cremosas con bechamel suave y jamón de bellota.', 8.50, 1),
    ('Entrantes Calientes', 'Calamares a la romana', 'Aro de calamar rebozado y crujiente con limón.', 10.50, 2),
    ('Entrantes Calientes', 'Gambas al ajillo', 'Salteadas al momento con ajo laminado y guindilla.', 12.00, 3),
    ('Entrantes Calientes', 'Pimientos de Padrón', 'Salteados con escamas de sal.', 6.50, 4),
    ('Entrantes Calientes', 'Tortilla española', 'Jugosa y hecha al momento, con patata confitada.', 8.00, 5),
    ('Tapas de la Casa', 'Patatas bravas', 'Dados de patata crujiente con salsa brava y alioli suave.', 6.50, 1),
    ('Tapas de la Casa', 'Pulpo a la gallega', 'Pulpo cocido, cachelos y pimentón de la Vera.', 14.00, 2),
    ('Tapas de la Casa', 'Mejillones a la marinera', 'Mejillón gallego con salsa de tomate y vino blanco.', 9.00, 3),
    ('Tapas de la Casa', 'Almejas al vapor', 'Almeja fina con ajo, perejil y un toque cítrico.', 13.00, 4),
    ('Tapas de la Casa', 'Berberechos', 'Berberecho al vapor con laurel y limón.', 11.00, 5),
    ('Carnes a la Brasa', 'Solomillo de ternera', 'Pieza premium marcada a la parrilla con patata panadera.', 22.00, 1),
    ('Carnes a la Brasa', 'Secreto ibérico', 'Carne jugosa a la brasa con chimichurri suave.', 18.00, 2),
    ('Carnes a la Brasa', 'Costillas de cerdo', 'Lacadas con salsa barbacoa casera.', 16.00, 3),
    ('Carnes a la Brasa', 'Pollo al chilindrón', 'Muslos deshuesados con salsa de pimientos y cebolla.', 14.00, 4),
    ('Carnes a la Brasa', 'Hamburguesa artesana', 'Ternera madurada, queso cheddar y pan brioche.', 14.50, 5),
    ('Pescados y Mariscos', 'Lubina a la sal', 'Lubina entera cocinada a la costra de sal.', 24.00, 1),
    ('Pescados y Mariscos', 'Merluza en salsa verde', 'Lomo de merluza con almejas, ajo y perejil.', 18.00, 2),
    ('Pescados y Mariscos', 'Bacalao a la vizcaína', 'Lomo confitado con salsa tradicional de pimientos.', 19.00, 3),
    ('Pescados y Mariscos', 'Gambas a la plancha', 'Gamba seleccionada con punto de sal.', 15.00, 4),
    ('Pescados y Mariscos', 'Pulpo a la brasa', 'Pulpo marcado en parrilla con parmentier ligera.', 16.00, 5),
    ('Arroces', 'Paella valenciana', 'Precio por persona, mínimo 2 personas.', 16.00, 1),
    ('Arroces', 'Arroz negro', 'Con sepia, alioli suave y fondo marino.', 17.00, 2),
    ('Arroces', 'Arroz caldoso de mariscos', 'Meloso, intenso y con producto del día.', 18.00, 3),
    ('Postres', 'Tarta de queso al horno', 'Cremosa, con coulis de frutos rojos.', 6.50, 1),
    ('Postres', 'Crema catalana', 'Con azúcar caramelizado al momento.', 5.50, 2),
    ('Postres', 'Brownie con helado', 'Brownie templado con helado de vainilla.', 6.00, 3),
    ('Postres', 'Fruta de temporada', 'Selección de fruta fresca cortada al momento.', 4.00, 4),
    ('Postres', 'Helado artesano', 'Dos bolas a elegir según disponibilidad.', 5.00, 5),
    ('Cervezas', 'Caña', 'Cerveza de grifo bien tirada.', 2.50, 1),
    ('Cervezas', 'Jarra', 'Jarra fría ideal para compartir.', 4.50, 2),
    ('Cervezas', 'Botellín de tercio', 'Selección nacional servida muy fría.', 3.50, 3),
    ('Cervezas', 'Cerveza sin gluten', 'Botella apta para intolerancia al gluten.', 3.50, 4),
    ('Cervezas', 'Cerveza artesana del mes', 'Rotación mensual de cervezas locales.', 4.00, 5),
    ('Vinos y Cavas', 'Copa de vino tinto de la casa', 'Tempranillo joven de fácil trago.', 3.00, 1),
    ('Vinos y Cavas', 'Botella Rioja Reserva', 'Notas especiadas y paso elegante.', 24.00, 2),
    ('Vinos y Cavas', 'Copa de vino blanco', 'Verdejo fresco y afrutado.', 3.00, 3),
    ('Vinos y Cavas', 'Cava Brut Nature', 'Burbuja fina ideal para aperitivo.', 5.50, 4),
    ('Vinos y Cavas', 'Vino rosado', 'Rosado seco con frutas rojas.', 3.00, 5),
    ('Bebidas', 'Agua mineral', 'Agua mineral natural fría.', 2.00, 1),
    ('Bebidas', 'Refresco', 'Cola, limón o naranja.', 2.50, 2),
    ('Bebidas', 'Zumo natural', 'Zumo exprimido al momento.', 4.00, 3),
    ('Bebidas', 'Café solo', 'Café espresso intenso.', 1.80, 4),
    ('Bebidas', 'Café con leche', 'Espresso con leche cremosa.', 2.20, 5)
) AS datos(familia, nombre, descripcion, precio, orden)
  ON fi.nombre = datos.familia;
