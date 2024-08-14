const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

connectDB();

app.use('/api', authRoutes);
app.use('/api', taskRoutes);

const PORT =3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
