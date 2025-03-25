import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';

const mockOrders = [
  {
    id: '1',
    userId: 'user1',
    products: [
      { productId: '1', quantity: 2, price: 5.98 },
      { productId: '2', quantity: 1, price: 1.99 }
    ],
    total: 7.97,
    status: 'pending',
    createdAt: '2024-03-15',
  },
  {
    id: '2',
    userId: 'user2',
    products: [
      { productId: '2', quantity: 3, price: 5.97 }
    ],
    total: 5.97,
    status: 'completed',
    createdAt: '2024-03-14',
  },
];

const Orders = () => {
  const [orders] = useState(mockOrders);

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('id', {
      header: 'Order ID',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('userId', {
      header: 'Customer ID',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('total', {
      header: 'Total',
      cell: info => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          info.getValue() === 'completed' ? 'bg-green-100 text-green-800' :
          info.getValue() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    }),
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
      </div>

      <DataTable
        data={orders}
        columns={columns}
        searchField="order ID"
      />
    </div>
  );
}

export default Orders;