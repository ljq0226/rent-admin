import React, { useState, useRef, useEffect } from 'react';
import {
  Typography,
  Card,
  Form,
  Select,
  Input,
  Grid,
  Space,
  Button,
  Message,
  DatePicker,
  InputNumber,
} from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';
import { HouseDirection, PriceTypeMap } from '../list/constants';
import dayjs from 'dayjs';
import useStorage from '@/utils/useStorage';
import { get, post } from '@/utils/http';
import { useHistory } from 'react-router-dom';
function GroupForm() {
  const t = useLocale(locale);
  const history = useHistory();
  const formRef = useRef<FormInstance>();
  const [loading, setLoading] = useState(false);
  const [userData] = useStorage('userData');
  const [listingList, setListingList] = useState([]);
  const [listing, setListing] = useState<any>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  useEffect(() => {
    getListingList();
  }, []);
  async function submit(formValue) {
    const [startTime, endTime] = formValue.rentTime;
    const { priceType, price, ordername, tenantName } = formValue;
    const postData = {
      priceType,
      price,
      ordername,
      tenantName,
      totalPrice,
      status: 0,
      landlordId: listing.landlordId,
      landlordName: userData.username,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      listingId: listing.id,
      listingTitle: listing.title,
    };
    try {
      const { code, data, msg } = await post('order/create_order', postData);
      if (code == 200) {
        Message.success('创建新订单成功');
        history.push('/order/list');
      }
    } catch (err) {
      Message.error(err.toString());
    }
  }

  const getListingList = async () => {
    const { data, code, msg }: any = await get(
      `listing/getall_listing_byid/${userData?.id}`
    );
    if (code === 200) {
      const arr = data.arr;
      setListingList(arr);
    }
  };
  function handleSubmit() {
    formRef.current.validate().then((values) => {
      submit(values);
    });
  }

  function handleReset() {
    formRef.current.resetFields();
  }
  const handleSelectChange = (value) => {
    const record = listingList.find((item) => item.title === value);
    const { priceType, price } = record;
    setListing(record);
    formRef.current.setFieldsValue({
      priceType,
      price,
      rentType: record.rentType + '',
      // rentTime: [dayjs(record.availableFrom), dayjs(record.availableUntil)],
    });
  };
  function calculateMonths(dateArr) {
    const startDate = new Date(dateArr[0]);
    const endDate = new Date(dateArr[1]);

    let months;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    return months <= 0 ? 0 : months;
  }

  function calculateRent(dateArr, priceType, price) {
    // 解析日期并计算租期总天数
    const startDate: any = new Date(dateArr[0]);
    const endDate: any = new Date(dateArr[1]);
    if (priceType == 'DAILY') {
      const rentDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
      return rentDays * price;
    } else if (priceType == 'MONTHLY') {
      return calculateMonths(dateArr) * price;
    } else if (priceType == 'QUARTERLY') {
      return (calculateMonths(dateArr) * price) / 3;
    }
  }
  const handleDatePickChange = (value) => {
    const all = calculateRent(value, listing.priceType, listing.price);
    formRef.current.setFieldValue('totalPrice', all);
    setTotalPrice(all);
  };
  return (
    <div className={styles.container}>
      <Form layout="vertical" ref={formRef} className={styles['form-group']}>
        <Card>
          <Typography.Title heading={6}>{'填写订单信息'}</Typography.Title>
          <Grid.Row gutter={80}>
            <Grid.Col span={8}>
              <Form.Item label={'订单标题'} field="ordername" initialValue={''}>
                <Input />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row gutter={80}>
            <Grid.Col span={8}>
              <Form.Item
                label={'租户用户名'}
                field="tenantName"
                initialValue={''}
              >
                <Input />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
          <Form.Item label={'房源'} field="listing">
            <Select placeholder={'选择房源'} onChange={handleSelectChange}>
              {listingList.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.title}>
                    {item.title}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <div
            className="underline text-md cursor-pointer text-blue-500 ml-2 -mt-4"
            onClick={() => {
              history.push('/listings/list/editlist?edit=&id=' + listing.id, {
                record: listing,
              });
            }}
          >
            {listing?.id && <div>查看房源信息</div>}
          </div>
        </Card>
        <Card>
          <Typography.Title heading={6}>{'租赁信息'}</Typography.Title>
          <Grid.Row gutter={50}>
            <Grid.Col span={8}>
              <Form.Item label={'租赁方式'} field="rentType" disabled>
                <Select placeholder={'选择租赁模式'}>
                  <Select.Option value="0">整租</Select.Option>
                  <Select.Option value="1">合租</Select.Option>
                </Select>
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={8}>
              <Form.Item label={'租赁周期'} field="priceType" disabled>
                <Select placeholder={'选择租赁周期'}>
                  {Object.keys(PriceTypeMap).map((key) => (
                    <Select.Option key={key} value={key}>
                      {PriceTypeMap[key]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={8}>
              <Form.Item label={'价格'} field="price" initialValue={0} disabled>
                <Input type="number" addAfter="人民币" />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={12}>
              <Form.Item label={'租赁时间'} field="rentTime">
                <DatePicker.RangePicker
                  allowClear
                  style={{ width: '100%' }}
                  disabledDate={(date) => dayjs(date).isBefore(dayjs())}
                  onChange={handleDatePickChange}
                />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
          <Form.Item
            className={'w-1/2'}
            label={'订单总价格'}
            field="totalPrice"
            disabled
          >
            <InputNumber
              type="number"
              value={totalPrice as number}
              suffix="人民币"
            />
          </Form.Item>
        </Card>
      </Form>
      {
        <div className={styles.actions}>
          <Space>
            <Button onClick={handleReset} size="large">
              {'重置'}
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              size="large"
            >
              {'生成并发送订单'}
            </Button>
          </Space>
        </div>
      }
    </div>
  );
}

export default GroupForm;
