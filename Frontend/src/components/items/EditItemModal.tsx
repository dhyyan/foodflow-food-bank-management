import React, { useState } from 'react';
import { useUpdateItemMutation } from '../../features/items/itemsApi';
import type { Item, UpdateItemRequest } from '../../features/items/itemTypes';
import { Modal } from '../common/Modal/Modal';
import { Input } from '../common/Input/Input';
import { Select } from '../common/Select/Select';
import { Button } from '../common/Button/Button';
import { Save, AlertCircle } from 'lucide-react';

interface Props {
  item: Item;
  onClose: () => void;
}

const CATEGORY_OPTIONS = [
  { value: 'Grains', label: 'Grains & Cereals' },
  { value: 'Dairy', label: 'Dairy & Refrigerated' },
  { value: 'Produce', label: 'Fresh Produce' },
  { value: 'Canned Goods', label: 'Canned Goods' },
  { value: 'Bakery', label: 'Bakery Items' },
  { value: 'Protein', label: 'Meat & Protein' },
  { value: 'Beverages', label: 'Beverages' },
  { value: 'Snacks', label: 'Snacks & Dry Packets' },
  { value: 'Other', label: 'General / Other' }
];

const UNIT_OPTIONS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'packets', label: 'Packets' },
  { value: 'cans', label: 'Cans' },
  { value: 'boxes', label: 'Boxes' },
  { value: 'liters', label: 'Liters' },
  { value: 'units', label: 'Units / Items' },
  { value: 'bags', label: 'Bags' },
  { value: 'cartons', label: 'Cartons' }
];

const EditItemModal: React.FC<Props> = ({ item, onClose }) => {
  const [updateItem, { isLoading }] = useUpdateItemMutation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateItemRequest>({
    id: item.id,
    name: item.name,
    category: item.category,
    unit: item.unit,
    shelfLifeDays: item.shelfLifeDays,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'shelfLifeDays' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await updateItem(formData).unwrap();
      onClose();
    } catch (err: any) {
      console.error('Failed to update item', err);
      setErrorMsg(err?.data?.error || 'Failed to update item');
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edit Catalog Item"
      subtitle={`Modifying properties for ${item.name}`}
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {errorMsg && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Item Name *"
            name="name"
            placeholder="e.g. Fresh Apples"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <Select
            label="Category *"
            name="category"
            options={CATEGORY_OPTIONS}
            value={formData.category}
            onChange={handleChange}
            required
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Select
              label="Default Unit *"
              name="unit"
              options={UNIT_OPTIONS}
              value={formData.unit}
              onChange={handleChange}
              required
            />
            <Input
              label="Standard Shelf Life (Days) *"
              name="shelfLifeDays"
              type="number"
              min="0"
              value={formData.shelfLifeDays}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} leftIcon={<Save size={16} />}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditItemModal;
