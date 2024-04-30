import plugin from './lib/Plugins';

declare var module: {
  exports: typeof plugin,
};
