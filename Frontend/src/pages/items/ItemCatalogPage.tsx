import React, { useState } from 'react';
import { 
  useGetItemsQuery, 
  useDeleteItemMutation 
} from '../../features/items/itemsApi';
import type { Item } from '../../features/items/itemTypes';
import CreateItemModal from '../../components/items/CreateItemModal';
import EditItemModal from '../../components/items/EditItemModal';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Table, type Column } from '../../components/common/Table/Table';
import { Button } from '../../components/common/Button/Button';
import { Loader } from '../../components/common/Loader/Loader';
import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const ItemCatalogPage: React.FC = () => {
  const { data: response, isLoading, error, refetch } = useGetItemsQuery();
  const [deleteItem] = useDeleteItemMutation();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);

  const items = response?.data || [];

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this catalog item? This action cannot be undone.')) {
      try {
        await deleteItem(id).unwrap();
      } catch (err) {
        console.error('Failed to delete item', err);
        alert('Failed to delete item');
      }
    }
  };

  const columns: Column<Item>[] = [
    {
      header: 'Item Name & Category',
      render: (item) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</span>
        </div>
      )
    },
    {
      header: 'Measurement Unit',
      render: (item) => (
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{item.unit}</span>
      )
    },
    {
      header: 'Standard Shelf Life',
      render: (item) => (
        <span style={{ color: 'var(--text-main)' }}>{item.shelfLifeDays} days</span>
      )
    },
    {
      header: 'Actions',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => setItemToEdit(item)}
            title="Edit Item"
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-default)',
              backgroundColor: '#ffffff',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.78rem'
            }}
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            title="Delete Item"
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-default)',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.78rem'
            }}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <PageContainer
      title="Item Catalog"
      subtitle="Manage standard food items, categories, and default shelf-life parameters"
      actions={
        <Button 
          variant="primary" 
          leftIcon={<Plus size={16} />} 
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add New Item
        </Button>
      }
    >
      {isLoading ? (
        <div style={{ padding: '3rem 0', display: 'flex', justifyContent: 'center' }}>
          <Loader text="Loading catalog items..." />
        </div>
      ) : error ? (
        <ErrorState message="Failed to load items" onRetry={refetch} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Catalog is Empty"
          description="There are currently no items defined in the catalog."
          actionLabel="Add First Item"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <Table columns={columns} data={items} emptyMessage="No items match your criteria" />
      )}

      {isCreateModalOpen && (
        <CreateItemModal onClose={() => setIsCreateModalOpen(false)} />
      )}
      {itemToEdit && (
        <EditItemModal item={itemToEdit} onClose={() => setItemToEdit(null)} />
      )}
    </PageContainer>
  );
};

export default ItemCatalogPage;
