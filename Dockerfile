# # Usa a imagem base node:lts-slim
# FROM node:lts-slim

# # Define o usuário root para a instalação de pacotes
# USER root

# Atualiza os pacotes e instala as dependências necessárias para o Electron e outras ferramentas
# RUN apt-get update && apt-get install -y \
#     build-essential clang libdbus-1-dev libgtk-3-dev libnotify-dev \
#     libasound2-dev libcap-dev libcups2-dev libxtst-dev \
#     libxss1 libnss3-dev gcc-multilib g++-multilib curl \
#     gperf bison python3-dbusmock default-jre libcanberra-gtk-module \
#     libcanberra-gtk3-module libpq-dev zlib1g-dev shared-mime-info \
#     libaio1 libaio-dev xvfb dbus-x11 dbus  && \
#     apt-get clean && \
#     apt-get autoremove -y && \
#     rm -rf /var/lib/apt/lists/* /var/cache/apt

#     RUN apt-get update && \
#     apt-get install -y libpq-dev zlib1g-dev build-essential shared-mime-info libaio1 libaio-dev unzip wget --no-install-recommends && \
#     wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-sdk-linux.x64-21.4.0.0.0dbru.zip && \
#     wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip && \
#     wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-basic-linux.x64-21.4.0.0.0dbru.zip && \
#     mkdir -p /opt/oracle && \
#     cp instantclient-* /opt/oracle/ && \
#     cd /opt/oracle/ && \
#     unzip instantclient-basic-linux.x64-21.4.0.0.0dbru.zip && \
#     unzip instantclient-sdk-linux.x64-21.4.0.0.0dbru.zip && \
#     unzip instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip && \
#     rm -rf /var/lib/apt/lists/* instantclient-basic-linux.x64-21.4.0.0.0dbru.zip instantclient-sdk-linux.x64-21.4.0.0.0dbru.zip instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip && \
#     apt -y clean && \
#     apt -y remove wget unzip && \
#     apt -y autoremove && \
#     rm -rf /var/cache/apt



# # Configura variáveis de ambiente para Oracle Instant Client
# ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_21_4
# COPY .docker/start.sh /usr/local/bin/

# ENTRYPOINT ["/usr/local/bin/start.sh"]


# # Troca de volta para o usuário 'node' para evitar a execução como root
# USER node

# # Define o diretório de trabalho
# WORKDIR /home/node/app/electron-app


# CMD [ "tail" ,"-f","/dev/null" ]


# Usando a versão mais recente do Debian
FROM node:lts-slim

# Atualizando pacotes e instalando os necessários para configurar locales
RUN apt-get update && apt-get install -y \
    locales \
    dbus-x11 \
    libcanberra-gtk-module \
    build-essential clang libdbus-1-dev libgtk-3-dev libnotify-dev \
    libasound2-dev libcap-dev libcups2-dev libxtst-dev \
    libxss1 libnss3-dev gcc-multilib g++-multilib curl \
    gperf bison python3-dbusmock default-jre libcanberra-gtk-module \
    libcanberra-gtk3-module libpq-dev zlib1g-dev shared-mime-info \
    libaio1 libaio-dev xvfb  && \
    apt-get clean && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt


RUN usermod -a -G video node
ENV NVIDIA_VISIBLE_DEVICES all
ENV NVIDIA_DRIVER_CAPABILITIES compute,utility
# Gerando um UUID universalmente único para o container
RUN dbus-uuidgen > /etc/machine-id

USER node