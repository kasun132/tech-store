# Sakith Tech Store: GitHub Export and Hosting Guide

## Recommended approach

Sakith Tech Store is a **full-stack application**. It includes a React storefront, a Node/Express server, tRPC procedures, a database, secure image storage, authentication, and server-side AI calls. For that reason, **GitHub Pages is not suitable for the complete application**: GitHub Pages can serve static files, but it cannot run the Node server, database procedures, secure image uploads, authentication callbacks, or server-side AI integration.

Use GitHub as the source-code repository, and use a full-stack host for the running application. The simplest option is to keep using Manus hosting and export the source to GitHub for version control. The checkpoint can be opened in the Management UI, where the GitHub export option is available.

## Export from the Management UI

Open the Sakith Tech Store project in the Management UI. Open **More (⋯) → GitHub**, choose the GitHub owner and repository name, and export the project. This preserves the project source while the Manus checkpoint remains available for preview and rollback.

## Manual GitHub export from a local clone

If you download the project files locally, run the following commands from the project root:

```bash
git init
git add .
git commit -m "Initial Sakith Tech Store storefront"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sakith-tech-store.git
git push -u origin main
```

Create the repository on GitHub first, keep it private if the source contains configuration that should not be public, and never commit `.env` files, API keys, database credentials, or OAuth secrets.

## Full-stack hosting checklist

A full-stack host must support a Node.js server process, the project build command, the `DATABASE_URL` connection, secure environment variables, and persistent database and object-storage access. Configure the same required environment variables used by the project, including the built-in Forge and OAuth values, database URL, JWT secret, and owner values. Run the project build command before starting the production server:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

The application must receive its port from the hosting environment; do not hardcode a production port. Enable SSL for the database connection and configure the production OAuth callback URL in the authentication provider. Product images must continue to use the project storage layer rather than local disk.

## If only a static demo is needed

A static export could be placed on GitHub Pages only after removing or replacing the server features. That version would not provide persistent catalog saves, secure image uploads, AI chat, authentication, or the database-backed owner editor. The production Sakith Tech Store should therefore remain on a full-stack host, with GitHub used for source control and collaboration.
