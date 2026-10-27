import * as migration_20261027_181013_initial from './20261027_181013_initial';

export const migrations = [
  {
    up: migration_20261027_181013_initial.up,
    down: migration_20261027_181013_initial.down,
    name: '20261027_181013_initial'
  },
];
