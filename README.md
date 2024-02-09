# Verification Microservice

This service manages verifications related to the Merlin ecosystem using the AWS SNS service (including email and SMS)

Examples:

- A user registers and is asked to verify their email
- Multi-factor authentication using their phone to recieve a MFA code
- A user forgets their password and is sent a recovery link

## Run Locally

Clone the project

```bash
  git clone  https://gitlab.com/merlintechgroup/verification-service/verification-backend.git
```

Go to the project directory

```bash
  cd verification-backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start OR 
  node server.js
```
Create an `.env` file in the root directory

| Key | Description |
| :-------- | :------------------------- |
| `MONGODB_CONNECTION_STRING` | **Required**. MongoDB connection string using the [URI connection scheme](https://www.mongodb.com/docs/manual/reference/connection-string/) |
| `DB_NAME` | **Required**. Name of the MongoDB databse to be used to store all collections |
