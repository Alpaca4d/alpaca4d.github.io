# Steel Section Library

A catalogue of **628 steel profiles** embedded in Alpaca4d. Pick a family and a name, and
the component builds the matching parametric section for you.

## 🔧 Grasshopper component

`Steel Section Library (Alpaca4d)` — **Alpaca4d ▸ 01_Section**, nickname `Section Library`

### Options

Two dropdowns live on the component body, under the **Library** menu:

| Dropdown | Values | Default |
| --- | --- | --- |
| **Family** | `I`, `O`, `[]`, `2L`, `All` | `I` |
| **Section** | `All`, then the profiles of the selected family | first profile in the family |

Set **Section** to `All` for every profile of the family as a list, and **Family** to `All` for
all 628. Either list is ordered by cross-sectional area, smallest first — the lightest profile
at index 0 and the heaviest last — so a **List Item** driven by a slider
walks through them by weight. Connect a Panel to the output to read the list: each section shows
as its name.

| Family | Profiles | Builds a | Examples |
| --- | --- | --- | --- |
| `I` | 90 | [I Section](h-section.md) | IPE80 … IPE600, HEA, HEB, HEM |
| `O` | 205 | [Circular](circular.md) | `26.9x2`, `33.7x2.5`, … |
| `[]` | 246 | [Rectangular Hollow](rectangular-hollow.md) | `40x20x2`, `40x30x3`, … |
| `2L` | 87 | [Double L-Angle](double-angle.md) | `L20x20x3`, `L25x25x4`, … |

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Section Name | `Name` | Text | *(empty)* | Type a profile name directly, e.g. `IPE200`. **Overrides the dropdowns** and moves them to match. |
| Material | `Material` | Material | Elastic steel | A [Uniaxial](../materials/Uniaxial.md) material. Defaults to Alpaca4d's elastic steel, so the component works with nothing plugged in. |
| Gap | `Gap` | Number | `0.01` | **Only present when the family is `2L` or `All`.** Clear distance between the two angles, in `m`. The input appears and disappears as you change the family. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Section | `Section` | Section | Beam section, for a [ForceBeamColumn](../elements/force-beam-column.md). With **Section** set to `All`, a list of them, smallest area first. |

## 📈 When to use it

**Use it when**

- The member is a standard rolled profile. Typing `HEB300` is faster and less error-prone
  than entering six dimensions.
- You are running an optimisation over a discrete set of profiles — set **Section** (or
  **Family**) to `All` and pick from the list with List Item and a slider, or feed your own
  list of names into **Section Name**.

**Do not use it when**

- The profile is welded, tapered or otherwise not in the catalogue → use the matching
  parametric section.
- You only have the stiffness properties → [Generic Section](parametric-cross-section.md).

## 🔗 Relation to OpenSees

The library resolves to one of the parametric sections, all of which write:

```tcl
section Elastic $secTag $E $A $Izz $Iyy $G $J $alphaY $alphaZ
```
