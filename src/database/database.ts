import * as SQLite from 'expo-sqlite';
import { Product, User } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('productos.db');
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = await getDatabase();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT UNIQUE NOT NULL,
      contrasenia TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT UNIQUE NOT NULL,
      nombre TEXT NOT NULL,
      stock INTEGER NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      disponibilidad_envio INTEGER DEFAULT 0
    );
  `);
}

export async function loginUser(usuario: string, contrasenia: string): Promise<User | null> {
  const database = await getDatabase();
  const user = await database.getFirstAsync<User>(
    'SELECT * FROM usuarios WHERE usuario = ? AND contrasenia = ?',
    [usuario, contrasenia]
  );
  return user || null;
}

export async function registerUser(usuario: string, contrasenia: string): Promise<void> {
  const database = await getDatabase();
  const existing = await database.getFirstAsync<User>(
    'SELECT id FROM usuarios WHERE usuario = ?',
    [usuario]
  );
  if (existing) {
    throw new Error('El usuario ya existe');
  }
  await database.runAsync(
    'INSERT INTO usuarios (usuario, contrasenia) VALUES (?, ?)',
    [usuario, contrasenia]
  );
}

export async function getPasswordByUser(usuario: string): Promise<string | null> {
  const database = await getDatabase();
  const user = await database.getFirstAsync<User>(
    'SELECT contrasenia FROM usuarios WHERE usuario = ?',
    [usuario]
  );
  return user?.contrasenia || null;
}

export async function getAllProducts(): Promise<Product[]> {
  const database = await getDatabase();
  return await database.getAllAsync<Product>('SELECT * FROM productos ORDER BY id DESC');
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<void> {
  const database = await getDatabase();
  const existing = await database.getFirstAsync<Product>(
    'SELECT id FROM productos WHERE codigo = ?',
    [product.codigo]
  );
  if (existing) {
    throw new Error('El código de producto ya existe');
  }
  await database.runAsync(
    'INSERT INTO productos (codigo, nombre, stock, descripcion, precio, disponibilidad_envio) VALUES (?, ?, ?, ?, ?, ?)',
    [product.codigo, product.nombre, product.stock, product.descripcion, product.precio, product.disponibilidad_envio]
  );
}

export async function updateProduct(product: Product): Promise<void> {
  const database = await getDatabase();
  const existing = await database.getFirstAsync<Product>(
    'SELECT id FROM productos WHERE codigo = ? AND id != ?',
    [product.codigo, product.id]
  );
  if (existing) {
    throw new Error('El código de producto ya está en uso');
  }
  await database.runAsync(
    'UPDATE productos SET codigo = ?, nombre = ?, stock = ?, descripcion = ?, precio = ?, disponibilidad_envio = ? WHERE id = ?',
    [product.codigo, product.nombre, product.stock, product.descripcion, product.precio, product.disponibilidad_envio, product.id]
  );
}

export async function deleteProduct(id: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM productos WHERE id = ?', [id]);
}
