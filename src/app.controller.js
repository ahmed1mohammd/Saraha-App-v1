import path from 'node:path';
import * as dotenv from 'dotenv';
dotenv.config({});
import cors from 'cors';
import express from 'express';
import connectDB from './DB/connection.js';
import authController from './modules/auth/auth.controller.js';
import { globalErrorHandling } from './utils/response.js';
import userController from './modules/user/user.controller.js';
import messageController from './modules/message/message.controller.js';
import { startTokenCleanupCron } from './utils/security.js/token.security.js';
import morgan from 'morgan';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

const app = express();

// DB connection
await connectDB();
startTokenCleanupCron();

app.use(cors());
app.use(helmet());
app.use(morgan('common'));

const limit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 200
});
app.use(limit);

app.use("/uploads", express.static(path.resolve('./src/uploads')));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send(`<!doctype html>
  <html lang="en"><head><meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Saraha App</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; margin: 0; }
    body{min-height:100dvh;display:grid;place-items:center;background:#000;}
    h1{color:#8B0000;font:600 clamp(28px,6vw,64px)/1.1 system-ui,Segoe UI,Roboto,Arial,sans-serif;text-align:center;}
  </style></head>
  <body><h1>Welcome To Saraha App <br> backEnd 🤖🚀 </h1></body></html>`));
app.use("/auth", authController);
app.use("/user", userController);
app.use("/message", messageController);

// Error Handling
app.use(globalErrorHandling);


// app.listen(port, () => console.log(`Server running on port ${port}🚀✅`))


export default app;
