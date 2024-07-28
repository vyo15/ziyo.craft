import ProfileMemberView from "@/components/views/member/Profile";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner"; // Impor loader
import styles from "./ProfilePage.module.scss";

interface Profile {
  id: string;
  image: string;
  fullname: string;
  email: string;
  phone: string;
  role: string; // Tambahkan properti role
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      const getProfile = async () => {
        try {
          const response = await axios.get("/api/user/profile", {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          setProfile(response.data.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      getProfile();
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className={styles.loadingContainer}>
        <Oval
          height={80}
          width={80}
          color="#4fa94d"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#4fa94d"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  if (status === "unauthenticated") {
    signIn();
    return <p>Redirecting to login...</p>;
  }

  return (
    <>
      {profile ? (
        <ProfileMemberView
          session={session}
          setProfile={setProfile}
          profile={profile}
        />
      ) : (
        <div className={styles.loadingContainer}>
          <Oval
            height={80}
            width={80}
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
    </>
  );
};

export default ProfilePage;
