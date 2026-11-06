# Playground, the Barn: LinkedIn post

Lesson 4 of the Playground, the website's island game that teaches Alpaca4d in ten lessons: one
timber portal frame of a barn in the wind, its knees bolted and its posts set in concrete. Here:
the steps (`01-frame.png`, `03-hinged-knees.png`, `06-wind.png`, `08-assemble.png`), wrong picks
(`02-posts-weak-way.png`, `04-four-hinges-fold.png`, `05-roller.png`, `07-wind-across.png`), the
lesson done (`09-done.png`), the game on a phone (`10-phone.png`) and the frame close up
(`11-the-frame.png`).

## What to attach

- **The post:** `04-four-hinges-fold.png`: the wrong pick that folds the frame, labelled
  "1.5 km: the frame folds". There is no video of it.
- **A carousel instead:** none: the other pictures show other picks, and this post is about the fold.
- **Alt text:** A low-poly barn frame lying folded flat on its floor beside the alpaca, labelled
  "1.5 km: the frame folds", next to the Grasshopper snippet that pinned its feet.

## The post

Copy everything in the box.

```text
Can a frame fold flat in the wind?

In the Alpaca4d Playground, you build a timber barn frame, piece by piece.

Pick the wrong piece, and it gets hinges at its feet too.

Four hinges. Nothing holds it square. It folds.

The software still gives a number: 1.5 km. A number is not a check.

Alpaca4d. Structural analysis at the speed of design.

Play it free in your browser. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #EngineeringEducation
```

About 85 words.

## Other openings

- "Four hinges, and the barn moves 1.5 km."
- "The software gave an answer. The frame had folded."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Play it free in your browser: https://alpaca4d.github.io/playground.html#barn
The lesson, with its Grasshopper file: https://alpaca4d.github.io/docs/learn/04-barn.html
```

## The numbers, if someone asks

- **The frame:** C24 timber posts 4 m tall, 6 m apart, and a beam across their tops, all 200 × 300
  mm; 3 kN of wind at the top of the first post.
- **How far it sways:** 6.8 mm with hinged knees and clamped feet, by hand (Hh³/6EI) and in
  OpenSees.
- **Try:** rigid knees, 2.8 mm; one knee hinged, 4.6 mm; pinned feet and rigid knees, the classic
  portal, 12.0 mm; posts the weak way, 15.3 mm; four hinges, 1.5 km; the wind across the barn, 23 mm.
- **Why the folded frame still solves:** Alpaca4d leaves a released joint a millionth of its
  stiffness.
