import db from '../utils/mysql.js';

const areasFullSchema = ['id', 'name', 'description', 'filename', 'img', 'created_at'];
const areasLightSchema = ['id', 'name', 'description', 'filename', 'created_at']; // Define the schema for areas without img

export const getAllAreas = async (img=false) => 
{
    const cols = img ? '*' : areasLightSchema; // conditional columns based on img parameter
    const [rows] = await db.query(`SELECT ${cols} FROM areas`);
    return rows;
}

export const getAreaById = async (id, img=false) =>
{
    const cols = img ? '*' : areasLightSchema; // conditional columns based on img parameter
    const [rows] = await db.query(`SELECT ${cols} FROM areas WHERE id = ?`, [id]);
    return rows.length > 0 ? rows[0] : null;
}

export const getAreaByName = async (name, img=false) =>
{
    const cols = img ? '*' : areasLightSchema; // conditional columns based on img parameter
    const [rows] = await db.query(`SELECT ${cols} FROM areas WHERE name = ?`, [name]);
    return rows.length > 0 ? rows[0] : null;
}

export const addArea = async ({ name, description, filename, img }) => {
    try {
        const [result] = await db.query(
            'INSERT INTO areas (name, description, filename, img) VALUES (?, ?, ?, ?)',
            [name, description, filename, img]
        );
        return result.insertId;
    } catch (error) {
        const message = error.sqlMessage || 'Failed to add area';
        const sqlState = error.sqlState || 'UNKNOWN';
        throw new Error(`${message} (SQLSTATE: ${sqlState})`);
    }
};

export const deleteArea = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM areas WHERE id = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        const message = error.sqlMessage || 'Failed to delete area';
        const sqlState = error.sqlState || 'UNKNOWN';
        throw new Error(`${message} (SQLSTATE: ${sqlState})`);
    }
}