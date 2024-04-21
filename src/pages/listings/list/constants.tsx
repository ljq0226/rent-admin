import React from 'react';
import { Button, Typography, Badge, Tag } from '@arco-design/web-react';
import IconText from './icons/text.svg';
import IconHorizontalVideo from './icons/horizontal.svg';
import IconVerticalVideo from './icons/vertical.svg';
import dayjs from 'dayjs';

// export const priceType = ['日租', '横版短视频', '竖版短视频'];
export const IsChecked = ['未审核', '通过', '未通过'];
export const Status = ['未出租', '已出租'];

const ContentIcon = [
  <IconText key={0} />,
  <IconHorizontalVideo key={1} />,
  <IconVerticalVideo key={2} />,
];
export const PriceTypeMap: Record<PriceType, string> = {
  DAILY: '日租',
  WEEKLY: '周租',
  MONTHLY: '月租',
  QUARTERLY: '季租',
  YEARLY: '年租',
};
type PriceType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
export const columnsMap: Record<string, string> = {
  title: '标题',
  address: '地址',
  city: '城市',
  price: '价格',
  priceType: '租期',
};

export function getColumns(
  t: any,
  callback: (record: Record<string, any>, type: string) => Promise<void>
) {
  return [
    {
      dataIndex: 'title',
      title: '标题',
    },
    {
      dataIndex: 'address',
      title: '地址',
    },
    {
      dataIndex: 'city',
      title: '城市',
    },
    {
      dataIndex: 'price',
      title: '价格',
      sorter: (a, b) => b.price - a.price,
    },
    {
      dataIndex: 'priceType',
      title: '租期',
      render: (type) => PriceTypeMap[type],
    },
    {
      dataIndex: 'rentType',
      title: '租住形式',
      render: (type) => (Number(type) == 1 ? '合租' : '整租'),
    },
    {
      dataIndex: 'area',
      title: '面积/m2',
    },
    {
      dataIndex: 'availableFrom',
      title: '可租赁开始时间',
      render: (_) => dayjs(_).format('YYYY-MM-DD'),
      sorter: (a, b) => b.availableFrom - a.availableFrom,
    },
    {
      dataIndex: 'availableUntil',
      title: '可租赁结束时间',
      render: (_) => dayjs(_).format('YYYY-MM-DD'),
      sorter: (a, b) => b.availableFrom - a.availableFrom,
    },
    {
      dataIndex: 'status',
      title: '状态',
      render: (status) =>
        status == 0 ? (
          <Tag color={'gray'} bordered>
            {'未出租'}
          </Tag>
        ) : (
          <Tag color={'cyan'} bordered>
            {'已出租'}
          </Tag>
        ),
    },
    {
      dataIndex: 'isChecked',
      title: '审核',
      render: (isChecked) => {
        return (
          <>
            {isChecked == 0 && (
              <>
                <Tag color={'orangered'} bordered>
                  {'未审核'}
                </Tag>
              </>
            )}
            {isChecked == 1 && (
              <Tag color={'green'} bordered>
                {'通过'}
              </Tag>
            )}
            {isChecked == 2 && (
              <Tag color={'red'} bordered>
                {'未通过'}
              </Tag>
            )}
          </>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operations',
      titleCellStyle: { paddingLeft: '15px' },
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          onClick={() => callback(record, 'view')}
        >
          {t['searchTable.columns.operations.view']}
        </Button>
      ),
    },
  ];
}

export default () => ContentIcon;
