import ProfileMemberView from "@/components/views/member/Profile";
import userServices from "@/services/user";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const { data: session } = useSession();

  useEffect(() => {
    const getProfile = async () => {
      if (session?.user?.id && session.accessToken) {
        try {
          const { data } = await userServices.getProfile(session.accessToken);
          setProfile(data.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    getProfile();
  }, [session]);

  return (
    <>
      <ProfileMemberView profile={profile} />
    </>
  );
};

export default ProfilePage;
