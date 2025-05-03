import express from "express";
const router = express.Router();

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
router.get("/list", (req, res) => {
    res.send(shelters);
    // res.send("List of shelters");
})
router.get("/details/:id", (req, res) => {
    const { id } = req.params;
    res.send(`Details of shelter with id: ${id}`);
})
router.post("/add", validateParams(["name", "location"]), (req, res) => {
    const { name, location } = req.body;
    res.send(`Shelter ${name} added at location ${location}`);
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
