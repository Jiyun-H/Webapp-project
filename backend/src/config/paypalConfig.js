const paypal = require('@paypal/checkout-server-sdk');

const clientId = 'AV1dAJvdd-gFuK5PTKf9tuIE6hShd_-KSHd7KYgnxd3IosigAHqHErRAfiPSi4HblApB_LB_Qbh1g0GC';
const clientSecret = 'EHaqArCQ6uCHChC9rnJ0JYUrdiFVv0Pc4U3cGSc0qhP_o5XX3bMGWxLlwlebVYju7StybKwfPtmFY8xu';

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = { client };
