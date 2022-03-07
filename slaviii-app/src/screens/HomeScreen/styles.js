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
  cardBodyText: {
    fontSize: 18,
  },
  cardBodySwitch: {
    transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }],
    marginRight: 15,
  },
});
