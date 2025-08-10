export async function fetchItemFromUUID(uuid) {
  const doc = await fromUuid(uuid);
  if (!doc) throw new Error("Invalid UUID.");
  return doc;
}
