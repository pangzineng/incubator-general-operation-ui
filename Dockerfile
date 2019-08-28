# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:10-alpine

# Install all dependencies of the current project.
COPY package.json package.json
RUN npm install

# Copy all local files into the image.
COPY . .

# environment variable for build
ARG AUTH_ENDPOINT
ENV REACT_APP_AUTH_ENDPOINT ${AUTH_ENDPOINT:-http://localhost:8080}

# Build for production.
RUN npm run build --production

FROM node:10-alpine

COPY --from=0 build build

# Install and configure `serve`.
RUN npm install -g serve
CMD serve -s build
EXPOSE 5000
