import { useRouter } from "next/router";
import styles from "./Login.module.scss";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Input from "../../../UI/Input";
import Button from "../../../UI/Button";
import Link from "next/link";
import AuthLayout from "../../../layouts/AuthLayout";

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
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      setError("Gagal login dengan Google");
    }
  };

  return (
    <AuthLayout
      title="Login"
      error={error}
      link="/auth/register"
      linkText="Belum punya akun? Daftar"
    >
      <form onSubmit={handleSubmit}>
        <Input label="Email" type="email" name="email" />
        <Input label="Password" type="password" name="password" />
        <Button
          type="submit"
          onClick={() => {}}
          variant="primary"
          className={styles.login__button}
        >
          {isLoading ? "Loading..." : "Login"}
        </Button>
        <hr className={styles.login__devider} />
        <div className={styles.login__other}>
          <Button
            type="button"
            className={styles.login__other__button}
            onClick={handleGoogleLogin}
            variant="google"
          >
            <i className="bx bxl-google" /> Login With Google
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginView;
