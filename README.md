# File Uploader

https://www.theodinproject.com/lessons/nodejs-file-uploader

**[Live Demo](https://file-uploader-production-d7b7.up.railway.app/)**

## Features

- **Authentication** — Session-based signup/login with Passport.js. Sessions stored in PostgreSQL.
- **Folders** — Full CRUD with nesting, breadcrumb navigation, and sibling-name uniqueness validation.
- **File Uploads** — Stored on Cloudinary with size and type validation.
- **File Details** — Individual pages for file details including downloading with validated original name and file type.
- **Shareable Links** — Generate an expiring (1 hour, 1 day, or 1 week), read-only link to a folder and everything nested inside it, with no login required.

## Tech Stack

| Layer         | Technology                             |
| ------------- | -------------------------------------- |
| Runtime       | Node.js                                |
| Framework     | Express                                |
| Language      | TypeScript                             |
| Templating    | EJS                                    |
| Database      | PostgreSQL                             |
| ORM           | Prisma                                 |
| Auth          | Passport.js (LocalStrategy) + bcrypt   |
| Sessions      | express-session + prisma-session-store |
| File Uploads  | Multer                                 |
| Cloud Storage | Cloudinary                             |
| Validation    | express-validator                      |
| Deployment    | Railway                                |

## Project Structure

```
src/
├── config/       # Prisma, Cloudinary, Multer, Passport Setup
├── controllers/  # Request Handling (Authentication, Files, Folders, Share Links)
├── middleware/   # Authentication Check, Error Handler
├── queries/      # Prisma Queries, Folder/File Traversal & Recursion
├── routes/       # Route To Controller Wiring (Authentication, Files, Folders, Share Links)
├── utils/        # Helper Functions
└── validators/   # Input Validation Using express-validator
```

## Notable Implementation Details

- **Self-Referencing Folder Hierarchy** — Folders reference their parent using a nullable `parentId`, enabling nesting with cascade deletes.
- **Share Link Security** — Every nested request is re-validated by walking up the folder's parents to confirm it's actually a descendant of the root shared folder.
- **Cloudinary + Database Consistency** — Deleting a folder recursively collects every nested file and removes each one from Cloudinary before the database cascade delete runs, preventing orphaned cloud storage.
- **Cloudinary Raw File Downloads** — Raw files are renamed at upload time to include their original extension, since Cloudinary's `raw` resource type needed an exact `public_id` match to download in the original file type. Passing in `resource_type` only worked for file types excluding raw files. This took me a long time to figure out and I am not sure if a more optimal solution exists.

## Local Setup

1. Clone Repo And Install Dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in values:

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/file_uploader?schema=public"
   SESSION_SECRET= node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
   ```

3. Create Local Database & Run Migrations:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. Start Dev Server:
   ```bash
   npm run dev
   ```

## Future Improvements / Known Limitations

- Uploading really large files causes app to stall
- Expired share links remain in the database
- Non-ASCII characters in downloaded file names aren't preserved
- Visiting a protected route while not logged in does not return user to that specific page after login
- File renaming or editing of any kind not implemented
- No magic-byte or "advanced" file verification, just size limit and file type