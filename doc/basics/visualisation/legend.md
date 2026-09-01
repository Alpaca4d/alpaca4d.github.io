# Legend

Draws a fixed on-screen colour scale — the key that makes a contour readable.

## 🔧 Grasshopper component

`Legend (Alpaca4d)` — **Alpaca4d ▸ 09_Visualisation**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Title | `Title` | Text | *(empty)* | Heading above the scale. Put the quantity and its unit here — `mxx [kN·m/m]`. |
| Data | `Data` | Number (list) | *(empty)* | Numbers the min and max labels are taken from. |
| Colors | `Colors` | Colour (list) | *Turbo* | The gradient, same list you gave the contour component. |
| Position | `Pos` | Integer | `0` | `0` left, `1` right, `2` bottom centre. |
| Scale | `Scale` | Number | `1.5` | Size multiplier. Values at or below zero fall back to `1.5`. |

### Outputs

None. The component draws straight to the viewport.

## 📈 When to use it

**Use it when**

- Any time you show a contour from [Deformed Model View](deformed-model-view.md),
  [Shell Forces View](shell-forces-view.md) or
  [Brick Stresses View](brick-stresses-view.md). A contour without a scale says nothing.
- You are producing a figure for a report.

## 💡 Getting it to agree with the contour

The legend does **not** read the contour component — it reads whatever you give it. To keep
the two in step:

- Feed **Colors** from the same [Colors](colors.md) component that feeds the contour.
- Feed **Data** with the same numbers, from the matching
  [Results](../results/README.md) component.
- If you fixed **Range** on the contour, give the legend the same two numbers as **Data** so
  the labels match the gradient.

The legend is drawn in **screen space**, so it stays put and stays the same size as you orbit
and zoom.
