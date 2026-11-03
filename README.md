# GamerKit

A one-stop download page for setting up a new gaming PC. It lists 74 launchers, drivers and tools in 9 categories, and each Download button opens the developer's official download page. GamerKit hosts no files.

## Features

- **Kit builder**: add tools one at a time, a whole category, or a preset (Fresh install essentials, NVIDIA build, AMD build, Streamer setup, Stability testing). Your kit is saved in your browser.
- **Download everything**: one button downloads a zip with `Install GamerKit.bat`, which installs every winget-supported tool at its latest version, plus `Update everything.bat` and shortcuts to the official download page of each remaining tool. No installers are bundled; winget pulls each one from its publisher at install time. The kit drawer can zip just your kit the same way.
- **One-command install**: the kit gives a PowerShell command that installs every supported tool with [winget](https://learn.microsoft.com/windows/package-manager/winget/), which is built into Windows 10 and 11. Tools without a winget package keep their direct download link.
- **Reactive design**: the GAMERKIT keycaps change the site's RGB accent colour when you click them or type the letters. A dot field behind the page lights up around your cursor and ripples whenever you press something. Cards tilt toward the cursor, added tools fly into the kit tray, the tray's meter shows which categories you've covered, and the nav follows the section you're reading. Light and dark themes, and motion is reduced for people who turn it off in their OS.

## Run it

It's a single static file with no build step. Open `index.html` in a browser, or serve the repo with GitHub Pages (Settings → Pages → Deploy from branch `main`, folder `/`).

## Adding a tool

Edit the `CATS` array in the `<script>` near the bottom of `index.html`. Each entry is:

```js
['id', 'Name', 'Vendor', 'https://official-download-page', 'Short description', 'Winget.PackageId or empty string', 1 /* free? 1 or 0 */]
```

Only link to the vendor's own site, and only add a winget ID you have confirmed with `winget show --id <id>`.
