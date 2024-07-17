import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import Modal from "@/components/UI/Modal";
import Select from "@/components/UI/Select";
import userServices from "@/services/user";
import { FormEvent, useState } from "react";

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
        setIsLoading(false);
        setUpdatedUser(null);
        const { data } = await userServices.getAllUsers();
        setUsersData(data.data);
      } else {
        setIsLoading(false);
        setError("Failed to update user");
      }
    } catch (err) {
      setIsLoading(false);
      setError("An error occurred during update");
    }
  };

  return (
    <Modal onClose={() => setUpdatedUser(null)}>
      <h1>Update User</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleUpdateUser}>
        <Input
          label="E-Mail"
          name="email"
          type="email"
          defaultValue={updatedUser.email}
          disabled
        />
        <Input
          label="Fullname"
          name="fullname"
          type="text"
          defaultValue={updatedUser.fullname}
          disabled
        />
        <Input
          label="Phone"
          name="phone"
          type="text"
          defaultValue={updatedUser.phone}
          disabled
        />
        <Select
          label="Role"
          name="role"
          defaultValue={updatedUser.role}
          options={[
            { label: "Member", value: "member" },
            { label: "Admin", value: "admin" },
          ]}
        />
        <Button type="submit" disabled={isLoading}>
          Update
        </Button>
      </form>
    </Modal>
  );
};

export default ModalUpdateUser;
