# Changelog

## 1.1.1
- Fix: Sheet could remain invisible after opening Prototype Token via context menu.
- Change: Stealth mode now **restores** sheet options/classes and removes DOM class even on errors.
- UX: Ensures you can reopen the actor sheet normally after using the menu.

## 1.1.0
- New: Context menu entry **Prototype Token…** on Actors.
- Change: Open the **real** prototype token config by invoking the sheet's `configurePrototypeToken` action.
- UX: If the Actor sheet isn't open, render it hidden (stealth), trigger, then close immediately.
- I18n: Added translations for 12 common languages.
- Docs: Added README and this CHANGELOG.

## 1.0.0
- Initial internal build / prototype.
