# tailwind-build

Builds `../assets/tailwind.css`, the stylesheet the resume sheet uses. The rest of the site is styled by `../drift/drift.css` and built by `../drift-build/`.

```
npm install          # first time only
npm run build
```

The output is committed, so Cloudflare deploys with no build step. Rebuild after adding a Tailwind class to the resume; the build scans `../*.html` and `../projects/*.html`.
