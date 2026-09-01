# Fiber Point

One fibre of a fibre section: a point, an area, and a material. Typically a single
reinforcing bar.

## 🔧 Grasshopper component

`Fiber Point (Alpaca4d)` — **Alpaca4d ▸ MomentCurvature_βeta**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Point | `Point` | Point | — | Where the fibre sits, in `m`. Its **X is the section's local y**, its **Y the local z**. |
| AreaFiber | `AreaFiber` | Number | `2.011e-4` | Area of the fibre, in `m²`. The default is one 16 mm bar. |
| Material | `Material` | Material | B450C | Material of the fibre. Defaults to [ReinforcingSteel](reinforcing-steel.md) B450C. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| PointFiber | `PointFiber` | PointFiber | For the `PointFiber` input of [Fiber Section](fiber-section.md). |

The component previews the fibre in blue.

## 📈 When to use it

**Use it when**

- Bars are placed individually and irregularly — corner bars, a bundled group, a single
  bar that differs from the rest.
- You are placing one fibre exactly.

**Do not use it when**

- The bars sit in a row → [Layer Fiber](layer.md) spaces them for you from one curve.
- You are filling an area → [Patch](patch.md).

## 💡 Common bar areas

| Diameter | Area (`m²`) |
| --- | --- |
| 10 mm | `7.854e-5` |
| 12 mm | `1.131e-4` |
| 14 mm | `1.539e-4` |
| 16 mm | `2.011e-4` *(default)* |
| 20 mm | `3.142e-4` |
| 25 mm | `4.909e-4` |

## 🔗 Relation to OpenSees

Inside the enclosing `section Fiber` block:

```tcl
fiber $yLoc $zLoc $area $matTag
```
