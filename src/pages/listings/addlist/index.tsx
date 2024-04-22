import React, { useState, useRef } from 'react';
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
} from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';
import Textarea from '@arco-design/web-react/es/Input/textarea';
import { HouseDirection, PriceTypeMap } from '../list/constants';
import dayjs from 'dayjs';
import useStorage from '@/utils/useStorage';
import { post } from '@/utils/http';
import { ImageUploader } from '@/components/ImagesUploader';

function GroupForm() {
  const t = useLocale(locale);
  const formRef = useRef<FormInstance>();
  const [loading, setLoading] = useState(false);
  const [userData] = useStorage('userData');
  // 图片上传
  const [images, setImages] = useState<string[]>([]);
  async function submit(formValue) {
    console.log('formValue', formValue);
    const code = '';
    const [availableFrom, availableUntil] = formValue.rentTime;
    delete formValue.rentTime;
    const postdata = {
      ...formValue,
      // images: images?.join(";"),
      // cover: images[0] || "",
      images: '',
      cover: '',
      code,
      availableFrom: new Date(availableFrom),
      availableUntil: new Date(availableUntil),
      landlordId: userData?.id,
      //每次发布或修改都将重新进行审核
      isChecked: 0,
    };
    try {
      setLoading(true);
      const { code, data, msg } = await post(`listing/add_listing`, postdata);
      if (code == 200) {
        console.log('data', data);
        Message.success('新增房源成功!');
      } else {
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit() {
    formRef.current.validate().then((values) => {
      submit(values);
    });
  }

  function handleReset() {
    formRef.current.resetFields();
  }

  return (
    <div className={styles.container}>
      <Form layout="vertical" ref={formRef} className={styles['form-group']}>
        <Card>
          <Typography.Title heading={6}>{'基本信息'}</Typography.Title>
          <Grid.Row gutter={80}>
            <Grid.Col span={8}>
              <Form.Item label={'标题'} field="title" initialValue={''}>
                <Input />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row gutter={80}>
            <Grid.Col span={8}>
              <Form.Item label={'关键词'} field="keywords" initialValue={''}>
                <Input />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={8}>
              <Form.Item label={'城市'} field="city" initialValue={''}>
                <Input />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={8}>
              <Form.Item label={'地址'} field="address" initialValue={''}>
                <Input />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row gutter={80}>
            <Grid.Col span={12}>
              <Form.Item label={'描述'} field="description" initialValue={''}>
                <Textarea placeholder="房源描述" />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={12}></Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Form.Item label={'房源图片'} field="images" initialValue={''}>
              <ImageUploader images={images} setImages={setImages} />
            </Form.Item>
          </Grid.Row>
        </Card>
        <Card>
          <Typography.Title heading={6}>{'租赁信息'}</Typography.Title>
          <Grid.Row gutter={50}>
            <Grid.Col span={8}>
              <Form.Item label={'租赁方式'} field="rentType">
                <Select placeholder={'选择租赁模式'}>
                  <Select.Option value="0">整租</Select.Option>
                  <Select.Option value="1">合租</Select.Option>
                </Select>
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={8}>
              <Form.Item label={'租赁周期'} field="priceType">
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
              <Form.Item label={'价格'} field="price" initialValue={0}>
                <Input type="number" addAfter="人民币" />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={12}>
              <Form.Item label={'租赁时间'} field="rentTime">
                <DatePicker.RangePicker
                  allowClear
                  style={{ width: '100%' }}
                  disabledDate={(date) => dayjs(date).isBefore(dayjs())}
                />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
        </Card>
        <Card>
          <Typography.Title heading={6}>{'建筑信息'}</Typography.Title>
          <Grid.Row gutter={50}>
            <Grid.Col span={6}>
              <Form.Item label={'房间数'} field="roomCount" initialValue={0}>
                <Input type="number" addAfter="室" />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={6}>
              <Form.Item
                label={'客厅数'}
                field="livingroomCount"
                initialValue={0}
              >
                <Input type="number" addAfter="厅" />
              </Form.Item>
            </Grid.Col>

            <Grid.Col span={6}>
              <Form.Item
                label={'卫生间数'}
                field="bathroomCount"
                initialValue={0}
              >
                <Input type="number" addAfter="卫" />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={6}>
              <Form.Item label={'房间数'} field="roomCount" initialValue={0}>
                <Input type="number" addAfter="间" />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={6}>
              <Form.Item label={'面积'} field="area" initialValue={0}>
                <Input type="number" addAfter="平方米(m2)" />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={6}>
              <Form.Item label={'楼层'} field="floor" initialValue={1}>
                <Input type="number" addAfter="楼" />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={6}>
              <Form.Item label={'总楼层'} field="totalFloor" initialValue={1}>
                <Input type="number" addAfter="楼" />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={6}>
              <Form.Item
                label={'建筑年份'}
                field="buildYear"
                initialValue={2000}
              >
                <Input type="number" addAfter="年" />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={8}>
              <Form.Item
                label={'房间朝向'}
                field="direction"
                initialValue={'朝南'}
              >
                <Select placeholder={'选择房间朝向'}>
                  {HouseDirection.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
        </Card>
        <Card>
          <Typography.Title heading={6}>{'设施信息'}</Typography.Title>
          <Grid.Row gutter={20}>
            <Grid.Col span={8}>
              <Form.Item label={'优势'} field="advantage" initialValue={''}>
                <Input placeholder={'房源优势'} />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={8}>
              <Form.Item
                label={'室内措施'}
                field="bedroomFacilities"
                initialValue={''}
              >
                <Input placeholder={'房源室内措施'} />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
        </Card>
        <Card style={{ marginBottom: '40px' }}>
          <Typography.Title heading={6}>{'关于此房源'}</Typography.Title>
          <Grid.Row gutter={80}>
            <Grid.Col span={6}>
              <Form.Item label={'介绍'} field="about" initialValue={''}>
                <Textarea placeholder="房源优势" />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={6}>
              <Form.Item
                label={'房源介绍'}
                field="listingIntro"
                initialValue={''}
              >
                <Textarea placeholder="房源介绍" />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={6}>
              <Form.Item
                label={'房客使用权限'}
                field="tenantPermission"
                initialValue={''}
              >
                <Textarea placeholder="房客使用权限" />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={6}>
              <Form.Item
                label={'其他注意事项'}
                field="others"
                initialValue={''}
              >
                <Textarea placeholder="其他注意事项" />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
        </Card>
      </Form>
      <div className={styles.actions}>
        <Space>
          <Button onClick={handleReset} size="large">
            {t['groupForm.reset']}
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            size="large"
          >
            {t['groupForm.submit']}
          </Button>
        </Space>
      </div>
    </div>
  );
}

export default GroupForm;
