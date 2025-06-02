import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageChange }) => {
  const [image, setImage] = useState<string | null>(null);
  const [cropper, setCropper] = useState<any>();
  const [showCropper, setShowCropper] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImage || '');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  const handleCrop = () => {
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      const croppedImage = croppedCanvas.toDataURL();
      setImageUrl(croppedImage);
      onImageChange(croppedImage);
      setShowCropper(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    onImageChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Upload size={24} />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <input
            type="url"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="URL изображения"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Перетащите изображение сюда или кликните для выбора
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PNG, JPG или GIF до 5MB
        </p>
      </div>

      {showCropper && image && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Обрезать изображение</h3>
              <button
                onClick={() => setShowCropper(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <Cropper
              src={image}
              style={{ height: 400, width: '100%' }}
              aspectRatio={1}
              guides={true}
              onInitialized={(instance) => setCropper(instance)}
            />
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowCropper(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Отмена
              </button>
              <button
                onClick={handleCrop}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;