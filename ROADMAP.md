# Paper Meadow roadmap

## Done
- visual slice: terrain, reactive grass, trees, particles, minecraft-ish movement
- first/third person (V)
- multiplayer: host in browser (PeerJS), join by code, Netlify hosting
- paper.io core: land, trails, capture, trail kills, respawn, leaderboard, solo bots

## Next
- items: rocks (pick up + throw), gunpowder, bomb crafting (button pops up)
- trees -> wood -> fences; bombs break fences + unclaim land in a radius
- inventory: no slots, just icons + counts bottom left (rocks, wood, gunpowder, bombs, fences)

## World setup (later)
- pick bounds from presets: size + shape
- pick terrain type: more water / more hills / more sand
- pick difficulty (easy/medium/hard): amount of rocks + gunpowder, tree mining speed
- terrain rules:
  - sand: slightly slower, gunpowder spawns more there
  - grass: only place trees grow
  - water: slower (not annoying), land claimed on water can't be bombed
- (water claiming needs to be allowed, right now only land counts)

## Look
- art direction pass once references are picked

## Updates (Sept 19)
- fixed: tight turns killing you on your own trail (last ~10 trail cells are safe now)
- nature: Quaternius Stylized Nature MegaKit (CC0) trees, pines, rocks, bushes (rare), flowers, ferns, mushrooms, pebbles
- character: rolling ball with floppy legs that plant on the ground
- next: lighting pass (AO, far shadows, shoreline/shallow water), then first person + items

## Fence placing (idea, Sept 19)
- after crafting your first fences from wood, a hint teaches: press F to place fences
- F = placement mode: from wherever you're looking, the stretch of your land's border you can afford (based on fence count) lights up in a really cool preview
- walk up to your land's edge and the preview follows along the border
- click or Enter confirms and builds them
- fences: only on your own border (decided)
- peaceful mode added (Sept 19): no deaths, only empty land claimable, round ends at 90% filled; world size picker will make rounds shorter

## Items update (Sept 19)
- modes: peaceful | classic | hard slider; look-speed slider (menu + gear)
- hold E chop trees (4 wood, regrow in 60s); roll over rocks & gunpowder to grab them
- X: 2 wood -> 3 fences; F: place fences along your border (preview), click/Enter builds; fences block others
- C: rock + gunpowder -> bomb; click throws rock (stun + knockback), right-click/G throws bomb
- bombs: clear land + fences in radius, cut trails (kills), knock players back; hard: point-blank kills
- death: lose half your items; peaceful: no throwing, no rocks/gunpowder
- todo: mobile buttons for items, better chop/explosion art, first person upgrade, lighting pass

## THE BIG PIVOT: doors, houses, factories (idea, Sept 19)
No more claimed land. Inspired by MC, but its own thing. The DOOR is the heart of everything.

### Houses
- chop trees -> craft a door -> place it anywhere
- gather rocks -> build walls in any shape, snapping to the door, to form a house
- door opens/closes automatically once it's a real house
- roof: wood + mud (mud needs a tool)
- windows: sand
- tools: mine faster, and unlock gathering mud from the ground

### Crafting (no crafting table: the door IS the crafting table)
- face a door while close -> a button prompt pops up -> press it to open crafting
- the menu only shows things you have enough materials for; click to craft, with a satisfying sound
- help / recipe book menu: every recipe, what you need, and where/how to get each material

### Inventory
- full inventory with a really cool way to open it, plus a hotbar

### Factories
- get iron -> craft an IRON DOOR = the start of a factory
- concrete = sand + mud; build concrete walls around the iron door to form the factory
- chests next to factory walls: choose input OR output when placing (max one of each per factory)
- cooker placed next to factory walls = the factory can cook
- iron door menu = automation editor: drag nodes and connect them
  - example: wheat (input chest) -> feed sheep -> raw mutton -> cooker -> cooked mutton -> output chest

### Animals
- harvest wheat (or another plant) to lure animals
- fences now mean pens: a fence pen next to factory walls = "animal extension"
- animals inside the pen become part of the factory's automations

### The merchant
- shows up once you finish your first factory, dragging a little cart with big wooden wheels
- sells things, including the GOLD DOOR: a premium iron door that unlocks more options
- keybinds (Sept 19): hotbar 1-5/scroll, R = use item, hold click = chop, fences: slot 3 > R > click. The door game will be a separate fork (own folder + link), paper meadow stays as is.

## Worlds update (Sept 19)
- "host new world" makes a saved world with a fixed code; "my worlds" list in the menu: play / download / delete (tap ✕ twice)
- autosaves every 5s + when the tab hides/closes (browser storage); saves your land, your fences, chopped trees, inventory, position, mode
- crash → reopen → play: same code, it retries grabbing the code for ~a minute while the old one expires
- load world file: drop in a downloaded .woosh.json (send worlds to tad)
- joined codes are remembered as chips under the join box
- hosting mode (gear menu): stops drawing, mutes, keeps the world running off a worker clock so a hidden tab keeps hosting
- test: leave a hosting tab hidden 20 min with tad playing

## Lighting target (reference shot Toby loved, Sept 19)
- low warm sun -> long soft shadows; shadows are tinted cool lavender/blue, never grey/black
- strong bright sky fill so shade still reads colorful
- contact AO where things meet the ground (crates, rocks, walls sit IN the world)
- slightly soft/toony shading, saturated but not blown out; bloom only on glowy stuff

## Doors fork started (Sept 19) — lives at /doors/ (colond3.github.io/Woosh/doors/)
- stripped paper.io: no land/trails/capture/leaderboard/fill/modes/bots; fences removed from hotbar (return as pens)
- own saves (wdoors_*) + own peer codes, so it never collides with woosh
- graphics pass 1: GTAO ambient occlusion (reconstructed from depth, off on phones, ?ao=0 to disable), VSM soft shadows 4096,
  shadow camera snapped to texels (no shimmer when moving), lavender sky fill, warmer lower sun (28°), softer bloom, milky grade
- next graphics: leaf shadow flicker from wind (freeze/soften leaf casters), contact shadows, TAA, grass look
- graphics pass 2 (Sept 19): TAA (jittered camera + depth reprojection + neighborhood clamp, ?taa=0 to disable), grass base now matches the ground instead of fading to black
- TODO look: UI redesign (current one reads generic), grass closer to the reference

## Soon (from Toby's notion list, Sept 19)
### Terrain
- way better terrain gen that uses the 3D assets fully: paths, rivers, and other ideas, while keeping good gameplay
- caves that look really good; destructible terrain with bombs to expose ores (iron) -> smelt through the iron door
- boulders minable piece by piece with a tool = better rock source; loose rocks you pick up get rarer; more boulders in caves (also makes caves look better)
- tools crafted at the wooden door
### Walls
- click a start point, click an end point = one wall; start can snap to either side of a door (build both door sides first, then the rest)
- chests, cooker, pens (fences) mount onto concrete walls in a really satisfying, obvious way
### Build mode (G toggles)
- place rocks and wood anywhere on any surface; rocks come in different shapes/sizes, break one if it's not what you wanted
- your cursor picks the spot (within reach), with a preview; wooshi's arm reaches out and slaps it down
- mine placed things back by selecting them with the cursor, like minecraft

## Art direction: painted/stylized (Sept 19)
- target vibe: Crimson Desert pack + No Way Out (Rocket Brush) forest shots — painted assets, soft short grass matching ground, big soft tree shadows, warm haze, DOF, warm yellow-green palette
- approved packs: Stylized Rocks and Cliffs Pack (3dmarkus.art), 70 stylized rocks (ondrasaur) = main rock set, Free Stylized Cliff Rock (SimplePolygon), Stylized tree pack (Salah3D); maybe: 100 Natural and Stylized Rock MegaPack (only if placed well)
- rejected: OozyArtist rocks, polytexrig tree, Alwoke trees, KayKit forest, amipolygon
- textures: freestylized.com (all approved, with maps) -> assets/stylized/<name>/{color,normal,ambient_occlusion}.jpg (1k); 3dtextures.me stylized also approved
- sketchfab packs need Toby's login: he downloads glTF into paper-meadow/incoming/
- CC-BY models need a credits screen
- packs optimized to models/packs/{rocks70,rockscliffs,trees}.glb (130MB -> 6MB); credits in CREDITS.md
- ground pass (Sept 19): painted textures (moss_ground_02 + grass_03 blended by big noise, ground_06 dirt patches, cliff_rocks_02 triplanar, sand_01, snow_01) with anti-tiling (rotated second sample, noise-blended) + macro light/dark + warm/cool patches; grass is shorter and takes its color from the ground under it
- NEXT: swap in packs (rocks70 scattered, rockscliffs as landmarks, pines from trees.glb), then procedural terrain gen v2
- terrain v2 (Sept 19): hydraulic erosion (60k droplets), rivers carved downhill to the sea with flowing ribbon water, dirt paths from spawn to 4 spots (flattened, no grass, trees/rocks avoid them). base island shape (crater ring) still the old one -> next: new landform generator

## Houses v1 (Sept 19) — DONE
- X: craft a wooden door from 6 wood (the only craft that doesn't need a door)
- slot 5 door + G (or R): place it where you aim (reach 9m), faces away from you
- G build mode: click start, click end = stone wall (1 rock per 1.5m), snaps to door sides + wall ends, chains from the last end, right-click stops the chain
- door + walls closing a loop from one side of the door to the other = HOUSE -> door swings open when anyone walks up, closes behind
- F near a door = door crafting menu (only shows what you can afford) + recipe book (everything + where materials come from)
- walls + closed doors are solid; synced over multiplayer; saved in worlds
- still to do from the vision: arm slap animation, roof (wood+mud), windows (sand), tools, mud, place loose rocks/wood anywhere, mining placed stuff

## Pickaxe + build mode rocks (Sept 19) — DONE
- stone pickaxe at the door (3 wood + 3 rocks), slot 6
- hold click near a big boulder = mine it piece by piece: 2 rocks a hit, it visibly shrinks, gone after 3-8 hits (saved, synced)
- build mode (G) with the rock slot: click to place a rock anywhere in reach, every one a random painted shape + size
- pickaxe aimed at your placed rocks / walls / doors = mine them back (you get the materials back); highlight shows what you're aiming at

## Roofs + mud + sand (Sept 19) — DONE
- pickaxe digs mud on river banks, sand on beaches (hold click)
- at a house's door (F): "roof for this house" = hay roof over the whole wall loop, cost scales with floor area (wood + mud)
- roofs saved + synced; knocking a wall out removes the roof

## NEXT (big ones left)
- windows (sand) slotting into walls, concrete (sand+mud), iron door -> factories, chests/cooker mounting on walls, node automation editor
- caves + bomb-destructible terrain + iron ore
- new island landform generator (not the crater ring), more rivers
- wooshi arm-slap animation when placing
- UI redesign (needs a style reference from Toby)
- perf pass (Sept 19): terrain skips texture layers that aren't there, shadow map 2048 (VSM blur was huge at 4096), AO at half res, dynamic resolution (pixel ratio .7-1.5 aiming for 60fps, ?fixres to turn off)

## Little globe worlds (decided Sept 19)
- fake globe: flat world that WRAPS (walk off east -> come in west, same N/S) + a shader that bends everything down with distance so it looks like a tiny planet
- sizes small / medium / large / mega = wrap size (+ default curve); chunks generate as you explore, nearest first
- terrain noise must tile seamlessly so there's no seam at the wrap
- DONE: world curve shader on everything (terrain, grass, trees, water, builds; not shadows) + "world curve" slider in settings (per player, saved)
- NEXT: chunked terrain streaming -> wrap (positions, multiplayer, builds) -> size picker in the world menu
- DONE (Sept 19): the world WRAPS. terrain noise is periodic so there's no seam; walk off any edge and you come in the other side (you, remote players, builds, trees, rocks all draw at their nearest copy around you); terrain + rivers drawn as 3x3 copies
- DONE: world size picker in the menu: small (240m) / medium (360) / large (480) / mega (720) globe. saves remember their size, joining a host auto-switches to the host's size
- new landform: continents + lakes instead of the crater ring, mountains kept away from spawn so you start in a green valley; no more distant fake mountain ring
- NOT yet: generating chunks as you explore (whole world still generates at load; mega takes a few secs)

## Toby's next wave (Sept 19)
### Terrain + mining
- terrain FULLY destructible by bombs, in a really cool looking way
- caves that make mining (with bombs) easier; ores (iron) exposed by blasting
- a good AUTOMATED way to get gunpowder (it's a core part of mining)
### Survival
- health system with hearts
- food refills hearts; food comes from plants (wheat -> craft bread)
- farming: plant wheat in mud next to rivers, OR in a craftable planter placed next to your factory to automate wheat farming
### Social
- chat: T opens it, type, Enter sends
### Menus + flow
- every menu opens and closes with Esc; once you're back in the game, Esc again = pause menu: leave world (-> title screen) or settings
- a really nice, aesthetic TITLE SCREEN: Worlds -> world menu (new world, load, join your worlds); inside a world you can get an invite code, THAT'S when it becomes a server and friends can join
- FIXED: door crafting menu reopening in "back" (recipe book) state after closing with Esc
### more from Toby (Sept 19)
- set spawn (like a bed in MC)
- waypoints: B adds one (menu to name it etc)
- minimap + full world map
- keybinds menu in settings: rebind everything, combos allowed (alt+T etc)
- buoyancy: float up slowly in water, Space swims up, Shift swims down
- sprint moves to Ctrl, MC-style: tap Ctrl while moving -> sprint (slight FOV kick) until you stop moving, then it resets
- one CRAFT key: radial menu of every craftable thing around your cursor, click to craft; after crafting (or Esc) the cursor goes back into the game
- FIXED: world curve now bends every object (flowers/trees/rocks were floating at high curve), water is a dense plane that follows you so lakes don't "empty" when bent
### rivers (Toby, Sept 19)
- NOW-ish: river mesh edges show -> deeper carved insets; nicer river -> lake transition (mist / particles where they meet)
- later: river current pushes you
- later: dig/blow a ditch + pour water -> it flows downhill dynamically (MC-like, more woosh-ish)
