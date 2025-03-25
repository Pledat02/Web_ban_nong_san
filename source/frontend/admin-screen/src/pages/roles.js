import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';



const mockRoles = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access',
    permissions: ['create', 'read', 'update', 'delete'],
    createdAt: '2024-03-01',
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Manage products and orders',
    permissions: ['read', 'update'],
    createdAt: '2024-03-02',
  },
];

const Roles = () => {
  const [roles] = useState(mockRoles);

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Role Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('permissions', {
      header: 'Permissions',
      cell: info => info.getValue().join(', '),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: info => new Date(info.getValue()).toLocaleDateString(),
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
        <h1 className="text-2xl font-bold">Role Management</h1>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Role
        </button>
      </div>

      <DataTable
        data={roles}
        columns={columns}
        searchField="role name"
      />
    </div>
  );
}

export default Roles;