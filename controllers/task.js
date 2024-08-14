const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const { title, description, status, priority, due_date } = req.body;

  try {
    const task = new Task({
      title,
      description,
      status,
      priority,
      due_date,
      user: req.user.id,
    });

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateTask = async (req, res) => {
  const { title, description, status, priority, due_date } = req.body;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, due_date, updated_at: Date.now() },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Task.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Task removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.filterTasks = async (req, res) => {
  const { status, priority, due_date } = req.query;

  try {
    const query = { user: req.user.id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (due_date) query.due_date = { $lte: new Date(due_date) };

    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.searchTasks = async (req, res) => {
  const { q } = req.query;

  try {
    const tasks = await Task.find({
      user: req.user.id,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ],
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
