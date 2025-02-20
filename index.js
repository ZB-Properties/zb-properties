const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./Server/routes/userRoutes');
const propertyRoutes = require('./Server/routes/propertyRoutes');
const swaggerUi = require('swagger-ui-express');
const swagger = require('./swagger/swagger.json');


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

