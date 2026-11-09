# Response spectrum from sticks: LinkedIn post

Thirty steel sticks, 1 m to 10 m tall, each a tube with a 4 t mass on top, shaken by the first 12 s of
the El Centro earthquake (1940) in Alpaca4d: the most each one moves, against its period, draws the
earthquake's response spectrum, which grows behind them as they shake. Here: the still with the
spectrum behind the sticks, the still with its charts (`-2.png`), the video with its charts
(`-shaking.mp4`, and a `.gif`) and the canvas.

## What to attach

- **The post:** `response-spectrum-shaking.mp4`: the sticks shaking, the spectrum growing behind them
  and in the chart underneath.
- **A carousel instead:** `response-spectrum-2.png`, `response-spectrum.png`,
  `grasshopper-definition.png`.
- **Alt text:** A row of thirty steel sticks, short to tall, each with a mass on top, swaying in an
  earthquake, with the response spectrum they draw growing behind them and plotted underneath.

## The post

Copy everything in the box.

```text
Where does a response spectrum come from?

I built one from thirty sticks.

Each is a steel tube with a weight on top. Short ones swing fast. Tall ones swing slowly.

One real earthquake shakes them all. The most each one moves, against how fast it swings, is the spectrum.

Watch it grow behind them.

The stiff ones feel three times the ground's shaking. The tall ones feel a seventh of that, but move 30 cm.

Alpaca4d. Structural analysis at the speed of design.

Try it free on models up to 50 elements: each stick here is one. Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering #EarthquakeEngineering
```

About 85 words.

## Other openings

- "Thirty sticks, one earthquake."
- "Why do squat buildings feel an earthquake more?"

## First comment

LinkedIn shows posts with links in them to fewer people, so post the links as the first comment:

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The sticks, with the .gh: https://alpaca4d.github.io/examples/response-spectrum/
```

## The numbers, if someone asks

- **The sticks:** thirty S355 CHS 219.1x8 tubes, built in at the ground, 1 m to 10 m tall, a 4 t mass
  on each top; periods 0.09 s to 2.99 s, each from its own Natural Vibration Analysis.
- **The analysis:** each stick a model of its own, damped 5% of critical at its own frequency; El
  Centro north-south, 0.32 g at its peak, the first 12 s, Newmark in 0.005 s steps.
- **The spectrum:** 0.94 g at 0.19 s and 0.90 g at 0.49 s at its peaks; 0.15 g at 2 s; the tallest
  sticks move up to 298 mm. Every stick within 0.4% of a single-degree-of-freedom oscillator solved on
  its own.
- **Free:** each stick's model is one element, inside the free limit of 50.
