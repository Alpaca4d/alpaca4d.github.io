# Footfall on a long straight stair: LinkedIn post

A straight steel stair of 36 steps in three flights with two landings, held only at its two ends, its
treads coloured by how much they shake when people walk on it, after SCI P354, with Alpaca4d's Footfall
Analysis: red where it is past the limit. Here: `footfall-straight-stair-response.png` and
`-above.png`, its fundamental mode as a still and a GIF/MP4 in blues, and the canvas.

## What to attach

- **The post:** `footfall-straight-stair-response.png`, the stair glowing red in the middle.
- **A carousel instead:** `footfall-straight-stair-response.png`, `footfall-straight-stair-mode.gif`,
  `footfall-straight-stair-response-above.png`, `grasshopper-definition.png`.
- **Alt text:** A long straight steel stair of three flights and two landings, its middle treads and
  landings dark red and its end treads green, showing where it shakes past the acceptable limit when
  people walk on it.

## The post

Copy everything in the box.

```text
36 steps. Two landings. Nothing in between.

This straight steel stair spans 11.5 metres from floor to floor, on two plate stringers 400 mm deep.

Its middle bounces 6.9 times a second. Run down at 3.45 steps a second and every footfall lands in time with it.

Footfall Analysis in Alpaca4d, after SCI P354: a response factor of 697. The limit for a stair is 32.

Make the stringers 600 mm deep and it drops to 23.

Alpaca4d. Structural analysis at the speed of design.

#Grasshopper #OpenSees #StructuralEngineering #Footfall #SteelDesign
```

About 90 words.

## Other openings

- "697. The limit is 32."
- "Why a long stair needs to clear 9 Hz."

## First comment

```text
The example, with its Grasshopper file: https://alpaca4d.github.io/examples/footfall-straight-stair/
Footfall Analysis in the docs: https://alpaca4d.github.io/docs/basics/analysis/footfall.html
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
```

## The numbers, if someone asks

- **The stair:** 3 flights of 12 risers of 175 mm, goings of 275 mm, landings 1.2 m, 1.2 m wide: about
  11.5 m along and 6.3 m up. Two S355 plate stringers, 15 mm, 400 mm deep below the treads' middle
  line and 100 mm above; 20 mm plate treads and landings, each tread tied to the stringers at its
  middle and by rigid links at its corners. Pinned along the stringers' end edges only. 928 ASD
  shells; about a second to solve (ARPACK on Mumps).
- **The modes:** 4.2 Hz sideways; 6.9 Hz the middle bouncing.
- **Footfall:** P354 Table 3.2 (stairs), paces 1.2 to 4.5 Hz, 0.5% damping, 36 footsteps. Largest
  R = 697 at 3.45 Hz, whose second harmonic is the 6.9 Hz bounce.
- **Stringer depth against R:** 300 mm 1 101, 400 mm 697, 500 mm 665, 600 mm 22.3, 800 mm 7.1, 1 000 mm
  4.7: the bounce has to clear 9 Hz, twice the fastest pace on a stair.
