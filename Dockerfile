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

RUN if [ -f '/interview-app/.env' ]; then sed "s#localhost:3000#${BASE_URL}#g" /interview-app/.env; fi
RUN npm install && \
    npm run build-app

CMD [ "npm", "start" ]
