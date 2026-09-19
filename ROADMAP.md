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
