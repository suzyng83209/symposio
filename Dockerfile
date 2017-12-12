FROM suzyng83209/fluent-ffmpeg

# FROM IMAGE:
# - ffmpeg(compiled)
# - python 3.4
# - node 8.x
# - fluent-ffmpeg
# - build/web essentials

ENV BASE_URL=localhost:9000

COPY . /app

WORKDIR /app

RUN npm install && \
    npm run build-app && \
    chmod +x docker/start.sh

CMD [ "sh", "docker/start.sh" ]
