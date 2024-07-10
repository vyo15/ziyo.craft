import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoginView from "../../components/views/auth/Login";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "authenticated") {
    return <p>Redirecting...</p>;
  }

  return <LoginView />;
};

export default LoginPage;
