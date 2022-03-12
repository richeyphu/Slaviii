import { StyleSheet } from "react-native";

export default StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    backgroundColor: "lightsalmon",
  },
  cardHeaderText: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 30,
    bottom: 5,
  },
  cardHeaderTime: {
    flex: 1,
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 40,
  },
  cardBody: {
    backgroundColor: "lightsalmon",
  },
  cardBodyText1: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 95,
    bottom: 15,
  },
  cardBodyText2: {
    fontSize: 16,
    marginLeft: 95,
    bottom: 10,
  },
  cardBodySwitch: {
    transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }],
    marginRight: 15,
  },
  cardPic: {
    borderRadius: 100,
    width: 75,
    height: 75,
    backgroundColor: "lightgrey",
    position: "absolute",
    left: 15,
    bottom: 10,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    bottom: 25,
  },
  welcomeText1: {
    fontWeight: "bold",
    fontSize: 30,
  },
  welcomeText2: {
    marginTop: 10,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 150,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    marginBottom: 10,
  },
  arrow: {
    tintColor: "salmon",
    width: 150,
    height: 150,
    position: "absolute",
    right: 80,
    bottom: 40,
  },
});
