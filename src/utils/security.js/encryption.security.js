import cryptoJs from "crypto-js"

export const generateEncryption = async ({plaintext ="", secretKey=process.env.ENC_SECRET }={})=>{
    return cryptoJs.AES.encrypt(plaintext , secretKey).toString()
}

export const decryptEncryption = async ({cipherText = "" , secretKey=process.env.ENC_SECRET}={})=>{
    return cryptoJs.AES.decrypt(cipherText,secretKey).toString(cryptoJs.enc.Utf8)
}