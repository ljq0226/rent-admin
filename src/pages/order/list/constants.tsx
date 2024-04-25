import React from 'react';
import {
  Button,
  Typography,
  Badge,
  Tag,
  Popconfirm,
} from '@arco-design/web-react';
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
export const HouseDirection = [
  { value: '朝东', label: '朝东' },
  { value: '朝南', label: '朝南' },
  { value: '朝西', label: '朝西' },
  { value: '朝北', label: '朝北' },
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
      dataIndex: 'ordername',
      title: '订单名称',
    },
    {
      dataIndex: 'landlordName',
      title: '房东',
    },
    {
      dataIndex: 'tenantName',
      title: '租客',
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
      dataIndex: 'startTime',
      title: '开始租赁时间',
      render: (_) => dayjs(_).format('YYYY-MM-DD'),
      sorter: (a, b) => b.startTime - a.startTime,
    },
    {
      dataIndex: 'endTime',
      title: '结束租赁时间',
      render: (_) => dayjs(_).format('YYYY-MM-DD'),
      sorter: (a, b) => b.endTime - a.endTime,
    },
    {
      dataIndex: 'totalPrice',
      title: '总价',
      sorter: (a, b) => b.price - a.price,
    },
    {
      dataIndex: 'status',
      title: '状态',
      render: (status) => {
        return (
          <>
            {status == 0 && (
              <>
                <Tag color={'orangered'} bordered>
                  {'未支付'}
                </Tag>
              </>
            )}
            {status == 1 && (
              <Tag color={'green'} bordered>
                {'已支付'}
              </Tag>
            )}
            {status == 2 && (
              <Tag color={'red'} bordered>
                {'已取消'}
              </Tag>
            )}
          </>
        );
      },
    },
    {
      dataIndex: 'contractId',
      title: '合同',
      render: (contractId) => {
        return <>{contractId}</>;
      },
    },
    {
      title: '操作',
      dataIndex: 'operations',
      titleCellStyle: { paddingLeft: '15px' },
      render: (_, record) => (
        <>
          <Popconfirm
            focusLock
            title="确认"
            content="你确认取消该订单?"
            onOk={() => {
              callback(record, 'delete');
            }}
          >
            <Button type="text" size="small">
              取消
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
}

export default () => ContentIcon;
