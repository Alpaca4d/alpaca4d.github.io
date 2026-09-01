# Damping

Rayleigh damping: a damping matrix built as a linear combination of the mass and stiffness
matrices,

$$
C = \alpha_M M + \beta_K K
$$

## 🔧 Grasshopper component

`Damping (Alpaca4d)` — **Alpaca4d ▸ 07_Analysis**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlphaM | `AlphaM` | Number | `0.0` | Factor on the mass matrix. Damps the **low** frequencies. |
| BetaKCurr | `BetaKCurr` | Number | `0.0` | Factor on the **current** stiffness matrix. |
| BetaKInit | `BetaKInit` | Number | `0.0` | Factor on the **initial** stiffness matrix. |
| BetaKComm | `BetaKComm` | Number | *(none)* | Factor on the **committed** stiffness matrix. |

Use exactly one of the three stiffness terms. They damp the **high** frequencies.

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Damping | `Damping` | Damping | For [Analysis Settings](analysis-settings.md). |

## 💡 Picking the coefficients

Target a damping ratio $$\xi$$ at two frequencies $$\omega_i$$ and $$\omega_j$$ (in rad/s):

$$
\alpha_M = \xi \frac{2\omega_i\omega_j}{\omega_i+\omega_j}
\qquad
\beta_K = \xi \frac{2}{\omega_i+\omega_j}
$$

Get the frequencies from [Natural Vibration](natural-vibration.md) first — usually the first
mode and whichever higher mode still carries meaningful mass. Between the two the damping
ratio dips slightly below $$\xi$$; outside them it rises, steeply at the high end.

Which stiffness matrix to use:

| Term | Behaviour |
| --- | --- |
| `BetaKInit` | Damping stays tied to the elastic stiffness. Predictable, but can over-damp a structure that has softened a lot. |
| `BetaKCurr` | Damping follows the tangent stiffness, and falls away as the structure yields. |
| `BetaKComm` | Uses the last committed stiffness — a middle course, and the usual recommendation for non-linear work. |

## 📈 When to use it

**Use it when** you are running a [Transient](analysis-settings.md) analysis. Without damping
a dynamic model rings indefinitely, and the peak response is overestimated.

**Do not use it when** the analysis is static — the damping matrix is never formed, and the
input is ignored.

## 🔗 Relation to OpenSees

```tcl
rayleigh $alphaM $betaKcurr $betaKinit $betaKcomm
```
