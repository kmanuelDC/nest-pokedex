# Etapa 1: Instalar dependencias (incluye devDependencies para build)
FROM node:18-alpine3.15 AS deps

# Añadir compatibilidad con libc si fuera necesario
RUN apk add --no-cache libc6-compat

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instalar TODAS las dependencias (incluye Nest CLI y TypeScript)
RUN npm install


# Etapa 2: Compilar la aplicación
FROM node:18-alpine3.15 AS builder

WORKDIR /app

# Copiar node_modules desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar todo el código fuente
COPY . .

# Compilar la aplicación
RUN npm run build


# Etapa 3: Imagen de producción
FROM node:18-alpine3.15 AS runner

WORKDIR /usr/src/app

# Copiar archivos necesarios para instalar solo dependencias de producción
COPY package.json package-lock.json ./
COPY .env* ./

# Instalar solo dependencias de producción
RUN npm install --omit=dev

# Copiar la carpeta compilada desde el builder
COPY --from=builder /app/dist ./dist

# (Opcional) Copiar archivo .env si lo usas
# COPY .env ./

# Puerto expuesto (ajusta si tu app usa otro)
EXPOSE 3000

# Comando de arranque
CMD ["node", "dist/main"]
