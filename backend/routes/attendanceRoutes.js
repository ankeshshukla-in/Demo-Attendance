import { Router } from 'express';
import Attendance from '../models/Attendance.js';

const router = Router();

router.get('/', async (req, res) => {
  const filter = req.query.date ? { date: new Date(`${req.query.date}T00:00:00.000Z`) } : {};
  const records = await Attendance.find(filter).populate('student').sort({ date: -1 });
  res.json(records);
});

router.post('/mark', async (req, res) => {
  try {
    const { student, date, status } = req.body;
    const day = new Date(`${date}T00:00:00.000Z`);
    const record = await Attendance.findOneAndUpdate(
      { student, date: day },
      { student, date: day, status },
      { new: true, upsert: true, runValidators: true }
    ).populate('student');
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/summary/:studentId', async (req, res) => {
  const records = await Attendance.find({ student: req.params.studentId });
  const total = records.length;
  const present = records.filter((record) => record.status === 'Present').length;
  res.json({ total, present, absent: total - present, percentage: total ? Number(((present / total) * 100).toFixed(2)) : 0 });
});

export default router;
