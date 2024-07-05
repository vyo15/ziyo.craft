import { signIn, signOut, useSession } from "next-auth/react";
import Style from "./Navbar.module.scss";

const Navbar = () => {
  const { data } = useSession();
  return (
    <div className={Style.navbar}>
      <button
        className={Style.navbar__button}
        onClick={() => (data ? signOut() : signIn())}
      >
        {data ? "Logout" : "Login"}
      </button>
    </div>
  );
};

export default Navbar;
