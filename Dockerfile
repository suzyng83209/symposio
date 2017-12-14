FROM suzyng83209/fluent-ffmpeg

# FROM IMAGE:
# - ffmpeg(compiled)
# - python 3.4
# - node 8.x
# - fluent-ffmpeg
# - build/web essentials

ENV REACT_APP_URL=https://symposio.stream
ENV BASE_URL=https://symposio.stream

COPY . /app

WORKDIR /app

RUN npm install && \
    npm run build-app

CMD [ "npm", "start" ]
