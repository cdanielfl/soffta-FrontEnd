import { useState, useRef } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Upload } from 'lucide-react';

const LogoUploader = ({ value, onChange }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Logo da UPA</label>
      <div className="flex items-center gap-4">
        {value && (
          <img src={value} alt="Logo" className="w-16 h-16 object-contain border rounded" />
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={16} className="mr-2" />
          {value ? 'Alterar Logo' : 'Upload Logo'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default LogoUploader;
