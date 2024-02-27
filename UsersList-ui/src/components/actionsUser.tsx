import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { User, UserActionsType } from '../models/users.interfaces';
import '../assets/css/users.css';
import {
  handleUserUpdated,
  handleUserDeleted,
  handleUserCreated,
} from '../utils/usersUtils';

interface ActionsUserProps {
  user: User | null;
  onClose: () => void;
}

const ActionsUser: React.FC<ActionsUserProps> = ({ user, onClose }) => {
  const [updateUser, setUpdateUser] = useState<Partial<User> | null>(
    user || null
  );
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (updateUser) {
      setButtonDisabled(checkDisabled);
    }
  }, [updateUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdateUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const checkDisabled = (): boolean => {
    return !(
      updateUser?.first_name &&
      updateUser?.last_name &&
      updateUser?.email &&
      updateUser?.avatar &&
      (updateUser?.first_name !== user?.first_name ||
        updateUser?.last_name !== user?.last_name ||
        updateUser?.email !== user?.email ||
        updateUser?.avatar !== user?.avatar)
    );
  };

  const handleActions = (actions: UserActionsType) => {
    switch (actions) {
      case UserActionsType.CREATE:
        if (updateUser) {
          handleUserCreated(updateUser as User);
        }
        break;
      case UserActionsType.UPDATE:
        if (updateUser) {
          handleUserUpdated(updateUser);
        }
        break;
      case UserActionsType.DELETE:
        if (user) {
          handleUserDeleted(user.id as number);
        }
        break;
      default:
        break;
    }
    onClose();
  };

  const headers: (keyof User)[] = [
    'first_name',
    'last_name',
    'email',
    'avatar',
  ];
  return (
    <Dialog
      className="user-dialog"
      header={
        <div className="dialog-header">
          {' '}
          {!user ? 'Create New User' : 'User Details'}
        </div>
      }
      visible
      onHide={onClose}
    >
      <div className="p-field">
        {headers.map((header) => (
          <div key={header}>
            <label
              className="header-input"
              htmlFor={header}
            >{`${header[0].toUpperCase()}${header.slice(1)}:`}</label>
            <InputText
              className="field-value"
              name={header}
              value={updateUser?.[header] as string}
              onChange={handleInputChange}
            />
          </div>
        ))}
      </div>
      <div className="p-dialog-footer">
        <Button
          className="p-button-cancel"
          label="Cancel"
          icon="pi pi-times"
          onClick={onClose}
        />
        <Button
          className="p-button-update"
          label={!user ? 'Create' : 'Update'}
          disabled={buttonDisabled}
          icon="pi pi-check"
          onClick={() =>
            handleActions(
              !user ? UserActionsType.CREATE : UserActionsType.UPDATE
            )
          }
        />
        {user && (
          <Button
            className="p-button-delete"
            icon="pi pi-trash"
            onClick={() => handleActions(UserActionsType.DELETE)}
          />
        )}
      </div>
    </Dialog>
  );
};

export default ActionsUser;
