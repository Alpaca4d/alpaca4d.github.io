# Layer Fiber

A row of equally spaced fibres along a curve — a layer of reinforcement.

## 🔧 Grasshopper component

`Layer Fiber (Alpaca4d)` — **Alpaca4d ▸ MomentCurvature_βeta**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Curve | `Curve` | Curve | — | The line the fibres are spread along, in `m`, in the section's local *yz* plane. |
| NumberOfFibers | `NumberOfFibers` | Integer | `3` | How many fibres to space along the curve, **ends included**. |
| AreaFiber | `AreaFiber` | Number | `2.011e-4` | Area of **each** fibre, in `m²`. The default is one 16 mm bar. |
| Material | `Material` | Material | B450C | Material of the fibres. Defaults to [ReinforcingSteel](reinforcing-steel.md) B450C. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Layer | `Layer` | Layer | For the `Layer` input of [Fiber Section](fiber-section.md). |

The component previews the fibres in red, on their black curve.

## 📈 When to use it

**Use it when**

- Bars sit in a row: the tension layer of a beam, a face of a column, a curved layer in a
  circular section — the curve does not have to be straight.
- You want to vary the bar count parametrically without moving points by hand.

**Do not use it when**

- The bars are irregular → [Fiber Point](fiber-point.md) each one.
- You are filling an area rather than a line → [Patch](patch.md).

{% hint style="info" %}
`AreaFiber` is the area of **one** bar, not of the layer. A layer of 5 × 16 mm bars is
`NumberOfFibers = 5` and `AreaFiber = 2.011e-4` — total steel `1.006e-3 m²`.

The fibres are placed **ends included**, so a straight curve from cover to cover puts a bar
at each corner.
{% endhint %}

## 🔗 Relation to OpenSees

The layer is expanded into individual fibres inside the enclosing `section Fiber` block:

```tcl
fiber $yLoc $zLoc $area $matTag
```
