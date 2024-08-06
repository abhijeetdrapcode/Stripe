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


exports.getFinancialAccounts = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // First, retrieve the customer's payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'us_bank_account',
    });

    if (paymentMethods.data.length === 0) {
      return res.json({ success: false, message: 'No bank accounts found for this customer' });
    }

    // Get the bank account details from the first payment method
    const bankAccount = paymentMethods.data[0].us_bank_account;

    const accountDetails = [{
      bankName: bankAccount.bank_name,
      accountType: bankAccount.account_type,
      last4: bankAccount.last4,
      // Note: Balance information is not available through this API
      balance: 'Not available',
      currency: 'USD',
    }];

    res.json({ success: true, accountDetails });
  } catch (error) {
    console.error("Error retrieving financial accounts: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
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

