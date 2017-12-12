# !/bin/bash

echo $BASE_URL

if [ -f '/interview-app/.env' ]; then sed -i "s#localhost:3000#${BASE_URL}#g" ./interview-app/.env; fi
if [ -f '.env' ]; then sed -i "s#localhost:9000#${BASE_URL}#g" .env; fi

nohup npm start &

/bin/bash
