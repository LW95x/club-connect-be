## Hosted version

https://the-football-pyramid-backend.onrender.com/api/

## Backend repository

https://github.com/LW95x/club-connect-be/

## Description

- This API is designed for the buying and selling of tickets to matches (events), as a mediator to Non-League Football Clubs in the United Kingdom.
- The project utilises a PSQL database, structured with four distinct tables: two for user-specific tables (fans and clubs), one for events (created by clubs), and one for orders (created by fans).
- This backend has been developed using Node.js and the Express framework, with TypeScript employed to ensure for type safety across all endpoints.
- BCrypt has been integrated to securely hash user passwords, while Joi has been utilised to ensure all request properties are thoroughly validated through comprehensively designed schemas before reaching the database.
- All API endpoints have been thoroughly tested using JEST and Supertest, adhering to Test Driven Development (TDD) principles throughout all phases of development.

## Cloning, Dependencies, Seeding, and Testing Instructions

- Installing dependencies: You will need to run the script ```npm install```

- Seeding Instructions: You will need to run the script ```npm run seed```

- Local Hosting Instructions: You will need to run the script ```npm run start```

- Testing Instructions: You will need to run the script ```npm run test```

## ClubConnect frontend 

https://github.com/LW95x/club-connect-fe/

https://clubconnects.netlify.app/
