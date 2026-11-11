# Reciprocal vault pushover: LinkedIn post

A barrel vault of 98 birch plywood planks in a pinwheel pattern, each resting on the next, one bolt at
each crossing. Each plank is on fibre sections, and the vault is pressed down with Alpaca4d's Pushover
Analysis until it gives way, Model View drawing its plastic hinges as they form.

Files here:
- `reciprocal-vault-pushover.png`: the still, at the end of the push.
- `-2.png`: the still with its curve.
- `-3.png`: the peak, with its curve.
- `-pushing.mp4`, and a `.gif`: the video, the curve growing under it.
- `-curve.png`: the vault beside the curve Grasshopper draws.
- `-in-grasshopper.png`: that picture beside the canvas.
- the canvas, `grasshopper-definition.png`.

## What to attach

- **The post:** `reciprocal-vault-pushover-pushing.mp4`, the vault sinking and its hinges appearing,
  yellow to dark red, with the curve drawn under it.
- **A carousel instead:** `reciprocal-vault-pushover-3.png`, `reciprocal-vault-pushover-2.png`,
  `reciprocal-vault-pushover-in-grasshopper.png`.
- **Alt text:** A small barrel vault made of plywood planks that rest on each other, pressed down from
  above. It sinks, most of all at its open ends, and balls appear where the planks bend too far,
  yellow at first, then orange, red and dark red as they bend further.
  Under it, a chart of the load against how far the top has moved rises to a peak and falls.

## The post

Copy everything in the box.

```text
How much can a vault of plywood planks carry before it falls?

Each plank rests on the next. One bolt holds each crossing. That is all.

I pressed this vault down, a little at a time.

It carried its own weight and more than twice as much again. Then it gave way.

The open ends went first. Each ball is a plank bending past its limit. Yellow first, then red as it bends further.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #TimberEngineering #ComputationalDesign
```

About 75 words.

## Other openings

- "Planks that hold each other up. How strong is that?"
- "Where does a reciprocal vault give way?"

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The vault, with the .gh: https://alpaca4d.github.io/examples/reciprocal-vault-pushover/
```

## The numbers, if someone asks

- **The vault:** 4 m across, 2 m high, 4.8 m long. 98 planks of birch plywood, 127 x 18 mm, 0.7 to
  1.1 m long, 1.57 kN in all. 168 bolts, each crossing exactly 18 mm deep. 602 elements, so it needs a
  licence.
- **The planks:** Steel01 standing in for plywood, 9 000 MPa, yielding at 25 MPa, in 6 x 8 fibres, on
  ForceBeamColumns with Corotational transformations.
- **The bolts:** Spring Links, 4 000 kN/m across, free to turn about the bolt.
- **The push:** its own weight held, then its weight again added and scaled, the crown controlled to
  600 mm in 200 steps.
- **The curve:** the first hinge at 126 mm, about 1.5 times its weight. The peak at 2.36 times its
  weight added, crown 222 mm down, while the top of an open end has moved 700 mm. Down to 1.66 times at
  600 mm, with 104 hinges.
- **Left out:** plywood breaking (Steel01 yields in tension too) and the bolts slipping, crushing or
  tearing out. A real vault would be softer and weaker.
- **The hinges:** a ball stays once a plank has yielded there, coloured by how far: yellow from first
  yield, orange from 2 times the yield strain, red from 4, dark red from 8; faded once it has unloaded. By
  600 mm: 82 yellow, 10 orange, 3 red, 9 dark red, the most 31 times, in a plank at a foot near an open end; 17 faded.
- **Drawn:** as it is, at true scale, the planks grey.
