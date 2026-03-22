import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ route: "auth", status: "ok" });
});

export default router;
