// app/providers.tsx (tạo mới file này)

'use client';

import { ConfigProvider } from 'antd';
import { ReactNode } from 'react';

export function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider>
      {children}
    </ConfigProvider>
  );
}
