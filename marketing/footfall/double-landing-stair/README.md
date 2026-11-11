# Footfall on a double landing stair: LinkedIn post

A U-shaped steel stair with two quarter landings, its treads and landings coloured by how much they
shake when someone walks up and down it: Alpaca4d's new Footfall Analysis, after SCI P354, with its
Fourier coefficients for stairs. Here: `footfall-stair-response.png` (from a corner) and
`-above.png`, the stair's fundamental mode as a still and a GIF/MP4, and the canvas.

## What to attach

- **The post:** `footfall-stair-response.png`, the stair coloured by the response factor.
- **A carousel instead:** `footfall-stair-response.png`, `footfall-stair-mode.gif`,
  `footfall-stair-response-above.png`, `grasshopper-definition.png`.
- **Alt text:** A U-shaped steel stair with two landings, its treads coloured from pale green to
  orange by how much they shake when people walk on it, strongest in the middle of the long flights,
  with a pin on the worst tread.

## The post

Copy everything in the box.

```text
Does your stair bounce?

Run down a stair and you take up to four and a half steps a second. Every step is a push.

If the stair likes to bounce near twice that, it will. And people notice.

This steel stair climbs 4.2 metres in a U, with two landings on slender posts. Its flights bounce 11 times a second.

Footfall Analysis in Alpaca4d walks a person up and down it and colours every tread by its response factor, after SCI P354.

The worst tread: 15.8. Under the limit of 24 for a busy stair.

Make the stringers 20 mm shallower and it jumps to 40.

Alpaca4d. Structural analysis at the speed of design.

#Grasshopper #OpenSees #StructuralEngineering #Footfall #SteelDesign
```

About 110 words.

## Other openings

- "Four and a half steps a second."
- "Why do some feature stairs feel lively?"
- "20 mm of stringer between a stair that passes and one that bounces."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
The example, with its Grasshopper file: https://alpaca4d.github.io/examples/footfall-stair/
Footfall Analysis in the docs: https://alpaca4d.github.io/docs/basics/analysis/footfall.html
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
```

## The numbers, if someone asks

- **The stair:** 4.2 m between floors, 24 risers of 175 mm, goings of 275 mm, 1.2 m wide: a flight
  of 10 risers up, a quarter landing, 4 across, a second quarter landing, 10 back up. S355 stringers,
  hollow sections 100 mm wide and 140 mm deep, 8 mm thick; landings on 200 x 100 x 8 edge beams with
  a 139.7 x 8 post under each free corner; treads and landings 20 mm steel plates as shells. Pinned
  at the feet and at the floor above. 290 elements: 90 beams, 200 shells.
- **The mass:** the steel, and 0.3 kN/m² of finishes with a tenth of 4 kN/m² imposed, as P354 asks.
- **The modes:** 4.2 Hz sideways on the posts; 11.1 Hz the long flights bouncing. Solved in under a
  second (ARPACK on Mumps, 12 modes).
- **Footfall:** self excitation, a 76 kg walker, P354 Table 3.2 (stairs: 1.1 and 0.22 on the first
  two harmonics), paces 1.2 to 4.5 Hz, 0.5% damping, 24 footsteps (build-up 0.53), Wb weighting.
  Largest R = 15.8 in the middle of the top flight, at 4.5 Hz, a fast descent.
- **Stringer depth against R:** 120 mm 40.4, 140 mm 15.8, 160 mm 12.2, 200 mm 7.1, 300 mm 3.4.
- **Limits (P354 Table 5.3):** stairs 32 in light use (offices), 24 in heavy use (public buildings).
