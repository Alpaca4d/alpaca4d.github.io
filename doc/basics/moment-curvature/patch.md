# Patch

An area of the section filled with fibres — **one fibre per mesh face, at its centroid**.
This is how the concrete part of a section is defined.

## 🔧 Grasshopper component

`Patch (Alpaca4d)` — **Alpaca4d ▸ MomentCurvature_βeta**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Mesh | `Mesh` | Mesh | — | The area to fill, in `m`, in the section's local *yz* plane. |
| Material | `Material` | Material | C25/30 | Material of the fibres. Defaults to [Concrete01](concrete01.md) C25/30. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| Patch | `Patch` | Patch | For the `Patch` input of [Fiber Section](fiber-section.md). |

The component previews the mesh wireframe in grey and the fibre centroids in black.

{% hint style="warning" %}
**The mesh density is the fibre density.** Each face becomes one fibre at its centroid, with
that face's area. There is no separate subdivision input — to refine the section, refine the
mesh.

Concentrate the faces where the strain gradient is steep, which for a section in bending
means the extreme compression fibre. Ten to twenty divisions through the depth is a usual
starting point; a mesh two faces deep will not resolve the neutral axis.
{% endhint %}

## 📈 When to use it

**Use it when**

- You are defining the concrete of a reinforced-concrete section.
- You are modelling any solid region of a section — a steel web, a timber body, an infill.
- You want a different material in the core and the cover: mesh them as two patches, and
  give the core patch a higher `fcu` and larger `EpsilonCu` to approximate confinement.

**Do not use it when**

- The fibres are discrete bars → [Layer Fiber](layer.md) or
  [Fiber Point](fiber-point.md).

{% hint style="info" %}
Patches and bars **overlap**: a bar sitting inside a concrete patch is counted twice, once as
concrete and once as steel. For ordinary reinforcement ratios the error is small and usually
ignored. If it matters, reduce the bar areas by the concrete they displace.
{% endhint %}

## 🔗 Relation to OpenSees

The patch is expanded into individual fibres inside the enclosing `section Fiber` block:

```tcl
fiber $yLoc $zLoc $area $matTag
```
