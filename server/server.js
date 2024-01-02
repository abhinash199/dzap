const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = 4000;
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());
const api_key = process.env.API_KEY;

// Endpoint to fetch the top 100 cryptocurrencies
app.get("/top100", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&x_cg_demo_api_key=${api_key}`
    );
    const top100 = response.data.map((crypto) => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      current_price: crypto.current_price,
    }));

    res.status(200).json(top100);
  } catch (error) {
    console.error("Error fetching top 100 cryptocurrencies:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Endpoint to fetch the supported cryptocurrencies
app.get("/supported", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/supported_vs_currencies?x_cg_demo_api_key=${api_key}`
    );
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error("Error fetching top 100 cryptocurrencies:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Endpoint to perform currency conversion
app.post("/convert", async (req, res) => {
  const { sourceCrypto, amount, targetCurrency } = req.body;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${sourceCrypto}&vs_currencies=${targetCurrency}&x_cg_demo_api_key=${api_key}`
    );
    const data = await response.json();

    // Calculate the converted amount

    const rate = data[sourceCrypto][targetCurrency];
    const convertedAmount = amount * rate;
    res
      .status(200)
      .json({ sourceCrypto, amount, targetCurrency, convertedAmount });
  } catch (error) {
    console.error("Error performing currency conversion:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//listening the server on 4000 Port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
