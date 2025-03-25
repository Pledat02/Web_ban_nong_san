import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import UserForm from '../components/UserForm';
import DeleteConfirmation from '../components/DeleteConfirmation';

// Mock data - replace with actual API calls
const mockUsers= [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    createdAt: '2024-03-01',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Manager',
    createdAt: '2024-03-02',
  },
];

const Users = () => {
  const [users, setUsers] = useState(mockUsers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleSave = (user) => {
    if (selectedUser) {
      // Update existing user
      setUsers(users.map(u => u.id === user.id ? user : u));
    } else {
      // Add new user
      setUsers([...users, { ...user, id: String(Date.now()) }]);
    }
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteOpen(false);
      setSelectedUser(null);
    }
  };

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: info => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(info.row.original)}
            className="p-1 text-blue-600 hover:text-blue-800"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(info.row.original)}
            className="p-1 text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => {
            setSelectedUser(null);
            setIsFormOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchField="user name or email"
      />

      {isFormOpen && (
        <UserForm
          user={selectedUser}
          onSave={handleSave}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {isDeleteOpen && (
        <DeleteConfirmation
          title="Delete User"
          message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default Users;