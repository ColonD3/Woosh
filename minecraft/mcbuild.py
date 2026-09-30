#!/usr/bin/env python3
"""Turn a .build layout file into a ready-to-drop Minecraft 1.21.1 datapack.

usage: python3 minecraft/mcbuild.py minecraft/builds/test.build
out:   minecraft/dist/woosh_builder/  and  minecraft/dist/woosh_builder.zip

.build format (see builds/test.build):
  palette:            then lines "<char> <block_id[states]>"
  layer N             then rows. row = z (south), column = x (east), layer = y (up)
  '.' = leave untouched. Origin (0,0,0) = block space above the iron block.
"""
import json, os, re, shutil, sys, zipfile

PACK_FORMAT = 48  # 1.21.1
# placed in a second pass so their support blocks / attached walls exist first
FRAGILE = re.compile(r"(redstone_wire|torch|lever|button|repeater|comparator|rail|pressure_plate|"
                     r"carpet|sign|banner|door|trapdoor|tripwire|ladder|vine|flower|sapling|lantern|"
                     r"^(minecraft:)?(sand|gravel))")

def parse(path):
    palette, layers, cur, mode = {}, {}, None, None
    for n, raw in enumerate(open(path), 1):
        line = raw.split("#", 1)[0].rstrip()
        if not line.strip(): continue
        if line.strip() == "palette:": mode = "p"; continue
        m = re.match(r"layer\s+(-?\d+)$", line.strip())
        if m: cur = int(m.group(1)); layers[cur] = []; mode = "l"; continue
        if mode == "p":
            ch, blk = line.strip().split(None, 1)
            if len(ch) != 1: sys.exit(f"line {n}: palette key must be 1 char")
            palette[ch] = blk if ":" in blk.split("[")[0] else "minecraft:" + blk
        elif mode == "l":
            layers[cur].append(line.strip())
        else:
            sys.exit(f"line {n}: unexpected content")
    return palette, layers

def commands(palette, layers):
    cells = {}  # (x,y,z) -> block
    for y, rows in layers.items():
        for z, row in enumerate(rows):
            for x, ch in enumerate(row):
                if ch == ".": continue
                if ch not in palette: sys.exit(f"unknown palette char {ch!r} (layer {y}, row {z})")
                cells[(x, y, z)] = palette[ch]
    out = []
    for fragile in (False, True):
        sel = {k: v for k, v in cells.items() if bool(FRAGILE.search(v)) == fragile}
        # merge runs along x into /fill (only for plain solid blocks; stateful ones setblock)
        done = set()
        for (x, y, z) in sorted(sel, key=lambda k: (k[1], k[2], k[0])):
            if (x, y, z) in done: continue
            blk = sel[(x, y, z)]
            x2 = x
            if not fragile and "[" not in blk:
                while sel.get((x2 + 1, y, z)) == blk and (x2 + 1, y, z) not in done: x2 += 1
            for i in range(x, x2 + 1): done.add((i, y, z))
            if x2 > x: out.append(f"fill ~{x} ~{y} ~{z} ~{x2} ~{y} ~{z} {blk}")
            else: out.append(f"setblock ~{x} ~{y} ~{z} {blk}")
    return out

def write_pack(cmds, name):
    root = "minecraft/dist/woosh_builder"
    shutil.rmtree(root, ignore_errors=True)
    def w(p, s):
        p = os.path.join(root, p); os.makedirs(os.path.dirname(p), exist_ok=True); open(p, "w").write(s)
    w("pack.mcmeta", json.dumps({"pack": {"pack_format": PACK_FORMAT,
        "description": f"Woosh builder: {name}"}}, indent=2))
    w("data/minecraft/tags/function/tick.json", '{ "values": ["woosh:tick"] }')
    w("data/minecraft/tags/function/load.json", '{ "values": ["woosh:load"] }')
    w("data/woosh/function/load.mcfunction",
      'tellraw @a {"text":"[woosh] loaded: %s. drop an iron ingot on an iron block.","color":"aqua"}\n' % name)
    w("data/woosh/function/tick.mcfunction",
      'execute as @e[type=item,nbt={OnGround:1b,Item:{id:"minecraft:iron_ingot"}}] at @s '
      'if block ~ ~-1 ~ minecraft:iron_block run function woosh:trigger\n')
    w("data/woosh/function/trigger.mcfunction",
      "execute align xyz run function woosh:build\n"
      "playsound minecraft:entity.firework_rocket.blast block @a ~ ~ ~ 1 1\n"
      "particle minecraft:happy_villager ~ ~ ~ 0.5 0.5 0.5 0 20\n"
      "kill @s\n")
    w("data/woosh/function/build.mcfunction", "\n".join(cmds) + "\n")
    z = root + ".zip"
    if os.path.exists(z): os.remove(z)
    with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED) as zf:
        for d, _, fs in os.walk(root):
            for f in fs:
                full = os.path.join(d, f); zf.write(full, os.path.relpath(full, root))
    return z

if __name__ == "__main__":
    if len(sys.argv) != 2: sys.exit(__doc__)
    pal, lay = parse(sys.argv[1])
    cmds = commands(pal, lay)
    z = write_pack(cmds, os.path.splitext(os.path.basename(sys.argv[1]))[0])
    print(f"{len(cmds)} commands -> {z}")
