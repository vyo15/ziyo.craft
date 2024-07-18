import React from "react";
import Modal from "@/components/UI/Modal";
import userServices from "@/services/user";
import styles from "./ModalDeleteUser.module.scss";

const ModalDeleteUser = ({
  deletedUser,
  setDeletedUser,
  setUsersData,
}: any) => {
  const handleDeleteUser = async () => {
    try {
      const result = await userServices.deleteUser(deletedUser.id);
      if (result.status === 200) {
        setUsersData((prevData: any) =>
          prevData.filter((user: any) => user.id !== deletedUser.id)
        );
        setDeletedUser(null);
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("An error occurred while deleting the user:", error);
    }
  };

  return (
    <Modal onClose={() => setDeletedUser(null)}>
      <div className={styles.modalContent}>
        <h1 className={styles.modalHeader}>Apa Kamu Yakin?</h1>
        <div className={styles.modalButtons}>
          <button
            className={`${styles.button} ${styles.buttonYes}`}
            type="button"
            onClick={handleDeleteUser}
          >
            Yes
          </button>
          <button
            className={`${styles.button} ${styles.buttonNo}`}
            type="button"
            onClick={() => setDeletedUser(null)}
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDeleteUser;
