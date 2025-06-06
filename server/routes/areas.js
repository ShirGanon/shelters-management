import express from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
const router = express.Router();
import { getAllAreas, getAreaById, addArea, deleteArea } from "../models/areasModel.js";

// Middleware to validate required fields in the request body
const validateParams = (requiredFields) => (req, res, next) => {
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields.join(", ")}` });
  }
  next();
};

// Multer setup - save to disk temporarily
// const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // e.g., .jpg
    const name = path.basename(file.originalname, ext); // e.g., photo
    const timestamp = Date.now(); // e.g., 1717685839973

    const filename = `${name}-${timestamp}${ext}`; // e.g., photo-1717685839973.jpg
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.get("/", (req, res) => {
  res.send("Welcome to the areas API");
});

router.get("/list", async (req, res) => {
  const img = req.query.img === "true"; // Check if img query parameter is set to true
  await getAllAreas(img)
    .then((areas) => {
      res.json(areas);
    })
    .catch((err) => {
      console.error("Error fetching areas:", err);
      res.status(500).send("Error fetching areas");
    });
});

router.get("/details/:id", async (req, res) => {
  const { id } = req.params;
  const img = req.query.img === "true"; // Check if img query parameter is set to true
  if (!id) {
    return res.status(400).send("Area ID is required");
  }
  await getAreaById(id, img)
    .then((area) => {
      if (!area) {
        return res.status(404).send("Area not found");
      }
      res.json(area);
    })
    .catch((err) => {
      console.error("Error fetching area details:", err);
      res.status(500).send("Error fetching area details");
    });
});


router.post("/upload", upload.single("image"), validateParams(["name", "description"]), async (req, res) => {
    try {
      const { name, description } = req.body;
      const { originalname, path: tempPath } = req.file;
      console.log("Request body:", req.body);

      // Read file into buffer
      const buffer = await fs.readFile(tempPath);

      await addArea({
        name: name,
        description: description,
        filename: originalname,
        img: buffer,
      })
        .then((areaId) => {
          console.log(`Area added with ID: ${areaId}`);
          res.status(201).send(`Area added with ID: ${areaId}`);
        })
        .catch((err) => {
          console.error("Error adding area:", err);
          res.status(500).send("Error adding area: " + err.message);
        });

      // Delete file after saving info - optional
      await fs.unlink(tempPath, (err) => {
        if (err) console.error("File delete error:", err);
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).send("Upload failed");
    }
  }
);

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("Area ID is required");
  }
  await deleteArea(id)
    .then((success) => {
      if (success) {
        res.send(`Area with ID ${id} deleted`);
      } else {
        res.status(404).send("Area not found");
      }
    })
    .catch((err) => {
      console.error("Error deleting area:", err);
      res.status(500).send("Error deleting area: " + err.message);
    });
});

export default router;
