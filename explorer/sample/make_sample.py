"""Makes the sample study the Alpaca4d Explorer opens with: a steel footbridge truss.

    python3 make_sample.py

writes footbridge/data.csv, and an image (.svg) and a 3D model (.glb) per design, in the layout
Explorer Record writes. The numbers are hand-calculation estimates, not an Alpaca4d analysis:
member forces by sections, deflection by virtual work over every member, the first frequency
from the stiffness that deflection implies. Good enough to have real trade-offs to explore -
some designs fail, the light ones are lively - and no more.

Only the standard library is used, so it runs anywhere.
"""
import itertools
import json
import math
import os
import struct

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "footbridge")

SPANS = [20, 25, 30, 35]           # m
DEPTHS = [1.5, 2.25, 3.0]          # m
PANELS = [6, 8, 10]
CHORDS = {                         # area cm2, weak-axis radius of gyration cm, mass kg/m
    "HEA160": (38.8, 3.98, 30.4),
    "HEA200": (53.8, 4.98, 42.3),
    "HEA240": (76.8, 6.00, 60.3),
}

WIDTH = 3.0                        # m between the two trusses
DECK = 2.5 * WIDTH                 # kN/m, deck and finishes
CROWD = 5.0 * WIDTH                # kN/m, pedestrians
E = 210e9                          # Pa
FY = 355e3                         # kPa
STEEL = 7850.0                     # kg/m3


def turbo(t):
    """The Turbo colormap, Alpaca4d's default gradient (polynomial fit by Google)."""
    t = min(max(t, 0.0), 1.0)
    r = 0.13572138 + t * (4.61539260 + t * (-42.66032258 + t * (132.13108234 + t * (-152.94239396 + t * 59.28637943))))
    g = 0.09140261 + t * (2.19418839 + t * (4.84296658 + t * (-14.18503333 + t * (4.27729857 + t * 2.82956604))))
    b = 0.10667330 + t * (12.64194608 + t * (-60.58204836 + t * (110.36276771 + t * (-89.90310912 + t * 27.34824973))))
    return tuple(int(round(255 * min(max(c, 0.0), 1.0))) for c in (r, g, b))


def chi(slenderness, fy=355.0):
    """EN 1993-1-1 buckling reduction, curve c."""
    lam1 = 93.9 * math.sqrt(235.0 / fy)
    lam = slenderness / lam1
    phi = 0.5 * (1 + 0.49 * (lam - 0.2) + lam * lam)
    return min(1.0, 1.0 / (phi + math.sqrt(max(phi * phi - lam * lam, 0.0))))


def design(span, depth, panels, chord):
    area_c, radius_c, mass_c = CHORDS[chord]
    area_c *= 1e-4
    radius_c *= 1e-2
    area_w = 0.45 * area_c             # web members, scaled with the chords
    radius_w = 0.8 * radius_c
    a = span / panels
    diagonal = math.hypot(a, depth)
    sin = depth / diagonal

    # Steel, both trusses and the cross members between them.
    chords = 2 * 2 * span * area_c
    webs = 2 * ((panels + 1) * depth + panels * diagonal) * area_w
    cross = 2 * (panels + 1) * WIDTH * area_w
    mass = (chords + webs + cross) * STEEL / 1000.0          # t
    self_weight = mass * 9.81 / span                          # kN/m

    q_uls = (1.35 * (DECK + self_weight) + 1.5 * CROWD) / 2   # kN/m per truss
    q_sls = (DECK + self_weight + CROWD) / 2

    def moment(x, q):
        return q * x * (span - x) / 2

    def shear(x, q):
        return q * (span / 2 - x)

    members = []          # (kind, start, end, utilisation)
    deflection = 0.0      # m, virtual work per truss
    for i in range(panels):
        x0, x1 = i * a, (i + 1) * a
        xm = (x0 + x1) / 2
        n_chord = moment(xm, q_uls) / depth                                   # kN
        u_top = n_chord / (chi(a / radius_c) * area_c * FY)
        u_bot = n_chord / (area_c * FY)
        members.append(("top", (x0, depth), (x1, depth), u_top))
        members.append(("bottom", (x0, 0.0), (x1, 0.0), u_bot))

        left = xm < span / 2
        v = abs(shear(xm, q_uls))
        u_diag = v / sin / (area_w * FY)
        start, end = ((x0, depth), (x1, 0.0)) if left else ((x0, 0.0), (x1, depth))
        members.append(("diagonal", start, end, u_diag))

        # Virtual work: real forces at SLS, unit load at midspan.
        unit_m = (xm if left else span - xm) / 2
        n_real = moment(xm, q_sls) * 1e3 / depth
        n_unit = unit_m / depth
        deflection += 2 * n_real * n_unit * a / (E * area_c)
        v_real = abs(shear(xm, q_sls)) * 1e3
        deflection += (v_real / sin) * (0.5 / sin) * diagonal / (E * area_w)

    for i in range(panels + 1):
        x = i * a
        v = abs(shear(x, q_uls)) if 0 < i < panels else q_uls * span / 2
        u_vert = v / (chi(depth / radius_w) * area_w * FY)
        members.append(("vertical", (x, 0.0), (x, depth), min(u_vert, 1.5)))
        v_real = abs(shear(x, q_sls)) * 1e3
        deflection += v_real * 0.5 * depth / (E * area_w)

    utilisation = max(m[3] for m in members)

    # The first vertical mode, from the stiffness the deflection implies.
    stiffness = 5 * q_sls * 1e3 * span ** 4 / (384 * deflection)            # EI, N m2
    mass_per_length = (DECK + self_weight) / 2 * 1e3 / 9.81                   # kg/m per truss
    frequency = math.pi / (2 * span ** 2) * math.sqrt(stiffness / mass_per_length)

    return {
        "mass": mass,
        "deflection": deflection * 1000,
        "utilisation": utilisation,
        "frequency": frequency,
        "members": members,
        "panel": a,
    }


def geometry(span, depth, result):
    """Every member as a 3D box: (start, end, width, height, colour)."""
    boxes = []
    for y in (-WIDTH / 2, WIDTH / 2):
        for kind, (x0, z0), (x1, z1), u in result["members"]:
            size = 0.16 if kind in ("top", "bottom") else 0.09
            boxes.append(((x0, y, z0), (x1, y, z1), size, size, turbo(u / 1.2)))
    panels = round(span / result["panel"])
    for i in range(panels + 1):
        x = i * result["panel"]
        boxes.append(((x, -WIDTH / 2, 0.0), (x, WIDTH / 2, 0.0), 0.08, 0.12, turbo(0.3 / 1.2)))
        boxes.append(((x, -WIDTH / 2, depth), (x, WIDTH / 2, depth), 0.06, 0.06, turbo(0.15 / 1.2)))
    deck = ((0.0, 0.0, 0.1), (span, 0.0, 0.1), WIDTH - 0.2, 0.08, (170, 174, 180))
    return [deck] + boxes


def labels(span, depth, result):
    """Text dots and a text, as Explorer Record writes them: the supports, the most used member, the span."""
    ink = "#2a2d31"
    kind, (x0, z0), (x1, z1), u = max(result["members"], key=lambda m: m[3])
    worst = "#%02x%02x%02x" % turbo(u / 1.2)
    return [
        {"text": "A", "position": (0.0, 0.0, -0.45), "color": ink, "kind": "dot"},
        {"text": "B", "position": (span, 0.0, -0.45), "color": ink, "kind": "dot"},
        {"text": f"{u:.2f}", "position": ((x0 + x1) / 2, -WIDTH / 2, (z0 + z1) / 2), "color": worst, "kind": "dot"},
        {"text": f"L = {fmt(span, 2)} m", "position": (span / 2, -WIDTH / 2 - 0.8, -0.6), "color": ink, "kind": "text"},
    ]


def frame(start, end):
    t = [e - s for s, e in zip(start, end)]
    length = math.sqrt(sum(c * c for c in t))
    t = [c / length for c in t]
    up = (0.0, 0.0, 1.0) if abs(t[2]) < 0.9 else (1.0, 0.0, 0.0)
    s = (t[1] * up[2] - t[2] * up[1], t[2] * up[0] - t[0] * up[2], t[0] * up[1] - t[1] * up[0])
    n = math.sqrt(sum(c * c for c in s))
    s = tuple(c / n for c in s)
    u = (s[1] * t[2] - s[2] * t[1], s[2] * t[0] - s[0] * t[2], s[0] * t[1] - s[1] * t[0])
    return s, u


def linear(c):
    c /= 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def write_glb(path, boxes, labels=()):
    """Boxes as a .glb: positions and linear vertex colours, no normals, so viewers shade them flat.
    Labels go in the scene's extras, where the explorer looks for them."""
    positions, colours, indices = [], [], []
    faces = [(0, 1, 3), (0, 3, 2), (4, 6, 7), (4, 7, 5), (0, 4, 5), (0, 5, 1),
             (2, 3, 7), (2, 7, 6), (0, 2, 6), (0, 6, 4), (1, 5, 7), (1, 7, 3)]
    for start, end, width, height, colour in boxes:
        s, u = frame(start, end)
        first = len(positions) // 3
        for p in (start, end):
            for i in (-0.5, 0.5):
                for j in (-0.5, 0.5):
                    x = p[0] + s[0] * width * i + u[0] * height * j
                    y = p[1] + s[1] * width * i + u[1] * height * j
                    z = p[2] + s[2] * width * i + u[2] * height * j
                    positions += [x, z, -y]                       # Z up to glTF's Y up
                    colours += [linear(c) for c in colour]
        # corners: start(-,-) 0, start(-,+) 1, start(+,-) 2, start(+,+) 3, then the same at the end
        for a, b, c in faces:
            indices += [first + a, first + b, first + c]

    count = len(positions) // 3
    mins = [min(positions[i::3]) for i in range(3)]
    maxs = [max(positions[i::3]) for i in range(3)]
    pos_bytes = struct.pack(f"<{len(positions)}f", *positions)
    col_bytes = struct.pack(f"<{len(colours)}f", *colours)
    idx_bytes = struct.pack(f"<{len(indices)}H", *indices)
    pad = lambda b, fill=b"\0": b + fill * ((4 - len(b) % 4) % 4)
    binary = pad(pos_bytes) + pad(col_bytes) + pad(idx_bytes)
    o1 = len(pad(pos_bytes))
    o2 = o1 + len(pad(col_bytes))
    gltf = {
        "asset": {"version": "2.0", "generator": "Alpaca4d Explorer sample"},
        "scene": 0, "nodes": [{"mesh": 0}],
        "scenes": [{"nodes": [0], "extras": {"alpaca4d": {"labels": [
            dict(label, position=[label["position"][0], label["position"][2], -label["position"][1]])  # Z up to Y up
            for label in labels]}}}],
        "meshes": [{"primitives": [{"attributes": {"POSITION": 0, "COLOR_0": 1}, "indices": 2, "material": 0, "mode": 4}]}],
        "materials": [{"pbrMetallicRoughness": {"baseColorFactor": [1, 1, 1, 1], "metallicFactor": 0, "roughnessFactor": 0.85}, "doubleSided": True}],
        "accessors": [
            {"bufferView": 0, "componentType": 5126, "count": count, "type": "VEC3", "min": mins, "max": maxs},
            {"bufferView": 1, "componentType": 5126, "count": count, "type": "VEC3"},
            {"bufferView": 2, "componentType": 5123, "count": len(indices), "type": "SCALAR"},
        ],
        "bufferViews": [
            {"buffer": 0, "byteOffset": 0, "byteLength": len(pos_bytes), "target": 34962},
            {"buffer": 0, "byteOffset": o1, "byteLength": len(col_bytes), "target": 34962},
            {"buffer": 0, "byteOffset": o2, "byteLength": len(idx_bytes), "target": 34963},
        ],
        "buffers": [{"byteLength": len(binary)}],
    }
    js = pad(json.dumps(gltf, separators=(",", ":")).encode(), b" ")
    with open(path, "wb") as f:
        f.write(struct.pack("<III", 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(binary)))
        f.write(struct.pack("<II", len(js), 0x4E4F534A) + js)
        f.write(struct.pack("<II", len(binary), 0x004E4942) + binary)


def write_svg(path, boxes, span):
    """A picture of the design from the same camera every time, as a viewport capture would be."""
    az, el = math.radians(-30), math.radians(27)
    centre = (span / 2, 0.0, 1.2)

    def project(p):
        x, y, z = (p[0] - centre[0], p[1] - centre[1], p[2] - centre[2])
        xr = x * math.cos(az) - y * math.sin(az)
        yr = x * math.sin(az) + y * math.cos(az)
        sx = xr
        sy = -(z * math.cos(el) - yr * math.sin(el))
        depth = yr * math.cos(el) + z * math.sin(el)
        return sx, sy, depth

    scale = 700 / (max(SPANS) * math.cos(az) + WIDTH * math.sin(-az) + 1)   # one scale for every design, so spans compare
    w, h = 800, 600
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">',
           '<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">'
           '<stop offset="0" stop-color="#fbfbfc"/><stop offset="1" stop-color="#e9eaed"/></linearGradient>'
           '<radialGradient id="shadow"><stop offset="0" stop-color="#2a2d31" stop-opacity=".18"/>'
           '<stop offset="1" stop-color="#2a2d31" stop-opacity="0"/></radialGradient></defs>',
           f'<rect width="{w}" height="{h}" fill="url(#bg)"/>']
    ground = project((span / 2, 0, -0.6))
    out.append(f'<ellipse cx="{w / 2 + ground[0] * scale:.1f}" cy="{h / 2 + 20 + ground[1] * scale:.1f}" '
               f'rx="{span * scale * 0.5:.1f}" ry="{18 + span * 0.6:.1f}" fill="url(#shadow)"/>')

    deck, members = boxes[0], boxes[1:]
    d0, d1 = deck[0], deck[1]
    corners = [(d0[0], -WIDTH / 2, 0.06), (d1[0], -WIDTH / 2, 0.06), (d1[0], WIDTH / 2, 0.06), (d0[0], WIDTH / 2, 0.06)]
    pts = " ".join(f"{w / 2 + project(c)[0] * scale:.1f},{h / 2 + 20 + project(c)[1] * scale:.1f}" for c in corners)
    out.append(f'<polygon points="{pts}" fill="#b4b8be" stroke="#8d939b" stroke-width="1"/>')

    drawn = []
    for start, end, width, height, colour in members:
        a, b = project(start), project(end)
        drawn.append(((a[2] + b[2]) / 2, a, b, max(2.0, width * scale * 1.5), colour))
    for _, a, b, stroke, colour in sorted(drawn, key=lambda m: -m[0]):
        out.append(f'<line x1="{w / 2 + a[0] * scale:.1f}" y1="{h / 2 + 20 + a[1] * scale:.1f}" '
                   f'x2="{w / 2 + b[0] * scale:.1f}" y2="{h / 2 + 20 + b[1] * scale:.1f}" '
                   f'stroke="rgb{colour}" stroke-width="{stroke:.1f}" stroke-linecap="round"/>')
    out.append("</svg>")
    with open(path, "w") as f:
        f.write("\n".join(out))


def fmt(x, digits):
    return f"{x:.{digits}f}".rstrip("0").rstrip(".")


def main():
    os.makedirs(OUT, exist_ok=True)
    for name in os.listdir(OUT):
        os.remove(os.path.join(OUT, name))

    columns = ["in:Span [m]", "in:Depth [m]", "in:Panels", "in:Chord",
               "out:Mass [t]", "out:Deflection [mm]", "out:Utilisation", "out:Frequency [Hz]", "img", "threeD"]
    rows = [",".join(columns)]
    # First input changes fastest, as Explorer Inputs runs a study.
    for chord, panels, depth, span in itertools.product(CHORDS, PANELS, DEPTHS, SPANS):
        result = design(span, depth, panels, chord)
        values = [fmt(span, 2), fmt(depth, 2), str(panels), chord]
        stem = "_".join(values)
        boxes = geometry(span, depth, result)
        write_glb(os.path.join(OUT, stem + ".glb"), boxes, labels(span, depth, result))
        write_svg(os.path.join(OUT, stem + ".svg"), boxes, span)
        rows.append(",".join(values + [
            fmt(result["mass"], 2), fmt(result["deflection"], 1),
            fmt(result["utilisation"], 3), fmt(result["frequency"], 2),
            stem + ".svg", stem + ".glb"]))

    with open(os.path.join(OUT, "data.csv"), "w") as f:
        f.write("\n".join(rows) + "\n")
    print(f"{len(rows) - 1} designs in {OUT}")


if __name__ == "__main__":
    main()
