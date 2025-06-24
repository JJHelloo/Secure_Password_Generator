// Justin Johnson * 6/24/25

// Generates a secure password using cryptographic randomness
// Parameters:
//   length - total password length (default: 12)
//   specialCharCount - how many special characters to include (default: 1)
function generateSecurePassword(length = 12, specialCharCount = 1) {
  // Ensure you don't ask for more special characters than total length
  if (specialCharCount > length) {
    throw new Error("Special character count cannot exceed password length.");
  }

  // Character pools: regular (letters + numbers) and special symbols
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const specials = "!@#$%^&*()";
  const passwordArray = []; // Stores generated characters before shuffling

  // Generate secure random special characters
  const specialValues = new Uint32Array(specialCharCount);
  crypto.getRandomValues(specialValues); // Cryptographically secure randomness
  for (let i = 0; i < specialCharCount; i++) {
    passwordArray.push(specials[specialValues[i] % specials.length]);
  }

  // Generate the rest of the password using regular characters
  const regularCharCount = length - specialCharCount;
  const regularValues = new Uint32Array(regularCharCount);
  crypto.getRandomValues(regularValues);
  for (let i = 0; i < regularCharCount; i++) {
    passwordArray.push(chars[regularValues[i] % chars.length]);
  }

  // Shuffle the password array using Fisher-Yates shuffle
  // Ensures randomness in character position, not just character selection
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  // Join characters into a final string and return it
  return passwordArray.join('');
}

// Handles click event for generating a password and displaying it in the UI
function generate() {
  const length = parseInt(document.getElementById("length").value, 10);
  const specialCount = parseInt(document.getElementById("specialCount").value, 10);
  try {
    const password = generateSecurePassword(length, specialCount);
    document.getElementById("passwordOutput").textContent = password;
  } catch (e) {
    alert(e.message); // Handle errors (e.g., invalid input)
  }
}

// Copies the generated password to the clipboard
function copyToClipboard() {
  const text = document.getElementById("passwordOutput").textContent;
  if (!text) return; // Nothing to copy
  navigator.clipboard.writeText(text)
    .then(() => alert("Password copied to clipboard!"))
    .catch(() => alert("Failed to copy password."));
}
