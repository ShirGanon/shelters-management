import db from '../utils/mysql.js';

const sheltersFullSchema = ['id', 'name', 'capacity', 'status', 'accessibility', 'floor', 'description', 'lat', 'lng', 'area_id', 'created_at'];

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
    const { name, capacity, status, accessibility, floor, description, lat, lng, area_id } = shelter;
    const [result] = await db.query('INSERT INTO shelters (name, capacity, status, accessibility, floor, description, lat, lng, area_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, capacity, status, accessibility, floor, description, lat, lng, area_id]);
    return result.insertId;
}

export const updateShelter = async (id, shelter) => {
    const { name, capacity, status, accessibility, floor, description, lat, lng, area_id } = shelter;
    // Build dynamic query to update only non-null fields
    const fields = [];
    const values = [];
    for (const key of ['name', 'capacity', 'status', 'accessibility', 'floor', 'description',]) {
        if (shelter[key] !== undefined && shelter[key] !== null) {
            fields.push(`${key} = ?`);
            values.push(shelter[key]);
        }
    }
    if (fields.length === 0) {
        return false; // Nothing to update
    }
    values.push(id);
    const [result] = await db.query(
        `UPDATE shelters SET ${fields.join(', ')} WHERE id = ?`,
        values
    );
    return result.affectedRows > 0;
}

export const deleteShelter = async (id) =>
{
    try{
        const [result] = await db.query('DELETE FROM shelters WHERE id = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        const message = error.sqlMessage || 'Failed to delete shelter';
        const sqlState = error.sqlState || 'UNKNOWN';
        throw new Error(`${message} (SQLSTATE: ${sqlState})`);
    }
}

// console.log(await getAllShelters())
// console.log(await getShelterById(2))
// console.log(await getShelterByName('shelter2'))
// console.log(await getSheltersByAreaId(1))
