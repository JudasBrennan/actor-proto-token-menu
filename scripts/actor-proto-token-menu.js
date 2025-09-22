
/* Actor Prototype Token (Context Menu) - v1.1.1
 * Opens the real Prototype Token config from the Actors context menu.
 * If the actor sheet wasn't open, we render it hidden ("stealth"), trigger
 * the official action, then CLOSE the sheet and RESTORE all sheet options/classes.
 */

const LOG_PREFIX = "actor-proto-token-menu";

/** Ensure our stealth CSS is present exactly once */
function installStealthCssOnce() {
  if (document.getElementById("aptm-stealth-style")) return;
  const style = document.createElement("style");
  style.id = "aptm-stealth-style";
  style.textContent = `
    .aptm-stealth {
      opacity: 0 !important;
      pointer-events: none !important;
      transform: translateZ(0);
    }
  `;
  document.head.appendChild(style);
}

/** Resolve the Actor from a clicked <li> row in the directory */
function resolveActorFromLi(li, app) {
  const el = li instanceof HTMLElement ? li : li?.[0];
  const ds = el?.dataset ?? {};
  let id =
    ds.documentId ||
    ds.entryId ||
    (ds.documentUuid ? ds.documentUuid.split(".").pop() : undefined) ||
    el?.closest?.("[data-document-id]")?.dataset?.documentId ||
    el?.closest?.("[data-entry-id]")?.dataset?.entryId;

  let actor = (id && game.actors?.get(id)) || null;
  if (!actor && app) {
    try {
      actor = app.collection?.get?.(id) ?? app.documents?.find?.(d => d.id === id) ?? null;
    } catch (_) {}
  }
  return actor;
}

/** Create (if needed) and return the actor's sheet instance */
function getOrCreateSheet(actor) {
  let sheet = actor.sheet;
  if (!sheet) {
    const BaseV2 =
      foundry?.applications?.sheets?.ActorSheetV2 ||
      foundry?.applications?.applications?.DocumentSheetV2 ||
      null;
    const Cls = actor.sheetClass ?? BaseV2 ?? actor.constructor.sheetClass ?? null;
    if (!Cls) throw new Error("No sheet class available for this Actor.");
    sheet = new Cls(actor, {});
    actor.apps[sheet.appId] = sheet;
  }
  return sheet;
}

/** Preferred: call the v13 'configurePrototypeToken' action directly if present */
function tryCallCoreAction(sheet) {
  const inst = sheet?.options?.actions?.configurePrototypeToken;
  if (typeof inst === "function") {
    try { inst.call(sheet, new PointerEvent("click")); return true; }
    catch (e) { console.warn(`${LOG_PREFIX} | instance action threw`, e); }
  }
  const cls = sheet?.constructor?.DEFAULT_OPTIONS?.actions?.configurePrototypeToken;
  if (typeof cls === "function") {
    try { cls.call(sheet, new PointerEvent("click")); return true; }
    catch (e) { console.warn(`${LOG_PREFIX} | class DEFAULT_OPTIONS action threw`, e); }
  }
  const BaseV2 = foundry?.applications?.sheets?.ActorSheetV2;
  const base = BaseV2?.DEFAULT_OPTIONS?.actions?.configurePrototypeToken;
  if (typeof base === "function") {
    try { base.call(sheet, new PointerEvent("click")); return true; }
    catch (e) { console.warn(`${LOG_PREFIX} | base ActorSheetV2 action threw`, e); }
  }
  return false;
}

/** Fallback: use a generic action dispatcher if the sheet provides one */
function tryActionDispatcher(sheet) {
  if (typeof sheet._onClickAction === "function") {
    try {
      const fakeBtn = document.createElement("button");
      fakeBtn.dataset.action = "configurePrototypeToken";
      sheet._onClickAction(new PointerEvent("click"), fakeBtn);
      return true;
    } catch (e) {
      console.warn(`${LOG_PREFIX} | _onClickAction threw`, e);
    }
  }
  if (typeof sheet._onClickHeaderControl === "function") {
    try {
      const evt = new Event("click", { bubbles: true, cancelable: true });
      evt.currentTarget = { dataset: { action: "configurePrototypeToken" } };
      sheet._onClickHeaderControl(evt);
      return true;
    } catch (e) {
      console.warn(`${LOG_PREFIX} | _onClickHeaderControl threw`, e);
    }
  }
  return false;
}

/** Last resort: find a matching header button in DOM and click it */
function tryDomClick(sheet) {
  const root = sheet.element?.[0] || sheet.element || document;
  if (!root) return false;

  const actionBtn =
    root.querySelector?.('[data-action="configurePrototypeToken"]') ||
    root.querySelector?.('[data-action="prototypeToken"]') ||
    root.querySelector?.('[data-action="token"]');
  if (actionBtn) {
    try { actionBtn.click(); return true; } catch (e) { console.warn(`${LOG_PREFIX} | clicking action button failed`, e); }
  }

  const candidates = root.querySelectorAll?.(
    '.window-header [data-action], .header-actions [data-action], ' +
    '.window-header .header-button, .header-actions .header-button, ' +
    '.window-header button, .header-actions button'
  ) || [];
  for (const btn of candidates) {
    const title = (btn.getAttribute?.("title") || btn.ariaLabel || btn.textContent || "").toLowerCase();
    const act = (btn.dataset?.action || "").toLowerCase();
    if (/configuretoken|prototypetoken|token/.test(act) || /prototype|token/.test(title)) {
      try { btn.click(); return true; } catch (e) { console.warn(`${LOG_PREFIX} | clicking heuristic button failed`, e); }
    }
  }
  return false;
}

/** Apply stealth to a sheet; return a cleanup function that restores options & DOM */
function applyStealth(sheet) {
  const el = sheet.element?.[0] || sheet.element;
  const prev = {
    classes: Array.isArray(sheet.options?.classes) ? [...sheet.options.classes] : undefined,
    focus: sheet.options?.focus
  };

  const classes = new Set([...(sheet.options?.classes ?? [])]);
  classes.add("aptm-stealth");
  sheet.options = { ...sheet.options, classes: [...classes], focus: false };
  try { el?.classList?.add("aptm-stealth"); } catch (_) {}

  return function cleanupStealth() {
    try {
      if (prev.classes) sheet.options.classes = prev.classes;
      else if (sheet.options?.classes) {
        sheet.options.classes = sheet.options.classes.filter(c => c != "aptm-stealth");
      }
      if (typeof prev.focus !== "undefined") sheet.options.focus = prev.focus;
      (sheet.element?.[0] || sheet.element)?.classList?.remove("aptm-stealth");
    } catch (_) {}
  };
}

/** Open the real Prototype Token config via the Actor sheet.
 *  If sheet wasn't open, render in stealth, trigger action, then close & restore.
 */
async function openRealPrototypeTokenStealth(actor) {
  installStealthCssOnce();

  const sheet = getOrCreateSheet(actor);
  const wasOpen = !!(sheet.rendered && !sheet._minimized);

  let cleanup = () => {};
  try {
    if (!wasOpen) {
      cleanup = applyStealth(sheet);
      await sheet.render(true);
      await new Promise(r => requestAnimationFrame(r));
    } else {
      await sheet.render(true);
      await new Promise(r => requestAnimationFrame(r));
    }

    const opened =
      tryCallCoreAction(sheet) ||
      tryActionDispatcher(sheet) ||
      tryDomClick(sheet);

    if (!opened) {
      ui.notifications?.warn("Could not find the Prototype Token control on this sheet.");
    }
  } finally {
    if (!wasOpen) {
      try { await sheet.close({ force: true }); } catch (_) {}
      try { cleanup(); } catch (_) {}
    }
  }
  return true;
}

/** Insert our menu entry into the Actors directory context menu */
function pushEntry(menuItems, app) {
  const label = game.i18n.localize("APTM.Menu.OpenPrototypeToken") || "Prototype Token";
  if (Array.isArray(menuItems) && menuItems.some(mi => mi?.name === label)) return;

  const entry = {
    name: label,
    icon: '<i class="fa-solid fa-user-gear"></i>',
    condition: (li) => {
      const actor = resolveActorFromLi(li, app);
      return !!actor && (game.user?.isGM || actor?.isOwner);
    },
    callback: async (li) => {
      const actor = resolveActorFromLi(li, app);
      if (!actor) return ui.notifications?.warn("Actor not found from selection.");
      try { await openRealPrototypeTokenStealth(actor); }
      catch (err) {
        console.error(`${LOG_PREFIX} | Failed to open Prototype Token`, err);
        ui.notifications?.error("Failed to open Prototype Token. See console.");
      }
    }
  };

  const idx = menuItems.findIndex(mi =>
    /ownership|permission/i.test(mi?.name ?? "") || /fa-user-gear|fa-user-shield/.test(mi?.icon ?? "")
  );
  if (idx >= 0) menuItems.splice(idx + 1, 0, entry);
  else menuItems.push(entry);
}

/* Hooks for v13+ (specific + generic), and legacy safety-net */
Hooks.on("getActorContextOptions", (app, menuItems) => pushEntry(menuItems, app));
Hooks.on("getDocumentContextOptions", (app, menuItems) => {
  const isActorDir = (app?.documentName === "Actor") || (app?.tabName === "actors");
  if (isActorDir) pushEntry(menuItems, app);
});
Hooks.on("getActorDirectoryEntryContext", (html, menuItems) => pushEntry(menuItems, ui?.actors));
