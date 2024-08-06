const stripe = require("stripe")(process.env.STRIPE_KEY);
const publishableKey = process.env.PUBLISHING_KEY;

exports.createCustomer = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      name: "Abhijeet Rana",
      email: "abhijeet@gmail.com",
    });

    const customerId = customer.id;

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["us_bank_account"],
      payment_method_options: {
        us_bank_account: {
          financial_connections: {
            permissions: ["payment_method", "balances"],
          },
        },
      },
    });

    res.json({
      clientSecret: setupIntent.client_secret,
      customer: customer.id,
    });
  } catch (error) {
    console.error("Error creating customer: ", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.createPayment =  async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'usd',
      payment_method_types: ["us_bank_account"],
      payment_method_options: {
        us_bank_account: {
          financial_connections: {
            permissions: ["payment_method", "balances"],
          },
        },
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.renderTestPage = (req, res) => {
  res.render("index", { publishableKey });
};

exports.renderPaymentPage = (req, res) => {
  res.render("completePayment", { publishableKey });
};


exports.renderTestingPage = (req,res)=>{
  res.render("testing",{publishableKey})
}


exports.renderSuccessPage = (req,res)=>{
  res.render("success",{publishableKey})
}

