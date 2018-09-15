# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:8

# Install and configure `serve`.
RUN npm install -g serve
CMD serve -s build
EXPOSE 5000

# Install all dependencies of the current project.
COPY package.json package.json
RUN npm install

# Copy all local files into the image.
COPY . .

# environment variable for build
ARG SWAGGER_SPEC
ENV REACT_APP_SWAGGER_SPEC ${SWAGGER_SPEC}
ARG SWAGGER_UI
ENV REACT_APP_SWAGGER_UI ${SWAGGER_UI}
ARG SWAGGER_ENDPOINT
ENV REACT_APP_SWAGGER_ENDPOINT ${SWAGGER_ENDPOINT:-http://localhost:8888/v1}

# Build for production.
RUN npm run build --production
