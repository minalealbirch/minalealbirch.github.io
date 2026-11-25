# Comments service
From this directory, sign in to the intended Cloudflare account with `npx wrangler login` and run `npx wrangler deploy`. The binding and migration create the persistent comments store. Generate a random 32-byte hex value locally (for example with `openssl rand -hex 32`) and enter it at the prompt from `npx wrangler secret put POST_KEY`. Keep this value out of GitHub.
Set the exported endpoint in ../comments/settings.js to the deployed Worker URL. Publish the repository root with GitHub Pages.
Reader URL: https://minalealbirch.github.io/e624740e93c246e11505f85c713aad36/
Commenter URL: append #key= followed by the secret to the reader URL. Share that full URL only with commenters. Rotate POST_KEY to revoke old links.
