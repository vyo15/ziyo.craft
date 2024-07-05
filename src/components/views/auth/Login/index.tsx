import { useRouter } from "next/router";
import styles from "./Login.module.scss";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

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
      setError("Both fields are required");
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (!res?.error) {
        setIsLoading(false);
        form.reset();
        push(callbackUrl);
      } else {
        setIsLoading(false);
        setError("Email or Password is incorrect");
      }
    } catch (error) {
      setIsLoading(false);
      setError("Email or Password is incorrect");
    }
  };

  return (
    <div className={styles.login}>
      <h1 className={styles.login__title}>Login</h1>
      <div className={styles.login__form}>
        {isLoading && <div className={styles.spinner}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.login__form__item}>
            <label htmlFor="email">E-Mail</label>
            <input
              name="email"
              id="email"
              type="email"
              className={styles.login__form__item__input}
            />
          </div>
          <div className={styles.login__form__item}>
            <label htmlFor="password">Password</label>
            <input
              name="password"
              id="password"
              type="password"
              className={styles.login__form__item__input}
            />
          </div>
          <button type="submit" className={styles.login__form__button}>
            Login
          </button>
        </form>
      </div>
      <p className={styles.login__link}>
        Dont have an account? <a href="register">Sign Up here</a>
      </p>
    </div>
  );
};

export default LoginView;
