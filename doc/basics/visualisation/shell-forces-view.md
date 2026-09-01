# Shell Forces View

Colours the shell mesh by one force resultant.

## 🔧 Grasshopper component

`Shell Forces View (Alpaca4d)` — **Alpaca4d ▸ 09_Visualisation**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The analysed model. |
| ForceType | `ForceType` | Integer | `0` | Which resultant: `0` pxx, `1` pyy, `2` pxy, `3` mxx, `4` myy, `5` mxy, `6` vxz, `7` vyz. |
| Step | `Step` | Integer | `0` | Analysis step. |
| Colors | `Colors` | Colour (list) | *Turbo* | Gradient. Feed it from [Colors](colors.md). |
| Range | `Range` | Interval | min/max of this step | Values the gradient spans. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Info | `Info` | Text | The min and max of the quantity drawn. Feed it to a Panel, or use the values to set **Range** on a second view. |

Units follow [Shell Forces](../results/shell-forces.md): `kN/m` for the membrane and shear
resultants, `kN·m/m` for the moments.

## 📈 When to use it

**Use it when**

- You want to see where a slab's moment concentrates, or how force flows through a wall.
- You are locating the peak before extracting numbers.

**Do not use it when**

- You need the values → [Shell Forces](../results/shell-forces.md).
- You want the principal directions rather than one component →
  [Principal Stress Lines](principal-stress-lines.md).

{% hint style="warning" %}
`pxx`, `myy` and the rest are in each element's **local** axes. If **Local X Axis** was not
set on the [ASD Shell](../elements/shell.md) component, adjacent faces orient themselves
independently and the contour is a mosaic of unrelated quantities — it will look noisy for a
reason that is not physical.
{% endhint %}
