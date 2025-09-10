import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
import authRoutes from "./routes/auth.js";
import farmerRoutes from "./routes/farmer.js";
import customerRoutes from "./routes/customer.js";
import agriCareRoutes from "./routes/agricare.js";
import hubManagerRoutes from "./routes/hubmanager.js";
import adminRoutes from "./routes/admin.js";

app.use("/api/auth", authRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/agricare", agriCareRoutes);
app.use("/api/hubmanager", hubManagerRoutes);
app.use("/api/admin", adminRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`)))
.catch(err => console.log(err));
