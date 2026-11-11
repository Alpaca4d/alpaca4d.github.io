# Footfall on a helical stair of shells: LinkedIn post

A helical steel stair made only of plates - a ribbon climbing round an open well between two curved
parapets that carry it - its steps coloured by how much they shake when people walk on it, after SCI
P354, with Alpaca4d's Footfall Analysis. Here: `footfall-helical-stair-response.png` and `-above.png`,
the same map in plan (`-response-plan.png`), from the far side (`-response-far-side.png`) and into the
stair's open side (`-response-opening.png`); its fundamental mode as a still and a GIF/MP4 in blues, and
as stills in plan, into the open side, from the side and from the far side (`-mode-plan.png`,
`-mode-opening.png`, `-mode-side.png`, `-mode-far-side.png`); the mode swinging while the camera goes
once round the stair (`-mode-spin.gif`, `.mp4`); and the canvas.

## What to attach

- **The post:** `footfall-helical-stair-response.png`, the steps coloured by the response factor.
- **A carousel instead:** `footfall-helical-stair-response.png`,
  `footfall-helical-stair-mode-spin.gif`, `footfall-helical-stair-response-far-side.png`,
  `footfall-helical-stair-response-plan.png`, `footfall-helical-stair-mode-opening.png`,
  `grasshopper-definition.png`.
- **A video instead:** `footfall-helical-stair-mode-spin.mp4`, the stair turning once round while its
  fundamental mode swings, four times in 6.4 s.
- **Other angles:** `footfall-helical-stair-mode.gif` (the camera still),
  `footfall-helical-stair-response-above.png`, `footfall-helical-stair-response-opening.png`,
  `footfall-helical-stair-mode-plan.png`, `footfall-helical-stair-mode-side.png`,
  `footfall-helical-stair-mode-far-side.png`.
- **Alt text:** A helical steel stair round an open well between two curved steel parapets, its steps
  coloured from pale green to orange by how much they shake when people walk on it, with a pin on the
  worst step.

## The post

Copy everything in the box.

```text
No column. No stringers. Just plates.

This helical stair is a steel ribbon climbing between two curved parapets. The parapets are the structure: they carry it, floor to floor.

How much does it shake when you run down it?

Footfall Analysis in Alpaca4d walks a person up and down every step, after SCI P354, and colours each one by its response factor.

The worst step: 15.9. Half the limit for an office stair.

Make the ribbon 10 mm instead of 15, and it goes past the limit.

Alpaca4d. Structural analysis at the speed of design.

#Grasshopper #OpenSees #StructuralEngineering #Footfall #SteelDesign
```

About 95 words.

## Other openings

- "The handrail is the beam."
- "A stair made of three steel plates."

## First comment

```text
The example, with its Grasshopper file: https://alpaca4d.github.io/examples/footfall-helical-stair/
Footfall Analysis in the docs: https://alpaca4d.github.io/docs/basics/analysis/footfall.html
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
```

## The numbers, if someone asks

- **The stair:** 3.6 m in 20 risers, turning 300 degrees; inner radius 0.8 m, 1.1 m wide; a 15 mm
  S355 ribbon between parapets of 12 mm steel 1.0 m tall; built in at both ends. 480 ASD shells, no
  beam.
- **The mass:** the steel, and 1.0 kN/m2 of steps and finishes with a tenth of 4 kN/m2 imposed.
- **The modes:** 12.3 and 13.9 Hz sideways; 15.7 Hz the first up and down. Solved in about a second
  (ARPACK on Mumps).
- **Footfall:** P354 Table 3.2 (stairs), paces 1.2 to 4.5 Hz, 0.5% damping, 20 footsteps. Largest
  R = 15.9 on the outside of the ribbon a quarter of the way up, at 4.5 Hz.
- **Ribbon against R:** 10 mm 36.8, 15 mm 15.9, 20 mm 10.1, 30 mm 5.8. Parapet height from 0.3 to
  1.2 m: 15.8 to 20.2 - taller walls are stiffer and heavier at once.
