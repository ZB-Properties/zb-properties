const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Real Estate API',
      version: '1.0.0',
      description: 'API documentation for the Real Estate Website',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./routes/userRoutes.js'],
  apis: ['./routes/propertyRoutes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
