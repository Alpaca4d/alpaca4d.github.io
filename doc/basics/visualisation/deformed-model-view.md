# Deformed Model View

Draws the displaced shape of the model, coloured by displacement magnitude.

## 🔧 Grasshopper component

`Deformed Model View (Alpaca4d)` — **Alpaca4d ▸ 09_Visualisation**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The analysed model. |
| Step | `Step` | Integer | `0` | Analysis step. On a modal model, the **mode number**. |
| Scale | `Scale` | Number | `1.0` | Displacement magnification. Real displacements are usually far too small to see. |
| Colors | `Colors` | Colour (list) | *Turbo* | Gradient. Feed it from [Colors](colors.md). |
| Range | `Range` | Interval | min/max of this step | Displacement magnitudes the gradient spans, in `m`. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Beam | `Beam` | Mesh (list) | The deformed beams, as coloured meshes. |
| Shell | `Shell` | Mesh (list) | The deformed shells. |
| Brick | `Brick` | Mesh (list) | The deformed solids. |

The three outputs are separate so you can bake, colour or hide each element family
independently. Leave them unplugged and the component still previews.

## 📈 When to use it

**Use it when**

- You have just run an analysis. A displaced shape that looks wrong almost always *is* wrong,
  and it finds a missing restraint or a disconnected member faster than any number.
- You are animating a mode shape — feed a series into **Step**, or drive it from
  [Counter](../utility/counter.md).
- You want a figure for a report.

**Do not use it when**

- You need the values → [Nodal Displacements](../results/nodal-displacements.md).

{% hint style="warning" %}
**Set Range when you compare anything.** Left empty, the gradient rescales to each step's own
min and max, so two steps side by side use different scales and the colours mean different
things. Fix the interval and the comparison becomes honest.

The same applies to **Scale** across load cases.
{% endhint %}

{% hint style="info" %}
On a model from [Natural Vibration](../analysis/natural-vibration.md), `Step` selects the
mode and the shape is a **normalised** mode shape. Its magnitude has no physical meaning, so
pick whatever **Scale** reads well.
{% endhint %}
