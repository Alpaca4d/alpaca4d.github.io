---
description: Alpaca4d - License
---

# 📕 License

Alpaca4d is a commercial Grasshopper plug-in. This page explains what you are paying for — and, just as importantly, what is not part of the purchase.

## What you are buying

Alpaca4d builds your structural model inside Grasshopper, writes it out as an OpenSees input file (`AlpacaModel`), hands that file to the solver installed on your computer, and brings the results back into Grasshopper for inspection and visualisation.

Your license covers that plug-in in full — every component in the toolbar: materials, sections, elements, loads, the model assembler, the `.tcl` writer, the analysis components, the result readers and the viewers.

## What you are not buying: OpenSees

OpenSees is the analysis engine — the program that actually solves your model. It is free, open-source software developed at UC Berkeley, and **it is not part of your purchase**. Alpaca4d does not include, bundle, or resell it.

You download OpenSees yourself, at no cost, from the official UC Berkeley page, and point Alpaca4d at it once — [Setup](../setup.md) walks you through it. From then on, Alpaca4d simply writes a file that OpenSees understands and launches the program you installed.

So your use of OpenSees runs under UC Berkeley's own terms, which you accept directly with them when you download it. Paying for Alpaca4d changes nothing in either direction: it buys you no rights in OpenSees, and it takes none away. Those terms are short — read them on the [OpenSees](opensees.md) page, where they are reproduced in full.

|                                                                              | Where it comes from                             | Terms that apply                                          |
| ---------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------- |
| **Alpaca4d** — Grasshopper components, `.tcl` writer, result readers, views   | Purchased from us                               | This page                                                 |
| **OpenSees** — the analysis engine                                            | Downloaded free by you, from UC Berkeley        | [The Regents' license](opensees.md#copyright-and-license) |

## Your models stay yours

The `.tcl` file Alpaca4d writes is plain text in the public, documented OpenSees input format. It is your file: keep it, edit it by hand, archive it alongside the project, send it to a reviewer, or run it with any OpenSees build you like. A colleague who does not own Alpaca4d can still re-run your analysis from that file alone.

## How the license works

After payment you receive a product key by email, which activates Alpaca4d on the computer you install it on. Get in touch if you change machine.

The purchase covers a **one-year maintenance period**: all versions of Alpaca4d released in that year are yours to use indefinitely, along with email support. Renewing extends the period so that newer releases are covered too.

Current price and the full maintenance terms are on the [buy page](https://alpaca4d.github.io/buy.html); email [alpaca4d@gmail.com](mailto:alpaca4d@gmail.com) first if you need a quotation, a proforma invoice, or your company details on the invoice.

## Independence and warranty

Alpaca4d is an independent project. It is not affiliated with, endorsed by, or sponsored by the University of California, Berkeley, the OpenSees developers, or the Pacific Earthquake Engineering Research Center. "OpenSees" is named here descriptively, to identify the software Alpaca4d writes input for.

Alpaca4d is provided "as is", without warranty of any kind. As noted on the [Welcome](../README.md) page, results should always be validated against another finite element package.

If anything here is unclear for your situation, please get in touch before purchasing.
