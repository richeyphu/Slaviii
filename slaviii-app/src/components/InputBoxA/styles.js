import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
  inputBox: {
    width: "100%",
    flexDirection: 'row',
    overflow: "hidden",
    alignItems: 'center',
  },
  inputField: {
    padding: 8,
    width: "90%",
  }
});
