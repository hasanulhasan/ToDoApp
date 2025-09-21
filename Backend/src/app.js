const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');


app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);


app.get('/', (req, res) => res.send({ ok: true, message: 'Todo API' }));


const PORT = process.env.PORT || 4000;


mongoose
.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
console.log('Mongo connected');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
console.error('Mongo connection error', err);
process.exit(1);
});