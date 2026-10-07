# Current limitations

Recipes must be statically analyzable by the Babel plugin. Avoid:

- external or computed recipe configuration;
- object spreads in recipe configuration;
- computed variant keys or values;
- dynamic style functions;
- calling `sxv` without the Babel transform.

The package is ESM-only and currently requires Babel 8. There is no extension,
composition, slot, or `extend` API yet. Do not document those as available
features; use separate static recipes when extension is requested.
