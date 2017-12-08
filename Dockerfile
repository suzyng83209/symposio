FROM suzyng83209/fluent-ffmpeg

# FROM IMAGE:
# - ffmpeg(compiled)
# - python 3.4
# - node 8.x
# - fluent-ffmpeg
# - build/web essentials

COPY . /app

WORKDIR /app

RUN npm install && \
    npm run build-app

CMD [ "npm", "start" ]
