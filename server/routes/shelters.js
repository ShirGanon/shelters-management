import express from "express";
const router = express.Router();
import { getAllShelters, getSheltersByAreaId, addShelter } from '../models/sheltersModel.js';

// Middleware to validate required fields in the request body
const validateParams = (requiredFields) => (req, res, next) => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(", ")}` });
    }
    next();
};

const shelters = [
    { id: 1, name: "Shelter A", location: "Location A" },
    { id: 2, name: "Shelter B", location: "Location B" },
    { id: 3, name: "Shelter C", location: "Location C" }
]


router.get("/", (req, res) => {
    res.send("Welcome to the shelters API");
})
router.get("/list", async (req, res) => {
    await getAllShelters().then((shelters) => {
        res.json(shelters);
    }).catch((err) => {
        console.error(err);
        res.status(500).send("Error fetching shelters");
    });
})
router.get("/area/:areaId", async (req, res) => {
    const { areaId } = req.params;
    if (!areaId) {
        return res.status(400).send("Area ID is required");
    }
    await getSheltersByAreaId(areaId).then((shelters) => {
        res.json(shelters);
    }).catch((err) => {
        console.error(err);
        res.status(500).send("Error fetching shelters for area");
    });
})
router.get("/details/:id", (req, res) => {
    const { id } = req.params;
    res.send(`Details of shelter with id: ${id}`);
})
router.post("/add", validateParams(["name", "capacity", "status", "accessibility", "lat", "lng", "area_id"]), async(req, res) => {
    const { name, capacity, status, accessibility, lat, lng, area_id } = req.body;
    await addShelter({ name, capacity, status, accessibility, lat, lng, area_id }).then((shelterId) => {
        console.log(`Shelter added with ID: ${shelterId}`);
        res.status(201).send(`Shelter added with ID: ${shelterId}`);
    }).catch((err) => {
        console.error(err);
        res.status(500).send("Error adding shelter");
    });
});
router.put("/update/:id", validateParams(["name", "location"]), (req, res) => {
    const { id } = req.params;
    const { name, location } = req.body;
    res.send(`Shelter with id ${id} updated to name ${name} and location ${location}`);
})
router.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    res.send(`Shelter with id ${id} deleted`);
})


export default router;
