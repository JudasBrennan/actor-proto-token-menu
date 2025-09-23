// Actor Prototype Token (Context Menu) — v2.0.0 (minimal)
// Opens the system's Prototype Token sheet via the supported API:
//   new CONFIG.Token.prototypeSheetClass({ prototype: actor.prototypeToken }).render({ force: true });

Hooks.on("getActorContextOptions", (app, menu) => {
  menu.push({
    name: game.i18n?.localize?.("TOKEN.TitlePrototype") ?? "Prototype Token…",
    icon: '<i class="fa-solid fa-user-gear"></i>',
    condition: li => {
      const id = li?.dataset?.entryId || li?.dataset?.documentId;
      const actor = id && game.actors?.get(id);
      return !!actor && (game.user?.isGM || actor.isOwner);
    },
    callback: li => {
      const id = li?.dataset?.entryId || li?.dataset?.documentId;
      const actor = id && game.actors?.get(id);
      if (!actor) return ui.notifications?.warn("Actor not found.");
      const Sheet = CONFIG?.Token?.prototypeSheetClass;
      if (!Sheet) return ui.notifications?.error("No prototype token sheet class registered.");
      new Sheet({ prototype: actor.prototypeToken }).render({ force: true });
    }
  });
});
