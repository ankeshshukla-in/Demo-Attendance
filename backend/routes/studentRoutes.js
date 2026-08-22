import { Router } from 'express';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';

const router = Router();

router.get('/', async (_req, res) => {
  const students = await Student.find().sort({ rollNo: 1 });
  res.json(students);
});

router.post('/', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.code === 11000 ? 'Roll number already exists' : error.message });
  }
});

router.delete('/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  await Attendance.deleteMany({ student: req.params.id });
  res.json({ message: 'Student deleted' });
});

export default router;
