# orchid board

A whiteboard for flowcharts, built from scratch in one file with no dependencies and no build step. It follows the **Orchid** design system (the full `DESIGN.md` from the "Orchid design" folder in Drive): soft neumorphic instrument panels on one cool-grey surface, a single orchid accent, and a lowercase mono voice.

Open `index.html` in any modern browser.

## Draw

| | |
|---|---|
| shapes | process, decision, start/end, data, note, text |
| place | pick a tool and click, or drag to size. Double-click the canvas for a new process. |
| connect | hover a shape and drag from a handle onto another shape. Drop on empty space to create a new connected shape. |
| connectors | elbow, curve or line. Optional arrowhead and label. They re-route when shapes move. |
| canvas | infinite. Scroll or pinch to zoom around the cursor. Drag the background, hold space, or right-drag to pan. |
| edit | select, marquee (Shift-drag), resize handles, tints, duplicate, copy/paste, undo/redo, arrow-key nudge, snap-to-grid |
| tidy | one key runs a layered auto-layout |

The full shortcut list is in settings > shortcuts. Autosaves in the browser.

## Formats

| export | opens in |
|---|---|
| **svg** | browsers, Figma, Inkscape, Illustrator |
| **png** | 2x raster |
| **pdf** | single page (raster at 2x, see the note below) |
| **draw.io** (`.drawio`) | diagrams.net, Confluence, Lucidchart import |
| **mermaid** (`.mmd`) | GitHub, GitLab, Notion, Obsidian |
| **graphviz** (`.gv`) | `dot`, and anything that reads DOT |
| **board file** (`.orchid.json`) | this app. Reopen and keep editing. |

Import reads `.orchid.json`, `.drawio` (plain or compressed) and mermaid `flowchart` text. You can also drop a file anywhere on the page. Mermaid and draw.io round-trip: export then import gives back the same shapes and connectors.

`examples/` has the same sample flow saved in every format.

Note: the pdf is a 2x raster page, not vector. Use svg when you need vector.

## Orchid rules that are enforced

- One surface. Screens (settings, export) morph in place with a back key. There are no modals.
- Raised means pressable and sunk means selected or displaying. The three elevation recipes are the only shadows.
- The accent appears only as small live details: LEDs, tick marks, selection, focus.
- Settings > appearance has the mode selector (light, dark, system) and the accent selector. Both apply live and are applied before first paint.
- Feedback on every press: visual, click sound (off by default) and haptics. Reduced motion is available in settings.

## Where I went past the file

DESIGN.md tags some choices `[proposed]` or `[default]`, so I treated them as strong defaults. This is where I used judgment:

- The tint palette on shapes uses the accent-family tints from 2.1, mixed 26% into the surface so shapes stay near the base colour.
- The dropdown popover is not used. Every choice in this app has 5 or fewer options, so they are snapping segmented controls.
- Selected shapes render sunk with an accent LED, and the selection toolbar is the floating raised pill from 6.1.
- The odometer-drum zoom readout was left out. The readout is a plain sunk numeral.
- On narrow screens the tool rail moves to the bottom and settings categories become a row of keys, instead of a push-to-pane list.
- Shape text uses whatever IBM Plex Mono the browser can load. If it is unavailable, PNG and PDF export fall back to the system monospace.
