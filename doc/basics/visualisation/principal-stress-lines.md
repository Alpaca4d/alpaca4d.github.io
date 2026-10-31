# Principal Stress Lines

Traces streamlines that follow the **principal stress directions** across a shell. Where a
contour shows how much, these show which way — the load paths through a plate.

## 🔧 Grasshopper component

`Principal Stress Lines (Alpaca4d)` — **Alpaca4d ▸ 09_Visualisation**

<figure><img src="../../.gitbook/assets/components/principal-stress-lines.png" alt="Principal Stress Lines component" width="348"><figcaption></figcaption></figure>

<figure><img src="../../.gitbook/assets/components/principal-stress-lines-open.png" alt="Principal Stress Lines component with every menu open" width="348"><figcaption><p>With every menu open</p></figcaption></figure>

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | An analysed model with shell elements. |
| Step | `Step` | Integer | `0` | Analysis step. |
| Seed | `S` | Point (list) | — | Where the lines start. |
| Step Tolerance | `T` | Number | `0` | Integration step along a line. `0` takes a third of the shells' mean edge length, so the default suits the model's units. Smaller is smoother and slower. |
| Single Line | `SL` | Boolean | `false` | `true` traces one line through the seed; `false` grows a field of lines from it. |
| Poisson's ratio | `v` | Number | `0.0` | Not used. For an isotropic elastic material the principal directions do not depend on it; the input is kept so that older files still open. |
| Bending Stress Lines | `BSL` | Boolean | `false` | `true` uses rotations, giving the **bending** principal directions; `false` uses in-plane displacements, giving the **membrane** ones. In bending, direction 1 is the moment that stretches the face each shell's normal points to most. |
| Separation | `dSep` | Number | `0` | Target spacing between neighbouring lines, in field mode. `0` takes twice the shells' mean edge length. |
| Test Dist. | `dTest` | Number | `0.0` | A new line stops when it comes closer than this to an existing one. `0` disables the check. |

The last four — **Poisson's ratio**, **Bending Stress Lines**, **Separation** and **Test Dist.** — are in the
**Advanced** menu under the component, which starts folded; click it to show them. A wire to one of
them keeps working with the menu folded.

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

- You need a magnitude → [View Results](view-results.md) or
  [Shell Forces](../results/shell-forces.md).
- The model is made of solids → [Principal Stress Lines 3D](principal-stress-lines-3d.md). This
  component reads shell results only.

## 🧮 How the lines are made

Each shell's strain is taken at its centre: the membrane strain from the nodal translations, or
the bending curvature from the nodal rotations. The centre values are averaged into each node from
the shells round it that lie within 30° of each other, and interpolated across each shell, so the
directions run on smoothly from shell to shell. Shells are joined through the nodes they share,
exactly as [Assemble Model](../assemble.md) welded them.

- **Material.** For an isotropic elastic material the principal stresses lie along the principal
  strains, so the strain gives the directions. On a layered or nonlinear section the lines follow
  the strain, which is no longer the same as the stress.
- **Bending.** Each shell's bending is read against its normal. Shells that face the other way
  from their neighbours are read the other way up, so that the lines run on across them, and a
  Remark says how many there were.
- **Where a line ends.** At the edge of the shells, cut where it crosses. Also where the two
  principal values become equal, as at the centre of a square slab or the middle of a simply
  supported edge, because there the field gives no direction to follow.

The method follows [LilyPad](https://github.com/formateng/LilyPad), by Matthew Church and Format
Engineers: lines traced with fourth-order Runge-Kutta steps, and a field of them grown by
neighbour seeding. Checked against closed-form solutions (the Timoshenko cantilever, a plate with a
hole in tension, and a simply supported plate under uniform load), the lines follow the exact
directions to within half a degree on average, on meshes as coarse as eight shells across a beam's
depth.

## 💡 Tuning it

Start with one seed and **Single Line** on, to check the direction field is sensible. Then
turn it off and adjust:

- **Separation** controls how dense the field is.
- **Test Dist.**, once non-zero, stops lines crowding — set it a little below **Separation**.
- **Step Tolerance** smooths each line. Left at `0` it follows the mesh; reduce it if the
  curves look faceted, at some cost in time.

Set **Bending Stress Lines** to match the problem: membrane directions for a wall in its own
plane, bending directions for a slab in flexure. They are generally not the same field.
