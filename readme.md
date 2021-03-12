# Backend Telegram App
---
### What is it?
This is an API application for a telegram-like chat application created using SocketIO, ExpressJS

### Framework and Library used?
1. Bcrypt
   
   Used for hashing the password of the user account.

2. Body Parser
   
   Used for catching form requested via body.

   
3. CORS
   
   Used for controlling an origin of resources.

4. DotEnv
   
   Used for define of server configuration such as Port, DB config and secret key for JWT.

5. ExpressJS
   
   Used for routing and some backend use.

6. JWT
   
   Used to generate a token as an access key of the app.
7. MomentJS
   
   Used for date format.

8. Multer
   
   Used for upload files to the server.
   
9.  MySql2
    
    Used for making connection to SQL database

10. Socket.IO
   
    Used for make realtime request and response from and to server
    
### How To Use ?
1. Clone this repository
2. Don't forget to run `npm install` or `npm i` to install libraries that required for this service
3. Import database
4. Fill ENV :
   - `PORT` = Fill with port that service will be run
   - `DB_HOST` = Fill with hostname in your database configuration
   - `DB_USER` = fill with username in your database configuration
   - `DB_PASS` = fill with password in your database configuration
   - `DB_NAME` = fill with database name
   - `JWT_SECRET` =  fill with the unique value due to signature verifier on JWT
5. Run `npm run start` or `nodemon` for run this service
