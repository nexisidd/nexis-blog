import * as migration_20261027_200351_initial from './20261027_200351_initial';

export const migrations = [
  {
    up: migration_20261027_200351_initial.up,
    down: migration_20261027_200351_initial.down,
    name: '20261027_200351_initial'
  },
];
