// Using base 'mysql2' import then switching pool to promise-based API for broader compatibility
import mysql from 'mysql2';

// Database connection configuration
// Catatan untuk XAMPP:
// - Biasanya host gunakan 127.0.0.1 (bukan localhost) agar pakai koneksi TCP bukan socket
// - Jika awalnya pakai root tanpa password dan gagal, buat user baru khusus aplikasi
//   Contoh SQL:
//   CREATE USER 'mentari_app'@'localhost' IDENTIFIED BY 'StrongPass123!';
//   CREATE DATABASE IF NOT EXISTS mentari_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
//   GRANT ALL PRIVILEGES ON mentari_db.* TO 'mentari_app'@'localhost';
//   FLUSH PRIVILEGES;
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1', // force IPv4 to avoid ::1 auth differences
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mentari_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const DEBUG_SQL = process.env.DB_DEBUG === '1';

if (dbConfig.user === 'root' && !dbConfig.password) {
  console.warn('[DB] Menggunakan user root tanpa password. Jika muncul ER_ACCESS_DENIED_ERROR, set DB_PASSWORD atau buat user baru.');
}

// ---- Dynamic pool handling (recreate when creds change in dev) ----
const globalAny = global as any;
const POOL_KEY = '__MENTARI_DB_POOL__';
const META_KEY = '__MENTARI_DB_META__';

const meta = {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
};

const previous = globalAny[META_KEY];
if (!previous) {
  console.log('[DB] Creating initial pool', meta);
} else if (
  previous.host !== meta.host ||
  previous.user !== meta.user ||
  previous.database !== meta.database
) {
  console.log('[DB] Detected env change -> recreating pool', { from: previous, to: meta });
  if (globalAny[POOL_KEY]) {
    try { globalAny[POOL_KEY].end?.(); } catch {}
  }
  globalAny[POOL_KEY] = mysql.createPool(dbConfig).promise();
  globalAny[META_KEY] = meta;
}

if (!globalAny[POOL_KEY]) {
  globalAny[POOL_KEY] = mysql.createPool(dbConfig).promise();
  globalAny[META_KEY] = meta;
}

const pool = globalAny[POOL_KEY];

// Development: verifikasi koneksi awal sekali agar error cepat muncul
if (process.env.NODE_ENV !== 'production' && !globalAny.__MENTARI_DB_VERIFIED__) {
  pool.getConnection()
    .then((c: any) => {
      c.release();
      globalAny.__MENTARI_DB_VERIFIED__ = true;
      console.log('[DB] Pool verified OK:', { host: dbConfig.host, user: dbConfig.user, db: dbConfig.database });
    })
    .catch((e: any) => {
      console.error('[DB] Initial pool verification failed:', enhanceError(e));
    });
}

function enhanceError(err: any) {
  if (!err) return err;
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    err.hint = 'Akses MySQL ditolak (ER_ACCESS_DENIED_ERROR). Periksa DB_USER, DB_PASSWORD, DB_NAME di .env.local. Jika pakai XAMPP dengan root tanpa password tetapi tetap ditolak: set password untuk root atau buat user baru khusus aplikasi. Contoh: CREATE USER "mentari_app"@"localhost" IDENTIFIED BY "StrongPass123!"; GRANT ALL PRIVILEGES ON mentari_db.* TO "mentari_app"@"localhost"; FLUSH PRIVILEGES;';
  }
  return err;
}

// Function to get database connection
export async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error: any) {
    const e = enhanceError(error);
    console.error('Database connection error:', e);
    throw e;
  }
}

// Function to execute query
export async function executeQuery(query: string, values?: any[]) {
  let connection;
  
  try {
    connection = await getConnection();
  if (DEBUG_SQL) {
    console.log('[SQL]', query, values || '');
  }
  const [results] = await connection.execute(query, values);
  return results as any;
  } catch (error: any) {
    const e = enhanceError(error);
    console.error('Query execution error:', e);
    throw e;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Function to test database connection
export async function testConnection() {
  try {
    const connection = await getConnection();
    await connection.ping();
    connection.release();
    console.log('Database connection successful!');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export default pool;