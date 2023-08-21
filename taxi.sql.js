import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

async function initializeDatabase() {
  const dbPromise = await sqlite.open({
    filename: './taxi_queue.db',
    driver: sqlite3.Database,
  });
  const db = await dbPromise;

  await db.migrate();

  // Create the passenger_queue table
  await db.run(`CREATE TABLE IF NOT EXISTS passenger_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    count INTEGER
  )`);

  // Create the taxi_queue table
  await db.run(`CREATE TABLE IF NOT EXISTS taxi_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    count INTEGER
  )`);

  return db;
}

export async function joinQueue() {
  const db = await initializeDatabase();
  await db.run('INSERT INTO passenger_queue (count) VALUES (1)');
}

export async function leaveQueue() {
  const db = await initializeDatabase();
  await db.run('DELETE FROM passenger_queue WHERE id = (SELECT id FROM passenger_queue LIMIT 1)');
}

export async function joinTaxiQueue() {
  const db = await initializeDatabase();
  await db.run('INSERT INTO taxi_queue (count) VALUES (1)');
}

export async function queueLength() {
  const db = await initializeDatabase();
  const row = await db.get('SELECT COUNT(*) as count FROM passenger_queue');
  return row ? row.count : 0;
}

export async function taxiQueueLength() {
  const db = await initializeDatabase();
  const row = await db.get('SELECT COUNT(*) as count FROM taxi_queue');
  return row ? row.count : 0;
}

export async function taxiDepart() {
  const db = await initializeDatabase();
  const passengersCount = await queueLength();
  if (passengersCount >= 12) {
    await db.run('DELETE FROM taxi_queue WHERE id = (SELECT id FROM taxi_queue LIMIT 1)');
    await db.run('DELETE FROM passenger_queue WHERE id IN (SELECT id FROM passenger_queue LIMIT 12)');
  }
}
