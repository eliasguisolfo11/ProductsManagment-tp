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
  await seedProducts(database);
}

async function seedProducts(database: SQLite.SQLiteDatabase): Promise<void> {
  const count = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM productos');
  if (count && count.count > 0) return;

  const productos = [
    { codigo: 'PROD-001', nombre: 'Laptop Gamer X1', stock: 15, descripcion: 'Laptop con RTX 4060, 16GB RAM, 512GB SSD', precio: 1299.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-002', nombre: 'Mouse Inalámbrico Pro', stock: 42, descripcion: 'Mouse ergonómico con 6 botones, batería recargable', precio: 49.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-003', nombre: 'Teclado Mecánico RGB', stock: 28, descripcion: 'Switch Cherry MX Red, retroiluminación personalizable', precio: 89.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-004', nombre: 'Monitor 27" 4K UHD', stock: 10, descripcion: 'Panel IPS, 144Hz, HDR10, 1ms respuesta', precio: 449.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-005', nombre: 'Auriculares Bluetooth', stock: 35, descripcion: 'Cancelación de ruido activa, 30h batería', precio: 79.99, disponibilidad_envio: 0 },
    { codigo: 'PROD-006', nombre: 'Webcam HD 1080p', stock: 20, descripcion: 'Cámara con micrófono integrado, plug and play', precio: 39.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-007', nombre: 'Hub USB-C 7 en 1', stock: 50, descripcion: 'Puertos: HDMI, USB-A, USB-C, SD, microSD', precio: 34.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-008', nombre: 'Disco SSD 1TB NVMe', stock: 22, descripcion: 'Velocidad lectura 3500MB/s, escritura 3000MB/s', precio: 109.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-009', nombre: 'Memoria RAM DDR5 32GB', stock: 18, descripcion: '5600MHz, CL36, disipador de calor', precio: 159.99, disponibilidad_envio: 0 },
    { codigo: 'PROD-010', nombre: 'Silla Ergonómica Pro', stock: 7, descripcion: 'Soporte lumbar ajustable, reposabrazos 4D', precio: 399.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-011', nombre: 'Base para Laptop Ajustable', stock: 30, descripcion: 'Aluminio, 6 alturas, plegable', precio: 29.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-012', nombre: 'Cable USB-C 2m', stock: 100, descripcion: 'Carga rápida 100W, datos 10Gbps, trenzado', precio: 12.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-013', nombre: 'Cargador Wall 65W GaN', stock: 45, descripcion: '2 puertos USB-C, compacto, carga rápida', precio: 44.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-014', nombre: 'Pad Mouse XXL', stock: 60, descripcion: '90x40cm, superficie suave, base antideslizante', precio: 24.99, disponibilidad_envio: 0 },
    { codigo: 'PROD-015', nombre: 'Micrófono Condenser USB', stock: 12, descripcion: 'Grabación 192kHz/24bit, patrón cardioide', precio: 69.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-016', nombre: 'Smartwatch Deportivo', stock: 25, descripcion: 'GPS, monitor cardíaco, 5ATM, 14 días batería', precio: 199.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-017', nombre: 'Tablet 10.5" WiFi', stock: 9, descripcion: '128GB, 8GB RAM, pantalla 2K, lápiz incluido', precio: 329.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-018', nombre: 'Router WiFi 6 AX3000', stock: 16, descripcion: 'Dual band, 4 antenas, cobertura 200m²', precio: 89.99, disponibilidad_envio: 0 },
    { codigo: 'PROD-019', nombre: 'Impresora Multifunción', stock: 5, descripcion: 'Láser color, WiFi, dúplex automático', precio: 279.99, disponibilidad_envio: 1 },
    { codigo: 'PROD-020', nombre: 'UPS 1500VA', stock: 8, descripcion: '8 tomas, protección contra sobretensión, 10h backup', precio: 219.99, disponibilidad_envio: 1 },
  ];

  for (const p of productos) {
    await database.runAsync(
      'INSERT INTO productos (codigo, nombre, stock, descripcion, precio, disponibilidad_envio) VALUES (?, ?, ?, ?, ?, ?)',
      [p.codigo, p.nombre, p.stock, p.descripcion, p.precio, p.disponibilidad_envio]
    );
  }
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
