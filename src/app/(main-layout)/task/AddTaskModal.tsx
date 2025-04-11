'use client';

import { useState } from 'react';
import { Modal, Input, Select, DatePicker, Button } from 'antd';
import { addTask } from '../../../api/taskApi';
import { useTaskStore } from '../../../store/task';
import dayjs from 'dayjs';
import { toast } from 'sonner';

const { TextArea } = Input;
const { Option } = Select;

interface AddTaskModalProps {
  onClose: () => void;
}

export default function AddTaskModal({ onClose }: AddTaskModalProps) {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    due_date: '',
  });
  const [loading, setLoading] = useState(false);

  const addTaskToStore = useTaskStore((state) => state.addTask);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      toast.warning('Tiêu đề không được để trống!');
      return;
    }

    try {
      setLoading(true);
      const task = await addTask(newTask);
      addTaskToStore(task);
      toast.success('Thêm công việc thành công!');
      setNewTask({ title: '', description: '', status: 'pending', due_date: '' });
      onClose();
    } catch (err: any) {
      toast.error('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm công việc mới"
      open={true}
      onCancel={onClose}
      onOk={handleAddTask}
      okText="Thêm"
      cancelText="Hủy"
      confirmLoading={loading}
    >
      <Input
        placeholder="Tiêu đề"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        className="mb-4"
      />
      <TextArea
        placeholder="Mô tả"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        className="mb-4"
        autoSize
      />
      <Select
        value={newTask.status}
        onChange={(value) => setNewTask({ ...newTask, status: value })}
        className="w-full mb-4"
      >
        <Option value="pending">Pending</Option>
        <Option value="in_progress">In Progress</Option>
        <Option value="completed">Completed</Option>
      </Select>
      <DatePicker
        value={newTask.due_date ? dayjs(newTask.due_date) : null}
        onChange={(date) =>
          setNewTask({ ...newTask, due_date: date ? date.format('YYYY-MM-DD') : '' })
        }
        className="w-full"
      />
    </Modal>
  );
}
