export interface User {
  id: number;
  usuario: string;
  contrasenia: string;
}

export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  stock: number;
  descripcion: string | null;
  precio: number;
  disponibilidad_envio: number;
}

export type RootStackParamList = {
  Login: undefined;
  Menu: { usuario: string };
};
