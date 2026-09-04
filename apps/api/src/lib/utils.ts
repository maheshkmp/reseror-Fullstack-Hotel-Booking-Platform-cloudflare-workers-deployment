export function generateInviteCode(length: number = 8): string {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed similar looking characters (I, O, 0, 1)
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // Format as XXX-XXX-XX or similar? 
  // Let's keep it simple for now: 8 chars
  return result;
}
