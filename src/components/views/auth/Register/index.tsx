import { useRouter } from "next/router";
import styles from "./Register.module.scss";
import { FormEvent, useState } from "react";
import Input from "../../../UI/Input";
import Button from "../../../UI/Button";
import authServices from "@/services/auth";
import AuthLayout from "../../../layouts/AuthLayout";
import Link from "next/link";

const RegisterView = () => {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined); // Ubah tipe state untuk error

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(undefined); // Reset error state
    const form = event.target as HTMLFormElement;
    const data = {
      email: form.email.value,
      fullname: form.fullname.value,
      phone: form.phone.value,
      password: form.password.value,
    };

    try {
      const result = await authServices.registerAccount(data);

      if (result.status === 200) {
        form.reset();
        push("/auth/login");
      } else {
        setError("Failed to register"); // Set error message
      }
    } catch (err) {
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Register"
      error={error} // Menggunakan state error
      link="/auth/login"
      linkText="Sudah punya akun? Login"
    >
      <form onSubmit={handleSubmit}>
        <Input label="E-Mail" name="email" type="email" />
        <Input label="Fullname" name="fullname" type="text" />
        <Input label="Phone" name="phone" type="text" />
        <Input label="Password" name="password" type="password" />
        <Button
          type="submit"
          onClick={() => {}} // Tidak ada aksi tambahan saat klik, karena tombol ini sudah dalam form yang menangani submit
          variant="primary"
          className={styles.register__button}
        >
          {isLoading ? "Loading..." : "Register"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterView;
