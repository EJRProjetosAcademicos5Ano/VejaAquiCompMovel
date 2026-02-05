// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for .cjs and .mjs files, which are used by Zod 4 and modern ESM packages
config.resolver.sourceExts = [...new Set(['cjs', 'mjs', ...config.resolver.sourceExts])];

// Enable package exports support, which Zod 4 relies on for subpath imports like "zod/v4/core"
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
