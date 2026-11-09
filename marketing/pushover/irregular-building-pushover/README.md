# Irregular building pushover: LinkedIn post

A small reinforced concrete building that is not regular - an L in plan, a tall ground storey, a top
storey set back - its members on fibre sections, carrying its own weight and its floors and pushed
sideways to 3% drift with Alpaca4d's Pushover Analysis, Model View drawing its plastic hinges as they
form. Here: the still, the still with its capacity curve (`-2.png`), the video with the curve growing
under it (`-pushing.mp4`, and a `.gif`), the building beside the curve Grasshopper draws (`-curve.png`),
that beside the canvas (`-in-grasshopper.png`) and the canvas.

## What to attach

- **The post:** `irregular-building-pushover-pushing.mp4`, the building leaning further and its hinges
  appearing, its capacity curve drawn under it.
- **A carousel instead:** `irregular-building-pushover-2.png`, `irregular-building-pushover-in-grasshopper.png`,
  `grasshopper-definition.png`.
- **Alt text:** A small L-shaped concrete building with a set-back top floor, pushed sideways until it
  leans. Orange and purple balls appear at the ends of its beams and columns where it yields, most of
  them on the ground floor, with a chart under it of the force against how far the top has moved.

## The post

Copy everything in the box.

```text
Where does a building give way when you push it?

I pushed this small concrete building sideways, a little at a time.

Each ball is a plastic hinge. Orange: the steel bars yield. Purple: the concrete crushes.

The first hinges appear in the beams. Then the ground floor columns go, top and bottom.

Its ground floor is taller than the rest, so it takes most of the sway. And the L-shaped plan twists.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #EarthquakeEngineering
```

About 85 words.

## Other openings

- "What makes a soft storey soft?"
- "Watch the hinges: that is where this building would fail."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The building, with the .gh: https://alpaca4d.github.io/examples/irregular-building-pushover/
```

## The numbers, if someone asks

- **The building:** an L of three bays, 6 and 5 m by 5 and 5 m; a ground storey 4 m tall, a second of
  3.2 m, a third of 3.2 m over one corner; 10.4 m tall. 20 columns and 24 beams, 44 members, so it runs
  without a licence.
- **The sections:** C25/30 concrete (Concrete01) in fibres and B450C bars (ReinforcingSteel): 400 x 400
  columns with eight φ20, 500 x 300 beams with three φ20 top and bottom; GJ a cracked section's.
- **The loads held:** its own weight and 20 kN/m on every beam, about 3 300 kN in all.
- **The push:** a load on every node above the ground, larger the higher up, scaled until the top has
  moved 312 mm, 3% of the height, in 200 steps of displacement control, with P-Delta.
- **The curve:** the first hinges at 42 mm, 373 kN, at the first-floor beams; the ground columns' feet
  from 69 mm; their concrete crushing from 119 mm; the peak 742 kN, a little over a fifth of its weight,
  at 268 mm; 50 hinges by 312 mm. Without P-Delta it would climb on to about 850 kN.
- **The irregularities:** the first floor moves up to 196 mm of the top's 312, nearly 5% drift over 4 m
  against 3% overall - a soft storey; across it, one side moves 103 mm and the other 196 - the L twisting.
- **Drawn:** the sway twice as large as it is.
