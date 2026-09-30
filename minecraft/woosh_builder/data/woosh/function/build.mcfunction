# TEST BUILD. origin (~ ~ ~) = block space above the iron block.
# builds toward +x (east) and +z (south). replace this file (or the whole pack) for new builds.
fill ~ ~ ~ ~6 ~ ~2 minecraft:smooth_stone
# lever -> dust -> lamp
setblock ~ ~1 ~ minecraft:lever[face=floor,facing=east,powered=false]
fill ~1 ~1 ~ ~4 ~1 ~ minecraft:redstone_wire
setblock ~5 ~1 ~ minecraft:redstone_lamp
# button on the side of a sticky piston pushes a block up
setblock ~2 ~1 ~2 minecraft:sticky_piston[facing=up]
setblock ~2 ~2 ~2 minecraft:iron_block
setblock ~3 ~1 ~2 minecraft:stone_button[face=wall,facing=east]
