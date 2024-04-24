import React, { useEffect, useState } from 'react';
import { Upload, Message, Image, Space } from '@arco-design/web-react';
import { uploadFile } from '@/utils/http';

interface Props {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}
export declare type UploadItem = {
  uid: string;
  url?: string;
  name?: string;
};
function ImageUploader({ images = [], setImages }: Props) {
  const [defalultFileList, setDefalultFileList] = useState<UploadItem[]>([]);

  useEffect(() => {
    const arr: UploadItem[] = images.map((src, index) => ({
      uid: index.toString(),
      name: src + index,
      url: `https://${src}`,
    }));
    setDefalultFileList(arr);
  }, [images]);

  console.log('defalultFileList', defalultFileList);
  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadFile('upload', file);
      const { data, code, msg }: any = response;
      if (code == 200) {
        const url = data?.fileUrl || '';
        onSuccess(url);
        setImages((pre) => [...pre, url]);
      }
    } catch (error) {
      onError(error);
    }
  };
  return (
    <div>
      {defalultFileList.length > 0 && (
        <Upload
          multiple
          imagePreview
          defaultFileList={defalultFileList}
          customRequest={customRequest}
          listType="picture-card"
        />
      )}
    </div>
  );
}
const ImagesContent = ({ images }: { images: string[] }) => {
  console.log('images', images);
  return (
    <div className="flex flex-wrap space-x-2">
      <Image.PreviewGroup infinite>
        <Space>
          {images.map((src, index) => (
            <Image
              key={index}
              src={`https://${src}`}
              width={200}
              alt={`lamp${index + 1}`}
            />
          ))}
        </Space>
      </Image.PreviewGroup>
    </div>
  );
};
export { ImageUploader, ImagesContent };
