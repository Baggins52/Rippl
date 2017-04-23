# Rippl

## A web application that renders sentiment analyses for user-inputted Twitter handles, locations, and topics within locations.

![Alt text](public/img/examplescreen.png)
### Getting Started
To get started, you will need some API keys to make everything work.  Please get API keys for the following:

1. https://dev.twitter.com/
2. https://www.havenondemand.com/

Once you have API keys, remove the .example from haven.example.js and twitter.example.js and add your API keys into these files.

Once you have those two files setup, run `npm install` to install requisite packages.

Create a MySQL database with: 
```javascript
CREATE DATABASE rippl;
```
Then run 
```javascript
npm run server
```
to start up your local express server.  From there, run 
```javascript
npm run dev-react
```
to load up all of your react files.

Finally, run 
```javascript
npm run twitterscript
```
Once all these commands have been run, navigate to localhost:3000 to use the app.  From here, you are able to get a Rippl score for any twitter user.
