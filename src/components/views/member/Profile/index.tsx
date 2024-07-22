import MemberLayout from "@/components/layouts/MemberLayout";
import styles from "./Profile.module.scss";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import Image from "next/image";
import { useState, useRef } from "react";
import { uploadFile } from "@/lib/firebase/service";
import axios from "axios";
import { Oval } from "react-loader-spinner";

interface ProfileProps {
  profile: {
    id: string;
    image: string;
    fullname: string;
    email: string;
    phone: string;
  };
  setProfile: (profile: {
    id: string;
    image: string;
    fullname: string;
    email: string;
    phone: string;
  }) => void;
  session: any;
}

const ProfileMemberView: React.FC<ProfileProps> = ({
  profile,
  setProfile,
  session,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeProfilePicture = async () => {
    if (selectedFile) {
      setIsLoading(true);
      try {
        const downloadURL = await uploadFile(profile.id, selectedFile);
        console.log("File berhasil diunggah, URL:", downloadURL);
        const updatedProfile = { ...profile, image: downloadURL };
        setProfile(updatedProfile);

        // Update profile in the database
        await axios.put(
          "/api/user/profile",
          { id: profile.id, data: { image: downloadURL } },
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        setSelectedFile(null); // Clear selected file after upload
      } catch (error) {
        console.error("Kesalahan saat mengunggah file:", error);
        setErrorMessage("Gagal mengunggah gambar");
      } finally {
        setIsLoading(false);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setErrorMessage("Ukuran foto profil maksimal 1MB.");
        setSelectedFile(null);
      } else {
        setErrorMessage("");
        setSelectedFile(file);
      }
    }
  };

  const defaultImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/ziyo-craft.appspot.com/o/images%2Fusers%2Ffoto%20kosong.jpg?alt=media"; // Gunakan URL yang benar di sini

  const imageUrl = profile.image || defaultImageUrl;

  return (
    <MemberLayout>
      <h1 className={styles.profile__title}>Halaman Profil</h1>
      <div className={styles.profile__main}>
        <div className={styles.profile__main__avatar}>
          <div className={styles.profile__main__avatar__image_container}>
            {isLoading ? (
              <div className={styles.loader}>
                <Oval
                  height={80}
                  width={80}
                  color="#4fa94d"
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#4fa94d"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              </div>
            ) : (
              <Image
                src={imageUrl}
                alt="avatar"
                layout="fill"
                className={styles.profile__main__avatar__image}
              />
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleChangeProfilePicture();
            }}
          >
            <label
              className={styles.profile__main__avatar__label}
              htmlFor="upload-image"
            >
              Foto Profil
            </label>
            <input
              type="file"
              name="image"
              id="upload-image"
              className={styles.profile__main__avatar__input}
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <Button
              className={styles.profile__main__avatar__button}
              type="button"
              onClick={handleChangeProfilePicture}
            >
              {isLoading
                ? "Mengunggah..."
                : selectedFile
                ? "Unggah Foto"
                : "Ganti Foto"}
            </Button>
            {selectedFile && (
              <p className={styles.profile__main__avatar__filename}>
                {selectedFile.name.length > 20
                  ? `${selectedFile.name.substring(0, 20)}...`
                  : selectedFile.name}
              </p>
            )}
            {errorMessage && (
              <div className={styles.profile__main__avatar__error}>
                *{errorMessage}
              </div>
            )}
          </form>
        </div>
        <div className={styles.profile__main__info}>
          <form action="">
            <Input
              name="fullname"
              type="text"
              label="Nama Lengkap"
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
              label="Telepon"
              defaultValue={profile.phone || ""}
            />
            <Button type="submit" variant="secondary">
              Perbarui
            </Button>
          </form>
        </div>
      </div>
    </MemberLayout>
  );
};

export default ProfileMemberView;
