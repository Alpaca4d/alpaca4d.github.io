# Custom Script: LinkedIn post

An OpenSees Tcl script of your own, run from Grasshopper with Alpaca4d, and what it prints read back.
The folder holds the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `grasshopper-definition.png`.
- **Alt text:** A Grasshopper definition: an OpenSees script in a panel, Custom Code and Run
  Analysis, and the log OpenSees printed.

## The post

Copy everything in the box.

```text
Already have an OpenSees script? Run it from Grasshopper.

Paste it into a panel.
Custom Code takes it as the whole model.
Run Analysis runs it as it stands, and what it prints comes back.

Here: a steel portal frame. OpenSees gives a sway of 2.55 mm.
My hand calculation: 2.54 mm.

Alpaca4d. Structural analysis at the speed of design.

Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #Tcl
```

About 65 words.

## First comment

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The script, with the .gh: https://alpaca4d.github.io/examples/custom-script/
```

## The numbers, if someone asks

| What | OpenSees | By hand, linear |
| --- | --- | --- |
| Sway at the top | 2.55 mm | 2.54 mm |
| Base shear | 30.0 kN | 30.0 kN |
| Vertical reactions | 52.1 and 67.9 kN | 52.2 and 67.8 kN |
| Moments at the feet | 14.2 and 58.8 kNm | 14.1 and 58.8 kNm |

- **The frame:** 6 m wide, 4 m tall, HEB 300 columns built in, an IPE 400 beam, 20 kN/m on the beam and 30 kN sideways. The difference is the columns' P-Delta.
