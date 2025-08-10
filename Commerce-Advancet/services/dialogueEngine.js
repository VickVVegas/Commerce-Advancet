import { checkConditions } from "./conditions.js";

export function getAvailableOptions(node, ctx) {
  const options = node?.options ?? [];
  return options.filter((opt) => {
    if (Array.isArray(opt.visibleForUsers) && opt.visibleForUsers.length) {
      if (!opt.visibleForUsers.includes(ctx.user?.id)) return false;
    }
    if (opt.conditions && !checkConditions(opt.conditions, ctx)) return false;
    return true;
  });
}
