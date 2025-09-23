# Changelog

## 2.0.0
- Radical redesign: replaced stealth-sheet approach with official API.
- Now directly opens the system’s `prototypeSheetClass` with `{ prototype: actor.prototypeToken }`.
- Simpler, cleaner, fully idiomatic. No hidden sheets or fallbacks needed.
- Removed bespoke localisation, falling back on FoundryVTT's native localisation.

## 1.1.1
- Fixed: ensured sheet invisibility cleanup after stealth open.
- Improved: actor sheets can be reopened normally.

## 1.1.0
- Added Prototype Token option to Actor context menu.
- Opened real Prototype Token config via stealth render + action trigger.
- Added multilingual support and docs.

## 1.0.0
- Initial release.
