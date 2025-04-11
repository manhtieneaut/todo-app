'use client';

import { Modal} from 'antd';
import { shareTaskWithUser } from '@/api/taskApi';
import { useState } from 'react';
import SearchUser from '@/component/SearchUser'; // Cập nhật đường dẫn nếu cần
import { toast } from 'sonner';

type ShareTaskModalProps = {
  taskId: string | null;
  visible: boolean;
  onClose: () => void;
};

export default function ShareTaskModal({ taskId, visible, onClose }: ShareTaskModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSelectUser = async (user: { id: string; email: string }) => {
    if (!taskId) return;

    setLoading(true);
    try {
      await shareTaskWithUser(taskId, user.id);
      toast.success(`Đã chia sẻ công việc với ${user.email}`);
      onClose();
    } catch (error: any) {
      toast.error(`Chia sẻ thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chia sẻ công việc"
      open={visible}
      onCancel={onClose}
      footer={null} // Không cần nút OK vì ta xử lý khi chọn user
    >
      <p className="mb-2">Tìm người dùng qua email:</p>
      <SearchUser onSelect={handleSelectUser} />
    </Modal>
  );
}
