import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import  {connectDB}  from './libs/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import friendRoute from './routes/friendRoute.js';
import { protectedRoute } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());
// Public route
app.use('/api/auth', authRoute);
// private route 
app.use(protectedRoute)
app.use('/api/users', userRoute)
app.use('/api/friends', friendRoute)
connectDB().then(() => {
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) });
});
