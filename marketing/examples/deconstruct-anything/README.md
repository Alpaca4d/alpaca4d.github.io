# Deconstruct Anything: LinkedIn post

Deconstruct opening every object of an Alpaca4d model: a beam, its section and material, a load, the
model and its nodes. The folder holds the canvas (`grasshopper-definition.png`).

## What to attach

- **The post:** `grasshopper-definition.png`.
- **Alt text:** A Grasshopper definition: a cantilever, and Deconstruct components opening its beam,
  section, material, load, model and nodes.

## The post

Copy everything in the box.

```text
What's inside an Alpaca4d object? Plug it into Deconstruct.

Every field and property gets an output of its own.
A beam gives its section. The section gives its area and second moments.
The model gives every node.

Use it to check what reached a component, or to read a number shown nowhere else.

Alpaca4d. Structural analysis at the speed of design.

Link in the comments.

#Grasshopper #OpenSees #StructuralEngineering
```

About 65 words.

## First comment

```text
Download Alpaca4d (Rhino 7 and 8, Windows and macOS): https://alpaca4d.github.io/download.html
The definition: https://alpaca4d.github.io/examples/deconstruct-anything/
```

## The numbers, if someone asks

| What | Value |
| --- | --- |
| The beam | IPE 300 of S355, 4 m, built in, 10 kN at the tip |
| Area | 51.9 cm², the section without root fillets |
| Second moments | Iyy 603 cm⁴, Izz 8 000 cm⁴ (local y up: Izz is the strong axis) |
| Nodes | two, at (0, 0, 0) and (4, 0, 0), 6 degrees of freedom each |
