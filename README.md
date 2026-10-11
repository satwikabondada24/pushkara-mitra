# Pushkara Mitra

Public-facing React, Vite, and TypeScript website for exploring Godavari ghats, crowd status, recommendations, food, safety information, and demo seva bookings.

## Run locally

```sh
npm install
npm run dev
```

Before publishing changes, run:

```sh
npm run typecheck
npm run lint
npm run build
```

## Demo mode and Supabase

The site works without backend credentials using clearly labelled sample ghat/crowd data. Favorites, demo sign-in, and demo seva bookings are stored in the current browser only. Demo sign-in does not authenticate a real account, and demo bookings do not contact a temple, reserve real availability, or collect payment.

To load shared ghat and crowd data, create a Supabase project and apply [`supabase-schema.sql`](./supabase-schema.sql) once. Populate `public.ghats` and `public.crowd_status` using the column names in that schema. Configure these **public client** values in a local `.env` file for development and as Vercel project environment variables for deployment:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

Never put a Supabase service-role key, database password, or other secret in a `VITE_` variable or browser code. The anon key is public by design; protect data with Supabase Row Level Security. The included schema grants public read access to the ghat and crowd tables only. Real authentication, shared favorites, and production booking/payment processing are not implemented.

## Deploy to Vercel

The Vercel project should use:

- **Framework preset:** Vite
- **Root directory:** the folder containing this README and `package.json`
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`
- **Node.js:** 20.19+ or 22.12+ (required by the installed Vite version)

`vercel.json` rewrites page requests to the SPA entry point so refreshing `/ghats`, `/crowd-map`, and other client-side routes works on the deployed domain. Public assets are in `public/` and are referenced from the site root.

### Connect a GitHub repository

1. Push this project folder to a GitHub repository. This working folder currently has no `.git` repository or configured Git remote.
2. Sign in to Vercel, choose **Add New → Project**, and import that GitHub repository. If prompted, grant Vercel access to the repository.
3. Set the root directory to this project folder and confirm the build/output settings listed above.
4. If using Supabase, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under the Vercel project's Environment Variables. Add them for the Production environment (and Preview if wanted); do not upload `.env` files.
5. Click **Deploy**. When Vercel reports deployment complete, open the generated `https://…vercel.app` URL and test the home page plus a nested route such as `/ghats/pushkar-ghat`.

A public deployment URL is not available until the repository is pushed and Vercel completes a deployment. Use Vercel's generated URL to share the site from other devices; a custom domain can be added later in Vercel project settings.
