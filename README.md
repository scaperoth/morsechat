# Morse Chat

Chat application created using react that requires [morse chat api](https://github.com/scaperoth/morsechatapi).

The way the chat works is it sends a socket message to the server with socket.io. The message sent is turned into morse code and returned to client where it is added to the message list. 

## Requirements
- Node v10.12
- Yarn

## Starting App

In the project directory, you can run:

### `yarn start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### TODO

- check and protect against multiple users with same username logging in
- clear history after so many messages
