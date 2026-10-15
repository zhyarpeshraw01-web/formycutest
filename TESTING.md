# Verification notes

Verified in the available Chromium-based browser at desktop (1440 × 900), phone (390 × 844), and narrow phone (320 × 740) sizes.

## Completed checks

- Full six-challenge playthrough through the letter and final surprise.
- All three constellation letters; numbered clues; continuous pointer drawing; keyboard activation.
- Cookie shape choice, ingredient clicks and drag-and-drop, stirring via pointer movement and buttons, three toppings including repeated toppings, untimed baking, and the oven button with reduced motion.
- Cookie keepsake display and an actual downloaded SVG cookie file.
- All five shuffled memory pairs and the temporary reveal hint.
- Catching the moving word fragment, rejection of an out-of-order piece, arranging both interchangeable `iii` fragments, the three untimed heart taps, and the three-tap dancing-cookie secret.
- Four quiz questions, four distinct selected reactions, secret-word celebration, and the certificate.
- Both alternative moon-riddle responses, intended answer, envelope opening, and the final cookie secret.
- Read Again, Replay Our Adventure, Give Lumi a Cookie, sound toggle, reduced-motion toggle, keepsakes dialog, and finish-for-me help.
- Reload recovery during a puzzle and preservation of progress and keepsakes.
- Empty personal letter omitted from the finale. A text comparison confirms that the complete nine-paragraph closing matches the supplied brief exactly.
- JavaScript syntax, local asset references, all quiz choices/reaction data, and manifest structure validated.
- No application console errors observed during the browser playthrough.
- The preview server was stopped; the browser successfully reloaded the cached game and continued playing, verifying the included service worker's offline behavior.

## Scope and limits

Direct `file://` navigation was blocked by the testing browser's URL security policy, so double-click opening could not be verified in that preview browser. The project uses ordinary relative CSS, classic scripts, and local SVGs; it has no modules, external dependencies, or runtime data fetches that require a web server for direct desktop file use.

Responsive browser checks are not physical iPhone/Android hardware tests. File-manager previews on phones may not execute JavaScript; see README.md for mobile opening options. Native touch hardware, every browser/OS combination, and subjective audio playback were not independently tested. Pointer and keyboard interactions and sound-control code were exercised in the available browser.

The six-to-eight-minute duration is a reading-and-play design target, not a measured usability-study result or a forced timer.
