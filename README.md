# Symposium
Quality Interview Video Chat Application and Transcript Generator.

## Run Development
```
// cd into react-app
cd interview-app; yarn start
```
```
// in root folder
yarn start
```

Go to localhost:3000 or react-app port to view changes

## Run Production
```
// cd into react-app
yarn build
```

```
// in root folder
yarn start
```

# Run Docker
```
docker build --tag <image-name> ./

docker run -p 9000:9000 -it <image-name>
```

Go to localhost:9000 or express-app port to view changes

# Run Docker on EC2
```
// pull directly from docker hub
docker run -dit -p 80:9000 -e REACT_APP_URL=https://symposio.stream BASE_URL=https://symposio.stream suzyng83209/symposio
```
