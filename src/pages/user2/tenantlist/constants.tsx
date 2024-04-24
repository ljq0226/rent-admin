import React from 'react';
import { Button, Popconfirm } from '@arco-design/web-react';
import dayjs from 'dayjs';

export function getColumns(
  t: any,
  callback: (record: Record<string, any>, type: string) => Promise<void>
) {
  return [
    {
      dataIndex: 'username',
      title: '用户名',
    },
    {
      dataIndex: 'phone',
      title: '电话',
    },
    {
      dataIndex: 'createdAt',
      title: '创建时间',
      render: (_) => dayjs(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'operations',
      titleCellStyle: { paddingLeft: '15px' },
      render: (_, record) => (
        <>
          <Button
            type="text"
            size="small"
            onClick={() => callback(record, 'edit')}
          >
            {'编辑'}
          </Button>
          <Popconfirm
            focusLock
            title="确认"
            content="你确认删除该用户?"
            onOk={() => {
              callback(record, 'delete');
            }}
          >
            <Button type="text" size="small">
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
}
