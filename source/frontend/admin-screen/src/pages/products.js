import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';

const mockProducts = [
  {
    id: '1',
    name: 'Organic Carrots',
    category: 'Vegetables',
    price: 2.99,
    stock: 500,
    sold: 1200,
  },
  {
    id: '2',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: 1.99,
    stock: 300,
    sold: 800,
  },
];

const Products = () => {
  const [products] = useState(mockProducts);

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Product Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('price', {
      header: 'Price',
      cell: info => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor('stock', {
      header: 'Stock',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('sold', {
      header: 'Units Sold',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: info => (
        <div className="flex gap-2">
          <button className="p-1 text-blue-600 hover:text-blue-800">
            <Pencil className="w-4 h-4" />
          </button>
          <button className="p-1 text-red-600 hover:text-red-800">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      <DataTable
        data={products}
        columns={columns}
        searchField="product name"
      />
    </div>
  );
}

export default Products;