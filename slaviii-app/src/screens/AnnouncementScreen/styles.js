import { StyleSheet } from "react-native";

export default StyleSheet.create({
  announcementContainer: {
    marginTop: 16,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  announcementText: {
    fontSize: 20,
    color: "#333333",
  },
  headerContent: {
    width: "100%",
    padding: 20,
    alignItems: "center",
    backgroundColor: "salmon",
  },
  logo: {
    width: 140,
    height: 140,
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
  cardHeader: {
    flexDirection: "row",
    // backgroundColor: "lightsalmon",
  },
  cardHeaderText: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 28,
  },
  cardBody: {
    // backgroundColor: "lightsalmon",
  },
  cardBodyText: {
    // fontSize: 18,
  },
  cardFooterTime: {
    flex: 1,
    textAlign: "right",
  },
});
