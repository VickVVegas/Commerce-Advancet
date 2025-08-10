export function getNumberByPath(doc, path) {
  return foundry.utils.getProperty(doc, path);
}
export function setNumberByPath(doc, path, value) {
  const update = {};
  foundry.utils.setProperty(update, path, value);
  return update;
}
export function getCurrencyPaths() {
  return {
    player: game.settings.get("commerce-automate", "playerCurrencyPath"),
    npc: game.settings.get("commerce-automate", "npcCurrencyPath"),
    sellRate: game.settings.get("commerce-automate", "sellRate"),
    markupRate: game.settings.get("commerce-automate", "markupRate"),
  };
}
