# Infinity Task: Application Architecture & Workflow

## Overview
Infinity Task is a high-performance, real-time background job processing service built with **Node.js, TypeScript, Express, BullMQ, Redis**, and **Socket.IO**. 

Its primary purpose is to accept requests to send emails, offload the actual sending process to a background queue for reliability and retry capabilities, and broadcast the real-time status of those emails back to connected clients using WebSockets.

---

## Architecture Components

1. **REST API (Express):**
   - The entry point for the application.
   - Accepts incoming HTTP POST requests to queue an email (`/api/notifications/email`).
   - Validates the incoming payload structure using **Zod**.
   - Provides a health check endpoint and queue status endpoint.

2. **Message Queue (BullMQ + Redis):**
   - Once the API accepts a valid request, it pushes the email payload onto a Redis-backed queue managed by **BullMQ**.
   - This prevents the HTTP server from hanging while waiting for slow SMTP servers and ensures jobs aren't lost if the server crashes.

3. **Background Worker (BullMQ):**
   - A dedicated worker process constantly listens to the Redis queue.
   - When a job appears, it picks it up and attempts to send the email via **Nodemailer** through the configured SMTP provider (e.g., mail.smtp2go.com).
   - If the sending fails, BullMQ automatically handles exponential backoff and retries.

4. **Real-time Notifications (Socket.IO):**
   - Uses WebSockets to establish a persistent, two-way connection with clients (like a frontend UI or Postman).
   - As the background worker shifts the job through different states (`queued` -> `processing` -> `sent` or `failed`), events are broadcasted in real-time.

5. **Structured Logging (Pino):**
   - Provides highly optimized JSON logging for production and human-readable, colorized output (`pino-pretty`) for local development, allowing developers to trace the exact lifecycle of every job.

---

## The Execution Workflow

1. **Client Request:** A client sends a `POST /api/notifications/email` request with `{ "to", "subject", "message" }`.
2. **Validation:** The Express server validates the payload. If invalid, it immediately returns a `400 Bad Request`.
3. **Queueing:** The API pushes the payload to the BullMQ "email" queue.
4. **Initial WebSocket Event:** A WebSocket event (`notification-status`) is broadcast stating the email is in the `queued` state. The HTTP response immediately returns `202 Accepted` with the `jobId`.
5. **Worker Pickup:** The BullMQ Worker pulls the job from Redis. Another WebSocket event is broadcast (`processing`).
6. **Execution:** The Worker leverages Nodemailer to execute the heavy SMTP connection to send the email.
7. **Completion Event:** Once Nodemailer confirms success, a final WebSocket event is broadcast (`sent`), and the worker logs the success along with the execution duration.

---

## Infrastructure

The application leverages **Docker** and **docker-compose** for consistent environments across dev, staging, and production. During local development, **Tilt** is used to continuously live-sync local source code changes straight into the running Docker container, providing instant refresh times without rebuilding containers.
