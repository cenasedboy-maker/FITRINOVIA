#!/usr/bin/env python3
"""
LOVE QR GENERATOR — QR Code ulang tahun Fitri Novia
====================================================
Menghasilkan QR Code yang BENAR-BENAR BISA DIPINDAI, bertema love:
modul deep mocha di atas warm ivory, bingkai champagne gold, ornamen
hati dusty rose di sudut (di luar area quiet zone), dan keterangan
"Scan to Open Your Birthday Surprise".

Cara pakai (setelah website di-hosting, mis. Netlify):
    python tools/generate_qr.py "https://nama-kamu.netlify.app"

Hasil:
    qr/love-qr.png   — resolusi tinggi (~2000 px) untuk dicetak
    qr/love-qr.svg   — versi vektor, bisa di-zoom tanpa pecah

Catatan teknis:
- Error correction level H (tinggi) → QR tetap terbaca walau 30% tertutup.
- Border (quiet zone) 4 modul di setiap sisi → wajib agar kamera mudah membaca.
- Ornamen hati HANYA di luar pola QR, tidak menutupi satu modul pun.
- Uji hasilnya: buka love-qr.png di HP dan pindai dengan kamera.
"""
import sys
import math
import os
from pathlib import Path

try:
    import qrcode
    from qrcode.image.svg import SvgPathImage
except ImportError:
    sys.exit("Modul 'qrcode' belum terpasang. Jalankan dulu: pip install qrcode pillow")

from PIL import Image, ImageDraw

# ---- palet warna desain -----------------------------------------------
IVORY  = (245, 240, 232)   # warm ivory
BEIGE  = (231, 217, 200)   # soft beige
GOLD   = (198, 168, 117)   # champagne gold
ROSE   = (197, 143, 145)   # dusty rose
MOCHA  = (73, 55, 47)      # deep mocha (warna modul QR)

def heart_points(cx, cy, s):
    """Bentuk hati sederhana (poligon halus) berpusat di (cx, cy), ukuran s."""
    pts = []
    for i in range(60):
        t = math.pi * 2 * i / 60
        x = 16 * math.sin(t) ** 3
        y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        pts.append((cx + x * s, cy - y * s))
    return pts

def draw_heart(d, cx, cy, s, fill):
    d.polygon(heart_points(cx, cy, s), fill=fill)

def build_qr(url):
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=28,   # resolusi tinggi untuk cetak
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    return qr

def render_png(qr, url, out_path):
    matrix = qr.get_matrix()   # sudah termasuk quiet zone (border) dari lib
    n = len(matrix)
    box = qr.box_size
    Q = n * box                # blok QR termasuk quiet zone 4 modul

    # geometri: hati besar sepenuhnya DI ATAS pola QR, teks + hati kecil DI BAWAH
    pad_side = box * 5
    heart_s = box * .5
    heart_cy = box * 8.7                      # hati teratas = .2 box dari tepi
    pad_top = box * 17.6                      # QR mulai setelah hati (celah .4 box)
    qr_bottom = pad_top + Q
    frame_top, frame_bot = pad_top - box * 4.2, qr_bottom + box * 13.6
    W = int(Q + pad_side * 2)
    H = int(frame_bot + box * 3)

    img = Image.new("RGB", (W, H), IVORY)
    d = ImageDraw.Draw(img)
    mid = W // 2

    # kartu: garis tepi ganda champagne + aksen rose
    d.rounded_rectangle([pad_side - box * 3, frame_top, W - pad_side + box * 3, frame_bot],
                        radius=box * 3, outline=GOLD, width=max(2, box // 2))
    d.rounded_rectangle([pad_side - box * 2, frame_top + box, W - pad_side + box * 2, frame_bot - box],
                        radius=box * 2, outline=ROSE, width=max(1, box // 4))

    # pola QR (modul mocha) — tidak tersentuh ornamen apa pun
    x0 = pad_side
    y0 = pad_top
    for y in range(n):
        for x in range(n):
            if matrix[y][x]:
                d.rectangle([x0 + x * box, y0 + y * box,
                             x0 + x * box + box - 1, y0 + y * box + box - 1], fill=MOCHA)

    # ornamen hati — semua di luar pola QR
    draw_heart(d, mid, heart_cy, heart_s, ROSE)                       # hati besar di atas
    for k, col in enumerate((ROSE, GOLD, ROSE)):                      # tiga hati di bawah QR
        draw_heart(d, mid + (k - 1) * box * 3.0, qr_bottom + box * 3.4, box * .42, col)
    draw_heart(d, pad_side // 2 + box, qr_bottom + box * 9.6, box * .3, GOLD)
    draw_heart(d, W - pad_side // 2 - box, qr_bottom + box * 9.6, box * .3, GOLD)

    # keterangan — font menyesuaikan lebar kartu
    text = "Scan to Open Your Birthday Surprise"
    sub = "A Birthday Story Made With Love"
    fs = box * 4.6
    while fs > box * 2:
        f_big = ImageFont_truetype(int(fs))
        if d.textlength(text, font=f_big) <= W - pad_side * 2.4:
            break
        fs -= box * .3
    f_big = ImageFont_truetype(int(fs))
    f_small = ImageFont_truetype(int(fs * .55))
    tw = d.textlength(text, font=f_big)
    d.text((mid - tw / 2, qr_bottom + box * 8.2), text, fill=MOCHA, font=f_big)
    sw = d.textlength(sub, font=f_small)
    d.text((mid - sw / 2, qr_bottom + box * 10.8), sub, fill=GOLD, font=f_small)

    img.save(out_path, "PNG", optimize=True)
    return img.size

def ImageFont_truetype(size):
    """Font serif yang tersedia di sistem (fallback aman)."""
    from PIL import ImageFont
    for path in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSerif.ttf",
        "/usr/share/fonts/truetype/chinese/NotoSansSC-Regular.ttf",
    ):
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()

def render_svg(qr, url, out_path):
    """SVG: pola QR vektor (dari qrcode lib) + latar ivory."""
    img = qr.make_image(image_factory=SvgPathImage)
    svg = img.to_string().decode()
    svg = svg.replace("<svg", '<svg style="background:#F5F0E8"', 1)
    Path(out_path).write_text(svg, encoding="utf-8")

def main():
    if len(sys.argv) < 2 or not sys.argv[1].strip():
        print(__doc__)
        print("\nCONTOH:  python tools/generate_qr.py \"https://fitrinovia.netlify.app\"")
        sys.exit(1)
    url = sys.argv[1].strip()
    if not url.lower().startswith(("http://", "https://")):
        url = "https://" + url
        print(f"(URL tanpa protokol — dipakai sebagai: {url})")

    here = Path(__file__).resolve().parent.parent
    qrdir = here / "qr"
    qrdir.mkdir(exist_ok=True)

    qr = build_qr(url)
    png = qrdir / "love-qr.png"
    svg = qrdir / "love-qr.svg"
    size = render_png(qr, url, str(png))
    render_svg(qr, url, str(svg))

    print(f"✓ QR Code berhasil dibuat untuk: {url}")
    print(f"  Versi QR: {qr.version}  |  Error correction: H (30%)")
    print(f"  PNG : {png}  ({size[0]} x {size[1]} px)")
    print(f"  SVG : {svg}")
    print("  Uji: buka PNG di HP lalu pindai dengan kamera.")

if __name__ == "__main__":
    main()
