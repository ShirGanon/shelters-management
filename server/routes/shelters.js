import express from "express";
const router = express.Router();
import { getAllShelters, getShelterById, getSheltersByAreaId, addShelter, deleteShelter } from '../models/sheltersModel.js';

// Middleware to validate required fields in the request body
const validateParams = (requiredFields) => (req, res, next) => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(", ")}` });
    }
    next();
};


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
        return res.status(400).send("Area ID is required (areaId)");
    }
    await getSheltersByAreaId(areaId).then((shelters) => {
        res.json(shelters);
    }).catch((err) => {
        console.error(err);
        res.status(500).send("Error fetching shelters for area");
    });
})
router.get("/details/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send("Shelter ID is required (id)");
    }
    await getShelterById(id).then((shelter) => {
        if (!shelter) {
            return res.status(404).send("Shelter not found");
        }
        res.send(shelter);
    });
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
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("Shelter ID is required (id)");
  }
  await deleteShelter(id)
    .then((success) => {
      if (success) {
        res.send(`Shelter with ID ${id} deleted`);
      } else {
        res.status(404).send("Shelter not found");
      }
    })
    .catch((err) => {
      console.error("Error deleting shelter:", err);
      res.status(500).send("Error deleting shelter: " + err.message);
    });
});


export default router;
