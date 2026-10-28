# Third-party design references

The theme in `src/routes/layout.css` adapts neutral surface colors and layered shadow values from [Medusa's UI preset](https://github.com/medusajs/medusa/tree/develop/packages/design-system/ui-preset). The green accent, layout, and site copy are project-specific. Medusa's React components are not dependencies.

Medusa's applicable MIT notice follows.

Copyright (c) 2021 Medusajs

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

UI components in `src/lib/components/ui` were generated with shadcn-svelte 1.7.1, Nova style, using the Lucide icon library. See their upstream [source and license](https://github.com/huntabyte/shadcn-svelte). Project changes specify button transitions and remove tab transitions. Inter is served locally through `@fontsource-variable/inter`; its package includes the font's license.

Kablammo is served locally through `@fontsource-variable/kablammo` (OFL-1.1). Its full license is included in `static/licenses/kablammo.txt`. See the [Fontsource font details](https://fontsource.org/fonts/kablammo/about).

Freckle Face is served locally through `@fontsource/freckle-face`; its full license is included in `static/licenses/freckle-face.txt`. It replaces Kablammo in the current hero.

The current hero serves Londrina Shadow locally through `@fontsource/londrina-shadow`. Its full license is in `static/licenses/londrina-shadow.txt`; Freckle Face and Kablammo are no longer dependencies.
