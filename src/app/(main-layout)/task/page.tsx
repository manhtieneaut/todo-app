'use client';

import { useEffect, useState } from 'react';
import { fetchTasks, deleteTask, updateTaskStatus } from '@/api/taskApi';
import { useTaskStore } from '../../../store/task';
import AddTaskModal from './AddTaskModal';
import ShareTaskModal from './ShareTaskModal';
import { Task } from '../../../store/task';
import { Table, Button, Modal, Select, message } from 'antd';
import { DeleteOutlined, ShareAltOutlined } from '@ant-design/icons';

export default function TaskPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);
  const removeTask = useTaskStore((state) => state.deleteTask);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTaskId, setShareTaskId] = useState<string | null>(null);

  const STATUS_OPTIONS = ['chưa làm', 'đang làm', 'hoàn thành'];

  useEffect(() => {
    const load = async () => {
      try {
        const tasks = await fetchTasks();
        setTasks(tasks);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [setTasks]);

  const handleChangeStatus = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error: any) {
      message.error(`Lỗi khi cập nhật trạng thái: ${error.message}`);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa công việc này?");
    if (!confirmDelete) return;

    try {
      await deleteTask(taskId);
      removeTask(taskId);
      setSelectedTask(null);
      message.success('Đã xóa công việc');
    } catch (error: any) {
      message.error(`Lỗi khi xóa công việc: ${error.message}`);
    }
  };

  const handleOpenModal = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Không có';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN').format(date);
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      render: (text: string, record: Task) => (
        <a onClick={() => handleOpenModal(record)}>{text}</a>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      render: (text: string) => text || "Không có mô tả",
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string, record: Task) => (
        <Select
          value={status}
          onChange={(value) => handleChangeStatus(record.id, value)}
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
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Hành động',
      render: (text: string, record: Task) => (
        <div className="flex gap-2">
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTask(record.id)}
          >
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
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
        >
          + Thêm Task
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      {/* Modal chi tiết công việc */}
      {selectedTask && (
        <Modal
          title={selectedTask.title}
          open={!!selectedTask}
          onCancel={handleCloseModal}
          footer={null}
        >
          <p><strong>Mô tả:</strong> {selectedTask.description || "Không có mô tả"}</p>
          <p><strong>Trạng thái:</strong> {selectedTask.status}</p>
          <p><strong>Thời hạn:</strong> {formatDate(selectedTask.due_date)}</p>
        </Modal>
      )}

      {/* Modal chia sẻ công việc */}
      <ShareTaskModal
        taskId={shareTaskId}
        visible={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setShareTaskId(null);
        }}
      />

      {/* Modal thêm công việc */}
      {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
