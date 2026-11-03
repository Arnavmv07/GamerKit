# GamerKit

A one-stop download page for setting up a new gaming PC. It lists 74 launchers, drivers and tools in 9 categories, and each Download button opens the developer's official download page. GamerKit hosts no files.

## Features

- **Kit builder**: add tools one at a time, a whole category, or a preset (Fresh install essentials, NVIDIA build, AMD build, Streamer setup, Stability testing). Your kit is saved in your browser.
- **Ninite-style install**: tick apps in the Checklist view (or switch to Cards), then press **Get your GamerKit**. You get a small zip made for your picks. Extract it and run `GamerKit Installer.bat`: Windows asks for admin rights once, then every app installs silently with winget at its latest version, apps already up to date are skipped, and a summary shows what installed, what was skipped and what failed. Run it again later to update everything. `Download installers.bat` saves the latest official installers into a folder instead, and tools without a winget package come as shortcuts to their official pages. The **Download everything** button builds the same zip with all tools. No installers are bundled or rehosted.
- **One-command install**: the kit gives a PowerShell command that installs every supported tool with [winget](https://learn.microsoft.com/windows/package-manager/winget/), which is built into Windows 10 and 11. Tools without a winget package keep their direct download link.
- **Reactive design**: the GAMERKIT keycaps change the site's RGB accent colour when you click them or type the letters. A quiet dot grid softly lights up near the cursor, cards get a gentle glow on hover, and the nav follows the section you're reading. Light and dark themes, and motion is reduced for people who turn it off in their OS.

- **Warm-up games**: a reaction test and an aim trainer, with best scores saved in the browser.
- **Easter eggs**: try the Konami code, type `gg`, `glhf` or `afk`, or click the logo dot five times.
- **SEO**: a descriptive title and meta description, canonical URL, Open Graph and Twitter cards with a preview image, JSON-LD structured data (WebSite, ItemList of every tool, FAQPage), a visible FAQ, `robots.txt`, `sitemap.xml`, and all tool cards pre-rendered into the HTML so search engines see them without running JavaScript.

## Editing

Edit `src/page.html`, then rebuild `index.html`, `og-image.png`, `robots.txt` and `sitemap.xml` with:

```
node tools/build.js src/page.html .
```

The canonical URL is set to `https://arnavmv07.github.io/GamerKit/` in `tools/build.js`. Change `BASE` there if you move to a custom domain.

## Run it

It's a single static file with no build step. Open `index.html` in a browser, or serve the repo with GitHub Pages (Settings → Pages → Deploy from branch `main`, folder `/`).

## Adding a tool

Edit the `CATS` array in the `<script>` near the bottom of `src/page.html`, then rebuild. Each entry is:

```js
['id', 'Name', 'Vendor', 'https://official-download-page', 'Short description', 'Winget.PackageId or empty string', 1 /* free? 1 or 0 */]
```

Only link to the vendor's own site, and only add a winget ID you have confirmed with `winget show --id <id>`.

## Logos

Brand logos are embedded in `index.html` as SVG paths from [Simple Icons](https://simpleicons.org/) (CC0) and [Arcticons](https://github.com/Arcticons-Team/Arcticons) (CC BY-SA 4.0). Logos remain trademarks of their owners and are shown only to identify each product. Tools without an open-licensed logo show their website's icon, loaded from Google's favicon service, with a letter tile as the fallback.
