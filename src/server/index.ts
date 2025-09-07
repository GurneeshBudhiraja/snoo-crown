import express from 'express';
import { createServer, getServerPort } from '@devvit/web/server';
import { internalRouter, appRouter } from './router/router';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

// Internal routes
app.use('/internal', internalRouter);
app.use('/api', appRouter);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
