# A tank's first hundred modes: LinkedIn post

A round concrete tank, 4 m across and 5 m tall, its wall 200 mm thick, built in at its base: its
first hundred natural modes from one Natural Vibration Analysis in Alpaca4d, each drawn on its own
copy of the tank, on a grid of ten by ten. Here: the close look at the grid (`tank-modes.png`), the
whole grid receding (`tank-modes-field.png`), the grid from above with each mode's number and
frequency (`tank-modes-grid.png`), every mode swinging at once (`tank-modes-swinging.gif` and
`.mp4`) and the canvas.

## What to attach

- **The post:** `tank-modes-swinging.mp4`, every mode swinging at once.
- **A carousel instead:** `tank-modes.png`, `tank-modes-field.png`, `tank-modes-grid.png`,
  `grasshopper-definition.png`.
- **Alt text:** Rows of concrete tanks, each one deformed in another of its first hundred natural
  modes: ovals, lobes round the rim, bands up the wall, coloured by how far each part moves.

## The post

Copy everything in the box.

```text
A hundred ways to shake a tank.

A round concrete tank, 4 metres across. Tap it, and it rings.

Not in one way. In hundreds.

The rim goes oval. The wall ripples in lobes. Bands run up it. It twists. It bounces.

Here are the first hundred, side by side, from 38 to 516 times a second.

One analysis. A few seconds.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #Rhino3D
```

About 75 words.

## Other openings

- "Tap a tank. It rings a hundred ways."
- "Which shape will your tank shake in?"

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The tank, with the .gh: https://alpaca4d.github.io/examples/natural-vibration/
```

## The numbers, if someone asks

- **The tank:** 4 m across, 5 m tall, a 200 mm concrete wall (E 30 GPa, 2 500 kg/m3), built in at
  its base, open at the top, empty; 31 t. 64 by 30 ASD Shells, 1 920 elements: past the free limit,
  it needs a licence.
- **The modes:** 37.6 Hz the rim going oval, 62.6 Hz the whole tank swaying, 65.8 Hz three lobes,
  111.8 Hz twisting, 172 Hz bouncing up and down, up to 516 Hz for the hundredth. Most come in
  pairs with the same frequency, one turned round from the other.
- **Checked:** on a mesh twice as fine the frequencies move by less than 1%.
- **Drawn:** Model View takes a list of steps, one a mode; its Geometry output is moved onto the grid.
