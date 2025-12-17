export function passwordTutorMessage(strength: string) {
  switch (strength) {
    case "Very Weak":
      return "This password would be guessed almost instantly. Never use passwords like this.";
    case "Weak":
      return "This password offers minimal protection and should be improved.";
    case "Moderate":
      return "Decent, but attackers could still crack it with time.";
    case "Strong":
      return "Good password, but consider increasing length for better security.";
    case "Very Strong":
      return "Excellent! This password follows strong security practices.";
    default:
      return "";
  }
}
