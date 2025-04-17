'use client';

import { useState } from 'react';
import { Table, Button, Modal, Select, Typography, Space, Tag, message, Empty } from 'antd';
import { DeleteOutlined, ShareAltOutlined, PlusOutlined } from '@ant-design/icons';
import { useTaskPage } from '@/hooks/useTaskPage';
import { useTaskStore } from '@/store/task';
import AddTaskModal from './AddTaskModal';
import ShareTaskModal from './ShareTaskModal';
import { Task } from '@/store/task';

const { Title } = Typography;

export default function TaskPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatusInStore);
  const deleteTask = useTaskStore((state) => state.removeTaskFromServer);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const { loading, error, total } = useTaskPage(currentPage, limit);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTaskId, setShareTaskId] = useState<string | null>(null);

  const STATUS_OPTIONS = ['chưa làm', 'đang làm', 'hoàn thành'];
  const statusColor: { [key: string]: string } = {
    'chưa làm': 'default',
    'đang làm': 'processing',
    'hoàn thành': 'success',
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      render: (_: string, record: Task) => record.title,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      render: (text: string) => text || <i style={{ color: '#888' }}>Không có mô tả</i>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string, record: Task) => (
        <Select
          value={status}
          onChange={(value) => updateTaskStatus(record.id, value)}
          style={{ width: 140 }}
        >
          {STATUS_OPTIONS.map((statusOption) => (
            <Select.Option key={statusOption} value={statusOption}>
              {statusOption}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Thời hạn',
      dataIndex: 'due_date',
      render: (date: string) =>
        date
          ? new Intl.DateTimeFormat('vi-VN').format(new Date(date))
          : <i>Không có</i>,
    },
    {
      title: 'Hành động',
      render: (_: any, record: Task) => (
        <Space>
          <Button onClick={() => setSelectedTask(record)}>Chi tiết</Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(record.id);
              message.success('Đã xóa công việc');
            }}
          >
            Xóa
          </Button>
          <Button
            type="primary"
            icon={<ShareAltOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setShareTaskId(record.id);
              setIsShareModalOpen(true);
            }}
          >
            Chia sẻ
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Đang tải công việc...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="!mb-0">
          Danh sách công việc
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm công việc
        </Button>
      </div>

      {tasks.length > 0 ? (
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: limit,
            total: total,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
          rowClassName="hover:bg-gray-100 transition"
        />
      ) : (
        <Empty description="Chưa có công việc nào." />
      )}

      {selectedTask && (
        <Modal
          title={selectedTask.title}
          open={!!selectedTask}
          onCancel={() => setSelectedTask(null)}
          footer={null}
        >
          <p>
            <strong>Mô tả:</strong>{' '}
            {selectedTask.description || <i>Không có mô tả</i>}
          </p>
          <p>
            <strong>Trạng thái:</strong>{' '}
            <Tag color={statusColor[selectedTask.status]}>
              {selectedTask.status}
            </Tag>
          </p>
          <p>
            <strong>Thời hạn:</strong>{' '}
            {selectedTask.due_date
              ? new Intl.DateTimeFormat('vi-VN').format(
                  new Date(selectedTask.due_date)
                )
              : 'Không có'}
          </p>
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
