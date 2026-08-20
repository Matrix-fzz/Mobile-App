// styles/auth.styles.js
import { Dimensions, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "center",
  },
  illustration: {
    width: 300,
    height: 310,
    contentFit: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginVertical: 15,
    textAlign: "center",
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.text,
  },
  errorInput: {
    borderColor: COLORS.expense,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginBottom: 10,
    gap: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "600",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    color: COLORS.text,
    fontSize: 16,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  verificationContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
    textAlign: "center",
  },
  verificationInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.text,
    width: "100%",
    textAlign: "center",
    letterSpacing: 2,
  },

  // 🔴 Error styles
  errorBox: {
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.expense,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  errorText: {
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  divider: {
    borderTopColor: COLORS.primary,
    borderTopWidth: StyleSheet.hairlineWidth,
    width: '80%',
    backgroundColor: COLORS.primary,
    height: 2,
    borderRadius: "50%",
    marginTop: 10,
    marginBottom: 15,
    alignSelf: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 7,
    top: 7,
    padding: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 30,
  },
  imageContainer: {
    height: height * 0.3,

    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 500,
    height: 320,
  },

});