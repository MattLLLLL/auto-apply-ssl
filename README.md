1. 產生account.ley
openssl genpkey -algorithm RSA -out account.key -pkeyopt rsa_keygen_bits:2048

2. 修改config.js

3. npm run dev