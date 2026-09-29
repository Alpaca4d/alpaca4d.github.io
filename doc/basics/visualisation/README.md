# 🕶️ Visualisation

The visualisation components draw the model and its results directly in the Rhino viewport.
Before an analysis they are how you catch a modelling mistake; afterwards they are how you
read the answer.

## Components in this tab

| Component | Nickname | Draws |
| --- | --- | --- |
| [Model View](model-view.md) | `ModelView` | The assembled model: elements, supports, loads, constraints, IDs, local axes. |
| [View Results](view-results.md) | `View Results_WIP` | Any result on the model: displacements, beam force diagrams, shell forces and stresses, solid stresses, reactions. |
| [Principal Stress Lines](principal-stress-lines.md) | `Principal Stress Lines` | Streamlines following the principal directions on shells. |
| [Legend](legend.md) | `Legend` | A fixed on-screen colour scale. |
| [Colors](colors.md) | `Colors` | 18 ready-made gradients to feed View Results and Legend. |

## A working habit

1. **Model View** first, every time, before running anything. Turn on supports and loads and
   check they are where you drew them.
2. Run the analysis.
3. [View Results](view-results.md) next, on *Displacement* with **Deformed shape** ticked — a displaced shape
   that looks wrong usually is wrong, and spots a missing restraint faster than any number will.
4. Then switch it to the quantity you actually need, with a [Colors](colors.md) gradient and
   a [Legend](legend.md).

## Colours and ranges

[View Results](view-results.md) has two inputs for this:

- **Colors** — a list of colours forming the gradient. Leave it empty for the default
  (*Turbo*), or feed it from [Colors](colors.md).
- **Range** — a domain fixing the values the gradient spans. Leave it empty and each
  view scales to its own min and max, which means **two views of the same model are not
  comparable**. Set it explicitly whenever you compare load cases or steps.
