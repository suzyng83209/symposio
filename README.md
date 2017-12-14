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

## Run Docker
```
docker build --tag <image-name> ./

docker run -p 9000:9000 -it <image-name>
```

Go to localhost:9000 or express-app port to view changes

## Run Docker on EC2
```
// pull directly from docker hub
docker run -d -p 80:9000 suzyng83209/symposio
```

# Details
Symposio is composed of an un-ejected create-react-app front-end and a NodeJS backend. To run it locally, ffmpeg needs to be installed on your machine.
Alternatively, build the Docker Image and run it 

Symposio does the following:
### Video Streaming
This is done using WebRTC and the WebRTC wrapper RTCMultiConnection. Socket is handled by the wrapper.

### Messaging
This is also done using WebRTC and RTCMultiConnection. RTCMultiConnection is able to send and receive messages with data when `sessions.data = true`

### Recording
This is done using WebRTC and RecordRTC which instantiates a recorder from a WebRTC stream and records it to `audio/webm` format.

### Merging Local and Remote Audio Files
FFmpeg has a node wrapper, fluent-ffmpeg, that still requires ffmpeg to be installed on the server. Instantiate ffmpeg(), pass in input files, specify filterComplex(), and pass in output.

### Generate Transcript (Single and Combined)
Symposio uses Watson Developer Cloud: speech to text v1. We use timestamps to massage the returned transcript into continuous chunks then write those chunks to a .txt file.

For Combined transcripts, we generate transcripts for both recordings, zip them together, sort by the start time, and write them into a file where each line is prepended with the type of recording: `[LOCAL|REMOTE]`

### Inviting Guests
Symposio uses Mailgun API to send email invitations to people that the Interviewer wishes to interview.

### Password-validated rooms / private rooms
TODO

### Video Recording
TODO

### Share
TODO

# Hosting
Symposio is hosted in a secure environment.
#### Docker: download and install ffmpeg. Provide localdisk to save tmp files
#### Amazon EC2 Linux AMI: pull docker image and run mapping port 80 to 9000 (internal app port)
#### Cloudflare: DNS, Caching, and SSL services.
