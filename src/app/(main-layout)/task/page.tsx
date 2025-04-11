'use client';

import { useState } from 'react';
import { useTaskPage } from '@/hooks/useTaskPage';
import { useTaskStore } from '@/store/task';
import { Table, Button, Modal, Select } from 'antd';
import { DeleteOutlined, ShareAltOutlined } from '@ant-design/icons';
import AddTaskModal from './AddTaskModal';
import ShareTaskModal from './ShareTaskModal';
import { Task } from '@/store/task';

export default function TaskPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatusInStore);
  const deleteTask = useTaskStore((state) => state.removeTaskFromServer);

  const { loading, error } = useTaskPage();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTaskId, setShareTaskId] = useState<string | null>(null);

  const STATUS_OPTIONS = ['chưa làm', 'đang làm', 'hoàn thành'];

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      render: (text: string, record: Task) => (
        <a onClick={() => setSelectedTask(record)}>{text}</a>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      render: (text: string) => text || 'Không có mô tả',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string, record: Task) => (
        <Select
          value={status}
          onChange={(value) => updateTaskStatus(record.id, value)}
          style={{ width: 120 }}
        >
          {STATUS_OPTIONS.map((status) => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Thời hạn',
      dataIndex: 'due_date',
      render: (date: string) =>
        date ? new Intl.DateTimeFormat('vi-VN').format(new Date(date)) : 'Không có',
    },
    {
      title: 'Hành động',
      render: (_: any, record: Task) => (
        <div className="flex gap-2">
          <Button danger icon={<DeleteOutlined />} onClick={() => deleteTask(record.id)}>
            Xóa
          </Button>
          <Button
            type="primary"
            icon={<ShareAltOutlined />}
            onClick={() => {
              setShareTaskId(record.id);
              setIsShareModalOpen(true);
            }}
          >
            Chia sẻ
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Đang tải công việc...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Danh sách công việc</h1>

      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          + Thêm Task
        </Button>
      </div>

      <Table columns={columns} dataSource={tasks} rowKey="id" pagination={false} />

      {selectedTask && (
        <Modal title={selectedTask.title} open onCancel={() => setSelectedTask(null)} footer={null}>
          <p><strong>Mô tả:</strong> {selectedTask.description || 'Không có mô tả'}</p>
          <p><strong>Trạng thái:</strong> {selectedTask.status}</p>
          <p><strong>Thời hạn:</strong> {selectedTask.due_date}</p>
        </Modal>
      )}

      <ShareTaskModal
        taskId={shareTaskId}
        visible={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setShareTaskId(null);
        }}
      />

      {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
