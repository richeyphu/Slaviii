import { StyleSheet } from "react-native";

export default StyleSheet.create({
  headerContent: {
    padding: 30,
    alignItems: "center",
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 500,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    marginBottom: 10,
    backgroundColor: "darkgray",
  },
  timeLabel: {
    fontSize: 50,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 30,
  },
  loadingIndicator: {
    zIndex: 5,
    width: "100%",
    height: "100%",
  },
});
