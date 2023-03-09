# Projet 6 OpenClassRooms : “PIQUANTE”

## Description

This “backend” code is a node.js application which allow users to create a profile and publish spicy
sauce recipe with an Express app instance and connecting to the MongoDB Atlas cluster using
Mongoose.

## Security features used :

* ### Hashing passwords: ### 
bcrypt library to hash user passwords before storing them in the database.
Hashing is a one-way encryption technique that ensures that even if the database is compromised,
the passwords cannot be easily decrypted.
* ### Password validation: 
includes a password validation function that checks if the user&#39;s chosen
password meets specific criteria (length, uppercase, lowercase, digits, etc.) before allowing it to be
used.
* ### Masking user data: 
maskdata library to mask sensitive user data, such as email addresses, in the
response messages sent back from the API.
* ### Json Web Tokens (JWT) for authentication: 
    to authenticate users and protect sensitive API
endpoints. JWT allows users to securely transmit authentication tokens between the client and
server, which can then be used to authorize future requests
* There is also a DDOS feature which at the moment I did not implement fully since mongo db already
provide a solution for it.

## Getting Started

### Dependencies

* node.js 
* angular cli 
* npm packet manager


### Installing

* Step 1 : Download the backend folder to the same folder as the frontend

* Step 2 : make sure you have node.js installed globally
  If not you can do : 
```
npm install -g node.js
```
Or download it from the official website https://nodejs.org/en/ and follow the instructions
( I highly recommend to install a version manager for node.js , to avoid going mental about which
version you have installed )

* Step 3 : install the dependencies
   take the root of the folder and open it in a terminal , then type 
```
npm install
```
   this command will install all dependencies needed from the json file provided in the folder.
   Normally the npm install will install nodemon but in some case ( node.js can be
sometimes a hassle for this ) you will have to reinstall it globally so just type 
```
npm i -g nodemon
```
and you’ll be good to go .

* Step 4 : how to connect to your mongo database , you’ll find in the .env file the different elements
you need to complete to successfully connect to mongo db :
```
MONGO_USER = "YOUR USER NAME"
MONGO_PASSWORD = "MONGO PASSWORD TO YOUR DATABASE"
MONGO_IP       = "Start with the @ ends with the /?"
TOKEN          = "you’ll need to create a token of your own"
TOP_SECRET     = "you’ll need to create a “top secret“ of your own"
JWT_KEY        = "you’ll need to provide a key of your own"
PORT           = "the port your intend to use ( keep in mind that the default is 3000 in general)"
```

Exemple of a mongodb connection string :

mongodb+srv://diego:&lt;password&gt;@cluster0.kcruy9p.mongodb.net/?retryWrites=true&amp;w=majority
you’ll need to complete the .env file with the data corresponding to your database to be able to
connect keep a eye for typo error when filling the different elements of your mongo db data .

### Executing program

* Launch the server and connection to mongo db 
if you respected this “how to” you only
need to tape 
```
nodemon server.js
```
and you’ll have a message in the terminal confirming the
connection to the mongo db data base , and confirmation of the port used.
( reminder : to launch the frontend you need to type : you should have a terminal message “application successfully compiled” if everything goes
right^^ )

```
ng serve
```
in the terminal from the root of the
frontend folder, don’t forget to 
```
npm install
```
for this folder to install the dependencies needed for the
frontend 

## Help

Any advise for common problems or issues.
```
check the terminal for error message or the console in dev mode in chrome/firefox/opera
```

## Authors
diego JULIA aka @HolyPandaRoux

## License

This project is licensed under the MIT License

