import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import express from "express"
import memberRouter from "./routes/member.routes.js"
import coachRouter from "./routes/coach.routes.js"
import { swaggerDocs } from "./swagger.js"
dotenv.config();
connectDB()
const app = express();
app.use(cors())
app.use(express.json())
app.use("/api/member", memberRouter);
app.use("/api/coach", coachRouter);
swaggerDocs(app)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
