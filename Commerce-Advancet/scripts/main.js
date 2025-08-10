// main.js — Commerce Automate para Foundry VTT v13
// Autor: VickVVegas

import { NPCInteractApp } from "./apps/NPCInteractApp.js";
import { DialogueEditorApp } from "./apps/DialogueEditorApp.js";
import { InventoryPickerApp } from "./apps/InventoryPickerApp.js";
import { DialogueEngine } from "./services/dialogueEngine.js";
import { ShopService } from "./services/shopService.js";

// Ativa debug opcional
const DEBUG = true;
function log(...args) {
  if (DEBUG) console.log("CommerceAutomate |", ...args);
}

// Hook inicial — antes de carregar cenas e UI
Hooks.once("init", async function () {
  log("Inicializando módulo Commerce Automate...");

  // Configura namespace global do módulo
  game.commerceAutomate = {
    apps: {
      NPCInteractApp,
      DialogueEditorApp,
      InventoryPickerApp,
    },
    services: {
      DialogueEngine,
      ShopService,
    },
    API: {}, // espaço para expor funções públicas
  };

  // Registra templates Handlebars
  await loadTemplates([
    "modules/commerce-automate/templates/npc-app.hbs",
    "modules/commerce-automate/templates/dialogue-editor.hbs",
    "modules/commerce-automate/templates/inventory-picker.hbs",
    "modules/commerce-automate/templates/partials/shop-inventory.hbs",
    "modules/commerce-automate/templates/partials/shop-sellrow.hbs",
    "modules/commerce-automate/templates/partials/dialogue-node.hbs",
  ]);

  log("Templates carregados.");
});

// Hook pós-carregamento de jogo
Hooks.once("ready", async function () {
  log("Módulo Commerce Automate pronto.");

  // Ativa clique em tokens de NPC para abrir interface
  canvas.tokens.interactiveChildren.forEach((token) => {
    if (token.actor?.getFlag("commerce-automate", "isVendor")) {
      token.on("click", () => openVendor(token));
    }
  });

  log("Sistema de clique em NPCs registrado.");
});

/**
 * Abre interface de vendedor ou diálogo.
 * @param {Token} token - Token do NPC clicado.
 */
function openVendor(token) {
  const isVendor = token.actor?.getFlag("commerce-automate", "isVendor");
  if (!isVendor) {
    ui.notifications.warn(game.i18n.localize("KULT.NPCAuto.NotVendor"));
    return;
  }

  const shopData = token.actor.getFlag("commerce-automate", "shopData") || {};
  new NPCInteractApp(token.actor, shopData).render(true);
}

// Registra comando no console do Foundry para debug
game.commerceAutomate.API.openVendorByName = function (name) {
  const token = canvas.tokens.placeables.find((t) => t.name === name);
  if (token) openVendor(token);
  else ui.notifications.warn(`NPC '${name}' não encontrado.`);
};
