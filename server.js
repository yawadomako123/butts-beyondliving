// Example: server.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});

app.listen(3001, () => console.log('Server running on port 3001'));