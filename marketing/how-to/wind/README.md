# How-to, wind: LinkedIn post

The picture of the how-to guide *Put wind on a building*: a box of shell walls with 0.8 kN/m²
pushing on the windward wall and 0.5 kN/m² of suction on the leeward one, both along the wind
(`wind.png`).

## What to attach

- **The post:** `wind.png`. There is no video of it.
- **A carousel instead:** there is only the one picture.
- **Alt text:** A box of shell walls under wind: a sheet of arrows pushing 0.8 kN/m² on the windward
  wall, and 0.5 kN/m² written on the leeward side.

## The post

Copy everything in the box.

```text
How do you put wind on a building?

Your code gives the numbers. Here, a push on the front wall and a pull on the back.

Name each wall. Type the name into a load. The whole wall is loaded.

The arrows show which way the wind acts, with the value beside them.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #WindEngineering
```

About 80 words.

## Other openings

- "A push on one wall, a pull on the other."
- "Name the wall. Load the wall."

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The guide, put wind on a building: https://alpaca4d.github.io/docs/how-to/loading/wind.html
```

## The numbers, if someone asks

- **In the picture:** 0.8 kN/m² on the windward wall, 0.5 kN/m² of suction on the leeward one.
- **Units:** a Mesh Load's Force in kN/m², a Linear Load's in kN/m, both in global axes.
- **Not along the normal:** the pressure acts in the global direction given, so a curved wall needs
  its faces grouped by direction.
- **Alpaca4d does not compute the pressure:** it comes from your code of practice.
