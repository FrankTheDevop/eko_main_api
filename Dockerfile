FROM fdsmedia/lbdocker:v1.0.0-3

# Add application folder
RUN mkdir /app
WORKDIR /app

# Add package.json and install deps
ADD package.json /app/package.json
RUN npm install

COPY . .

# Expose the listening port
EXPOSE 1235

# Start the server
CMD ["pm2-docker", "start", "process.yml"]
