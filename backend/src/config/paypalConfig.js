const paypal = require("@paypal/checkout-server-sdk");

const clientId = "";
const clientSecret = "";

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = { client };
