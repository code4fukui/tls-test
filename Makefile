all: server.key server.csr
	openssl x509 -days 3650 -req -extfile san.txt -signkey server.key < server.csr > server.crt
server.key:
	openssl genrsa 2048 > server.key
server.csr: server.key
	openssl req -new -key server.key -subj "/C=JP/ST=Some-State/O=Some-Org/CN=localhost" > server.csr

clean:
	rm -f server.key
	rm -f server.csr
	rm -f server.crt
