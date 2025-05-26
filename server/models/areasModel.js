import db from '../utils/mysql.js';

const areasFullSchema = ['id', 'name', 'description', 'img', 'created_at'];
const areasLightSchema = ['id', 'name', 'description', 'created_at']; // Define the schema for areas without img

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

// console.log(await getAllAreas())
// console.log(await getAreaById(1))
// console.log(await getAreaByName('test1'))