# woosh — TAD RELEASE (immediate roadmap, follow in order)
Core loop: chop -> house (door + walls + roof) -> tools -> caves/iron -> cooker -> iron tools -> concrete -> iron door + factory -> factory works for you

## 1. Menus + flow
- aesthetic title screen: Worlds -> world menu (new world / load / your worlds)
- every menu closes with Esc; Esc again in-game = pause menu (settings, leave world -> title)
- worlds are private until you grab an INVITE CODE from the pause menu -> then it's a server and friends can join
- chat: T to type, Enter to send

### status: title screen, worlds/join pages, private worlds + invite code, pause menu (Esc), chat (T) DONE Sept 19

## 2. Crafting + keybinds
- one CRAFT key -> radial menu of everything craftable around the cursor, click to craft, cursor goes back into the game after (or Esc)
- kill the scattered craft keys (C, X); door stays a crafting station for door-only recipes if needed
- DONE Sept 19: Q radial craft menu (door, bomb, stone tool, roof when at a house door); C/X gone; pickaxe renamed "stone tool"; settings opens on top of pause
- keybinds menu in settings (rebind everything, combos like alt+T)

## 3. Tools (no pickaxes/specialized tools yet: just TOOLS and WEAPONS)
- stone tool: chop faster?, scoop mud (slow), mine rocks/boulders, mine iron (slow)
- iron tool = 3 iron ingot + 3 stone: mines iron faster, can get sand, scoops mud way faster
- cooker: cook iron ore -> iron ingot

- DONE Sept 19: iron ore veins (dark rock + orange crystals) in mountains + under cliff arches, stone tool mines slow, iron tool fast; cooker (Q craft, G place, F cook: ore + wood -> iron, shift+F cook all); iron tool (3 iron + 3 rock); sand needs iron tool; bombs radius 6, stick where they land, blast boulders + ore for loot
- hotbar now only shows what you have

## 4. Building v2
- place rocks/wood on top of / on any face of other placed stuff (face snapping)
- roofs: procedurally generated good-looking roof for your wall perimeter, built all at once when you have enough roof items
  - house roof = mud + branches (branches from bushes)
  - factory roof = rebar + concrete (rebar: 3 iron -> 4 rebar)
- inside a house: set your spawn

## 5. Caves + iron (simple v1)
- simple caves with iron in rock; mine with bombs or slowly with the stone tool
- bombs: slightly bigger blast, stick to faces they hit

## 6. Sand + concrete
- sand: iron tool (beaches)
- concrete = sand + mud (as planned) -> walls around the iron door

## 7. Factories (full v1)
- iron door + concrete walls (+ rebar/concrete roof) = factory
- chests: ONE chest item, choose input or output when attaching; chests can sit inside or outside as long as they touch the walls
- cooker attaches to walls -> factory can cook
- outside-only attachments: animal pen, farm planter
- automation (node editor) — full functionality

## Later (main ROADMAP)
- expand factory walls with lots of concrete (costs more than building a new factory)
- sheep -> carpets: decorate houses + sleep on them to skip the night
- hearts/food/farming, waypoints, minimap, swimming, ctrl-sprint, destructible terrain everywhere

## DONE Sept 19 (factory wave)
- concrete (2 sand + 2 mud -> 2), concrete walls (G with concrete selected)
- iron door (4 iron): wall it in with CONCRETE = FACTORY (rock walls = still just a house)
- chest (5 wood): R while placing switches INPUT/OUTPUT (blue/orange band); attaches when touching factory walls; F opens it (click to put all / take all)
- factory v1 automation: input chest (ore + wood) -> cooker touching the walls -> iron into the output chest, every ~3s
- rebar (3 iron -> 4); factory roof = rebar + concrete (metal roof); house roof = branches + mud
- branches: hold click on bushes (regrow 40s)
- set spawn at your house door (Q or F)
- NEXT: node automation editor, gunpowder source, planters, keybinds

## Notes from Toby (Sept 19, later)
- terrain borders are a bit jagged (later)
- UI overhaul sometime (later)
- gunpowder: a DRILL farms a new resource; mixer: that resource + sand -> gunpowder (after nodes)
- real CAVES still missing (right now only cliff arches over ore) -> needs a proper pass
- DONE: 1) chests/cookers snap-mount onto factory walls (blue ghost when snapping)  2) iron door node editor (F): wire chests + cookers, cut wires, drag nodes; chest->chest wires move items; new factories auto-wire

## DONE Sept 19 (caves + drill)
- caves: rock domes on hillsides (3 on small, more on bigger globes), opening faces downhill with a walkable dirt ramp, flat floor, iron ore on the inner walls, glowing blue crystals, solid walls
- vines hang over every cave mouth and sway; hold click to cut them -> vines (grow back after 2 min)
- gear = 5 iron; drill = 2 gears + 4 vines + 2 iron: gear turns a crank, vine belt, shaft pumps into the ground
- drill snaps onto factory walls, shows in the node board, digs sulfur into its wired chest every ~6s
- chests: "F open chest" prompt; click = 1, shift+click = all (put and take)
- NEXT: mixer (sulfur + sand -> gunpowder), then props pass / hearts+food
