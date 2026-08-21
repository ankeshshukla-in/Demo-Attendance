import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const attendanceSchema = new mongoose.Schema(
  {
    roll: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    present: { type: Boolean, required: true }
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "attendance-api" }));

app.get("/api/attendance", async (_req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1, roll: 1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance", error: error.message });
  }
});

app.post("/api/attendance", async (req, res) => {
  try {
    const record = await Attendance.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: "Invalid attendance record", error: error.message });
  }
});

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/demo_attendance")
  .then(() => app.listen(PORT, () => console.log(`API running on port ${PORT}`)))
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
