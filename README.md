# Actor Prototype Token (Context Menu)

Adds a **“Prototype Token…”** option to the right-click context menu of Actors in the sidebar.  
Clicking it opens the system’s **Prototype Token configuration** window directly (the same one normally accessed from inside the Actor sheet).

---

## ✨ Features
- Right‑click any Actor → **Prototype Token…**
- Opens the **real** prototype token sheet (no hacks): we briefly render the Actor sheet hidden, invoke the official `configurePrototypeToken` action, then close it.
- Works with **any system** that subclasses `ActorSheetV2` (tested with D&D5e + Tidy5e).
- Visibility: **GM** and **Actor Owners**.
- 🌍 Localized: en, de, fr, es, it, pt‑BR, pl, ru, ja, ko, zh‑CN, zh‑TW.

---

## 📦 Installation
**Manifest URL** (paste into Foundry's module installer):
```
https://github.com/JudasBrennan/actor-proto-token-menu/releases/latest/download/module.json
```

Or download the ZIP and drop it into `Data/modules/actor-proto-token-menu/`.

---

## 🖼️ Usage
1. Open the **Actors** sidebar.
2. Right‑click an Actor.
3. Choose **Prototype Token…**

---

## ⚙️ Compatibility
- Foundry **v13+**
- System‑agnostic; respects the system’s registered token sheet (ex: D&D5e’s `TokenConfig5e`).

---

## 🗺️ Localization
Contributions welcome! See the `lang/*.json` files.

---

## 🧰 Development Notes
- We avoid creating temporary `TokenDocument`s or intercepting form submits.  
- Instead, we call the **real** `configurePrototypeToken` action on the Actor sheet.  
- If the sheet is not open, it is rendered with a hidden CSS class and closed immediately after triggering the action—no visible flicker.

---

## 📜 License
MIT
