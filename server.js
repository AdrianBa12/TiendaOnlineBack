require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Ruta para procesar pagos
app.post("/api/pago", async (req, res) => {
  try {
    const { amount, currency, token } = req.body;

    const charge = await stripe.charges.create({
      amount: amount * 100, // Stripe usa centavos
      currency,
      source: token,
      description: "Pago en la tienda",
    });

    res.json({ success: true, message: "Pago exitoso", charge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
