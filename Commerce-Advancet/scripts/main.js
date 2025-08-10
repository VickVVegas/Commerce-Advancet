// scripts/main.js — Ecommerce Advancet (Foundry v13)

export const MODULE_ID = "Commerce-Advancet";

// (opcional) namespace global p/ facilitar macros
globalThis.EcommerceAdvancet = { MODULE_ID };

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | init`);

  // ===== Settings do módulo (aparecem em Configure Settings > Module Settings) =====
  game.settings.register(MODULE_ID, "playerCurrencyPath", {
    name: "Player currency path",
    hint: "Ex.: system.resources.credit (ajuste ao sistema que você usa)",
    scope: "world",
    config: true,
    type: String,
    default: "system.resources.credit"
  });

  game.settings.register(MODULE_ID, "npcCurrencyPath", {
    name: "NPC currency path",
    hint: "Ex.: system.resources.credit (usado para troco/compra do vendedor)",
    scope: "world",
    config: true,
    type: String,
    default: "system.resources.credit"
  });

  game.settings.register(MODULE_ID, "sellRate", {
    name: "Sell rate (player → vendor)",
    hint: "0.5 = 50% do preço base ao vender para o NPC",
    scope: "world",
    config: true,
    type: Number,
    default: 0.5
  });

  game.settings.register(MODULE_ID, "markupRate", {
    name: "Vendor markup",
    hint: "1.0 = preço base; 1.2 = +20% sobre o preço mostrado",
    scope: "world",
    config: true,
    type: Number,
    default: 1.0
  });

  game.settings.register(MODULE_ID, "openOnDoubleClick", {
    name: "Abrir interação com duplo clique no token",
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "shopCompendium", {
    name: "Compêndio de Itens (opcional)",
    hint: "Formato: scope.packId (permite itens por UUID)",
    scope: "world",
    config: true,
    type: String,
    default: ""
  });

  // ===== Carrega templates usados pelo módulo =====
  loadTemplates([
    `modules/${MODULE_ID}/templates/npc-app.hbs`,
    `modules/${MODULE_ID}/templates/dialogue-editor.hbs`,
    `modules/${MODULE_ID}/templates/inventory-picker.hbs`
  ]);
});

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | ready`);
});

// HUD do token: botão para abrir a UI
Hooks.on("renderTokenHUD", (hud, html) => {
  const token = canvas.tokens?.get(hud.object.document.id);
  const actor = token?.actor;
  if (!actor || actor.type !== "npc") return;

  const controls = html.find(".col.right");
  const btn = $(
    `<div class="control-icon" data-action="ea-interact" title="Interagir (Ecommerce Advancet)">
       <i class="fas fa-comments"></i>
     </div>`
  );
  btn.on("click", async () => {
    // lazy import para evitar import circular
    const { NPCInteractApp } = await import(`./apps/NPCInteractApp.js`);
    new NPCInteractApp(actor, actor.getFlag(MODULE_ID, "shopData") ?? {}).render(true);
  });
  controls.append(btn);
});

// Duplo clique opcional
Hooks.on("dblclickToken", (tokenDoc) => {
  if (!game.settings.get(MODULE_ID, "openOnDoubleClick")) return;
  const actor = tokenDoc.actor;
  if (!actor || actor.type !== "npc") return;
  (async () => {
    const { NPCInteractApp } = await import(`./apps/NPCInteractApp.js`);
    new NPCInteractApp(actor, actor.getFlag(MODULE_ID, "shopData") ?? {}).render(true);
  })();
});
