import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import RegisterView from "../../components/views/auth/Register";

const RegisterPage = () => {
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

  return <RegisterView />;
};

export default RegisterPage;
