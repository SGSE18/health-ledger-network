mkdir certificates
mkdir certificates/newcerts

touch certificates/index.txt
hexdump -n 16 -e '4/4 "%08X" 1 "\n"' /dev/random > certificates/serial

openssl req -config openssl.cnf -nodes -new -newkey ec:<(openssl ecparam -name prime256v1) -keyout $1.key -sha256 -out $1.csr
openssl ca -config openssl.cnf -in $1.csr -out $1.crt -extensions v3_ca -md sha256
openssl x509 -inform PEM -outform PEM -in $1.crt -out $1.pem

rm -f $1.csr
rm -f $1.crt

rm -rf certificates
