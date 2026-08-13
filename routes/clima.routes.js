const express = require("express");
const router = express.Router();
const climaController = require("../controllers/clima.controller");

router.get("/", climaController.mostrarInicio);
router.post("/clima", climaController.buscarClima);

module.exports = router;