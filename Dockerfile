###################
# DEVELOPMENT
###################
FROM node:20-alpine As development
WORKDIR /usr/src/app
RUN apk add --no-cache openssl
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npx prisma generate
USER node

###################
# BUILD
###################
FROM node:20-alpine As build
WORKDIR /usr/src/app
RUN apk add --no-cache openssl
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build
ENV NODE_ENV=production
RUN npm ci --omit=dev && npm cache clean --force
USER node

###################
# PRODUCTION
###################
FROM node:20-alpine As production
WORKDIR /usr/src/app
RUN apk add --no-cache openssl
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma


# 👇 Prisma needs to generate client here too
RUN npx prisma generate

CMD ["npm", "run", "start:prod"]
