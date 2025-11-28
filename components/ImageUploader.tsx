import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  currentImage: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {!currentImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-300 group
            ${isDragging 
              ? 'border-white bg-zinc-900' 
              : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50'
            }
          `}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`p-3 rounded-full transition-colors duration-300 ${isDragging ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 group-hover:bg-zinc-800 group-hover:text-zinc-200'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Upload Source Image</p>
              <p className="text-xs text-zinc-500 mt-1">Drag & drop or click to browse</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950/50">
            <div className="aspect-video w-full relative flex items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
                <img 
                    src={currentImage} 
                    alt="Uploaded source" 
                    className="max-h-64 object-contain"
                />
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-black px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-200 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300"
                >
                    Replace Image
                </button>
            </div>
        </div>
      )}
    </div>
  );
};