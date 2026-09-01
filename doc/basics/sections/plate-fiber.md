# Plate Fiber Section

The section a **shell** element uses: a thickness plus an
[nD material](../materials/ND.md).

## 🔧 Grasshopper component

`Plate Fiber Section (Alpaca4d)` — **Alpaca4d ▸ 01_Section**, nickname `PFS`

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| SectionName | `SecName` | Text | *(empty)* | Label for the section. |
| Thickness | `Thickness` | Number | `0.15` | Shell thickness, in `m`. |
| Material | `Material` | Material | — | An [nD](../materials/ND.md) material. A uniaxial material will not be accepted. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Section | `Section` | Section | Shell section, for an [ASD Shell](../elements/shell.md). |

## 📈 When to use it

**Use it when**

- You are building any shell element. This is the only section that
  [ASD Shell](../elements/shell.md) accepts.

**Do not use it when**

- The element is a beam → use one of the [beam sections](README.md).
- The element is a solid → bricks and tetrahedra take a material directly, with no section.

## 🔗 Relation to OpenSees

```tcl
section PlateFiber $secTag $matTag $thickness
```
