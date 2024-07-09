import { useRouter } from "next/router";
import styles from "./Login.module.scss";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Input from "../../../UI/Input";
import Button from "../../../UI/Button";

const LoginView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { push, query } = useRouter();

  const callbackUrl: any = query.callbackUrl || "/";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    if (!email || !password) {
      setIsLoading(false);
      setError("Email dan Password harus diisi");
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });
      console.log("Credential signIn response:", res);

      if (!res?.error) {
        setIsLoading(false);
        form.reset();
        push(callbackUrl);
      } else {
        setIsLoading(false);
        setError("Email atau Password salah");
      }
    } catch (error) {
      setIsLoading(false);
      setError("Email atau Password salah");
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await signIn("google", { redirect: false, callbackUrl });
      console.log("Google signIn response:", res);

      if (!res?.error) {
        setIsLoading(false);
        push(callbackUrl);
      } else {
        setIsLoading(false);
        setError("Login Google gagal");
      }
    } catch (error) {
      setIsLoading(false);
      setError("Login Google gagal");
    }
  };

  return (
    <div className={styles.login}>
      <h1 className={styles.login__title}>Login</h1>
      <div className={styles.login__form}>
        {isLoading && <div className={styles.spinner}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" name="email" />
          <Input label="Password" type="password" name="password" />
          <Button
            type="submit"
            onClick={() => {}} // Tambahkan onClick kosong di sini
            variant="primary"
            className={styles.login__form__button}
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
          <hr className={styles.login__form__devider} />
          <div className={styles.login__form__other} />
          <Button
            type="button"
            className={styles.login__form__other__button}
            onClick={handleGoogleLogin}
            variant="google"
          >
            <i className="bx bxl-google" /> Login With Google
          </Button>
        </form>
      </div>
      <p className={styles.login__link}>
        Belum punya akun? <a href="register">Daftar disini</a>
      </p>
    </div>
  );
};

export default LoginView;
