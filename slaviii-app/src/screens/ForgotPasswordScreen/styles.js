import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  logo: {
    flex: 1,
    height: 160,
    width: 160,
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 30,
    tintColor: "#6B1C12",
  },
  errorView: {
    flex: 1,
    alignItems: "flex-start",
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  errorText: {
    fontSize: 16,
    color: "tomato",
  },
});
