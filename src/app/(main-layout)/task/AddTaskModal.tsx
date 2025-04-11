'use client';

import { useState } from 'react';
import { Modal, Input, Select, DatePicker, Form, Space } from 'antd';
import { addTask } from '../../../api/taskApi';
import { useTaskStore } from '../../../store/task';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { CheckCircleOutlined, ClockCircleOutlined, LoadingOutlined } from '@ant-design/icons';

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
      title="📝 Thêm công việc mới"
      open={true}
      onCancel={onClose}
      onOk={handleAddTask}
      okText="Thêm"
      cancelText="Hủy"
      confirmLoading={loading}
      okButtonProps={{ type: 'primary' }}
    >
      <Form layout="vertical">
        <Form.Item label="Tiêu đề" required>
          <Input
            placeholder="Nhập tiêu đề công việc"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="Mô tả">
          <TextArea
            placeholder="Mô tả chi tiết"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>

        <Form.Item label="Trạng thái">
          <Select
            value={newTask.status}
            onChange={(value) => setNewTask({ ...newTask, status: value })}
            className="w-full"
          >
            <Option value="pending">
              <ClockCircleOutlined /> Chờ xử lý
            </Option>
            <Option value="in_progress">
              <LoadingOutlined spin /> Đang thực hiện
            </Option>
            <Option value="completed">
              <CheckCircleOutlined /> Hoàn thành
            </Option>
          </Select>
        </Form.Item>

        <Form.Item label="Hạn hoàn thành">
          <DatePicker
            value={newTask.due_date ? dayjs(newTask.due_date) : null}
            onChange={(date) =>
              setNewTask({ ...newTask, due_date: date ? date.format('YYYY-MM-DD') : '' })
            }
            className="w-full"
            format="DD/MM/YYYY"
            placeholder="Chọn ngày"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
