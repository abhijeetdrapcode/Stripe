const stripe = require("stripe")(process.env.STRIPE_KEY);
const publishableKey = process.env.PUBLISHING_KEY;

exports.createCustomer = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      name: "Abhijeet Rana",
      email: "abhijeet@gmail.com",
    });

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["us_bank_account"],
      payment_method_options: {
        us_bank_account: {
          financial_connections: {
            permissions: ["payment_method", "balances"],
          },
        },
      },
    });

    res.status(200).json({
      clientSecret: setupIntent.client_secret,
      customer: customer.id,
    });
  } catch (error) {
    console.error("Error creating customer: ", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getFinancialAccounts = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'us_bank_account',
    });

    if (paymentMethods.data.length === 0) {
      return res.json({ success: false, message: 'No bank accounts found for this customer' });
    }

    const bankAccount = paymentMethods.data[0].us_bank_account;

    const accountDetails = [{
      bankName: bankAccount.bank_name,
      accountType: bankAccount.account_type,
      last4: bankAccount.last4,
      balance: 'Not available',
      currency: 'USD',
    }];

    res.status(200).json({ success: true, accountDetails });
  } catch (error) {
    console.error("Error retrieving financial accounts: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.renderAccountPage = (req, res) => {
  res.render("Account", { publishableKey });
};
