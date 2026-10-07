# Model View

Draws the assembled model in the viewport. It is the component that turns a tree of
Grasshopper objects into something you can actually check.

## 🔧 Grasshopper component

`Model View (Alpaca4d)` — **Alpaca4d ▸ 09_Visualisation**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | — | The assembled model, from [Assemble](../assemble.md). |
| LoadPattern | `LP` | Integer | *all* | Show the loads of one pattern only, by Id. Leave empty to show all of them. |
| ElementIds | `ElemIds` | Integer (list) | *all* | Show only these elements, by Id. Leave empty to show all. |

### Options

Three menus live on the component body. Right-click to expand them.

**Elements**

| Toggle | Shows |
| --- | --- |
| Extruded | Beams as extruded 3D solids of their real cross-section, instead of lines. On by default; a beam whose section has no shape to draw stays a line. |
| Node IDs | The tag of every node. |
| Element IDs | The tag of every element. |
| Section Names | The section name on each beam. |
| Local Axes | The local axes of each element as red, green and blue arrows: *x*, *y*, *z* on beams, 1, 2, 3 on shells and solids. These are the axes beam and shell forces and local solid stresses are reported in. |
| Text size | Height of the ids and section names, in model units. Shown while any of them is on. |
| Axes size | How big the local axes are drawn, as a multiple of each element's own size. Shown while Local Axes is on. |

**Loads**

| Control | Effect |
| --- | --- |
| Show Loads | Draws point, line and surface loads as arrows and patches. |
| Load Scale | Slider, 0.1 – 10. Arrow size. |

**Supports**

| Control | Effect |
| --- | --- |
| Show Supports | Draws support symbols — [the seven presets](../elements/support.md#the-seven-presets) get their own glyph, anything else a text tag. |
| Support Scale | Slider, 0.1 – 10. Symbol size. |
| Show Constraints | Draws rigid diaphragms and rigid links. |

### Outputs

| Name | Nick | Type | Description |
| --- | --- | --- | --- |
| AlpacaModel | `AlpacaModel` | Model | The model, passed through so the component can sit inline. |
| Info | `Info` | Text | A summary of what the model contains. |

## 📈 When to use it

**Use it when**

- Before every analysis, on every model. It is the cheapest way to catch a support in the
  wrong place, a load pointing the wrong way, or two members that never connected.
- You are working out which way a beam's local axes run, before reading
  [Beam Forces](../results/beam-forces.md).
- You want a figure of the undeformed model.

**Do not use it when**

- You want to see results → [View Results](view-results.md) reads an analysed model.

## 💡 What to check, and how

| Question | Turn on |
| --- | --- |
| Did the members actually connect? | **Node IDs** — two tags at one joint means the [Assemble](../assemble.md) tolerance is too small. |
| Is the section oriented the way I meant? | **Extruded** |
| Which way is local *y* on this beam? | **Local Axes** — this is what `My` and `Mz` in [Beam Forces](../results/beam-forces.md) refer to. |
| Are the supports right? | **Show Supports**, then compare the glyphs against [the preset table](../elements/support.md#the-seven-presets). |
| Did that load land where I put it? | **Show Loads**, and raise **Load Scale**. |

{% hint style="info" %}
On a large model, **Extruded** and **Node IDs** are both expensive to draw. Use
**ElementIds** to narrow the view to the part you are inspecting, or turn the toggles off
again once you have looked.
{% endhint %}

{% hint style="info" %}
The colours of the ids, section names and loads are set once for every definition, in
**Alpaca4d → Settings → Display...** in the Grasshopper menu bar. They apply as soon as they
are picked, and are kept for the next session. The same window sets the colour of the values
View Results writes.
{% endhint %}
