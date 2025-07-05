const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const COMMISSION_WALLET = "1Je1Mk9YBCBk4JaHixw4KKs2iYJjv9x88Y";

app.post('/withdraw', async (req, res) => {
  const { address, amount } = req.body;

  const commission = amount * 0.05;
  const finalAmount = amount - commission;

  try {
    const response = await axios.post('https://api.kucoin.com/api/v1/withdrawals', {
      currency: 'BTC',
      amount: finalAmount.toFixed(8),
      address: address
    }, {
      headers: {
        'KC-API-KEY': process.env.KUCOIN_API_KEY,
        'KC-API-SECRET': process.env.KUCOIN_API_SECRET,
        'KC-API-PASSPHRASE': process.env.KUCOIN_API_PASSPHRASE
      }
    });

    console.log("Comisión de " + commission.toFixed(8) + " BTC para el admin: " + COMMISSION_WALLET);

    res.json({ success: true, message: 'Retiro enviado', tx: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => console.log(`BTCMovil backend en línea en puerto ${PORT}`));
