# base image
FROM node:latest

# Create and change to the app directory.
WORKDIR /usr/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY . .

# Install production dependencies.

# If you add a package-lock.json, speed your build by switching to 'npm ci'.
RUN npm install --save-dev

# Copy local code to the container image.

RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "run", "cloudrunstart" ]

#https://www.youtube.com/watch?v=v202rmUuBis&ab_channel=StrayKids
