
# Changes to be made in the app

make a .env file similar to sample.env file and copy your Stripe key and publishing key there

you can start the application by running npm start command on the terminal

Accessible route that renders the ejs file = http://localhost:3001/payment

POST route that sends the clientSecret and customerID = http://localhost:3001/

Stripe keys are passed to script with the help of ejs file in the customerController.js file 