# MPCO Recorder

Chooses which results [Run Analysis](analysis/run-analysis.md) writes to the results file,
in place of the set it picks for the analysis type. Untick what you do not need, and a big
analysis runs faster and writes a smaller file.

The file is an MPCO (HDF5) file. The [Results](results/README.md) components and
[View Results](visualisation/view-results.md) read it back, and STKO opens it too.

## 🔧 Grasshopper component

`MPCO Recorder (Alpaca4d)` — **Alpaca4d ▸ 06_Assemble**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| FileName | `FileName` | Text | `recorder.mpco` | Name of the results file, written beside the Grasshopper document. Letters, digits, `_`, `-` and `.` only, with no folders. A name without an extension gets `.mpco`. |

### Options

Two menus live on the component body, **Nodes** and **Elements**, with one tick box per result.
There is a box for every result a result component can read, and all of them start ticked, so
adding the component changes nothing until you untick something.

| Box | Read by |
| --- | --- |
| `displacement`, `rotation` | [Nodal Displacements](results/nodal-displacements.md), [View Results](visualisation/view-results.md), [Principal Stress Lines](visualisation/principal-stress-lines.md) |
| `velocity`, `angularVelocity`, `acceleration`, `angularAcceleration` | [Nodal Displacements](results/nodal-displacements.md), after a transient analysis |
| `reactionForce`, `reactionMoment` | [Reaction Forces](results/reaction-forces.md), [View Results](visualisation/view-results.md) |
| `stresses` | [Brick Stresses](results/brick-stresses.md), [View Results](visualisation/view-results.md) |
| `section.force` | [Beam Forces](results/beam-forces.md), [Shell Forces](results/shell-forces.md), [View Results](visualisation/view-results.md), for every beam with or without hinges and every shell |
| `section.fiber.stress` | Shell Stresses, [View Results](visualisation/view-results.md), for plate fibre and layered shell sections |

The first eight are in **Nodes**, the last three in **Elements**.

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Recorder | `Recorder` | Recorder | The recorder, for the **Recorders** input of [Assemble](assemble.md). |

## 📈 When to use it

**Use it when**

- A large model or a long transient analysis records results you will never read. Untick
  them and the run gets faster and the file smaller.
- One Grasshopper document holds two analyses. Give each its own **FileName**, or the second
  run overwrites the first one's results.

**Do not use it when**

- The default suits you. Leave the **Recorders** input of [Assemble](assemble.md) empty and
  Run Analysis picks the set itself (see below).
- You are running [Natural Vibration](analysis/natural-vibration.md). It always records the
  mode shapes to `recorder_eigen.mpco` itself, and ignores the recorders on Assemble.

## 💡 Notes

- **What Run Analysis records without one.** A static analysis records `displacement`,
  `rotation`, `reactionForce` and `reactionMoment`, plus the three element results. A
  transient analysis adds `velocity`, `angularVelocity`, `acceleration` and
  `angularAcceleration`. Connect an MPCO Recorder and exactly what it ticks is recorded
  instead.
- **Asking for something that was not recorded.** The result component says which box to
  tick. [Nodal Displacements](results/nodal-displacements.md) leaves that output empty with a
  note, and still fills the others.
- **Only results Alpaca4d can read have a box.** MPCO records much more, but no component
  would read it back yet.
- **Every converged step is recorded.** There is no option to record every *n*-th step yet.
- **Two recorders cannot share a file.** Run Analysis stops with an error if two write to the
  same **FileName**.
- **Run Analysis with "Do not use settings" ticked** runs the deck as it stands, and writes
  no recorder into it. It warns when Assemble was given one.

## 🔗 Relation to OpenSees

```tcl
recorder mpco $fileName -N $nodalResult1 $nodalResult2 ... -E $elementResult1 $elementResult2 ...
```

What a static analysis records when nothing is connected:

```tcl
recorder mpco recorder.mpco -N displacement rotation reactionForce reactionMoment -E stresses section.force section.fiber.stress
```

The MPCO recorder was written by M. Petracca and G. Camata at
[ASDEA Software Technology](https://asdeasoft.net/?product-stko).
