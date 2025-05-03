import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import shelters from "./routes/shelters.js";

import {accessOriginController} from "./middlewares/accessOriginController.js";

dotenv.config();

const app = express();
//middlewares
app.use(cors());
app.use(accessOriginController);
app.use(express.json());
app.use(express.urlencoded());



//routers
app.use("/", shelters);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
