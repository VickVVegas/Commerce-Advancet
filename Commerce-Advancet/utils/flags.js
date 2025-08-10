import { MODULE_ID } from "../main.js";

export function getNPCFlags(actor) {
  return actor.getFlag(MODULE_ID, "") ?? {};
}

export async function setNPCFlags(actor, updates) {
  const current = foundry.utils.duplicate(getNPCFlags(actor));
  const merged = foundry.utils.mergeObject(
    current,
    foundry.utils.expandObject(updates),
    { inplace: false, overwrite: true, insertKeys: true }
  );
  return actor.update({ [`flags.${MODULE_ID}`]: merged });
}

export async function ensureNPCFlags(actor) {
  const f = getNPCFlags(actor);
  if (f && Object.keys(f).length) return;
  const base = {
    dialogue: {
      startNode: "root",
      nodes: [
        {
          id: "root",
          text: game.i18n.localize("KULT.NPCAuto.DefaultRoot"),
          options: [
            {
              label: game.i18n.localize("KULT.NPCAuto.DefaultSeeGoods"),
              next: null,
            },
            {
              label: game.i18n.localize("KULT.NPCAuto.DefaultWhoAreYou"),
              next: "who",
            },
          ],
        },
        {
          id: "who",
          text: game.i18n.localize("KULT.NPCAuto.DefaultWhoText"),
          options: [
            { label: game.i18n.localize("KULT.NPCAuto.Back"), next: "root" },
          ],
        },
      ],
    },
    shop: {
      inventory: [
        {
          id: randomID(),
          name: game.i18n.localize("KULT.NPCAuto.DefaultRelic"),
          price: 15,
          qty: 1,
          type: "loot",
          system: {
            description: game.i18n.localize("KULT.NPCAuto.DefaultRelicDesc"),
          },
        },
      ],
    },
  };
  await actor.update({ [`flags.${MODULE_ID}`]: base });
}
