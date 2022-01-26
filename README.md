# MessageDrop - live communicator

## Table of contents
* [General info](#general-info)
* [Techstack](#techstack)
* [Setup](#Setup)
* [License](#License)
* [Quick view](#quick-view)

## General info
MessageDrop is a web app allowing you to communicate with others. Conversations are divided into rooms with different permissions. You can create your room and add anyone you want :)

## Techstack
1. Frontend
* [React](https://reactjs.org/)
* [Next.js](https://nextjs.org/)
* [Typescript](https://www.typescriptlang.org/)
* [Sass](https://sass-lang.com/)
* [Graphql](https://graphql.org/)
* [Apollo-Client](https://www.apollographql.com/docs/react/)

2. Backend
* [Nodejs](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Typescript](https://www.typescriptlang.org/)
* [Graphql](https://graphql.org/)
* [Apollo](https://www.apollographql.com/)
* [MongoDB](https://www.mongodb.com/)
* [AWS-S3](https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3)
* [redis](https://redis.io/)
* [Twilio](https://www.twilio.com/)

##Setup
1. Clone the repo
2. Go under `/server` and create `.env` file with variables provided in `.env.example`
3. Repeat second point under `/web`
4. Run `yarn` under `/server` and under `/web` to install all necessary dependencies
5. Run your local redis server
6. In a first terminal run `yarn dev` under `/server`
7. In a second terminal run `yarn dev` under `/web`

## Licence
> You can check out the full license [here](https://github.com/michalwarchol/MessageDrop/blob/main/LICENSE)

## Quick View
### Dashboard of the application. Search for new chats
![Home](https://github.com/michalwarchol/MessageDrop/blob/main/web/src/screens/4.jpg?raw=true "Home")

### Example of a chat room
![Chat](https://github.com/michalwarchol/MessageDrop/blob/main/web/src/screens/2.JPG?raw=true "Chat")

### Profile page. You can change your settings here
![Profile](https://github.com/michalwarchol/MessageDrop/blob/main/web/src/screens/3.JPG?raw=true "Profile")

### Verify your profile after registration
![Verification](https://github.com/michalwarchol/MessageDrop/blob/main/web/src/screens/5.jpg?raw=true "Verification")
