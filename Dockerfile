# Pull base image
FROM node:6.11.0

MAINTAINER Venkata krishna "vkvenkat94@gmail.com"

# Copy to work directory
ADD . ./badgeit-front

# Move to work directory
WORKDIR ./badgeit-front

# Install app dependencies
RUN ["npm", "install"]

# Binds to port 8080
EXPOSE  8080

CMD ["npm", "start"]