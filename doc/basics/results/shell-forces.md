# Shell Forces

The stress resultants on every shell element: membrane forces, bending moments and
transverse shears, all per unit width.

## 🔧 Grasshopper component

`Shell Forces (Alpaca4d)` — **Alpaca4d ▸ 08_NumericalOutput**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The analysed model. |
| History | `History` | Boolean | `false` | Not implemented. |
| Step | `Step` | Integer | `0` | Analysis step. |

### Outputs

One branch per shell element, values at the element's integration points.

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| pxx | `pxx` | Number (tree) | Membrane force along local *x*, in `kN/m`. |
| pyy | `pyy` | Number (tree) | Membrane force along local *y*, in `kN/m`. |
| pxy | `pxy` | Number (tree) | In-plane shear, in `kN/m`. |
| mxx | `mxx` | Number (tree) | Bending moment about local *x*, in `kN·m/m`. |
| myy | `myy` | Number (tree) | Bending moment about local *y*, in `kN·m/m`. |
| mxy | `mxy` | Number (tree) | Twisting moment, in `kN·m/m`. |
| vxz | `vxz` | Number (tree) | Transverse shear on the *x* face, in `kN/m`. |
| vyz | `vyz` | Number (tree) | Transverse shear on the *y* face, in `kN/m`. |

## 📈 When to use it

**Use it when**

- You are designing slab or wall reinforcement — `mxx`, `myy` and `mxy` are what go into a
  Wood–Armer calculation.
- You need membrane forces in a shear wall or a tank.

**Do not use it when**

- You want a contour → [Shell Forces View](../visualisation/shell-forces-view.md).
- You want the principal directions → [Principal Stress
  Lines](../visualisation/principal-stress-lines.md) traces them as curves.

{% hint style="warning" %}
**These are local-axis results, and the local axes are per face** unless you set them. Two
adjacent faces of the same slab can report `mxx` about different directions, which makes the
numbers meaningless to compare or to contour.

Set **Local X Axis** on the [ASD Shell](../elements/shell.md) component for any model whose
shell results you intend to read.
{% endhint %}

## 💡 Sign convention

All quantities are **per unit width**. Positive membrane force is tension. A positive `mxx`
puts the bottom face — the face on the negative local *z* side — in tension.
