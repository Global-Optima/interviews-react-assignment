import { memo } from 'react';

const heavyness = 2;

// do not remove this component
export const HeavyComponent = memo(() => {
  const now = new Date().getTime();
  while (new Date().getTime() < now + heavyness) {}
  return <></>;
});
