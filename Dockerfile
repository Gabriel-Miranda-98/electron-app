# Usa a imagem base node:lts-slim
FROM node:lts-slim

# Define o usuário root para a instalação de pacotes
USER root

# Atualiza os pacotes e instala as dependências necessárias para o Electron e outras ferramentas
RUN apt-get update && apt-get install -y \
    build-essential \
    clang \
    libdbus-1-dev \
    libgtk-3-dev \
    libnotify-dev \
    libasound2-dev \
    libcap-dev \
    libcups2-dev \
    libxtst-dev \
    libxss1 \
    libnss3-dev \
    gcc-multilib \
    g++-multilib \
    curl \
    gperf \
    bison \
    python3-dbusmock \
    default-jre

# Troca de volta para o usuário 'node' para evitar a execução como root
USER node

# Define o diretório de trabalho
WORKDIR /home/node/app/electron-app

# Expõe a porta 3333 se necessário (dependendo da aplicação)

# Mantém o container rodando em modo de espera
CMD ["tail", "-f", "/dev/null"]
