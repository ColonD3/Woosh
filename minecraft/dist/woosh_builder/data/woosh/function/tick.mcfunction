execute as @e[type=item,nbt={OnGround:1b,Item:{id:"minecraft:iron_ingot"}}] at @s if block ~ ~-1 ~ minecraft:iron_block run function woosh:trigger
