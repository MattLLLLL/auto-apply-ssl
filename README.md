1. create account.key
>> openssl genpkey -algorithm RSA -out account.key -pkeyopt rsa_keygen_bits:2048

2. modify "config.js"

3. npm run dev
