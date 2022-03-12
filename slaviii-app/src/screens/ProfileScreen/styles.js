import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    backgroundColor: "salmon",
  },
  headerContent: {
    padding: 28,
    alignItems: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 500,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    color: "#FFFFFF",
    // fontWeight: "600",
    fontFamily: "Kanit",
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    // flex: 1,
    alignItems: "center",
    padding: 30,
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#DCDCDC",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    padding: 10,
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
    backgroundColor: "lightgrey",
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: "600",
    color: "#222",
    fontSize: 18,
    width: 170,
  },
  mblTxt: {
    fontWeight: "200",
    color: "#777",
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  msgTxt: {
    fontWeight: "400",
    color: "#008B8B",
    fontSize: 12,
    marginLeft: 15,
  },
});
