import React from 'react';
import { Upload, Message } from '@arco-design/web-react';
import { uploadFile } from '@/utils/http';

interface Props {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

function ImageUploader({ images = [], setImages }: Props) {
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
      <Upload
        multiple
        imagePreview
        defaultFileList={[]}
        customRequest={customRequest}
        listType="picture-card"
      />
    </div>
  );
}
// const ImagesContent = ({ images }: { images: string[] }) => {
//   return (
//     <div className="flex flex-wrap space-x-2">
//       {images?.length &&
//         images.map((image: string, index) => (
//           <div
//             key={index}
//             className="shadow-blackA4 m-2 w-[200px] rounded-md shadow-[0_2px_10px] overflow-hidden"
//             style={{
//               display: `${!image && 'none'}`,
//             }}
//           >
//             <AspectRatio.Root ratio={16 / 9}>
//               <img
//                 className="object-cover w-full h-full"
//                 alt=""
//                 src={'https://' + image}
//               />
//             </AspectRatio.Root>
//           </div>
//         ))}
//     </div>
//   );
// };
export { ImageUploader };
