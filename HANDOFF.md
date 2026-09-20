# woosh — where we left off (Sept 19, 2026)

## How to work on it
- Source: ~/Claude/paper-meadow on Toby's mac. The game Toby plays is `doors/index.html` (the "doors" fork). Root `index.html` = old paper.io woosh, leave it alone.
- Live: https://colond3.github.io/Woosh/doors/  (GitHub Pages, repo ColonD3/Woosh, branch main)
- Push: deploy key at ~/Claude/paper-meadow/.nala/woosh_deploy (see .nala/README.txt). Nala's push script copies paper-meadow -> a clone and pushes over SSH.
- ALWAYS check the edited file actually landed on the mac (grep for the new code) before pushing — a stale copy got pushed once.
- Plans: TAD-RELEASE.md (immediate, in order), ROADMAP.md (everything, incl. sheeps spec + visual north star), refs/ (reference images).

## Just shipped (last push)
- world map (M): whole globe, houses/factories, players, waypoints; click the map to add a waypoint
- waypoints (B): name + color, glowing beam + floating name/distance in the world, saved per world
- optional minimap (settings), fuller settings: look speed, FOV, world curve, volume, minimap, fps, controls hint, AO/TAA/shadows/bloom toggles (saved per player)
- sound toggle moved off M into the volume slider
- UNVERIFIED: opening the world map crashed the headless test browser (software renderer). Minimap was fine. Removed a backdrop blur that was the likely cause, but Toby should confirm M works on his mac. If it lags/crashes: look at drawMap() (runs every 0.2s while open) and drawMapBase().

## Decisions from Toby (latest)
- NO ctrl-sprint. Keep Shift = sprint. In water (when buoyancy exists): can't run, so Shift = swim down, Space = swim up.
- Resource from the drill is called "sulfur" for now (placeholder, Toby may rename).
- Trees don't regrow; plant branches.
- Real dug-in caves later (current caves = rock domes).

## Known behavior to fix
- Multiplayer: if the HOST closes the game, clients stay in a frozen local copy (nothing syncs or saves). No host migration exists. Should show "host left" + send them to the title screen, or later add host migration.

## Next up (TAD-RELEASE order)
1. hearts + food (wheat in mud by rivers -> bread)
2. sheeps (see ROADMAP "SHEEPS" section — the whole spec)
3. props pass toward refs/ (stumps, flowers, pebbles, bushes along paths)
4. keybinds menu, buoyancy/swimming
5. later: UI overhaul, real caves, jagged terrain borders, planters, pens, carpets, factory wall expanding
