import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  formContainer: {
    flexDirection: "row",
    height: 80,
    marginTop: 40,
    marginBottom: 20,
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: "salmon",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  listContainer: {
    // width: "95%",
    // marginTop: 20,
    padding: 20,
  },
  annoucementContainer: {
    marginTop: 16,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  annoucementText: {
    fontSize: 20,
    color: "#333333",
  },
  headerContent: {
    width: "100%",
    padding: 30,
    alignItems: "center",
    backgroundColor: "salmon",
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 150,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },
});
