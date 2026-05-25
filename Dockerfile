FROM node:24.0.0

WORKDIR /usr/src/app

# Disable corepack so it does not intercept yarn with the packageManager field,
# then pin yarn to 1.22.19 to match the local dev setup.
RUN corepack disable && npm install -g yarn@1.22.19

# Install dependencies before copying source for better layer caching.
COPY package.json yarn.lock ./
RUN yarn install

COPY . .

# PORT must be set to 3002 to match the Prometheus NodePort scrape config.
# NODE_ENV=development is set by npm run dev via cross-env — no need to set it here.
ENV PORT=3002

EXPOSE 3002

CMD ["npm", "run", "dev"]
