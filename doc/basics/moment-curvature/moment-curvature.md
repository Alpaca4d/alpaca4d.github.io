# Moment Curvature

Pushes a fibre section to a given curvature under a held axial force, and returns the
moment–curvature curve together with the stress–strain history of every fibre.

## 🔧 Grasshopper component

`MomentCurvature (Alpaca4d)` — **Alpaca4d ▸ MomentCurvature_βeta**, nickname `MC`

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| FiberSection | `FiberSection` | FiberSection | — | The section to analyse, from [Fiber Section](fiber-section.md). |
| Axial | `Axial` | Number | `0.0` | Axial force held constant while the curvature is applied, in `kN`. **Positive is tension, negative is compression.** |
| Direction | `Direction` | Text | `y` | The section's local axis to bend about — `"y"` or `"z"`. |
| NumIncr | `NumIncr` | Integer | `100` | Increments used to reach `MaxPhi` — the number of points on the curve. |
| MaxPhi | `MaxPhi` | Number | `0.02` | The curvature to push the section to, in `rad/m`. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| log | `log` | Text | The OpenSees deck this component ran, followed by the solver's console output. |
| N | `N` | Number (list) | Axial force at each increment, in `kN`. |
| My | `My` | Number (list) | Moment about the local *y* axis, in `kN·m`. |
| Mz | `Mz` | Number (list) | Moment about the local *z* axis, in `kN·m`. |
| ε | `ε` | Number (list) | Axial strain at the section centroid, dimensionless. |
| κy | `κy` | Number (list) | Curvature about the local *y* axis, in `rad/m`. |
| κz | `κz` | Number (list) | Curvature about the local *z* axis, in `rad/m`. |
| fiberStressStrain | `fiberStressStrain` | Generic | Stress and strain history of every fibre. Unpack it with [Fiber Stress Strain](fiber-stress-strain.md). |

Plot `My` against `κy` — or `Mz` against `κz` — for the moment–curvature curve.

## 📈 When to use it

**Use it when**

- You need the real capacity of a reinforced-concrete or composite section: cracking, yield
  and ultimate moment, all from the material laws.
- You are assessing ductility — the ratio of ultimate to yield curvature.
- You need the M–N interaction: sweep **Axial** and take the peak moment at each level.
- You want an effective cracked stiffness, `EI = M/κ` on the branch that matters.

**Do not use it when**

- You want member behaviour. This is a section-level analysis; the section cannot yet be
  assigned to a [ForceBeamColumn](../elements/force-beam-column.md).

## 💡 Getting a good curve

- **Start with `MaxPhi` too small and increase it.** Pushed far past failure the analysis
  stops converging, and you get a truncated curve with no indication why. The `log` output
  says what happened.
- **Turn `MinMax` on** for [Concrete01](concrete01.md) and
  [ReinforcingSteel](reinforcing-steel.md). Without it the section keeps a capacity it should
  have lost, and the curve has no honest end.
- **Raise `NumIncr`** for a smooth curve. 100 points is enough to see the shape; 500 resolves
  the yield knee.
- **Sign the axial force correctly.** A column carries compression, so `Axial` is negative.
  Getting it positive gives a section in tension and a much lower moment.

## 🔗 Relation to OpenSees

The component writes and runs a complete section-analysis deck: a single
`zeroLengthSection` element carrying the fibre section, a `Plain` pattern applying the axial
force, then a `DisplacementControl` push on the curvature DOF, with a fibre recorder
capturing every fibre at every step.

Read the whole deck from the **log** output.
