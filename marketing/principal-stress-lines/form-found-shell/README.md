# Form-Found Shell: LinkedIn post

A net 10 x 10 m held at its four corners and pushed up by Kangaroo into a shell, then analysed with
Alpaca4d as concrete under its own weight, with its principal stress lines in its surface. Here: the form
being found, analysed at every step (`shell-form-finding.mp4`), the lines growing (`shell-growing.mp4`),
the shell spinning (`shell-spin.mp4`) and walked under (`shell-walk-through.mp4`), each with a `.gif`;
from four sides (`shell.png`, `shell-clean.png`, `shell-above.png`, `shell-low.png`, `shell-top.png`),
the canvas (`grasshopper-definition.png`) and the canvas beside the result (`shell-in-grasshopper.png`).

## What to attach

- **The post:** `shell-form-finding.mp4`. 7 s of the net rising into a shell, its lines moving with it;
  it needs no sound.
- **A carousel instead:** `shell.png`, `shell-low.png`, `shell-top.png`, `shell-in-grasshopper.png`.
- **Alt text:** A square net held at its four corners rising into a shell, covered in purple and blue
  lines that run down into the corners.

## The post

Copy everything in the box.

```text
Your shell looks right. But does it work?

I held a 10 m square net at its corners, and Kangaroo pushed it up. It rose about 3.6 m.

Then I made it 8 cm of concrete, under its own weight.

It carries its weight in compression. The lines run down into the corners.

Alpaca4d checks it with OpenSees, in the same Grasshopper file.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #ShellStructures
```

About 85 words.

## Other openings

- "Looking right isn't the same as working."
- "Kangaroo finds the shape. Alpaca4d checks it."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
Principal Stress Lines: https://alpaca4d.github.io/docs/basics/visualisation/principal-stress-lines.html
```

## The numbers, if someone asks

- **The form:** a flat net 10 x 10 m in 24 x 24 quads, held at each corner and its two neighbours,
  pushed up by a load on every node, its edges springs as long as the flat net's; Kangaroo's Zombie
  Solver finds the form, rising about 3.6 m.
- **The shell:** concrete, 80 mm thick, pinned where the net was held, under its own weight; it carries
  it in compression.
- **The video:** Kangaroo's iterations moved evenly from the flat net to the finished form; at each, the
  model is analysed and its lines traced again.
- **Needs:** Kangaroo2, which Rhino 7 and 8 ship; a licence, as 576 shells is over the free 50. No example
  page: the definition was made for these pictures.
