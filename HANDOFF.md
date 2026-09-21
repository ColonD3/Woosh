# woosh — where we left off (Sept 20, 2026 · v82)

## How to work on it
- Source: ~/Claude/paper-meadow on Toby's mac. The game is `doors/index.html` (the "doors" fork). Root `index.html` = old paper.io woosh, leave it alone.
- Live: https://colond3.github.io/Woosh/doors/  (GitHub Pages, repo ColonD3/Woosh, branch main)
- Push: `bash ~/push.sh "commit message"` — it needs a message argument, and it copies doors/, lib/, models/, assets/stylized, assets/under, assets/music and assets/sfx into ~/woosh and pushes with the deploy key. It also copies test/ (old builds kept for bisecting bugs).
- ALWAYS grep the file on the mac for the new code before pushing. A patch script silently failed once and a whole "fix" shipped as the old file.
- GitHub Pages sends cache-control max-age=600, so Toby needs cmd+shift+R to see a new build right away. The deploy itself takes ~1 minute.
- Plans: ROADMAP.md (everything), TAD-RELEASE.md, refs/ (reference images, "No Way Out" is the look target).

## How to actually test (this matters — most of a day was lost here)
- Headless chromium renders at well under 1 fps on this box, so it CANNOT measure performance or tell a freeze from normal slowness. Use it only for: shader compile errors, JS exceptions, and logic checks via `__dev` + `__dev.step(n)`.
- The reliable test rig is Toby's own mac through the Claude browser pane (`Claude_Browser__*` tools): real GPU, real fps. Two gotchas: the page pauses whenever the pane is hidden or the Claude window isn't in front (`document.hidden` = true → 0 frames), and pointer lock can't be obtained from automation, so hold-click paths must be driven by dispatching a bubbling `KeyboardEvent` for `KeyE` (E chops exactly like holding click).
- `?dev` exposes `__dev` (frames, step, tp, look, near, inv, give, carveHere, ...), plus `__pos`, `__trees`, `__bould`, `__act`, `__W`.
- Isolation switches: `?rays=0` `?gshadow=0` `?anim=0` `?post=0` `?bake=1`.
- Old builds for bisecting: /test/v50/ /test/v55/ /test/v58/ /test/v62/.

## The freeze saga (solved — read this before chasing any "hang")
Symptom: game froze solid when chopping a tree, sometimes when mining. Cause: `for(const[i,a] of treeWob)` then `a+=dt` — assignment to a const, thrown every frame once a wobble started. Because the throw happened mid-frame, `requestAnimationFrame` was never re-queued: the picture froze while the page stayed alive, which is why every "slow frame" detector stayed silent.
- Fixed in v74 (`let`), and the render loop now schedules the next frame FIRST and catches errors, showing them in the corner diag box. A JS error can no longer freeze the game.
- Lesson: when the frame counter stops but timers keep firing, it's an exception, not a hang. Check the console first.

## Movement was rewritten (v80–v82) — read this before touching physics
There is no "sticky mode" any more. It was a mode you entered and left, and the entering/leaving was the bug (it oscillated at every edge, and releasing the keys was the only way to break the loop). One unified step now:

1. Gravity is always applied, always down. Never disabled.
2. `solveContacts(pos, iters)` gathers contacts from BOTH sources in one pass — the terrain heightfield (`surfAt`, normal from a finite-difference of the slope) and the boulder/cave SDF (`SF`, two body spheres at +0.55 r0.45 and +1.05 r0.40). It pushes out of each, cancels velocity into the contact, and sets `onGround`.
3. It produces TWO normals, and the difference matters: `stickyN` is the averaged normal (used for jumping and the avatar), `steerN` is the STEEPEST contact normal (used for steering). Averaging them was a real bug — standing at the base of a rock gave a 45° normal belonging to neither surface, so you walked into the rock.
4. Steering runs AFTER gravity. Input is projected onto `steerN`'s plane, and the part pointing INTO the surface is redirected up it (`into * 1.6`). That is the whole climb mechanic — on flat ground that term is zero, so walking is untouched, and the ground→wall transition is continuous because it is the same formula throughout.
5. **Grip** is what makes coming down work. Gravity's along-the-face component is re-added scaled by `(1 - grip)`, where grip is how hard you are pressing into the face. Press in → climb and hold. Aim away or let go → slide and fall. Without this, up worked and down was impossible (you had to drive down a slope at walking speed).
6. Edge-snap: if you had a contact last frame and lost it this frame, it probes up to 0.36m along the old normal for a new one before letting you fall. That is what makes rolling over a lip seamless. Longer probes (0.55) glue you to faces under ledges.
7. Space adds velocity along `stickyN` (blended toward straight up on flat ground) and sets `noStick = 0.3` so adhesion cannot immediately recapture you.

Dead code left in place, no longer called: `solidPush`, `cvPush`, `blockedBy`/`stepOK`. There was also a `unTrap` escape in v79 — deleted, it teleported you to the top of slabs.
Camera: world-up at all times (`CAMTILT` = 0, `?camtilt=0..1` blends the old surface-aligned tilt back), pitch clamp 1.53 rad, and the camera is now clamped above `surfAt` (it only tested rocks and caves before, so it clipped through terrain).
Old builds: `/test/v79/` is the last pre-rewrite build.

## Shipped this session (v51 → v77)
- Look: real sun shadows on the grass (sampled in the fragment shader), god rays, muted olive/sage grade with hue-selective desaturation, softer sky, muted water, rust reds, distance haze pulled way back.
- Animation: trees lean, topple, hit the ground with dust + bounce, then fade; chop wobble; rock jolt + flying chunks (shared materials — a new material per chunk used to hitch hard).
- World: 6 biomes from two noise maps (forest / birch / marsh / canyon / alpine / meadow) driving tree species, density and grass colour. Authored landmarks: cairns on ridges, fire rings near water, standing stone circles, fallen logs, ruins.
- Sound: per-surface footsteps (Kenney CC0), cave reverb (only wired up underground — it was a suspect), altitude wind, synth birds by day / crickets at night, layered mining + chopping hits.
- Digging: mine into sand, mountain rock, granite, deep stone. Scoop mud and sand without carving. Grass and mud need a bomb. Carve remeshing goes through the budgeted queue now (it used to rebuild chunks inline) and repeated digs merge into one shape.
- Rocks: boulders AND cliff slabs are solid and minable piece by piece, with collision fitted to the real mesh (8–26 spheres packed from the model's geometry). They hide ore including rare gold.
- Movement: stick-and-roll onto any surface until you press space, roll axis follows the surface, horizontal-only depenetration, rocks block you instead of letting you slide through.
- Other: `/give <item> [n]`, world thumbnails (auto snapshots + seeded painted fallback + upload your own), camera strafe roll / landing bob / idle drift, hearts+hunger+stamina fade when you're fine.

## Pick up here
1. **Movement tuning knobs**, if the feel drifts: climb assist `1.6`, on-surface response `22`, grip curve `1.4`, adhesion `14`, edge probe `0.36`. Toby signed off on the feel at v82.
2. **World reacts to you** (biggest remaining feel win): water ripples where you walk, birds flushing out of trees when you get close, bushes rustling, more landing dust. Grass already bends.
3. **Transitions**: sleep fade, spawn fade-in, menu flying into the game.
4. **Time-of-day moods**: real golden hour with long shadows, overcast days, rain + wet ground.
5. **UI auto-hide**: the controls panel and the quest box should disappear after the first few minutes.
6. **Dense forest light shafts**: placed in the world at canopy gaps, visible when you stand in shadow. The screen-space god rays can't do this — they look wrong from most angles (tried and reverted in v56).
7. Real sound loops from Freesound (CC0) to replace the synthesized birds and crickets.
8. Perf check in the new dense forests — the tree cap went up a lot for biomes.

## Known / unverified
- Multiplayer: if the HOST closes the game, clients sit in a frozen local copy. No host migration.
- Untested by Toby: multiplayer enemies, gift chests, the new landmarks, `/give`, thumbnails.
- The diag box (bottom-left, dark, tap to dismiss) reports slow frames, caught errors, and a "froze inside / last heartbeat" readout after a reload. Leave it in until the game has been stable for a while.
