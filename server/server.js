import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Hello World!222");
});

const server = app.listen(8080);

