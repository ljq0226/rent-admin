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
    if (type == 'edit') {
      history.push(`${pathname}/editlist?edit=true&id=${record.id}`, {
        record,
      });
    } else if (type == 'view') {
      history.push(`${pathname}/editlist?edit=&id=${record.id}`, {
        record,
      });
    } else if (type == 'delete') {
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

    const { address, isChecked, priceType, status, title }: any = formParams;
    const newArr = initData.filter((item) => {
      let flag = true;
      // 过滤地址
      if (address && item.address !== address) {
        flag = false;
      }
      // 过滤是否选中
      if (isChecked && !isChecked?.includes(item.isChecked)) {
        flag = false;
      }
      // 过滤价格类型
      if (priceType && !priceType?.includes(item.priceType)) {
        flag = false;
      }
      // 过滤状态
      if (status && !status?.includes(item.status)) {
        flag = false;
      }
      // 过滤标题
      if (title && item.title !== title) {
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
          ? await get(`listing/getall_listing`)
          : await get(`listing/getall_listing_byid/${userData?.id}`);
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
      const { code, msg } = await post(`listing/delete_listing/${id}`, {});
      if (code == 200) {
        Message.info('删除成功!');
        fetchData();
      }
    } catch (err) {
      Message.error('删除失败!');
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
              history.push(`${pathname}/addlist`);
            }}
          >
            {'新建'}
          </Button>
        </Space>
        <Space>
          <Button icon={<IconDownload />}>
            {t['searchTable.operation.download']}
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
