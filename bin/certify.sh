#!/bin/bash
# script to create the ssl certificate
SSL_DIR=./ssl
SSL_CNF=$SSL_DIR/openssl.cnf
SSL_KEY=$SSL_DIR/aproxy.key
SSL_CSR=$SSL_DIR/aproxy.csr
SSL_CRT=$SSL_DIR/aproxy.crt

rm $SSL_KEY $SSL_CRT
openssl req -new -nodes -batch -out $SSL_CSR -config $SSL_CNF && \
openssl x509 -req -days 3650 -in $SSL_CSR -signkey $SSL_KEY -out $SSL_CRT \
             -extensions v3_req -extfile $SSL_CNF && \
openssl x509 -text -in $SSL_CRT && \
rm $SSL_CSR
