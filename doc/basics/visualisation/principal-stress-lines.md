# Principal Stress Lines

Traces streamlines that follow the **principal stress directions** across a shell. Where a
contour shows how much, these show which way — the load paths through a plate.

## 🔧 Grasshopper component

`Principal Stress Lines (Alpaca4d)` — **Alpaca4d ▸ 09_Visualisation**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | An analysed model with shell elements. |
| Step | `Step` | Integer | `0` | Analysis step. |
| Seed | `S` | Point (list) | — | Where the lines start. |
| Step Tolerance | `T` | Number | `0.3` | Integration step size along a line. Smaller is smoother and slower. |
| Single Line | `SL` | Boolean | `false` | `true` traces one line through the seed; `false` grows a field of lines from it. |
| Poisson's ratio | `v` | Number | `0.0` | Poisson's ratio used when evaluating the principal directions. |
| Bending Stress Lines | `BSL` | Boolean | `false` | `true` uses rotations, giving the **bending** principal directions; `false` uses in-plane displacements, giving the **membrane** ones. |
| Separation | `dSep` | Number | `0.5` | Target spacing between neighbouring lines, in field mode. |
| Test Dist. | `dTest` | Number | `0.0` | A new line stops when it comes closer than this to an existing one. `0` disables the check. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Stress Lines Dir1 | `SL1` | Curve (list) | Lines following the first principal direction. |
| Stress Lines Dir2 | `SL2` | Curve (list) | Lines following the second principal direction, orthogonal to the first. |

## 📈 When to use it

**Use it when**

- You are laying out reinforcement in a slab or a wall and want the bars to follow the force.
- You are looking for the load path through a plate — where the arching, the fan, the strut
  actually goes.
- You are working out where to place ribs, stiffeners, or the members of a discrete structure
  that replaces the shell.

**Do not use it when**

- You need a magnitude → [Shell Forces View](shell-forces-view.md) or
  [Shell Forces](../results/shell-forces.md).
- The model has no shells. The component reads shell results only.

## 💡 Tuning it

Start with one seed and **Single Line** on, to check the direction field is sensible. Then
turn it off and adjust:

- **Separation** controls how dense the field is.
- **Test Dist.**, once non-zero, stops lines crowding — set it a little below **Separation**.
- **Step Tolerance** smooths each line. Reduce it if the curves look faceted; expect it to
  cost time.

Set **Bending Stress Lines** to match the problem: membrane directions for a wall in its own
plane, bending directions for a slab in flexure. They are generally not the same field.
