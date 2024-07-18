import React, { FormEvent, useState } from "react";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import Modal from "@/components/UI/Modal";
import Select from "@/components/UI/Select";
import userServices from "@/services/user";
import styles from "./ModalUpdateUser.module.scss";

const ModalUpdateUser = (props: any) => {
  const { updatedUser, setUpdatedUser, setUsersData } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleUpdateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target as HTMLFormElement;
    const roleElement = form.elements.namedItem("role") as HTMLSelectElement;
    const roleValue = roleElement ? roleElement.value : "";

    const data = {
      role: roleValue,
    };

    try {
      const result = await userServices.updateUser(updatedUser.id, data);
      if (result.status === 200) {
        setUsersData((prevData: any) =>
          prevData.map((user: any) =>
            user.id === updatedUser.id ? { ...user, ...data } : user
          )
        );
        setUpdatedUser(null);
      } else {
        setError("Failed to update user");
      }
    } catch (err) {
      setError("An error occurred during update");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={() => setUpdatedUser(null)}>
      <div className={styles.modalContent}>
        <h1 className={styles.modalHeader}>Update User</h1>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form className={styles.modalForm} onSubmit={handleUpdateUser}>
          <div className={styles.formGroup}>
            <Input
              label="E-Mail"
              name="email"
              type="email"
              defaultValue={updatedUser.email}
              disabled
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <Input
              label="Fullname"
              name="fullname"
              type="text"
              defaultValue={updatedUser.fullname}
              disabled
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <Input
              label="Phone"
              name="phone"
              type="text"
              defaultValue={updatedUser.phone}
              disabled
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <Select
              label="Role"
              name="role"
              defaultValue={updatedUser.role}
              options={[
                { label: "Member", value: "member" },
                { label: "Admin", value: "admin" },
              ]}
              className={styles.formInput}
            />
          </div>
          <Button
            className={isLoading ? styles.loadingButton : styles.submitButton}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Update"}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalUpdateUser;
