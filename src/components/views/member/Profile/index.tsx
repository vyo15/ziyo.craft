import MemberLayout from "@/components/layouts/MemberLayout";
import styles from "./Profile.module.scss";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Image from "next/image";
import { useState } from "react";

interface ProfileProps {
  profile: {
    image: string;
    fullname: string;
    email: string;
    phone: string;
  };
}

const ProfileMemberView: React.FC<ProfileProps> = ({ profile }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setErrorMessage("Upload Photo profile maksimal 1MB.");
        setSelectedFile(null);
      } else {
        setErrorMessage("");
        setSelectedFile(file);
      }
    }
  };

  const imageUrl = profile.image || "/default-avatar.png"; // Ganti dengan path avatar default jika perlu

  return (
    <MemberLayout>
      <h1 className={styles.profile__title}>Profile Page</h1>
      <div className={styles.profile__main}>
        <div className={styles.profile__main__avatar}>
          <Image src={imageUrl} alt="avatar" width={200} height={200} />
          <label
            className={styles.profile__main__avatar__label}
            htmlFor="upload-image"
          >
            Photo Profile
          </label>
          <input
            type="file"
            name="image"
            id="upload-image"
            className={styles.profile__main__avatar__input}
            onChange={handleFileChange}
          />
          {errorMessage && (
            <div className={styles.profile__main__avatar__error}>
              *{errorMessage}
            </div>
          )}
        </div>
        <div className={styles.profile__main__info}>
          <form action="">
            <Input
              name="fullname"
              type="text"
              label="Fullname"
              defaultValue={profile.fullname || ""}
            />
            <Input
              name="email"
              type="email"
              label="Email"
              defaultValue={profile.email || ""}
            />
            <Input
              name="phone"
              type="number"
              label="Phone"
              defaultValue={profile.phone || ""}
            />
            <Button type="submit" variant="secondary">
              Update
            </Button>
          </form>
        </div>
      </div>
    </MemberLayout>
  );
};

export default ProfileMemberView;
