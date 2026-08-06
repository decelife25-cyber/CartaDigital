export type Allergen =
  | 'gluten'
  | 'crustaceans'
  | 'eggs'
  | 'fish'
  | 'peanuts'
  | 'soybeans'
  | 'milk'
  | 'nuts'
  | 'celery'
  | 'mustard'
  | 'sesame'
  | 'sulphites'
  | 'lupin'
  | 'molluscs';

export interface Family {
  id: string;
  name: string;
  image: string;
}

export interface Dish {
  id: string;
  familyId: string;
  name: string;
  shortDescription: string;
  description: string;
  ingredients: string[];
  price: number;
  image: string;
  allergens: Allergen[];
  available: boolean;
}

export const mockFamilies: Family[] = [
  {
    id: 'f1',
    name: 'Entrantes',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'f2',
    name: 'Tapas',
    image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'f3',
    name: 'Carnes',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=2069&auto=format&fit=crop'
  },
  {
    id: 'f4',
    name: 'Pescados',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'f5',
    name: 'Postres',
    image: 'https://images.unsplash.com/photo-1551024506-0baa27396184?q=80&w=2036&auto=format&fit=crop'
  },
  {
    id: 'f6',
    name: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop'
  }
];

export const mockDishes: Dish[] = [
  {
    id: 'd1',
    familyId: 'f1',
    name: 'Tartar de Salmón',
    shortDescription: 'Salmón fresco con aguacate y toque cítrico',
    description: 'Delicioso tartar de salmón noruego fresco, cortado a cuchillo, mezclado con aguacate en su punto, cebolla roja, alcaparras y un aliño de cítricos y soja.',
    ingredients: ['Salmón noruego', 'Aguacate', 'Cebolla roja', 'Alcaparras', 'Soja', 'Limón'],
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=2070&auto=format&fit=crop',
    allergens: ['fish', 'soybeans', 'sesame'],
    available: true
  },
  {
    id: 'd2',
    familyId: 'f1',
    name: 'Croquetas de Jamón Ibérico',
    shortDescription: 'Croquetas caseras cremosas de jamón ibérico',
    description: 'Nuestras tradicionales croquetas caseras, elaboradas con una bechamel muy cremosa y virutas de jamón ibérico de bellota. Crujientes por fuera y fundentes por dentro.',
    ingredients: ['Leche', 'Harina', 'Mantequilla', 'Jamón ibérico', 'Pan rallado', 'Huevo'],
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1627995804558-45b0a9f5d378?q=80&w=2070&auto=format&fit=crop',
    allergens: ['gluten', 'milk', 'eggs'],
    available: true
  },
  {
    id: 'd3',
    familyId: 'f3',
    name: 'Chuletón de Vaca Madurada',
    shortDescription: 'Chuletón (1kg) a la brasa con patatas',
    description: 'Espectacular chuletón de vaca vieja con 40 días de maduración. Asado a la parrilla de carbón para conseguir un exterior caramelizado y un interior jugoso. Acompañado de patatas fritas caseras y pimientos de Padrón.',
    ingredients: ['Carne de vaca madurada', 'Sal en escamas', 'Patatas', 'Pimientos de Padrón', 'Aceite de oliva'],
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop',
    allergens: [],
    available: true
  },
  {
    id: 'd4',
    familyId: 'f5',
    name: 'Tarta de Queso Fluida',
    shortDescription: 'Tarta de queso cremosa al horno',
    description: 'Nuestra famosa tarta de queso elaborada con una mezcla de quesos crema y un toque de queso azul. Horneada a alta temperatura para lograr un interior completamente fluido.',
    ingredients: ['Queso crema', 'Queso azul', 'Nata', 'Huevos', 'Azúcar', 'Galleta', 'Mantequilla'],
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=2070&auto=format&fit=crop',
    allergens: ['milk', 'eggs', 'gluten'],
    available: true
  }
];

export const restaurantInfo = {
  name: 'El Jardín Secreto',
  logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop',
  coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
  phone: '+34 912 345 678',
  bookingUrl: 'https://example.com/booking'
};
