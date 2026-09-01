# Colors

Eighteen ready-made colour gradients, for the contour components.

## 🔧 Grasshopper component

`Colors (Alpaca4d)` — **Alpaca4d ▸ 09_Visualisation**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| GradientIndex | `Index` | Integer | `0` | Which gradient. See the table. |

| Index | Gradient | | Index | Gradient |
| --- | --- | --- | --- | --- |
| 0 | Turbo *(default)* | | 9 | Seismic |
| 1 | Viridis | | 10 | Batlow |
| 2 | Plasma | | 11 | Tokyo |
| 3 | Inferno | | 12 | Buda |
| 4 | Magma | | 13 | Imola |
| 5 | Cool | | 14 | Vik |
| 6 | Hot | | 15 | Roma |
| 7 | Coolwarm | | 16 | Bam |
| 8 | Spectral | | 17 | Berlin |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Colors | `Colors` | Colour (list) | The gradient, for the **Colors** input of any contour component or of [Legend](legend.md). |

## 📈 When to use it

**Use it when** you are feeding a gradient to
[Deformed Model View](deformed-model-view.md), [Shell Forces View](shell-forces-view.md),
[Brick Stresses View](brick-stresses-view.md) or [Legend](legend.md), and the default *Turbo*
is not the right map for the data.

**Do not use it when** the default is fine — leave **Colors** empty on those components and
they use *Turbo* on their own.

## 💡 Choosing one

| The quantity | Use | Why |
| --- | --- | --- |
| Has a meaningful zero — a moment, a stress that can be tension or compression | **Coolwarm** (7), **Vik** (14), **Berlin** (17), **Seismic** (9) | Diverging: two hues meeting at a neutral midpoint, so the sign is visible. |
| Runs from nothing to a maximum — displacement magnitude, Von Mises | **Viridis** (1), **Batlow** (10), **Plasma** (2), **Inferno** (3) | Sequential and perceptually uniform: equal steps in value look like equal steps in colour. |
| Needs maximum contrast for a presentation | **Turbo** (0) | Bright, but not perceptually uniform — it invents banding that is not in the data. |

Batlow, Tokyo, Buda, Imola, Vik, Roma, Bam and Berlin are from the **Scientific Colour Maps**
family: perceptually uniform and readable by colour-blind viewers. They are the safer choice
for anything that will be printed or published.

{% hint style="info" %}
Whichever gradient you pick, give the same list to [Legend](legend.md), and fix **Range** on
the contour if you are comparing more than one view.
{% endhint %}
