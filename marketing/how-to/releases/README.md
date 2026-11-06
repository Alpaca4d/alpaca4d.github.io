# How-to, releases: LinkedIn post

The picture of the how-to guide *Release the end of a beam*: a portal frame whose beam is pinned at
both ends, with Model View drawing a circle at each released end, under a 10 kN push at the knee
and 5 kN/m along the beam (`releases.png`).

## What to attach

- **The post:** `releases.png`. There is no video of it.
- **A carousel instead:** there is only the one picture.
- **Alt text:** A steel portal frame with a 10 kN push at one knee and 5 kN/m along its beam; a blue
  circle at each end of the beam marks where it is released.

## The post

Copy everything in the box.

```text
Is that beam really pinned?

You bolted it between two columns. On paper, its ends turn freely. Does your model agree?

Release its ends. A small circle appears at each free end.

Here, both ends of the beam are free to turn. You can see it at a glance.

Check it before you run it, not after.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #SteelDesign
```

About 80 words.

## Other openings

- "On paper the ends turn freely. Does your model agree?"
- "A small circle says: this end is free to turn."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The guide, release the end of a beam: https://alpaca4d.github.io/docs/how-to/supports-and-releases/hinges.html
```

## The numbers, if someone asks

- **The release:** a very soft hinge section, its stiffness scaled by 10⁻⁶.
- **The hinge lengths, LpI and LpJ:** a fraction of the beam's length, 0.05 unless given, kept
  between 0.02 and 0.10.
- **Torsion:** release Rx at one end only; released at both, the beam can spin about its own axis.
- **In the picture:** 10 kN sideways at a knee, 5 kN/m down along the beam.
