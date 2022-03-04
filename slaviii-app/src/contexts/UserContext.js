import React, { useState } from "react";

export const userStoreContext = React.createContext();

const UserStoreProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  // กำหนดตัวแปร userStore เพื่อเก็บข้อมูล profile ทั้งหมด
  const userStore = {
    profile: profile,
    updateProfile: (profile) => {
      setProfile(profile);
    },
  };
  return (
    <userStoreContext.Provider value={userStore}>
      {children}
    </userStoreContext.Provider>
  );
};

export default UserStoreProvider;
