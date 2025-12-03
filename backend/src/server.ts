import express from "express";
import session from "express-session";
import { getEnv } from "./utils/getEnv";

import productRouter from "./resources/product/product.route";
import userRouter from "./resources/user/user.route";
import purchaseRouter from "./resources/purchase/purchase.route";

import { langMiddleware } from "./middlewares/langMiddleware";
import { errorHandler } from "./middlewares/errorHandler";

const env = getEnv();
const app = express();

app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 },
  }),
);

import cors from "cors";

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(langMiddleware);

app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/purchase", purchaseRouter);

app.get("/language/change", (req, res) => {
  const { lang } = req.query;
  if (typeof lang === "string") {
    res.cookie("lang", lang);
    return res.json({ message: req.t("language_changed") });
  }
  return res.status(400).json({ error: req.t("invalid_language") });
});

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Servidor rodando na porta ${env.PORT}`);
});
