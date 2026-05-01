const express = require("express");
const cors = require("cors");
const path = require("path");

const movieAbl = require("./abl/movieAbl");
const favoriteAbl = require("./abl/favoriteAbl");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


app.get("/", (_req, res) => {
  res.json({
    service: "netflix-clone-backend",
    version: "1.0.0",
    assignment: "BCAA HW#3",
    endpoints: [
      "POST /movie/create",
      "GET  /movie/get",
      "GET  /movie/list",
      "POST /movie/update",
      "POST /movie/delete",
      "POST /favorite/create",
      "GET  /favorite/list",
      "POST /favorite/delete",
    ],
  });
});

app.post("/movie/create", (req, res) => movieAbl.create(req, res));
app.get("/movie/get", (req, res) => movieAbl.get(req, res));
app.get("/movie/list", (req, res) => movieAbl.list(req, res));
app.post("/movie/update", (req, res) => movieAbl.update(req, res));
app.post("/movie/delete", (req, res) => movieAbl.remove(req, res));


app.post("/favorite/create", (req, res) => favoriteAbl.create(req, res));
app.get("/favorite/list", (req, res) => favoriteAbl.list(req, res));
app.post("/favorite/delete", (req, res) => favoriteAbl.remove(req, res));


app.use((req, res) => {
  res.status(404).json({
    errorList: [
      {
        type: "error",
        code: "endpointNotFound",
        message: `Endpoint ${req.method} ${req.url} does not exist.`,
        params: {},
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Netflix-clone backend running on http://localhost:${PORT}`);
  console.log(`   Data file: ${path.resolve(__dirname, "data/db.json")}\n`);
});
