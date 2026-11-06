# Inigo the Dragon: LinkedIn post

A concrete dragon 5.5 m tall on its two feet, in 10 903 Ten Node Tetrahedra, and the ways it vibrates,
from a Natural Vibration analysis. Here: two modes moving, the wings (`mode-4-wings.mp4`) and the sway
(`mode-0-sway.mp4`), each with a `.gif`; four modes as stills (`mode-0.png`, `mode-1.png`, `mode-4.png`,
`mode-5.png`); the canvas (`grasshopper-definition.png`) and the canvas beside the result
(`inigo-in-grasshopper.png`). The docs' pictures of it are one folder up: `../inigo-the-dragon.png` and
`../inigo-the-dragon-2.png`.

## What to attach

- **The post:** `mode-4-wings.mp4`. A 2.4 s loop of the dragon flapping its wings and swinging its tail;
  it needs no sound. `mode-0-sway.mp4`, the dragon swaying forward and back, would make a post of its
  own.
- **A carousel instead:** `mode-4.png`, `mode-5.png`, `inigo-in-grasshopper.png`.
- **Alt text:** A concrete dragon made of small tetrahedra, standing on two feet, flapping its wings and
  swinging its tail, coloured by how much each part moves.

## The post

Copy everything in the box.

```text
How does a dragon vibrate? 🐉

I made a 5.5 m concrete dragon and stood it on its two feet. No load, just its mass.

The computer finds the ways it likes to shake.

This one is about 60 times a second. The wings flap and the tail swings.

Your next model won't be a dragon. But thin parts need checking too.

Alpaca4d finds these with OpenSees, in Grasshopper.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #StructuralDynamics
```

About 90 words.

## Other openings

- "I asked a dragon how it shakes."
- "Wings are the first thing to move."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The dragon, with the .gh: https://alpaca4d.github.io/examples/inigo-the-dragon/
```

## The numbers, if someone asks

| Mode | Step | Frequency | Shape |
| --- | --- | --- | --- |
| 1 | 0 | 7.7 Hz | sways forward and back (`mode-0`) |
| 2 | 1 | 21.8 Hz | sways side to side (`mode-1`) |
| 3 | 2 | 41.5 Hz | wags its tail, and the wings rock |
| 4 | 3 | 59.1 Hz | both wings flap together |
| 5 | 4 | 60.1 Hz | the wings flap against each other, and the tail swings (`mode-4`) |

- **The files are named by Step**, the slider that counts from 0: `mode-4` is the fifth mode, at 60.1 Hz.
  The post says "about 60 times a second", which is true of both wing modes.
- **The dragon:** Keenan Crane's Inigo, public domain (CC0), rebuilt on a grid for meshing: grown by
  4.5 cm all over, gaps under 18 cm filled, soles cut flat. 10 903 Ten Node Tetrahedra on 3 511 corner
  points, concrete C30/37 at 2 500 kg/m³: 11.4 m³, 28.5 t. Held at every node on the soles.
- **A mode has no size of its own:** the colours show where the dragon moves most, not by how much.
- **What it needs:** an OpenSees newer than 3.8.0, and a licence (10 903 elements).
