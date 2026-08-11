import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : currentPage * pageSize;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 0.25rem',
        marginTop: '0.75rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}
    >
      <div>
        {totalItems ? (
          <span>
            Showing <strong style={{ color: 'var(--text-main)' }}>{startItem}</strong> to{' '}
            <strong style={{ color: 'var(--text-main)' }}>{endItem}</strong> of{' '}
            <strong style={{ color: 'var(--text-main)' }}>{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Page <strong style={{ color: 'var(--text-main)' }}>{currentPage}</strong> of{' '}
            <strong style={{ color: 'var(--text-main)' }}>{totalPages}</strong>
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{
            padding: '0.4rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
            backgroundColor: '#ffffff',
            color: currentPage === 1 ? 'var(--text-light)' : 'var(--text-main)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: currentPage === page ? 700 : 500,
              backgroundColor: currentPage === page ? 'var(--primary-light)' : '#ffffff',
              color: currentPage === page ? 'var(--primary)' : 'var(--text-main)',
              border: currentPage === page ? '1px solid var(--primary-border)' : '1px solid var(--border-default)'
            }}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={{
            padding: '0.4rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
            backgroundColor: '#ffffff',
            color: currentPage === totalPages ? 'var(--text-light)' : 'var(--text-main)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
