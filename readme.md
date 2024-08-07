# Changes to be made in the app

1. Make a `.env` file similar to `sample.env` and copy your Stripe key and publishing key there.
2. You can start the application by running `npm start` command on the terminal.
3. Accessible route that renders the ejs file: [http://localhost:3001/payment](http://localhost:3001/payment)
4. POST route that sends the `clientSecret` and `customerID`: [http://localhost:3001/](http://localhost:3001/)
5. Stripe keys are passed to script with the help of ejs file in the `customerController.js` file.
