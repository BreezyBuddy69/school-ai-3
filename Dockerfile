# LG KI 2.0 — Multi-Stage-Build, Next standalone, non-root, Port 8100.
# node:24-alpine: node:sqlite ist dort stabil — null native Dependencies.

# ── Stage 1: Build ────────────────────────────────────────────────────────
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# basePath muss beim BUILD feststehen (z.B. /lgai für halovisionai.cloud/lgai).
ARG NEXT_PUBLIC_BASE_PATH=
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH
# Ebenso die App-URL: Next inlined NEXT_PUBLIC_* beim Build, env_file wirkt
# darauf nicht mehr (Verifizierungs-Mails zeigten sonst auf localhost:8100).
ARG NEXT_PUBLIC_APP_URL=
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
RUN npm run build

# ── Stage 2: Runtime ──────────────────────────────────────────────────────
FROM node:24-alpine
ENV NODE_ENV=production \
    PORT=8100 \
    HOSTNAME=0.0.0.0 \
    DATA_DIR=/data

RUN mkdir -p /data && chown node:node /data
USER node
WORKDIR /app

# Next-standalone: server.js + minimale node_modules
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
# Fachinhalte + Curriculum werden zur Laufzeit vom Dateisystem gelesen
COPY --from=build --chown=node:node /app/data/subjects ./data/subjects
COPY --from=build --chown=node:node /app/data/curriculum ./data/curriculum

# SQLite (Nutzer, Codes, Chats — die Wahrheit) liegt im Volume /data
VOLUME ["/data"]

EXPOSE 8100

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8100/api/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
