FROM node:slim
# Create app directory from where subsequent commands will be executed
WORKDIR /app
# Copy package.json to the app directory and install dependencies
COPY package*.json /app
RUN npm install

# Copy all files from the current directory to the app directory
COPY . /app

#Run the app
CMD ["npm", "start"]