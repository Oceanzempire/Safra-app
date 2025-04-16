import CryptoJS from "crypto-js"

/**
 * Encrypts data using AES encryption
 * @param data The data to encrypt
 * @param key The encryption key
 * @returns Encrypted string
 */
export const encryptData = (data: string, key: string): string => {
  // Create a consistent key by hashing the provided key
  const hashedKey = CryptoJS.SHA256(key).toString()

  // Encrypt the data using AES
  const encrypted = CryptoJS.AES.encrypt(data, hashedKey).toString()

  return encrypted
}

/**
 * Decrypts data using AES encryption
 * @param encryptedData The encrypted data
 * @param key The decryption key
 * @returns Decrypted string
 */
export const decryptData = (encryptedData: string, key: string): string => {
  // Create a consistent key by hashing the provided key
  const hashedKey = CryptoJS.SHA256(key).toString()

  // Decrypt the data
  const decrypted = CryptoJS.AES.decrypt(encryptedData, hashedKey).toString(CryptoJS.enc.Utf8)

  return decrypted
}
