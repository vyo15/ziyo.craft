import AdminLayout from "@/components/layouts/AdminLayout";
import styles from "./Users.module.scss";
import Button from "@/components/UI/Button";

type PropTypes = {
  users: any;
};

const UsersAdminView = (props: PropTypes) => {
  const { users } = props;
  console.log(users);
  return (
    <AdminLayout>
      <div className={styles.users}>
        <h1>Users Management</h1>
        <table className={styles.users__table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any, index: number) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                  <div className={styles.users__table__actions}>
                    <Button type="button" onClick={() => {}}>
                      Update
                    </Button>
                    <Button type="button" onClick={() => {}}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default UsersAdminView;
