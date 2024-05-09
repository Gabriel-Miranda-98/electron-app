# # Usa a imagem base node:lts-slim
# FROM node:lts-slim

# # Define o usuário root para a instalação de pacotes
# USER root

# # Atualiza os pacotes e instala as dependências necessárias para o Electron e outras ferramentas
# RUN apt-get update && apt-get install -y \
#     build-essential clang libdbus-1-dev libgtk-3-dev libnotify-dev \
#     libasound2-dev libcap-dev libcups2-dev libxtst-dev \
#     libxss1 libnss3-dev gcc-multilib g++-multilib curl \
#     gperf bison python3-dbusmock default-jre libcanberra-gtk-module \
#     libcanberra-gtk3-module libpq-dev zlib1g-dev shared-mime-info \
#     libaio1 libaio-dev unzip wget xvfb dbus-x11 --no-install-recommends && \
#     wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-sdk-linux.x64-21.4.0.0.0dbru.zip && \
#     wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip && \
#     wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-basic-linux.x64-21.4.0.0.0dbru.zip && \
#     mkdir -p /opt/oracle && \
#     unzip '*.zip' -d /opt/oracle && \
#     rm -rf /var/lib/apt/lists/* *.zip && \
#     apt-get clean && \
#     apt-get autoremove -y && \
#     rm -rf /var/cache/apt
# USER node

# WORKDIR /home/node/app/electron-app

# CMD ["tail", "-f","/dev/null"]


# Usa a imagem base node:lts-slim
FROM node:lts-slim

# Define o usuário root para a instalação de pacotes
USER root

# Atualiza os pacotes e instala as dependências necessárias para o Electron e outras ferramentas
RUN apt-get update && apt-get install -y \
    build-essential clang libdbus-1-dev libgtk-3-dev libnotify-dev \
    libasound2-dev libcap-dev libcups2-dev libxtst-dev \
    libxss1 libnss3-dev gcc-multilib g++-multilib curl \
    gperf bison python3-dbusmock default-jre libcanberra-gtk-module \
    libcanberra-gtk3-module libpq-dev zlib1g-dev shared-mime-info \
    libaio1 libaio-dev xvfb dbus-x11 --no-install-recommends

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_21_4

RUN apt-get update && \
        apt-get install -y libpq-dev zlib1g-dev build-essential shared-mime-info libaio1 libaio-dev unzip wget --no-install-recommends && \
        wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-sdk-linux.x64-21.4.0.0.0dbru.zip && \
        wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip && \
        wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-basic-linux.x64-21.4.0.0.0dbru.zip && \
        mkdir -p /opt/oracle && \
        cp instantclient-* /opt/oracle/ && \
        cd /opt/oracle/ && \
        unzip instantclient-basic-linux.x64-21.4.0.0.0dbru.zip && \
        unzip instantclient-sdk-linux.x64-21.4.0.0.0dbru.zip && \
        unzip instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip && \
        rm -rf /var/lib/apt/lists/* instantclient-basic-linux.x64-21.4.0.0.0dbru.zip instantclient-sdk-linux.x64-21.4.0.0.0dbru.zip instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip && \
        apt -y clean && \
        apt -y remove wget unzip && \
        apt -y autoremove && \
        rm -rf /var/cache/apt

# Limpa cache e arquivos temporários para reduzir o tamanho da imagem
RUN apt-get clean && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt



# Troca de volta para o usuário 'node' para evitar a execução como root
USER node

# Define o diretório de trabalho
WORKDIR /home/node/app/electron-app

# Comando padrão (alterar conforme necessário para iniciar sua aplicação Electron)
CMD ["tail", "-f", "/dev/null"]

