import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SortOrder } from 'primereact/api';
import { User } from '../models/users.interfaces';
import ActionsUser from '../components/actionsUser';

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder>(1);
  const [first, setFirst] = useState<number>(0);
  const [showUserForm, setShowUserForm] = useState<User | null>(null);
  const [showUserActions, setShowUserActions] = useState<boolean>(false);

  const onSort = (e: any) => {
    setSortField(e.field);
    setSortOrder(e.order as SortOrder);
  };

  const onRowClick = (rowData: User) => {
    setShowUserForm(rowData);
    setShowUserActions(true);
  };

  return (
    <>
      <DataTable
        value={users}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSort}
        paginator
        rows={6}
        first={first}
        onPage={(e: any) => setFirst(e.first)}
        onRowClick={(e: any) => onRowClick(e.data)}
      >
        <Column field="first_name" header="First Name" />
        <Column field="last_name" header="Last Name" />
        <Column field="email" header="Email" />
      </DataTable>
      {showUserActions && (
        <ActionsUser
          user={showUserForm}
          onClose={() => {
            setShowUserActions(false);
          }}
        />
      )}
    </>
  );
};

export default UserTable;
