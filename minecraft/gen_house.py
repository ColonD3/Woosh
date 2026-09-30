#!/usr/bin/env python3
"""Cherry Tree Cottage: a starter house built around a living cherry tree that grows up through the roof.
python3 minecraft/gen_house.py   ->  minecraft/dist/woosh_builder.zip
Origin (0,0,0) = block space above the iron block = house floor level. x east, z south, y up.
House is x0..10, z0..10. Pad/garden extends 3 blocks out. Everything inside x-3..13, z-3..13, y0..17 is cleared first."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from mcbuild import cells_to_commands, write_pack

g = {}
M = "minecraft:"
def put(x, y, z, b, force=True):
    if force or (x, y, z) not in g: g[(x, y, z)] = M + b
def box(x1, y1, z1, x2, y2, z2, b):
    for x in range(min(x1, x2), max(x1, x2) + 1):
        for y in range(min(y1, y2), max(y1, y2) + 1):
            for z in range(min(z1, z2), max(z1, z2) + 1): put(x, y, z, b)
def hsh(x, y, z, n=7): return (x * 73856093 ^ y * 19349663 ^ z * 83492791) % n
def stairs(x, y, z, mat, facing, half="bottom"): put(x, y, z, f"{mat}_stairs[facing={facing},half={half}]")
def log(x, y, z, axis, mat="stripped_dark_oak_log"): put(x, y, z, f"{mat}[axis={axis}]")
def base(x, y, z):
    k = hsh(x, y, z, 6)
    put(x, y, z, ["mossy_stone_bricks", "cobblestone", "mossy_cobblestone"][k] if k < 3 else "stone_bricks")

def roof_h(z):  # y of the roof surface stair at this z (z clipped to house)
    z = max(0, min(10, z))
    return z + 6 if z <= 5 else 16 - z

# ------------------------------------------------------------- ground + foundation
for x in range(-3, 14):
    for z in range(-3, 14): put(x, -1, z, "grass_block")
box(0, -1, 0, 10, -1, 10, "stone_bricks")
for x in range(1, 10):                       # floor: dark oak with spruce stripes
    for z in range(1, 10):
        put(x, 0, z, "spruce_planks" if (x % 3 == 0) else "dark_oak_planks")
box(0, 0, 0, 10, 0, 0, "stone_bricks"); box(0, 0, 10, 10, 0, 10, "stone_bricks")
box(0, 0, 0, 0, 0, 10, "stone_bricks"); box(10, 0, 0, 10, 0, 10, "stone_bricks")

# ------------------------------------------------------------- walls
POSTS_N = {0, 4, 6, 10}; POSTS_S = {0, 3, 7, 10}
for x in range(0, 11):
    for z in (0, 10):
        posts = POSTS_N if z == 0 else POSTS_S
        base(x, 1, z)
        for y in (2, 3): put(x, y, z, "calcite")
        log(x, 4, z, "x")
        put(x, 5, z, "calcite")
        if x in posts:
            for y in (1, 2, 3): log(x, y, z, "y")
for z in range(1, 10):
    for x in (0, 10):
        base(x, 1, z)
        for y in (2, 3): put(x, y, z, "calcite")
        log(x, 4, z, "z")
for z in (0, 10):
    for x in (0, 10): log(x, 1, z, "y"); log(x, 2, z, "y"); log(x, 3, z, "y")
# west wall posts + windows
for z in (3, 7):
    for y in (1, 2, 3): log(0, y, z, "y")
for z in (2, 8, 4, 5, 6):
    for y in (2, 3): put(0, y, z, "glass_pane")
# north wall: windows x=2,8, door x=5
for x in (2, 8):
    for y in (2, 3): put(x, y, 0, "glass_pane")
put(5, 1, 0, "cherry_door[facing=north,half=lower,hinge=left,open=false]")
put(5, 2, 0, "cherry_door[facing=north,half=upper,hinge=left,open=false]")
put(5, 3, 0, "glass_pane")
# south wall: three windows (the big centre one looks at the tree)
for x in (1, 2, 4, 5, 6, 8, 9):
    for y in (2, 3): put(x, y, 10, "glass_pane")
# gable triangles (west x=0, east x=10 is glazed)
for z in range(1, 10):
    for y in range(5, roof_h(z)): put(0, y, z, "calcite")
for z in range(4, 7):
    for y in (7, 8): put(0, y, z, "glass_pane")
for z in (1, 9):
    for y in range(5, roof_h(z)): log(0, y, z, "y")
for z in (3, 7):
    for y in range(5, roof_h(z)): log(0, y, z, "y")
# east wall: big glazed gable with mullions
for z in range(1, 10):
    top = roof_h(z)
    for y in range(2, top):
        if y == 4: continue
        put(10, y, z, "stripped_dark_oak_log[axis=y]" if z in (3, 5, 7) else "glass_pane")
for z in range(1, 10): pass

# ------------------------------------------------------------- roof (cherry, ridge along x)
for i in range(0, 6):
    y = 5 + i
    for x in range(-1, 12):
        stairs(x, y, -1 + i, "cherry", "south")
        stairs(x, y, 11 - i, "cherry", "north")
for x in range(-1, 12):
    put(x, 10, 5, "cherry_planks"); put(x, 11, 5, "cherry_slab[type=bottom]")
for x in range(-1, 12):                      # eave trim
    put(x, 4, -1, "dark_oak_slab[type=top]"); put(x, 4, 11, "dark_oak_slab[type=top]")
# skylight around the tree
for x in (4, 5, 6):
    for (y, z) in [(8, 2), (9, 3), (10, 4), (8, 8), (9, 7), (10, 6), (10, 5), (11, 5)]:
        put(x, y, z, "glass")
# tie beams + hanging lanterns
for xb in (3, 7):
    for z in range(2, 9): log(xb, 7, z, "z")
    for z in (3, 7): put(xb, 6, z, "lantern[hanging=true]")

# ------------------------------------------------------------- the tree
for y in range(0, 14): put(5, y, 5, "cherry_log[axis=y]")
for (x, y, z) in [(6, 12, 5), (7, 13, 5), (4, 12, 5), (3, 13, 5), (5, 12, 6), (5, 13, 7), (5, 12, 4), (5, 13, 3)]:
    put(x, y, z, "cherry_log[axis=y]", force=False)
cx, cy, cz = 5, 13.2, 5
for x in range(-1, 12):
    for y in range(8, 18):
        for z in range(-1, 12):
            dx, dy, dz = (x - cx) / 5.6, (y - cy) / 3.4, (z - cz) / 5.6
            d = dx * dx + dy * dy + dz * dz
            if d > 1.0 or y <= roof_h(z): continue
            if d > 0.72 and hsh(x, y, z, 5) == 0: continue
            put(x, y, z, "cherry_leaves[persistent=true]", force=False)
# trunk ring on the ground: moss + petals, bench around it
for x in range(4, 7):
    for z in range(4, 7):
        if (x, z) != (5, 5): put(x, 0, z, "moss_block")
for (x, z, n) in [(4, 4, 4), (6, 4, 3), (4, 6, 3), (6, 6, 4), (5, 4, 2), (4, 5, 2), (6, 5, 3), (5, 6, 4)]:
    put(x, 1, z, f"pink_petals[flower_amount={n},facing=north]")
for x in range(3, 8):
    for z in range(3, 8):
        if max(abs(x - 5), abs(z - 5)) != 2 or (x, z) == (5, 3): continue
        if x in (3, 7) and z in (3, 7): put(x, 1, z, "cherry_slab[type=bottom]")
        elif z == 3: stairs(x, 1, z, "cherry", "north")
        elif z == 7: stairs(x, 1, z, "cherry", "south")
        elif x == 3: stairs(x, 1, z, "cherry", "west")
        else: stairs(x, 1, z, "cherry", "east")

# ------------------------------------------------------------- loft (west strip) + stairs up
for x in (1, 2, 3):
    for z in range(1, 10): put(x, 4, z, "spruce_planks")
for z in range(1, 9): put(3, 5, z, "cherry_fence")
put(2, 5, 2, "pink_bed[facing=west,part=foot]"); put(1, 5, 2, "pink_bed[facing=west,part=head]")
put(2, 5, 8, "pink_bed[facing=west,part=foot]"); put(1, 5, 8, "pink_bed[facing=west,part=head]")
put(1, 5, 5, "barrel[facing=up]"); put(1, 6, 5, "lantern[hanging=false]")
for y in (5, 6): put(1, y, 4, "bookshelf"); put(1, y, 6, "bookshelf")
for z in (4, 5, 6): put(2, 5, z, "pink_carpet")
# stairs along the south wall, rising west
put(7, 1, 9, "cherry_stairs[facing=west,half=bottom]")
put(6, 1, 9, "cherry_planks"); put(6, 2, 9, "cherry_stairs[facing=west,half=bottom]")
for y in (1, 2): put(5, y, 9, "cherry_planks")
put(5, 3, 9, "cherry_stairs[facing=west,half=bottom]")
for y in (1, 2, 3): put(4, y, 9, "cherry_planks")
put(4, 4, 9, "cherry_stairs[facing=west,half=bottom]")

# ------------------------------------------------------------- ground floor furnishing
put(9, 1, 1, "crafting_table")
for x, b in [(8, "furnace"), (7, "smoker"), (6, "blast_furnace")]: put(x, 1, 1, f"{b}[facing=south]")
put(9, 1, 2, "barrel[facing=up]"); put(9, 2, 2, "barrel[facing=up]"); put(8, 1, 2, "cauldron")
for z in (7, 8, 9): put(9, 1, z, "chest[facing=west,type=single]")
put(8, 1, 9, "chest[facing=north,type=single]")
put(9, 2, 9, "barrel[facing=up]"); put(9, 2, 8, "barrel[facing=up]")
for z in (8, 9):
    for y in (1, 2, 3): put(1, y, z, "bookshelf")
put(2, 1, 9, "lectern[facing=east]")
put(9, 1, 5, "cherry_fence"); put(9, 2, 5, "cherry_pressure_plate")       # tea table
put(9, 1, 4, "cherry_stairs[facing=north,half=bottom]"); put(9, 1, 6, "cherry_stairs[facing=south,half=bottom]")
for z in (2, 8): put(2, 3, z, "lantern[hanging=true]")

# ------------------------------------------------------------- porch + path + garden
for x in (4, 6):
    for y in (1, 2, 3): log(x, y, -1, "y")
for x in range(3, 8):
    for z in (-2, -1): put(x, 4, z, "cherry_slab[type=bottom]")
put(5, 3, -1, "lantern[hanging=true]")
put(5, 0, -1, "stone_brick_stairs[facing=south,half=bottom]")
for z in (-2, -3):
    put(5, -1, z, "stone_bricks" if z == -2 else "gravel")
    put(4, -1, z, "gravel" if z == -2 else "cobblestone"); put(6, -1, z, "gravel" if z == -2 else "cobblestone")
for x in (3, 7):                              # lamp posts
    for y in (0, 1): log(x, y, -3, "y")
    put(x, 2, -3, "lantern[hanging=false]")
flowers = ["pink_tulip", "allium", "cornflower", "azure_bluet", "lily_of_the_valley", "short_grass", "fern"]
for x in range(-3, 14):
    for z in range(-3, 14):
        if 0 <= x <= 10 and 0 <= z <= 10: continue
        if (x, 0, z) in g or (x, 1, z) in g or g.get((x, -1, z)) != M + 'grass_block': continue
        k = hsh(x, 3, z, 9)
        if k == 0: put(x, 0, z, "flowering_azalea")
        elif k in (1, 2): put(x, 0, z, "pink_petals[flower_amount=%d,facing=north]" % (1 + hsh(x, 5, z, 4)))
        elif k in (3, 4, 5): put(x, 0, z, M[len(M):] + flowers[hsh(x, 9, z, len(flowers))])
for x in (2, 8):
    put(x, 0, -1, "flowering_azalea"); put(x, 0, 11, "flowering_azalea")

# ------------------------------------------------------------- panes/fences need explicit connections
def solid(b):
    if b is None: return False
    n = b[len(M):].split("[")[0]
    return not any(t in n for t in ("pane", "fence", "trapdoor", "door", "stairs", "slab", "lantern", "carpet",
                                    "bed", "petals", "pressure", "leaves", "azalea", "grass", "fern", "tulip",
                                    "allium", "cornflower", "bluet", "lily", "cauldron", "lectern", "chest", "barrel"))
for (x, y, z), b in list(g.items()):
    n = b[len(M):].split("[")[0]
    if n in ("glass_pane", "cherry_fence"):
        st = {}
        for d, (dx, dz) in {"north": (0, -1), "south": (0, 1), "east": (1, 0), "west": (-1, 0)}.items():
            nb = g.get((x + dx, y, z + dz))
            same = nb is not None and nb[len(M):].split("[")[0] == n
            st[d] = "true" if (same or solid(nb)) else "false"
        g[(x, y, z)] = f"{M}{n}[north={st['north']},east={st['east']},south={st['south']},west={st['west']},waterlogged=false]"

cmds = ["fill ~-3 ~0 ~-3 ~13 ~17 ~13 minecraft:air"] + cells_to_commands(g)
z = write_pack(cmds, "cherry_tree_cottage")
print(len(cmds), "commands ->", z)
