# FinTrack - Finance Tracker Backend

FinTrack is the backend service for a personal finance tracking application. It provides RESTful API endpoints to manage financial transactions, user accounts, and automated financial tracking features.

## Features
- User authentication and authorization (JWT)

- Transaction management (income/expenses)

- Automated transaction categorization

- Email notifications for important financial events

- Scheduled financial reports

- Secure password storage with bcrypt

- MongoDB database integration

## Technologies Used
- Node.js

- Express.js

- MongoDB (with Mongoose ODM)

- JSON Web Tokens (JWT) for authentication

- Bcrypt for password hashing

- Nodemailer for email notifications

- Node-cron for scheduled tasks

- Axios for external API calls

## Prerequisites
- Node.js (v18 or higher recommended)

- MongoDB (local or cloud instance)

- NPM or Yarn

## Installation
1. Clone the repository:
```
git clone https://github.com/your-username/finance-tracker-backend.git
cd finance-tracker-backend
```
3. Install dependencies:
```
npm install
```
3. Create a .env file in the root directory with the following variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```
4. Start the development server:
```
npm run dev
```
Or for production:
```
npm start
```
## API Documentation
All the APIs starts like this
- **http://localhost:5000/api** Home page of a FinTracker


## Scripts
- **npm start**: Starts the production server

- **nodemon index**: Starts the development server with nodemon

-(Add any other scripts you might have)

## Environment Variables
| Variable       | Description                          | Required |
|----------------|--------------------------------------|----------|
| `MONGO_URI`    | MongoDB connection string           | **Yes**  |
| `JWT_SECRET`   | Secret key for JWT tokens           | **Yes**  |
| `PORT`         | Server port (default: `5000`)       | No       |
| `EMAIL_USER`   | Email account for notifications     | Yes*     |
| `EMAIL_PASS`   | Email account password              | Yes*     |
*Required if using email features

## License
This project is licensed under the ISC License - see the LICENSE file for details.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## Support
For support, please open an issue in the GitHub repository.
