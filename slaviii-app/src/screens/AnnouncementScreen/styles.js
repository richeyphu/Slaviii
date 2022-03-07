import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
  cardHeader: {
    flexDirection: "row",
    // backgroundColor: "lightsalmon",
  },
  cardHeaderText: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 30,
  },
  cardBody: {
    // backgroundColor: "lightsalmon",
  },
  cardBodyText: {
    // fontSize: 18,
  },
  cardBodySwitch: {
    transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }],
    marginRight: 15,
  },
  cardFooterTime: {
    flex: 1,
    textAlign: "right",
  },
});
