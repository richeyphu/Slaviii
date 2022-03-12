import { StyleSheet } from "react-native";

export default StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    backgroundColor: "lightsalmon",
  },
  cardHeaderText: {
    flex: 1,
    // fontWeight: "bold",
    fontFamily: "KanitBold",
    fontSize: 30,
    bottom: 5,
  },
  cardHeaderTime: {
    flex: 1,
    textAlign: "right",
    // fontWeight: "bold",
    fontFamily: "KanitBold",
    fontSize: 40,
  },
  cardBody: {
    backgroundColor: "lightsalmon",
  },
  cardBodyText1: {
    fontSize: 22,
    // fontWeight: "bold",
    fontFamily: "KanitBold",
    marginLeft: 95,
    bottom: 15,
  },
  cardBodyText2: {
    fontFamily: "Kanit",
    fontSize: 18,
    marginLeft: 95,
    bottom: 10,
  },
  cardBodySwitch: {
    transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }],
    marginRight: 15,
  },
  cardPic: {
    borderRadius: 100,
    width: 80,
    height: 80,
    backgroundColor: "lightgrey",
    position: "absolute",
    left: 15,
    bottom: 15,
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
