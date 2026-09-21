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
- (CANCELLED: ctrl-sprint) keep Shift sprint; in water Shift = swim down, Space = swim up (with buoyancy)
- one CRAFT key: radial menu of every craftable thing around your cursor, click to craft; after crafting (or Esc) the cursor goes back into the game
- FIXED: world curve now bends every object (flowers/trees/rocks were floating at high curve), water is a dense plane that follows you so lakes don't "empty" when bent
### rivers (Toby, Sept 19)
- NOW-ish: river mesh edges show -> deeper carved insets; nicer river -> lake transition (mist / particles where they meet)
- later: river current pushes you
- later: dig/blow a ditch + pour water -> it flows downhill dynamically (MC-like, more woosh-ish)

## VISUAL NORTH STAR — refs/ folder (Toby: "eventually look very similar to this level of beauty")
- refs/01-creamy-lighting-brawler.png — the creamy look: lavender shadows, strong fill, soft AO, bloom only on glowy stuff
- refs/02-crimson-desert-island.png, refs/03-crimson-desert-rocks.png — painted rocks/cliffs, layered stone, dry grass clumps, depth of field
- refs/04-no-way-out-forest.png, refs/05-no-way-out-building-kit.jpeg — building pieces (walls, doors, windows, planks) in a sunny clearing: THE target for our houses/building
- refs/06-no-way-out-pines-boulders.jpeg — pines, flat painted boulders, stumps, yellow flowers, big soft tree shadows + god rays
- refs/07-jakeline-forge-house.webp — the dream house: curved tiled roof, timber + stone, vines, waterfall, snowy peak behind
- refs/08-forest-path.jpg — dirt path through a forest, bushes along the edges, cabin in the distance, warm light
- what they share: painted textures with baked light, warm yellow-green palette, big soft shadow shapes, sun haze/god rays, dense clumped foliage at edges, strong silhouettes, lots of small props (stumps, flowers, pebbles)

## SHEEPS (Toby's spec, Sept 19 — they are NOT sheep, they're just called sheeps)
- look nothing like sheep. that's the joke
- run decently fast, arms held straight up in the air for no reason, dirpiest run cycle ever: floppy side-to-side, arms flopping while held up
- running = "wowowowowow"; heard ONLY when fairly close, fake-doppler rise/fall as they pass: "....wowowooWOWOWOWOWWOwooowow...."
- they only make sounds while RUNNING (never walking/standing)
- not always frantic: they run sometimes, especially near players — they run away BUT always path close past you first so you hear the pass-by, then flee
- every once in a while they faceplant goofily, little "ow..." sound, pause ~1s, then keep running "wwowowowowow"
- steep edge while running: pause... then yeet off it "WAAAAAaaaaa-"
- if you hold wheat: toddlers on sugar, they chase you going "NOM NOM NOM NOM NOM" (hideously hilarious) -> that's how you lure them into the animal pen
- later: pens attach outside factories, sheeps become part of automations (wheat -> sheep -> mutton -> cooker...), carpets from sheeps

## THE BIG PROGRESSION (Toby, Sept 19 late) — gold, energy, survival, characters, the rock, the clouds

### Survival stats
- HEALTH: goes down only from damage (fall damage, players hitting you, hostile mobs later). 0 = death. eating restores health. PvP: you can hit other players
- HUNGER: always draining; you need food constantly; 0 hunger = you DIE (no slow-down phase)
- STAMINA: drains the longer you run; if it gets really low (mildly hard to reach) you get slower AND hunger drains faster; stand still to rest it back up
- stamina potion: refills all stamina (lets you keep running)

### Characters are separate from worlds
- level up your character; characters carry items BETWEEN worlds
- menu: make new characters, make new worlds, independently
- this is what forces searching MULTIPLE worlds (for the rock / the clouds)

### Copper + armor
- mine copper -> cook in a BLAST FURNACE -> copper ingots -> place them down and let them OXIDIZE (10-30s) -> collect
- oxidized copper -> WOOSHI ARMOR: adds protection, legs go STIFF, you roll around stiff, slower up steep slopes, metal rolling sound, visibly armored
- later: DIAMOND ARMOR via the forge, way more damage resistance

### Gold + energy
- gold is rare, deep in caves; 3 gold -> (at the FORGE: iron door + gold) -> GOLD DOOR = unlocks energy/electricity; replaces your iron door
- gold rebar for the roof; bigger factory = more roof needed, but also more wall space for attachments (e.g. many mixers in parallel)
- GENERATOR = gears + vines + lots of copper; connects to the gold factory, powers other machines; burns COAL
- ELECTRIC DRILL (copper + stuff, faster than the mechanical drill): pick what ore it mines in its options (coal etc.); different ores take different times
- automation: electric drill -> coal -> generator -> powers brewer, electric mixer, etc.
- all electric things are crafted with copper (+ other stuff)
- every machine (drills, generators...) can be upgraded with GOLD (faster/more efficient), then DIAMOND (really good, diamonds are hard to get)
- (Toby wants ideas for fun electric machines — see list below)

### The rock (boss) — the only real diamond source
- a ROCK DUNGEON sometimes spawns deep underground; ONE rock per world
- activate it -> fight THE ROCK (it's just a big rock lol): lunges, tries to roll you over, does a lot of damage (why copper armor matters)
- beat it -> its vault opens -> chests with 1-2 diamonds + a HERO OF THE ROCK potion
- best odds: make SMALL worlds and explore every cave
- HERO OF THE ROCK potion (limited time): newly generated small worlds get 3-6 rock dungeons
- BREWER (needs energy): put in glass bottles + an ingredient; the ingredient decides the potion. hero of the rock: put the found potion + water bottles in, it copies it into the bottles
- diamonds can technically be drilled but take forever

### Clouds (night) + the key + the cloud elevator
- CLOUDS fall on the ground at night: rare, lightly glowing, walk around and find them
- KEY = diamond + cloud; craft it with a gold door -> the CLOUD ELEVATOR that magically takes you up
- up there: literally just clouds, with treasure: best source of diamonds + copper (copper is also fine with electric drills, just easier up there)
- WATER HOLDERS come from the clouds (more cloud loot ideas TBD)

### Water, farming, sheeps (depends on water holders!)
- you can't farm until you have a water holder: hold water, place it in a pond
- seeds come from blowing up grass
- wheat grows in a PLANTER (needs water) -> wheat
- wheat lures sheeps into the pen; FENCES let sheeps in but never out
- place a water holder in the pen: keeps sheeps from despawning + makes them reproduce -> kill for meat
- MEAT = great food + the SHEEP EFFECT (run much faster using less stamina)
- wire the planter output into the pen in the node board = feed wheat = faster reproduction

## Adaptive graphics presets (Toby, Sept 19) — "different rendering, same game"
- on first launch, auto-detect the machine (GPU info + a quick fps test) and pick a preset; weak laptops get the light version automatically
- presets in settings: potato / low / medium / high / ultra, plus the individual toggles still there for tinkering
- what scales: resolution cap, shadow map size + softness (or off), AO (off / half-res / full), TAA vs cheap AA, bloom, grass density + radius, foliage/props density + draw distance, water reflection quality, texture size (512 / 1k / 2k), fog distance
- high/ultra can go beyond today's look (bigger shadow maps, more grass, full-res AO, god rays, DOF) for strong machines
- dynamic resolution stays on top of any preset as the safety net
- gameplay must be identical at every preset (same world, same hitboxes); only the rendering changes

- [done] characters separate from worlds (inv+stats travel), copper ore (teal crystals) → cooker → copper → wooshi armor (8 copper, -40% dmg)
- [next] oxidizing copper, blast furnace, armor on the character model
- [done] deep caves: ramp from each surface cave into tunnels + chambers (iron shallow, copper mid, gold deep), darkness, torches (wood+coal, drills make coal), gold smelting
- [done] tools in chests, 9-slot hotbar + bag overflow, rocks stop spawning after first tool, death keeps 25-50% + tool
- [next] rock dungeons, gold uses (forge/gold door), diamonds + rock boss chamber
- [done] caves v3: minecraft-style worm caves + caverns carved into a real volume (surface nets), terrain holes, no domes, vines only at mouths, real darkness, camera collision, bombs carve craters, surface coal, drills need cranking (F), stamina buff, no ground gunpowder, name worlds
- [next] check cave gen time on big maps, rock dungeons
- [done] terrain v3: whole world is one solid field meshed w/ surface nets (terrain+caves one mesh), dig anywhere w/ tools (grass->dirt/mud->stone/granite/deep), bombs carve + drop, seeds, granite block, buried ores (gold very rare, deep), cave types (tunnels, crawlspaces, big halls, shafts, ravines, hidden systems), stalactites/mites, cave rocks, glow shrooms, polyhaven underground textures, rocks settle flush
- [next] farming (seeds), gold door + gold factory roofs, perf of world build on big maps
- [done] stuck-in-holes fix, tools only break stone (dirt/grass/sand = bombs only), glow shrooms edible (big regen), fewer/smaller surface ore rocks, saplings 17-40s, /mode creative|survival
- [done] smooth sculpted-clay caves (field normals + vertex snapping, 0.5m detail where dug), mining sphere + chunk burst + per-material crunch, no tripping (smoothed body, bigger crawlspaces), fewer boulders/ores
- [done] paper-brutalist UI revamp, fall damage toggle, full camera pitch range
- [done] day/night + sunsets, sleep in houses (Z), night shades + cave crawlers (click to fight), wooshi personality (look around/doze/wiggle/flinch), milestone banners, fades, loading screen, bigger menu, UI click sounds, hurt vignette, stone footsteps in caves

- dense forest biome: faked light shafts through canopy gaps, visible when you stand in shadow (not global mist)
- SOUND (next): cc0 pack review w/ Toby -> per-surface footsteps, cave reverb, altitude wind, birds day / crickets night, layered hits, more sfx variety
- world reacts: grass bends under wooshi, birds flush, bush rustle, water ripples, landing dust
- camera: turn lag/ease, strafe roll, landing bob, idle drift
- UI: auto-hide controls panel + quest box, hearts/hunger fade when full
- authored moments: ruins, old campfire, log bridge, paths that lead somewhere, mossy rock piles (~10)
- time-of-day moods: real golden hour, overcast days, rain + wet ground
- transitions: sleep fade, spawn fade-in, menu flies into game

## Sept 20 (v51-v77)
- [done] look pass: grass shadows, god rays, muted olive/sage grade, softer sky + water
- [done] animations: tree topple + impact, chop wobble, boulder jolt + chunks
- [done] 6 biomes + authored landmarks (cairns, fire rings, stone circles, fallen logs, ruins)
- [done] sound pass: per-surface steps, cave reverb, wind, birds/crickets, layered hits
- [done] mine sand/mountain rock, scoop mud+sand, /give, world thumbnails
- [done] rocks + cliff slabs solid + minable, mesh-fitted sphere collision, stick-to-any-surface climbing
- [done] THE FREEZE: const reassignment in tree wobble killed the render loop (v74); loop now error-proof
- [next] see HANDOFF.md "Pick up here"
