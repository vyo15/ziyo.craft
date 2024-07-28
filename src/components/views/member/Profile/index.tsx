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
    role: string;
    password: string;
  };
  setProfile: (profile: {
    id: string;
    image: string;
    fullname: string;
    email: string;
    phone: string;
    role: string;
    password: string;
  }) => void;
  session: any;
}

const ProfileMemberView: React.FC<ProfileProps> = ({
  profile,
  setProfile,
  session,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [state, setState] = useState({
    loading: {
      profile: false,
      password: false,
      picture: false,
    },
    messages: {
      profile: "",
      password: "",
      picture: "",
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateState = (
    type: "loading" | "messages",
    key: keyof typeof state.loading,
    value: boolean | string
  ) => {
    setState((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value,
      },
    }));
  };

  const resetMessages = () => {
    setState((prev) => ({
      ...prev,
      messages: {
        profile: "",
        password: "",
        picture: "",
      },
    }));
  };

  const handleChangePassword = async (e: any) => {
    e.preventDefault();
    resetMessages();
    updateState("loading", "password", true);
    const form = e.target as HTMLFormElement;
    const data = {
      oldPassword: form.oldPassword.value,
      newPassword: form.newPassword.value,
    };
    try {
      const response = await fetch("/api/user/[[...user]]", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          id: profile.id,
          data,
        }),
      });

      if (response.ok) {
        updateState("messages", "password", "Kata sandi berhasil diperbarui");
        form.reset(); // Kosongkan kolom input setelah berhasil
      } else {
        const result = await response.json();
        updateState(
          "messages",
          "password",
          result.message || "Gagal memperbarui kata sandi"
        );
      }
    } catch (error) {
      console.error("Error updating password:", error);
      updateState("messages", "password", "Gagal memperbarui kata sandi");
    } finally {
      updateState("loading", "password", false);
    }
  };

  const handleChangeProfile = async (e: any) => {
    e.preventDefault();
    resetMessages();
    updateState("loading", "profile", true);
    const form = e.target as HTMLFormElement;
    const data = {
      fullname: form.fullname.value,
      phone: form.phone.value,
    };

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          id: profile.id,
          data,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setProfile({ ...profile, fullname: data.fullname, phone: data.phone });
        updateState("messages", "profile", "Profil berhasil diperbarui");
      } else {
        const result = await response.json();
        updateState(
          "messages",
          "profile",
          result.message || "Gagal memperbarui profil"
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      updateState("messages", "profile", "Gagal memperbarui profil");
    } finally {
      updateState("loading", "profile", false);
    }
  };

  const handleChangeProfilePicture = async () => {
    resetMessages();
    if (selectedFile) {
      updateState("loading", "picture", true);
      try {
        const downloadURL = await uploadFile(profile.id, selectedFile);
        const updatedProfile = { ...profile, image: downloadURL };
        setProfile(updatedProfile);

        // Perbarui profil di database
        await axios.put(
          "/api/user/profile",
          { id: profile.id, data: { image: downloadURL } },
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        setSelectedFile(null); // Hapus file yang dipilih setelah unggah
        updateState("messages", "picture", "Foto profil berhasil diperbarui");
      } catch (error) {
        console.error("Kesalahan saat mengunggah file:", error);
        updateState("messages", "picture", "Gagal mengunggah gambar");
      } finally {
        updateState("loading", "picture", false);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        updateState("messages", "picture", "Ukuran foto profil maksimal 1MB.");
        setSelectedFile(null);
      } else {
        updateState("messages", "picture", "");
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
          <h2 className={styles.profile__main__avatar__title}>Foto Profil</h2>
          <div className={styles.profile__main__avatar__image_container}>
            {state.loading.picture ? (
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
              {state.loading.picture
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
            {state.messages.picture && (
              <div className={styles.profile__main__avatar__message}>
                *{state.messages.picture}
              </div>
            )}
          </form>
        </div>
        <div className={styles.profile__main__info}>
          <h2>Profil</h2>
          <form onSubmit={handleChangeProfile}>
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
              disabled
            />
            <Input
              name="phone"
              type="number"
              label="Telepon"
              defaultValue={profile.phone || ""}
            />
            <Input
              name="role"
              type="text"
              label="Peran"
              defaultValue={profile.role || ""}
              disabled
            />
            <Button type="submit" variant="secondary">
              {state.loading.profile ? "Memperbarui..." : "Perbarui"}
            </Button>
            {state.messages.profile && (
              <div className={styles.profile__main__info__message}>
                *{state.messages.profile}
              </div>
            )}
          </form>
        </div>
        <div className={styles.profile__main__password}>
          <h2>Ubah Kata Sandi</h2>
          <form onSubmit={handleChangePassword}>
            <Input name="oldPassword" type="password" label="Kata Sandi Lama" />
            <Input name="newPassword" type="password" label="Kata Sandi Baru" />
            <Button type="submit" variant="secondary">
              {state.loading.password
                ? "Memperbarui..."
                : "Perbarui Kata Sandi"}
            </Button>
            {state.messages.password && (
              <div className={styles.profile__main__password__message}>
                *{state.messages.password}
              </div>
            )}
          </form>
        </div>
      </div>
    </MemberLayout>
  );
};

export default ProfileMemberView;
