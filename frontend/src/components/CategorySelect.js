import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import { categories } from '../types/categories';
import { useState } from 'react';

function CategorySelect({ value, onChange, required = true, error }) {
  const [touched, setTouched] = useState(false);
  const isInvalid = (required && touched && !value) || error;

  const handleValueChange = (newValue) => {
    onChange(newValue);
    setTouched(true);
  };

  return (
    <div className="mb-4">
    <Label.Root htmlFor="category" className="block mb-1">
      Category{required && ' *'}
    </Label.Root>
    <Select.Root onValueChange={handleValueChange} value={value}>
      <Select.Trigger 
        className={`w-full border rounded px-2 py-1 ${isInvalid ? 'border-red-500' : ''}`}
        onBlur={() => setTouched(true)}
      >
        <Select.Value placeholder="Select a category" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="bg-white border rounded shadow-lg">
          <Select.Viewport>
            {categories.map((category) => (
              <Select.Item
                key={category.value}
                value={category.value}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
              >
                <Select.ItemText>{category.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
    {isInvalid && (
      <p className="text-red-500 text-sm mt-1">{error || "Please select a category"}</p>
    )}
  </div>
  );
}

export default CategorySelect;