import { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button';

const ColorPicker = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    '#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => setIsOpen(!isOpen)}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded border-2 border-gray-300"
        />
      </div>
      {isOpen && (
        <div className="flex gap-2 mt-2">
          {colors.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded border-2 border-gray-300"
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;