# Deconstruct

Explodes any Alpaca4d object into its fields and properties, one output each. The outputs are
built from the object it is given, so the component changes shape as you plug things in.

## 🔧 Grasshopper component

`Deconstruct (Alpaca4d)` — **Alpaca4d ▸ 10_Utility**

### Inputs

| Name | Nick | Type | Default | Description |
| --- | --- | --- | --- | --- |
| object | `object` | Generic | — | Any Alpaca4d object: an element, a section, a material, a load, a support, a model. |

### Outputs

| Name | Description |
| --- | --- |
| Object Class | The type name of the object. |
| *(varies)* | One output per property of the object, named after it. |

## 📈 When to use it

**Use it when**

- You are not sure what a component produced, or what an object carries.
- You need a property that no component exposes — the computed area of a section, the node
  tags of an element, the resolved geometric transformation of a beam.
- You are learning the library, or building a custom preview or filter.

**Do not use it when**

- A dedicated component gives you the same thing. Deconstruct reaches internals that are free
  to change between versions; a definition leaning on them is more fragile than one that
  does not.

{% hint style="info" %}
Deconstruct is the answer to most *"how do I get at…"* questions. Plug in a section and you
will find `Area`, `Izz`, `Iyy` and `J` already computed; plug in an assembled model and you
can walk its elements, nodes and supports.
{% endhint %}
