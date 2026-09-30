# woosh builder datapack
1. Drop the `woosh_builder` folder (or `woosh_builder.zip`) into `<world>/datapacks/`, then `/reload`.
2. Stand anywhere, throw an iron ingot onto an iron block. The build appears with its corner in the space above the block, extending east (+x) and south (+z).
3. New build = replace `data/woosh/function/build.mcfunction` (or the whole pack) and `/reload`.
Pack format: 81 (1.21.7). If your version complains, edit `pack_format` in pack.mcmeta.
Undo: `/fill` over the area, or use a creative world and F3+... just make a backup.
