# Steel

A steel law for the fibres of a section. The **Law** menu (right click the component) picks one; the inputs change with it. The default is Steel01. Stresses in `kN/m²`, strains dimensionless.

## 🔧 Grasshopper component

`Steel (Alpaca4d)` — **Alpaca4d ▸ MomentCurvature_βeta**

<figure><img src="../../.gitbook/assets/components/steel.png" alt="Steel component" width="363"><figcaption></figcaption></figure>

### Laws

| Law | Models | Inputs |
| --- | --- | --- |
| **Steel01** | Bilinear with kinematic hardening. See [Steel01](steel01.md). | `fy`, `E0`, `b`, `a1`–`a4` |
| **Steel02** | Giuffré–Menegotto–Pinto: the same, with a smooth elastic to plastic transition. | `fy`, `E0`, `b`, `R0`, `cR1`, `cR2`, `a1`–`a4`, `sigInit` |
| **ReinforcingSteel** | A reinforcing bar with a strain-hardening branch to its ultimate strength. See [ReinforcingSteel](reinforcing-steel.md). | `fy`, `fu`, `Es`, `Esh`, `esh`, `eult`, `MinMax` |

Every law has a `MatName` first, and a `Material` output for the Fibers and Layers of a [Fiber Section](fiber-section.md). Steel01 and Steel02 default to **S355**, ReinforcingSteel to **B450C**. `R0`, `cR1` and `cR2` default to OpenSees' 18, 0.925 and 0.15. `a1` to `a4` go together or not at all, and `sigInit` can be given alone.

Files saved with the old **Steel01** and **ReinforcingSteel** components open on this one, on those laws.
