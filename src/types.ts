export type CommissionType = 'Porcentaje' | 'Monto Fijo';

export interface CatalogItem {
  id: string;
  articulo: string;
  tipo: CommissionType;
  valor: number;
}

export interface Sale {
  id: string;
  fecha: string;
  vendedor: string;
  articulo: string;
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
  tipoComision: CommissionType;
  valorAplicado: number;
  comision: number;
  registradoPor?: string;
}

export const VENDEDORES = [
  "PACO",
  "YAEL",
  "ARELY",
  "DYLAN",
  "FERNANDO",
  "PATRICIA SOTO"
];

export const INITIAL_CATALOG: CatalogItem[] = [
  { id: "n-1", articulo: "Kit Membresía 2026", tipo: "Monto Fijo", valor: 40 },
  { id: "n-2", articulo: "Activación De Membresía", tipo: "Monto Fijo", valor: 40 },
  { id: "n-3", articulo: "SABANAS MICROFIBRA ESTAMPADA IND DON PONCHO", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-4", articulo: "SABANAS MICROFIBRA ESTAMPADA MAT DON PONCHO", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-5", articulo: "SABANAS MICROFIBRA ESTAMPADA KS DON PONCHO", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-6", articulo: "SABANAS DURAZNO ESTAMPADAS IND DON PONCHO", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-7", articulo: "SABANAS DURAZNO ESTAMPADAS MAT DON PONCHO", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-8", articulo: "SABANAS DURAZNO ESTAMPADAS KS DON PONCHO", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-9", articulo: "SABANAS POCKET MAT MELIZA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-10", articulo: "SABANAS POCKET KS MELIZA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-11", articulo: "SABANAS ESTAMPADA 6 PIEZAS MAT CASA NOVA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-12", articulo: "SABANAS ESTAMPADA 6 PIEZAS KS CASA NOVA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-13", articulo: "SABANAS ALGODÓN IND SANTA ANA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-14", articulo: "SABANAS ALGODÓN MAT SANTA ANA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-15", articulo: "SABANAS ALGODÓN QS SANTA ANA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-16", articulo: "SABANAS ALGODÓN KS SANTA ANA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-17", articulo: "FRAZADA CHEVIAN JBS", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-18", articulo: "EDREDON REVERSIBLE MAT Q-HOME", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-19", articulo: "EDREDON REVERSIBLE KS Q-HOME", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-20", articulo: "JUEGO EDREDON LIGERO COOL MAT-QS", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-21", articulo: "JUEGO EDREDON LIGERO CORRUGADAO MAT-QS", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-22", articulo: "EDREDON ITALIA BORDADO KS", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-23", articulo: "COORDINADO EDREDON LIGERO MAT CASA ISLA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-24", articulo: "COORDINADO EDREDON LIGERO KS CASA ISLA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-25", articulo: "CORTINAS BLACKOUT VICTORIA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-26", articulo: "CORTINAS BLACKOUT DOBLE MELIZA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-27", articulo: "CORTINAS ORGANZA BORDADA MELIZA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-28", articulo: "CORTINAS BORDADA DOBLE MELIZA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-29", articulo: "CORTINAS BORDADAS DON PONCHO", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-30", articulo: "PROTECTOR DE COLCHON IND CASA ISLA", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-31", articulo: "PROTECTOR DE COLCHON MAT CASA ISLA", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-32", articulo: "PROTECTOR DE COLCHON KS CASA ISLA", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-33", articulo: "CUBIERTA SALA STRECH QUEEN HOME", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-34", articulo: "FRAZADA UNICORNIO", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-35", articulo: "ARTICULOS NUEVOS DE COCINA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-36", articulo: "DESCONTINUADO", tipo: "Porcentaje", valor: 0.07 },
  { id: "n-37", articulo: "SABANAS ESTAMPADAS 8 PZS MAT QUEEN HOME", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-38", articulo: "SABANAS ESTAMPADAS 8 PZS KS QUEEN HOME", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-39", articulo: "CORTINAS BLACKOUT DOBLE 5 PZAS MELIZA", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-40", articulo: "FRAZADA DON PONCHO", tipo: "Porcentaje", valor: 0.03 },
  { id: "n-41", articulo: "TOALLA MELIZA BAÑO", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-42", articulo: "COBERTOR BONDED KS COLAP", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-43", articulo: "SABANA CAJON MAT AREKA", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-44", articulo: "SABANA CAJON KS CASA ISLA", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-45", articulo: "COBERTOR CUNERO PROVIDENCIA (SUPER SOFT - RACHEL- HD)", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-46", articulo: "ELECTRODOMESTICOS ( PLANCHAS - CAFETERA - LICUADORA )", tipo: "Porcentaje", valor: 0.05 },
  { id: "n-47", articulo: "CORTINAS BORDADA PLAYA BLANCA ( CH-MED-GDE )", tipo: "Porcentaje", valor: 0.015 }
];

export type UserRole = 'admin' | 'seller';
export interface User {
  username: string;
  role: UserRole;
  pin: string;
}
export const INITIAL_USERS: User[] = [
  { username: 'QUEEN', role: 'admin', pin: 'Primavera2026' },
  { username: 'PACO', role: 'seller', pin: '1234' },
  { username: 'YAEL', role: 'seller', pin: '1234' },
  { username: 'ARELY', role: 'seller', pin: '1234' },
  { username: 'DYLAN', role: 'seller', pin: '1234' },
  { username: 'FERNANDO', role: 'seller', pin: '1234' },
  { username: 'PATRICIA SOTO', role: 'seller', pin: '1234' },
];
