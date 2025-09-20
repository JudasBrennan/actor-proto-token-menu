# Actor Prototype Token (Context Menu)

Adds a **“Prototype Token…”** option to the right-click context menu of Actors in the sidebar.  
Clicking it opens the system’s **Prototype Token configuration** window directly (the same one normally accessed from inside the Actor sheet).

---

## ✨ Features

- Adds a right-click menu entry for Actors: **Prototype Token…**  
- Opens the prototype token config (`TokenConfig` or your system’s registered token sheet, e.g. `TokenConfig5e`).  
- Works for **all systems** — D&D5e, PF2e, SWADE, etc.  
- Visibility restricted to **GMs** and **Actor Owners**.  
- Localized into multiple languages:
  - English, Deutsch, Français, Español, Italiano, Português (Brasil), Polski, Русский, 日本語, 한국어, 简体中文, 繁體中文

---

## 📦 Installation

### Option 1: Install via Manifest URL
1. In Foundry: go to **Configuration → Manage Modules → Install Module**.
2. Paste the manifest link to this repository’s `module.json`.  
   *(Once you publish a release, copy the GitHub raw link here.)*

### Option 2: Manual Install
1. Download the latest release ZIP.  
2. Extract it into your Foundry `Data/modules/` folder.  
   Path should look like:
   ```
   Data/modules/actor-proto-token-menu/
   ```
3. Restart Foundry and enable **Actor Prototype Token (Context Menu)** in **Manage Modules**.

---

## 🖼️ Usage

1. Open the **Actors Directory** sidebar.  
2. Right-click any Actor entry.  
3. Select **Prototype Token…**.  
4. The prototype token configuration window opens immediately.

---

## ⚙️ Compatibility

- Built for **Foundry VTT v13+**.  
- System-agnostic: the module uses whichever token sheet the active system registers.  
- Tested with D&D5e, but should work with any system that implements prototype tokens.

---

## 🌍 Localization

This module currently supports:
- English (en)  
- German (de)  
- French (fr)  
- Spanish (es)  
- Italian (it)  
- Portuguese, Brazil (pt-BR)  
- Polish (pl)  
- Russian (ru)  
- Japanese (ja)  
- Korean (ko)  
- Simplified Chinese (zh-CN)  
- Traditional Chinese (zh-TW)

---

## 🤝 Contributing

Pull requests for:
- Additional translations  
- Menu placement improvements  
- Compatibility tweaks for specific systems  
are welcome!

---

## 📜 License

This module is released under the **MIT License**.  
Feel free to use, modify, and share.
