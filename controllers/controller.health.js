const endpointsJson = require("../endpoints.json");

const healthController = {
    healthCheck: (req, res) => {
        res.status(200).send({ endpoints: endpointsJson });
      }
}

module.exports = healthController

