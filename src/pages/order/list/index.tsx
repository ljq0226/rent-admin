import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Typography,
  Message,
} from '@arco-design/web-react';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import axios from 'axios';
import useLocale from '@/utils/useLocale';
import SearchForm from './form';
import locale from './locale';
import styles from './style/index.module.less';
import './mock';
import { getColumns, IsChecked } from './constants';
import useStorage from '@/utils/useStorage';
import { get, post } from '@/utils/http';
import { useHistory } from 'react-router-dom';

const { Title } = Typography;

function SearchTable() {
  const t = useLocale(locale);
  const [userData] = useStorage('userData');
  const history = useHistory();
  const pathname = history.location.pathname;
  const tableCallback = async (record, type) => {
    if (type == 'delete') {
      onConfirmDelete(record?.id);
    }
  };
  const columns = useMemo(() => getColumns(t, tableCallback), [t]);

  const [data, setData] = useState([]);
  const [initData, setInitDta] = useState([]);
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [loading, setLoading] = useState(true);
  const [formParams, setFormParams] = useState({});

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);
  useEffect(() => {
    if (JSON.stringify(formParams) == '{}') {
      setData(initData);
      return;
    }

    const { ordername, tenantName, landlordName, contractId, status }: any =
      formParams;
    const newArr = initData.filter((item) => {
      let flag = true;
      if (ordername && item.ordername !== ordername) {
        flag = false;
      }
      if (tenantName && item.tenantName !== tenantName) {
        flag = false;
      }
      if (landlordName && item.landlordName !== landlordName) {
        flag = false;
      }
      if (contractId && item.contractId !== contractId) {
        flag = false;
      }
      if (status && !status?.includes(item.status)) {
        flag = false;
      }
      return flag;
    });
    setData(newArr);
  }, [formParams]);

  async function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);
    try {
      const { code, data, msg }: { code: number; data: any; msg: string } =
        userData?.role == 'ADMIN'
          ? await get(`order/get_all_order`)
          : await get(`order/get_landlord_order/${userData?.id}`);
      if (code === 200) {
        const arr = data.arr as any[];
        setData(arr);
        setInitDta(arr);
        setPatination({
          ...pagination,
          current,
          pageSize,
          total: data.arr?.length,
        });
        setLoading(false);
      } else {
      }
    } catch (err: any) {
      // message({ title: err.toString() });
    }
  }
  const onConfirmDelete = async (id) => {
    try {
      const { code, msg } = await post(`order/cancel_order/${id}`, {});
      if (code == 200) {
        Message.info('取消成功!');
        fetchData();
      }
    } catch (err) {
      Message.error('取消失败!');
    }
  };
  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  return (
    <Card>
      <Title heading={6}>{'查询表格'}</Title>
      <SearchForm onSearch={handleSearch} />
      <div className={styles['button-group']}>
        <Space>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={() => {
              history.push(`/order/addorder`);
            }}
          >
            {'新建'}
          </Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />
    </Card>
  );
}

export default SearchTable;
