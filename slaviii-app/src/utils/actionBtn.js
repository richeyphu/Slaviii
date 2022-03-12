import { Feather, Ionicons } from "@expo/vector-icons";

export const homeActions = [
  {
    text: "Add Pet Profile",
    icon: <Ionicons name="paw-outline" size={24} color="white" />,
    name: "bt_pet",
    position: 1,
    color: "#C84132",
  },
  {
    text: "Add Alarm",
    icon: <Feather name="bell" size={24} color="white" />,
    name: "bt_alarm",
    position: 2,
    color: "#C84132",
  },
];

export const profileActions = [
  {
    text: "Announcement",
    icon: <Ionicons name="megaphone-outline" size={24} color="white" />,
    name: "bt_annoucement",
    position: 1,
    color: "#C84132",
  },
  {
    text: "Edit Profile",
    icon: <Feather name="edit" size={24} color="white" />,
    name: "bt_editprofile",
    position: 2,
    color: "#C84132",
  },
  {
    text: "Add Pet Profile",
    icon: <Ionicons name="paw-outline" size={24} color="white" />,
    name: "bt_pet",
    position: 3,
    color: "#C84132",
  },
  {
    text: "Log out",
    icon: <Feather name="log-out" size={24} color="white" />,
    name: "bt_logout",
    position: 4,
    color: "#C84132",
  },
];
