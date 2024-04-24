import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Input,
  Form,
  Typography,
  Message,
  Modal,
} from '@arco-design/web-react';
import useLocale from '@/utils/useLocale';
import SearchForm from './form';
import locale from './locale';
import styles from './style/index.module.less';
import './mock';
import { getColumns } from './constants';
import { get, post } from '@/utils/http';
import { useHistory } from 'react-router-dom';

const { Title } = Typography;
const FormItem = Form.Item;
function SearchTable() {
  const t = useLocale(locale);
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [form] = Form.useForm();
  const pathname = history.location.pathname;
  const tableCallback = async (record, type) => {
    if (type == 'edit') {
      setVisible(true);
      setCurrentUser(record);
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
    const { username, phone, email }: any = formParams;
    const newArr = initData.filter((item) => {
      let flag = true;
      // 过滤地址
      if (username && item.username !== username) {
        flag = false;
      }
      if (phone && item.phone !== phone) {
        flag = false;
      }
      return flag;
    });
    setData(newArr);
  }, [formParams]);
  useEffect(() => {
    form.setFieldsValue(currentUser);
  }, [currentUser]);
  async function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);
    try {
      const { code, data, msg }: { code: number; data: any; msg: string } =
        await get(`tenant/getall_tenant`);
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
      const { code, msg } = await post(`tenant/delete_tenant/${id}`, {});
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
      <div className={styles['button-group']}></div>
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />
      <Modal
        title="编辑用户信息"
        visible={visible}
        onOk={async () => {
          const { code, msg } = await post(
            `tenant/update_tenant/${currentUser.id}`,
            form.getFieldsValue()
          );
          if (code == 200) {
            fetchData();
            Message.success('编辑成功!');
          }
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
      >
        <Form form={form}>
          <FormItem label="用户名" field="username">
            <Input />
          </FormItem>
          <FormItem label="电话" field="phone">
            <Input />
          </FormItem>
        </Form>
      </Modal>
    </Card>
  );
}

export default SearchTable;
