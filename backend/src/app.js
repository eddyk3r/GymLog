import express from "express";
import cors from "cors";
import exercitiiRouter from "./routes/exercitii.js";
import istoricRouter from "./routes/istoric.js";

const app = express();

// CORS: browserul blochează cererile de pe :5173 către :3001
// dacă serverul nu spune explicit că le permite
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));

// Transformă corpul JSON al cererii în req.body
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Jurnalul (resursa din tw.json) și istoricul pentru statistici
app.use("/exercitii", exercitiiRouter);
app.use("/istoric", istoricRouter);

// Rută necunoscută
app.use((req, res) => {
  res.status(404).json({ error: "Ruta nu există" });
});

// Tratare centralizată a erorilor (Express 5 trimite aici și erorile async).
// JSON invalid în corp vine de la express.json() cu status 400.
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  let mesaj = err.message;
  if (status === 500) mesaj = "Eroare internă";
  else if (err.type === "entity.parse.failed") mesaj = "Corpul cererii nu este JSON valid";
  res.status(status).json({ error: mesaj });
});

export default app;
