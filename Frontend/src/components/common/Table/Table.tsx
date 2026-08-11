import { type ReactNode } from 'react';
import { Loader } from '../Loader/Loader';
import { EmptyState } from '../EmptyState/EmptyState';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T, index: number) => ReactNode;
  width?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
}

export function Table<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No records found',
  emptyIcon
}: TableProps<T>) {
  if (loading) {
    return (
      <div style={{ padding: '3rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <Loader text="Loading records..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyMessage} icon={emptyIcon} />;
  }

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: '#ffffff'
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.88rem'
        }}
      >
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-default)' }}>
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{
                  padding: '0.85rem 1.15rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  width: col.width
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIdx) => (
            <tr
              key={rowIdx}
              style={{
                borderBottom: rowIdx === data.length - 1 ? 'none' : '1px solid var(--border-light)',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  style={{
                    padding: '0.95rem 1.15rem',
                    color: 'var(--text-main)',
                    verticalAlign: 'middle'
                  }}
                >
                  {col.render
                    ? col.render(item, rowIdx)
                    : col.accessor
                    ? (item[col.accessor] as unknown as ReactNode)
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
