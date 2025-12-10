export function HeavyComponent() {
  const now = new Date().getTime();
  // eslint-disable-next-line no-empty
  while (new Date().getTime() < now + heavyness) {}
  return null;
}
