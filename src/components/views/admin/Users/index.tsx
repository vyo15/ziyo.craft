import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import styles from "./Users.module.scss";
import Button from "@/components/UI/Button";
import ModalUpdateUser from "./ModalUpdateUser";
import ModalDeleteUser from "./ModalDeleteUser";
import userServices from "@/services/user";

type User = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
};

type PropTypes = {
  users: User[];
};

const UsersAdminView: React.FC<PropTypes> = ({ users }) => {
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  const [deletedUser, setDeletedUser] = useState<User | null>(null);
  const [usersData, setUsersData] = useState<User[]>([]);

  useEffect(() => {
    setUsersData(users);
  }, [users]);

  return (
    <>
      <AdminLayout>
        <div className={styles.users}>
          <h1>Users Management</h1>
          <table className={styles.users__table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.fullname || "-"}</td>
                  <td>{user.email || "-"}</td>
                  <td>{user.phone || "-"}</td>
                  <td>{user.role || "-"}</td>
                  <td>
                    <div className={styles.users__table__actions}>
                      <Button
                        className={styles.users__table__actions__edit}
                        type="button"
                        onClick={() => setUpdatedUser(user)}
                      >
                        <i className="bx bx-edit" />
                      </Button>
                      <Button
                        className={styles.users__table__actions__delete}
                        type="button"
                        onClick={() => setDeletedUser(user)}
                      >
                        <i className="bx bx-trash" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
      {updatedUser && (
        <ModalUpdateUser
          updatedUser={updatedUser}
          setUpdatedUser={setUpdatedUser}
          setUsersData={setUsersData}
        />
      )}
      {deletedUser && (
        <ModalDeleteUser
          deletedUser={deletedUser}
          setDeletedUser={setDeletedUser}
          setUsersData={setUsersData}
        />
      )}
    </>
  );
};

export default UsersAdminView;
