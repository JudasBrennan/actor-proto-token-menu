
/* Actor Prototype Token (Context Menu) - v1.1.2
 * - Uses system Token sheet class when available.
 * - Constructs TokenDocument with Scene parent to supply units/grid.
 * - Suppresses noisy Handlebars warnings ONLY for missing fields.
 */
const LOG_PREFIX = "actor-proto-token-menu";

/** Scoped patch: quiet missing-field warnings from {{formGroup}} (returns empty). */
function installQuietFormGroupOnce() {
  const hbs = foundry?.applications?.api?.handlebars ?? window.Handlebars;
  if (!hbs?.helpers?.formGroup) return;
  if (hbs.helpers.formGroup.__aptmQuietPatched) return;
  const original = hbs.helpers.formGroup;
  function quietFormGroup(field, options) {
    try {
      if (!field) return new hbs.SafeString("");
      return original.apply(this, arguments);
    } catch (err) {
      // If anything goes wrong, fail closed (no output) rather than warn
      return new hbs.SafeString("");
    }
  }
  quietFormGroup.__aptmQuietPatched = true;
  hbs.unregisterHelper?.("formGroup");
  hbs.registerHelper("formGroup", quietFormGroup);
}

function resolveActorFromLi(li, app) {
  const el = li instanceof HTMLElement ? li : li?.[0];
  const ds = el?.dataset ?? {};
  let id =
    ds.documentId ||
    ds.entryId ||
    (ds.documentUuid ? ds.documentUuid.split(".").pop() : undefined) ||
    el?.closest?.("[data-document-id]")?.dataset?.documentId ||
    el?.closest?.("[data-entry-id]")?.dataset?.entryId;

  let actor = (id && (game.actors?.get(id))) || null;
  if (!actor && app) {
    try {
      actor = app.collection?.get?.(id) ?? app.documents?.find?.(d => d.id === id) ?? null;
    } catch (e) {}
  }
  return actor;
}

function buildPrototypeTokenDocument(actor) {
  const TokenDocumentClass = CONFIG.Token?.documentClass ?? TokenDocument;
  const proto = actor.prototypeToken;
  const raw = (typeof proto?.toObject === "function") ? proto.toObject() : (proto ?? {});
  raw.actorId = actor.id;
  raw.actor = actor;
  const sceneParent = game.scenes?.current ?? game.scenes?.active ?? game.scenes?.contents?.[0] ?? null;
  const parentForDoc = sceneParent || actor;
  try {
    return new TokenDocumentClass(raw, { parent: parentForDoc });
  } catch (err) {
    console.error(`${LOG_PREFIX} | Failed to construct TokenDocument`, err);
    return null;
  }
}

function insertMenuItem(menuItems, entry) {
  const idx = menuItems.findIndex(mi =>
    /ownership|permission/i.test(mi?.name ?? "") || /fa-user-gear|fa-user-shield/.test(mi?.icon ?? "")
  );
  if (idx >= 0) menuItems.splice(idx + 1, 0, entry);
  else menuItems.push(entry);
}

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
      const tokenDoc = buildPrototypeTokenDocument(actor);
      if (!tokenDoc) return ui.notifications?.error("Could not build a TokenDocument from the Actor's prototype.");
      try {
        installQuietFormGroupOnce();
        const SheetClass = tokenDoc.sheetClass ?? CONFIG.Token?.sheetClass ?? TokenConfig;
        const sheet = new SheetClass(tokenDoc, { isPrototype: true });
        if ("isPrototype" in sheet) sheet.isPrototype = true;
        sheet.render(true);
      } catch (err) {
        console.error(`${LOG_PREFIX} | Failed to open Token sheet`, err);
        ui.notifications?.error("Failed to open Prototype Token sheet. See console for details.");
      }
    }
  };
  insertMenuItem(menuItems, entry);
}

Hooks.on("getActorContextOptions", (app, menuItems) => pushEntry(menuItems, app));
Hooks.on("getDocumentContextOptions", (app, menuItems) => {
  const isActorDir = (app?.documentName === "Actor") || (app?.tabName === "actors");
  if (isActorDir) pushEntry(menuItems, app);
});
Hooks.on("getActorDirectoryEntryContext", (html, menuItems) => pushEntry(menuItems, ui?.actors));
