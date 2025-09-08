import { HOST } from "../../config/env.js";
import express from "express";
import morgan from "morgan";

import { RoleRouter } from "../../interfaces/api/Routes.js";

const app: express.Application = express();
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use("/api", RoleRouter);

app.listen(9000, HOST, () => {
  console.log(`Server running at http://${HOST}:9000`);
});
