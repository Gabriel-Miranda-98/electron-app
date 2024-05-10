#!/bin/bash

# Definindo a variável de ambiente para o Oracle Instant Client

# Atualizando os pacotes e instalando as dependências necessárias
apt-get update
apt-get install -y libpq-dev zlib1g-dev build-essential shared-mime-info libaio1 libaio-dev unzip wget --no-install-recommends

# Baixando arquivos necessários do Oracle Instant Client
wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-sdk-linux.x64-21.4.0.0.0dbru.zip
wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip
wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-basic-linux.x64-21.4.0.0.0dbru.zip

# Criando o diretório para o Oracle Instant Client
mkdir -p /opt/oracle

# Movendo arquivos baixados para o diretório criado
mv instantclient-* /opt/oracle/

# Entrando no diretório do Oracle Instant Client
cd /opt/oracle

# Descompactando os arquivos baixados
unzip instantclient-basic-linux.x64-21.4.0.0.0dbru.zip
unzip instantclient-sdk-linux.x64-21.4.0.0.0dbru.zip
unzip instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip

# Removendo arquivos zip e limpando o diretório de instalação
rm -f instantclient-basic-linux.x64-21.4.0.0.0dbru.zip
rm -f instantclient-sdk-linux.x64-21.4.0.0.0dbru.zip
rm -f instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip

# Limpeza final do sistema para remover pacotes não mais necessários
apt-get clean
apt-get remove -y wget unzip
apt-get autoremove -y
rm -rf /var/lib/apt/lists/* /var/cache/apt
export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_4

echo "Oracle Instant Client instalado com sucesso em /opt/oracle."
