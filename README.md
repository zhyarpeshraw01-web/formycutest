# NMA — The Little Universe That Loves You

A complete, private, offline romantic adventure for Nma (Narmokakam).

## Open it offline

1. Extract the ZIP completely. Do not open the game from inside the ZIP preview.
2. Open the extracted `nma-universe` folder.
3. Double-click `index.html`, or right-click it and choose **Open with → Chrome, Edge, Firefox, or Safari**.
4. Tap **Let's gooo!** The sound button is optional.

You do not need an account, internet connection, package installation, or build command. Keep the files and the `assets` folder together. All artwork, styling, game logic, and audio generation are included. The melody is generated on your device after sound is enabled; there is no streamed audio.

Windows shortcut: you can also double-click `Open Nma.cmd`.

### Phones and tablets

The game is designed for touch and small screens. Some phone file managers display HTML as a document preview and do not run JavaScript. In that case, use a local web-server/file-browser app that can serve the extracted folder, then open its local address in your phone browser. No internet is needed once the folder and app are on the phone.

Another option is to host the folder, visit the link once while online, and keep it available as a home-screen web app. An included service worker caches the game on HTTPS or localhost. Let the first page finish loading, then reopen the same address offline. Browser storage can be cleared or evicted, so keep the ZIP as your permanent copy. Phone browser behavior varies; direct file opening is most reliable on a desktop browser.

## Add your own love letter

1. Open `personalization.js` in a plain-text editor, such as Notepad.
2. Find this line near the top:

```js
personalLetter: ``,
```

3. Write your own letter **between the two backticks**. New lines and blank lines are welcome. Keep the final backtick and comma.
4. Save the file, then reload the game. If you type a literal backtick in your letter, put a backslash before it. Avoid typing `${` inside a template-string letter unless you escape the `$` with a backslash.

The personal letter is intentionally empty. When empty, its area is omitted and the complete prepared closing message is shown. The prepared closing message keeps the exact supplied wording and emojis. It is separate from your personal letter.

You can also edit the name, nickname, inside joke, favorite treat, quiz questions and reactions, compliments, game dialogue, colors, star count, and music settings in this same file. The constellation puzzle is intentionally designed to draw **N → M → A**; its letter paths live in `app.js` if you ever want to redesign it for a different name.

## Play and accessibility

- Six real challenges: constellation drawing, cookie making, five-pair memory game, word sequencing and rhythm, personality quiz, and moon riddle.
- Use a mouse or touch. Most controls also work with **Tab** and **Enter/Space**.
- Ingredients and word pieces can be dragged, or tapped/clicked instead.
- Stir with circular swipes, or use **Stir once**.
- Baking and rhythm have untimed alternatives. Every puzzle has a **little help from Lumi** panel and a finish-for-me option.
- **Gentle motion** switches to reduced motion. Your device's reduced-motion preference is respected on first visit.
- **Sound off/on** controls both the instrumental melody and little sound effects.
- Tap the star counter to view keepsakes and download your decorated cookie as SVG artwork.
- After the Wjiiiiii challenge, tap the big secret word three times for the dancing-cookie collectible.
- The tiny cookie on the final screen contains one last message.
- **Read Again** reopens the letter. **Replay Our Adventure** starts a new playthrough and resets game progress and keepsakes; sound/motion preferences remain.

Allow about 6–8 minutes for a first playthrough with reading. There are no forced time gates, and the ending can be read at any pace.

## Saved progress and privacy

Progress and settings are stored only in this browser's localStorage. Nothing is sent to a server or analytics service. Refreshing resumes the current scene and puzzle progress. Clearing browser data, using private mode, moving the folder, or changing browsers can remove or separate saved progress. Some browsers restrict saving when opening local files; in that case the game still plays, but keep the tab open.

## Publish it as a link, if you want

1. Add your personal letter first and test the game locally.
2. Choose a static website host that accepts an uploaded folder.
3. Upload **index.html, styles.css, app.js, personalization.js, manifest.webmanifest, service-worker.js, and the entire assets folder** together, with `index.html` at the root of the uploaded folder.
4. Use the host's generated HTTPS link. No build command or server-side code is required.
5. After changing a published version, change `VERSION` in `service-worker.js` (for example to `nma-universe-v2`) and upload the changed files together.

This ZIP has not been published anywhere. A static site's files and letter are readable by anyone who can access that site; use your host's access controls if the link should be private.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Open this to play |
| `personalization.js` | Your blank letter and all editable content/settings |
| `app.js` | Six games, story, saving, synthesized music |
| `styles.css` | Responsive artwork styling and motion |
| `assets/` | Original SVG illustrations; no remote image dependencies |
| `service-worker.js` | Optional offline cache when hosted |
| `manifest.webmanifest` | Home-screen web-app metadata |
| `Open Nma.cmd` | Windows shortcut to the game |
| `TESTING.md` | Verification notes and device limits |

The illustrations and melody were created for this project. Typography uses fonts already on the device, and emoji appearance follows the device's emoji set. No bundled third-party libraries or paid assets are required.
