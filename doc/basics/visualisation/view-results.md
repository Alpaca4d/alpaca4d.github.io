# View Results

Draws any result of an analysed model in the viewport: displacements, beam force diagrams,
beam stresses, shell forces, shell stresses, solid stresses and reactions. It shows one result at a time, on
the undeformed shape or the deformed one.

## 🔧 Grasshopper component

`View Results_WIP (Alpaca4d)` — **Alpaca4d ▸ 09_Visualisation**

<figure><img src="../../.gitbook/assets/components/view-results-wip.png" alt="View Results_WIP component" width="393"><figcaption></figcaption></figure>

<figure><img src="../../.gitbook/assets/components/view-results-wip-open.png" alt="View Results_WIP component with every menu open" width="393"><figcaption><p>With every menu open</p></figcaption></figure>

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The analysed model, from [Run Analysis](../analysis/run-analysis.md), [Natural Vibration](../analysis/natural-vibration.md) or [Linear Buckling](../analysis/linear-buckling.md). The results are read from the recorder file it points at. |
| Step | `Step` | Integer | `0` | Which recorded step to draw, or which mode after a natural vibration or buckling analysis. |
| ElementId | `ElementId` | Text (list) | *(empty)* | Draw only some elements' results: an ElementId (`MyBeam_3`), a wildcard over them (`MyBeam*`, `Col_?`), an element tag (`47`) or a regular expression (`regex:^Col`), mixed freely. What is left out is greyed rather than hidden. Empty draws them all. |
| Colors | `Colors` | Colour (list) | Turbo | The gradient to colour with, from the low end to the high. Connect [Colors](colors.md) for a ready-made one. With **Iso-surfaces** on, each colour is one band of values. Beam force diagrams ignore it and use the colour that belongs to the force. |
| Range | `Range` | Domain | *(empty)* | The range the gradient is stretched over, in the unit picked under **Unit**. Left empty it fits what is drawn, which makes two steps impossible to compare: set it to compare them. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Info | `Info` | Text | What is drawn, the unit it is in, and the range it spans — `Displacement - Uz [mm], step 0, min -12.3, max 0`. |
| Values | `Values` | Number (list) | The value each colour stands for, one per colour of **Colors**, from the low end to the high — over **Range** when it is set — in the unit picked under **Unit**. With **Iso-surfaces** on, the edges of the bands instead, one more than there are colours. Feed it to the **Data** input of [Legend](legend.md). |
| Colors | `Colors` | Colour (list) | The gradient used. Feed it to the **Colors** input of Legend, so the legend and the model agree. |

### Result menu

What to draw. The menu starts open.

| Control | Options | Shown |
| --- | --- | --- |
| Result | Displacement, Beam forces, Beam stresses, Shell forces, Shell stresses, Brick stresses, Reactions | Always |
| Component | Those of the result, below | Always |
| Unit | Those of the component, below | Always |
| Layer through the thickness | Top, Middle, Bottom | For *Shell stresses* |
| Reactions drawn as | Selected component, Resultant, All three | For *Reactions* |
| Read in which axes | Global, Local — the element's own axes, from its node numbering | For *Brick stresses* |

| Result | Components |
| --- | --- |
| Displacement | Magnitude, Ux, Uy, Uz |
| Beam forces | N, Vy, Vz, Torsion, My, Mz |
| Beam stresses | σN, σMy, σMz, σmax, σmin, τV, τT, VonMises |
| Shell forces | fxx, fyy, fxy, mxx, myy, mxy, vxz, vyz |
| Shell stresses | σ11, σ22, σ12, σ23, σ31, VonMises |
| Brick stresses | σ11, σ22, σ33, σ12, σ23, σ13, VonMises |
| Reactions | Force, Fx, Fy, Fz, Moment, Mx, My, Mz |

**Unit** offers the units of the component picked. A new View Results starts in the unit in bold.
**Info**, **Values**, the values written on the model and **Range** are all in the unit picked, so
a legend fed from **Values** reads in it too, and a **Range** is typed in it.

| Component | Units |
| --- | --- |
| Displacement | **mm**, cm, m |
| N, Vy, Vz of *Beam forces*; Force, Fx, Fy, Fz of *Reactions* | N, **kN**, MN |
| Torsion, My, Mz of *Beam forces*; Moment, Mx, My, Mz of *Reactions* | N·mm, N·m, kN·cm, **kN·m**, MN·m |
| Every stress — *Beam*, *Shell* and *Brick stresses* | kPa (= kN/m²), **MPa** (= N/mm²), kN/cm² |
| fxx, fyy, fxy, vxz, vyz of *Shell forces* | N/m, **kN/m** (= N/mm), MN/m |
| mxx, myy, mxy of *Shell forces* | N·m/m, **kN·m/m**, MN·m/m |

Each kind of quantity keeps its own unit: pick mm for a displacement and MPa for a stress, and
switching between the two finds each where you left it. A definition saved before **Unit** existed
opens in the units the solver works in — m, kN, kN·m, kPa, kN/m, kN·m/m, and MPa for beam
stresses — which is what it drew then, so a **Range** wired into it keeps its meaning.

### Display menu

How to draw it. The menu starts folded; click its header to unfold it.

| Control | Default | Does | Shown |
| --- | --- | --- | --- |
| Deformed shape | off | Draws the result on the deformed shape. | Always |
| Deformation scale | `1`, from 0 to 200 | How much the deformation is magnified. | With **Deformed shape** on |
| Animate | off | Sweeps the deformation scale from the slider's least value to its greatest and back, moving the slider with it. It reads *Stop animation* while it runs. | With **Deformed shape** on |
| Extruded beams | off | Draws each beam as its cross-section, coloured by the result. | Always |
| Diagram and arrow scale | `1`, from 0 to 20 | Stretches the beam force diagrams and the reaction arrows. | For *Beam forces* and *Reactions* |
| Iso-surfaces | off | Colours in bands — one flat colour per range of values — instead of a smooth gradient. See [Iso-surfaces](#iso-surfaces). | For every result but *Beam forces* |
| Element edges | on | Draws the edges of the shell, solid and extruded beam elements. | Always |
| Show values | off | Writes values on the model, in the unit picked, to four significant figures: each beam's largest, at the tip of its diagram for beam forces; each shell or solid element's at its centre; each reaction at its arrow. | Always |
| Value text size | `0.5`, from 0.05 to 5 | The height of those values, in model units. | With **Show values** on |

Connect the analysed model from [Run Analysis](../analysis/run-analysis.md) or
[Natural Vibration](../analysis/natural-vibration.md), then pick what to draw from the
**Result** menu on the component body. After a natural vibration analysis, **Step** selects
the mode.

Feed its **Values** and **Colors** outputs to [Legend](legend.md), so the scale matches what is
drawn. **Values** follows **Range**, so the legend matches with or without one.

*Beam stresses* colours each beam along its length by any output of
[Beam Stresses](../results/beam-stresses.md) — σN, σMy, σMz, σmax, σmin, τV, τT or Von Mises —
in MPa unless another **Unit** is picked, with each integration point's colour placed where the point sits on the beam. It is the third entry
of the **Result** menu, after *Beam forces*.

*Beam forces* draws each force as a diagram in the plane it acts in, in the beam's local axes
(turn on **Local Axes** in [Model View](model-view.md) to see them): Vy and Mz across local *y*,
Vz and My across local *z*, N and torsion across local *y*. **Moments are drawn on the tension
side** — on a beam with local *y* up, sagging hangs below it; the other forces are drawn
towards the positive axis. One scale serves the whole model, so the heights compare from one
beam to the next; **Diagram and arrow scale** stretches it. With **Show values** on, each beam's
largest value is written at the tip of its diagram. The signs of the numbers are those
of [Beam Forces](../results/beam-forces.md).

**Extruded beams** draws each beam as its cross-section, on the deformed shape too, coloured by
whatever result is picked.

### Iso-surfaces

With **Iso-surfaces** ticked, the range is cut into as many equal bands as there are colours in
**Colors**, and everything in a band is drawn in that band's colour, flat. Where the value
crosses from one band into the next, the element is cut along the line where it does, so the
bands meet in a sharp edge across the elements rather than blending into each other. It reads
like a contour map: which parts are over a value, and where the boundary runs, is plain at a
glance.

- **The number of bands is the number of colours.** [Colors](colors.md) gives ten; give
  **Colors** a list of your own for more or fewer.
- **Range** sets the bands as it sets the gradient: give it `0 to 10` with ten colours and each
  band is one unit wide.
- Anything below the range is in the first band, and anything above it in the last.
- Shells, solids, beams — lines or extruded — and reaction arrows are all banded. *Beam forces*
  is not: its diagrams take the colour of the force, not the gradient.
- **Element edges** still draws the elements' own edges, not the cuts between bands.

**Values** then holds the edges of the bands, one more than there are colours, and
[Legend](legend.md) wired to it writes them on the lines between its swatches, so each swatch
reads as the band from one label to the next.

## 🔁 Instead of the old view components

View Results replaces the separate view components. They are hidden from the ribbon, but
definitions that already use them still open.

| You used | In View Results |
| --- | --- |
| Deformed Model View | *Displacement*, with **Deformed shape** ticked |
| Beam Forces View | *Beam forces* |
| Shell Forces View | *Shell forces* |
| Shell Stresses View | *Shell stresses* |
| Brick Stresses View | *Brick stresses* |
