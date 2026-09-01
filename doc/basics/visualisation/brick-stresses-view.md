# Brick Stresses View

Colours solid elements by one stress component.

## 🔧 Grasshopper component

`Brick Stresses View (Alpaca4d)` — **Alpaca4d ▸ 09_Visualisation**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The analysed model. |
| StressType | `StressType` | Integer | `0` | Which component: `0` σ₁₁, `1` σ₂₂, `2` σ₃₃, `3` σ₁₂, `4` σ₂₃, `5` σ₁₃, `6` Von Mises. |
| Step | `Step` | Integer | `0` | Analysis step. |
| Colors | `Colors` | Colour (list) | *Turbo* | Gradient. Feed it from [Colors](colors.md). |
| Range | `Range` | Interval | min/max of this step | Values the gradient spans, in `kN/m²`. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Info | `Info` | Text | The min and max of the quantity drawn. |

## 📈 When to use it

**Use it when**

- You want to find where a solid region is working hardest — **Von Mises** (`6`) is the usual
  first look.
- You are checking a detail: a bearing, an anchorage, a re-entrant corner.

**Do not use it when**

- You need the values → [Brick Stresses](../results/brick-stresses.md).

{% hint style="info" %}
An [SSP Brick](../elements/brick.md) has one integration point, so each element is a single
flat colour. The contour is as coarse as the mesh — refine where the gradient is steep, and
do not read a stress concentration off a coarse mesh.
{% endhint %}
