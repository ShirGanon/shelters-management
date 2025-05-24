import db from '../utils/mysql.js';

const sheltersFullSchema = ['id', 'name', 'capacity', 'status', 'accessibility', 'lat', 'lng', 'area_id', 'created_at'];

export const getAllShelters = async () => 
{
    const [rows] = await db.query('SELECT * FROM shelters');
    return rows;
}

export const getShelterById = async (id) =>
{
    const [rows] = await db.query('SELECT * FROM shelters WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
}

export const getShelterByName = async (name) =>
{
    const [rows] = await db.query('SELECT * FROM shelters WHERE name = ?', [name]);
    return rows.length > 0 ? rows[0] : null;
}

export const getSheltersByAreaId = async (areaId) =>
{
    const [rows] = await db.query('SELECT * FROM shelters WHERE area_id = ?', [areaId]);
    return rows;
}

export const addShelter = async (shelter) =>
{
    const { name, capacity, status, accessibility, lat, lng, area_id } = shelter;
    const [result] = await db.query('INSERT INTO shelters (name, capacity, status, accessibility, lat, lng, area_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, capacity, status, accessibility, lat, lng, area_id]);
    return result.insertId;
}

// console.log(await getAllShelters())
// console.log(await getShelterById(2))
// console.log(await getShelterByName('shelter2'))
// console.log(await getSheltersByAreaId(1))
