import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import DataTable from "./DataTable";

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
  columnHelper.accessor('sold', {
    header: 'Units Sold',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: info => `$${info.getValue()}`,
  }),
];


const TopProductsTable = ({ products }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Top Selling Products</h2>
      </div>
      <DataTable
        data={products} 
        columns={columns}
        searchField="product name"
      />
    </div>
  );
};

export default TopProductsTable;