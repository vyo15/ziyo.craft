import { useRouter } from "next/router";
import styles from "./Register.module.scss";
import { FormEvent, useState } from "react";
import Input from "../../../UI/Input";
import Button from "../../../UI/Button";

const RegisterView = () => {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target as HTMLFormElement;
    const data = {
      email: form.email.value,
      fullname: form.fullname.value,
      phone: form.phone.value,
      password: form.password.value,
    };

    const result = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (result.status === 200) {
      form.reset();
      push("/auth/login");
    } else {
      console.log("failed");
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.register}>
      <h1 className={styles.register__title}>Register</h1>
      <div className={styles.register__form}>
        <form onSubmit={handleSubmit}>
          <Input label="E-Mail" name="email" type="email" />
          <Input label="Fullname" name="fullname" type="text" />
          <Input label="Phone" name="phone" type="text" />
          <Input label="Password" name="password" type="password" />
          <Button
            type="submit"
            onClick={() => {}} // Tidak ada aksi tambahan saat klik, karena tombol ini sudah dalam form yang menangani submit
            variant="primary"
            className={styles.register__form__button}
          >
            {isLoading ? "Loading..." : "Register"}
          </Button>
        </form>
      </div>
      <p className={styles.register__link}>
        Have an account? <a href="login">Sign in here</a>
      </p>
    </div>
  );
};

export default RegisterView;
