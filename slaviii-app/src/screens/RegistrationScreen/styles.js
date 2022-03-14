import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    flex: 1,
    height: 150,
    width: 150,
    alignSelf: "center",
    margin: 30,
    tintColor: "#6B1C12",
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#2e2e2d",
  },
  footerLink: {
    color: "salmon",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorView: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  errorText: {
    fontSize: 16,
    color: "tomato",
  },
});
