#!/usr/bin/env python3
import json
import subprocess
import os
import sys

os.makedirs("/var/www/mega-project/design/exports", exist_ok=True)

class FigCraftMCPClient:
    def __init__(self):
        cmd = [
            "flatpak", "run",
            "--command=figcraft-cli",
            "ai.storyteller.figcraft",
            "mcp",
            "--automation-read-root", "/var/www/mega-project",
            "--automation-write-root", "/var/www/mega-project"
        ]
        self.proc = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1
        )
        self.req_id = 0
        self._init_session()

    def _send(self, payload):
        line = json.dumps(payload) + "\n"
        self.proc.stdin.write(line)
        self.proc.stdin.flush()

    def _recv(self):
        while True:
            line = self.proc.stdout.readline()
            if not line:
                err = self.proc.stderr.read()
                raise RuntimeError(f"EOF from FigCraft MCP. Stderr: {err}")
            line = line.strip()
            if line.startswith("{"):
                return json.loads(line)

    def _init_session(self):
        self.req_id += 1
        self._send({
            "jsonrpc": "2.0",
            "id": self.req_id,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "kertamarga-designer", "version": "1.0"}
            }
        })
        self._recv()
        self._send({"jsonrpc": "2.0", "method": "notifications/initialized"})

    def call_tool(self, name, arguments):
        self.req_id += 1
        self._send({
            "jsonrpc": "2.0",
            "id": self.req_id,
            "method": "tools/call",
            "params": {
                "name": name,
                "arguments": arguments
            }
        })
        resp = self._recv()
        if "error" in resp:
            raise RuntimeError(f"Tool error ({name}): {resp['error']}")
        result = resp.get("result", {})
        if result.get("isError"):
            raise RuntimeError(f"Tool execution error ({name}): {result}")
        content = result.get("content", [])
        if content and content[0].get("type") == "text":
            try:
                return json.loads(content[0]["text"])
            except Exception:
                return content[0]["text"]
        return result

    def batch(self, commands, label="Design Step"):
        return self.call_tool("batch", {
            "label": label,
            "onError": "abort",
            "commands": commands
        })

    def run_cmd(self, command, params=None):
        return self.call_tool("run_command", {
            "command": command,
            "params": params or {}
        })

    def close(self):
        try:
            self.proc.stdin.close()
            self.proc.wait(timeout=3)
        except Exception:
            self.proc.kill()


# Helper builders for batch commands
def cmd_frame(as_id, name, parent=None, x=0, y=0, w=100, h=100, fill="#FFFFFF",
              stroke=None, stroke_weight=1, radius=0, layout=None, gap=0,
              padding=0, main_align="min", cross_align="min",
              sizing_h="fixed", sizing_v="fixed", clip=False, effects=None):
    props = {
        "fill": fill,
        "cornerRadius": radius,
        "clip": clip,
        "sizingH": sizing_h,
        "sizingV": sizing_v
    }
    if stroke:
        props["stroke"] = stroke
        props["strokeWeight"] = stroke_weight
    if layout:
        props["layout"] = layout
        props["gap"] = gap
        props["padding"] = padding
        props["mainAlign"] = main_align
        props["crossAlign"] = cross_align
    if effects:
        props["effects"] = effects

    params = {
        "type": "frame",
        "name": name,
        "x": x,
        "y": y,
        "width": w,
        "height": h,
        "props": props
    }
    if parent:
        params["parent"] = parent
    step = {"command": "node.create", "params": params}
    if as_id:
        step["as"] = as_id
    return step


def cmd_text(as_id, name, text, parent, x=0, y=0, w=None, fill="#14181D",
             size=14, family="Inter", style="Regular", line_height=None,
             align="left", sizing_h=None):
    props = {
        "fill": fill,
        "fontFamily": family,
        "fontStyle": style,
        "fontSize": size,
        "textAlign": align
    }
    if line_height:
        props["lineHeight"] = line_height
    if sizing_h:
        props["sizingH"] = sizing_h

    params = {
        "type": "text",
        "name": name,
        "text": text,
        "parent": parent,
        "x": x,
        "y": y,
        "props": props
    }
    if w is not None:
        params["width"] = w
    step = {"command": "node.create", "params": params}
    if as_id:
        step["as"] = as_id
    return step


def cmd_rect(as_id, name, parent, x=0, y=0, w=100, h=20, fill="#C84B31",
             stroke=None, stroke_weight=1, radius=4, sizing_h="fixed", sizing_v="fixed"):
    props = {
        "fill": fill,
        "cornerRadius": radius,
        "sizingH": sizing_h,
        "sizingV": sizing_v
    }
    if stroke:
        props["stroke"] = stroke
        props["strokeWeight"] = stroke_weight
    params = {
        "type": "rectangle",
        "name": name,
        "parent": parent,
        "x": x,
        "y": y,
        "width": w,
        "height": h,
        "props": props
    }
    step = {"command": "node.create", "params": params}
    if as_id:
        step["as"] = as_id
    return step


def ref(name):
    return {"$ref": name}


def build_all():
    client = FigCraftMCPClient()
    print("Connected to FigCraft MCP server")

    # Rename file and setup tokens/variables
    client.run_cmd("file.rename", {"name": "KertaMarga : Bali DigiFest 2026 UI/UX & System"})
    client.run_cmd("page.rename", {"name": "01 - Design System & 4 Boundary States"})
    client.run_cmd("page.setBackground", {"color": "#E6E1D6"})

    # Create Design Tokens Variable Collection
    try:
        client.batch([
            {"command": "variable.createCollection", "as": "col", "params": {
                "name": "KertaMarga Tokens",
                "modes": ["Lontar Light", "Volcanic Basalt"]
            }},
            {"command": "variable.create", "params": {
                "collection": ref("col"), "name": "bg/canvas", "type": "color",
                "values": {"Lontar Light": "#F8F6F1", "Volcanic Basalt": "#14181D"}
            }},
            {"command": "variable.create", "params": {
                "collection": ref("col"), "name": "bg/surface", "type": "color",
                "values": {"Lontar Light": "#FFFFFF", "Volcanic Basalt": "#1E242B"}
            }},
            {"command": "variable.create", "params": {
                "collection": ref("col"), "name": "bg/subtle", "type": "color",
                "values": {"Lontar Light": "#EFECE4", "Volcanic Basalt": "#262E38"}
            }},
            {"command": "variable.create", "params": {
                "collection": ref("col"), "name": "text/primary", "type": "color",
                "values": {"Lontar Light": "#14181D", "Volcanic Basalt": "#F8F6F1"}
            }},
            {"command": "variable.create", "params": {
                "collection": ref("col"), "name": "text/secondary", "type": "color",
                "values": {"Lontar Light": "#464E59", "Volcanic Basalt": "#B8C0CC"}
            }},
            {"command": "variable.create", "params": {
                "collection": ref("col"), "name": "accent/terracotta", "type": "color",
                "values": {"Lontar Light": "#C84B31", "Volcanic Basalt": "#E05A3F"}
            }},
            {"command": "variable.create", "params": {
                "collection": ref("col"), "name": "status/verified", "type": "color",
                "values": {"Lontar Light": "#14593D", "Volcanic Basalt": "#34D399"}
            }},
            {"command": "variable.create", "params": {
                "collection": ref("col"), "name": "status/caution", "type": "color",
                "values": {"Lontar Light": "#854D0E", "Volcanic Basalt": "#FBBF24"}
            }}
        ], label="Create Design System Variables")
        print("Created KertaMarga Tokens variable collection.")
    except Exception as e:
        print("Variable setup note:", e)

    # =========================================================================
    # PAGE 1: DESIGN SYSTEM & 4 BOUNDARY STATES (Frame 00)
    # =========================================================================
    ds_cmds = [
        cmd_frame("ds_board", "00_Design_System_And_Boundary_States", x=0, y=0, w=1440, h=1180,
                  fill="#F8F6F1", stroke="#B8B0A0", stroke_weight=2, radius=12,
                  layout="vertical", gap=24, padding=32, clip=True),

        # Header Bar (Volcanic Basalt)
        cmd_frame("ds_hdr", "DS_Header", parent=ref("ds_board"), w=1376, h=96,
                  fill="#14181D", radius=8, layout="horizontal", gap=24, padding=24,
                  main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_frame("ds_hdr_left", "DS_Header_Left", parent=ref("ds_hdr"),
                  fill="#14181D", layout="vertical", gap=6, sizing_h="hug", sizing_v="hug"),
        cmd_text(None, "DS_Tag", "BALI DIGIFEST 2026 : KATEGORI SMK (3 ANGGOTA) : MASTER DESIGN SYSTEM",
                 parent=ref("ds_hdr_left"), fill="#E05A3F", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "DS_Title", "KertaMarga Bali : Warm Lontar Editorial & Cartographic System",
                 parent=ref("ds_hdr_left"), fill="#F8F6F1", size=24, family="Merriweather", style="Bold"),
        cmd_frame("ds_hdr_right", "DS_Header_Right", parent=ref("ds_hdr"),
                  fill="#1E242B", stroke="#333C48", radius=6, layout="vertical", gap=4, padding=12,
                  sizing_h="hug", sizing_v="hug"),
        cmd_text(None, "DS_Dials", "DIAL: ENERGY 2 / RHYTHM 3 / MOTION 2",
                 parent=ref("ds_hdr_right"), fill="#F8F6F1", size=12, family="Liberation Mono", style="Bold"),
        cmd_text(None, "DS_Audit", "Anti-Slop Gate: PASS | WCAG AAA/AA Verified",
                 parent=ref("ds_hdr_right"), fill="#86EFAC", size=11, family="Inter", style="Medium"),

        # Row 1: Color Palette Swatches (8 swatches)
        cmd_frame("ds_palette_sec", "Section_Palette", parent=ref("ds_board"), w=1376, h=210,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=14, padding=20,
                  sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "Sec1_Title", "1. Palet Warna Fungsional & Bukti Rasio Kontras (2-3 Core + 1 Aksen Terracotta, Tanpa Gradien AI Slop)",
                 parent=ref("ds_palette_sec"), fill="#14181D", size=16, family="Merriweather", style="Bold"),
        cmd_frame("swatch_row", "Swatch_Row", parent=ref("ds_palette_sec"), w=1336, h=130,
                  fill="#FFFFFF", layout="horizontal", gap=12, sizing_h="fill", sizing_v="hug"),
    ]

    swatches = [
        ("bg.canvas", "#F8F6F1", "#14181D", "Kertas Lontar", "Base Surface"),
        ("bg.surface", "#FFFFFF", "#14181D", "Kartu & Tabel", "Border #DFD9CC"),
        ("bg.basalt", "#14181D", "#F8F6F1", "Drawer Audit AI", "16.4:1 (AAA)"),
        ("text.primary", "#14181D", "#FFFFFF", "Teks Utama", "17.8:1 (AAA)"),
        ("text.secondary", "#464E59", "#FFFFFF", "Teks Penjelasan", "8.4:1 (AAA)"),
        ("accent.terra", "#C84B31", "#FFFFFF", "Aksi Primer", "4.86:1 (AA)"),
        ("status.verified", "#E6F4ED", "#14593D", "Sumber Resmi", "7.2:1 (AAA)"),
        ("status.caution", "#FDF2DF", "#854D0E", "Rentang AI", "6.4:1 (AA)")
    ]
    for idx, (tok, bg_hex, fg_hex, desc, ratio) in enumerate(swatches):
        sw_id = f"sw_{idx}"
        ds_cmds.extend([
            cmd_frame(sw_id, f"Swatch_{tok}", parent=ref("swatch_row"), w=156, h=124,
                      fill="#F8F6F1", stroke="#DFD9CC", radius=8, layout="vertical", gap=5, padding=10,
                      sizing_h="fill", sizing_v="hug"),
            cmd_frame(f"{sw_id}_box", "Color_Sample", parent=ref(sw_id), w=136, h=40,
                      fill=bg_hex, stroke="#B8B0A0", radius=4, layout="horizontal", padding=8,
                      cross_align="center", sizing_h="fill", sizing_v="fixed"),
            cmd_text(None, "Hex_Code", bg_hex, parent=ref(f"{sw_id}_box"),
                     fill=fg_hex, size=11, family="Liberation Mono", style="Bold"),
            cmd_text(None, "Tok_Name", tok, parent=ref(sw_id), w=134,
                     fill="#14181D", size=11, family="Liberation Mono", style="Bold"),
            cmd_text(None, "Tok_Desc", f"{desc} ({ratio})", parent=ref(sw_id), w=134,
                     fill="#464E59", size=10, family="Inter", style="Regular", line_height=14)
        ])

    # Row 2: Typography + Core Interactive Components & Source Badges
    ds_cmds.extend([
        cmd_frame("ds_row2", "Row2_Type_And_Components", parent=ref("ds_board"), w=1376, h=290,
                  fill="#F8F6F1", layout="horizontal", gap=20, sizing_h="fill", sizing_v="hug"),

        # Left: Typography Hierarchy
        cmd_frame("ds_type_card", "Typography_Card", parent=ref("ds_row2"), w=678, h=280,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=10, padding=20,
                  sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "Sec2_Title", "2. Hierarki Tipografi Tri-Font & Alasan Pemilihan (R-06, R-31)",
                 parent=ref("ds_type_card"), fill="#14181D", size=16, family="Merriweather", style="Bold"),
        cmd_text(None, "Type_H1", "Merriweather Bold (28-40px) : Suara Editorial Panduan",
                 parent=ref("ds_type_card"), w=630, fill="#14181D", size=18, family="Merriweather", style="Bold"),
        cmd_text(None, "Type_Body", "Inter Regular & SemiBold (14-16px, Line-height 1.6) : Keterbacaan tinggi untuk kuesioner adaptif siswa SMK/SMA dan tabel perbandingan institusi tanpa beban visual.",
                 parent=ref("ds_type_card"), w=630, fill="#464E59", size=14, family="Inter", style="Regular", line_height=21),
        cmd_frame("type_mono_box", "Mono_Box", parent=ref("ds_type_card"), w=638, h=64,
                  fill="#EFECE4", stroke="#DFD9CC", radius=6, layout="vertical", gap=4, padding=10,
                  sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "Type_Mono_1", "Liberation Mono (12px) : Khusus Rumus Skor, Tanggal Cek Sumber, dan Skema JSON AI",
                 parent=ref("type_mono_box"), w=614, fill="#14181D", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "Type_Mono_2", "rank_score = 0.40*fit + 0.25*dist_est + 0.20*accred + 0.15*facility | verified_at: 2026-11-02",
                 parent=ref("type_mono_box"), w=614, fill="#464E59", size=11, family="Liberation Mono", style="Regular"),

        # Right: Interactive Controls, 5 States & Verification Badges
        cmd_frame("ds_comp_card", "Components_Card", parent=ref("ds_row2"), w=678, h=280,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=12, padding=20,
                  sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "Sec3_Title", "3. Komponen Inti, 5 State Interaksi & Lencana Kebenaran Sumber Data",
                 parent=ref("ds_comp_card"), fill="#14181D", size=16, family="Merriweather", style="Bold"),
        cmd_frame("btn_states_row", "Button_5_States", parent=ref("ds_comp_card"), w=638, h=44,
                  fill="#FFFFFF", layout="horizontal", gap=10, cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_frame("btn_def", "Btn_Default", parent=ref("btn_states_row"), w=116, h=40,
                  fill="#C84B31", radius=8, layout="horizontal", main_align="center", cross_align="center", sizing_h="fixed", sizing_v="fixed"),
        cmd_text(None, "Lbl", "Default CTA", parent=ref("btn_def"), fill="#FFFFFF", size=12, family="Inter", style="Bold"),
        cmd_frame("btn_hov", "Btn_Hover", parent=ref("btn_states_row"), w=112, h=40,
                  fill="#A93B24", radius=8, layout="horizontal", main_align="center", cross_align="center", sizing_h="fixed", sizing_v="fixed"),
        cmd_text(None, "Lbl", "Hover State", parent=ref("btn_hov"), fill="#FFFFFF", size=12, family="Inter", style="Bold"),
        cmd_frame("btn_foc", "Btn_Focus", parent=ref("btn_states_row"), w=124, h=40,
                  fill="#C84B31", stroke="#14181D", stroke_weight=3, radius=8, layout="horizontal", main_align="center", cross_align="center", sizing_h="fixed", sizing_v="fixed"),
        cmd_text(None, "Lbl", "Focus Ring 3px", parent=ref("btn_foc"), fill="#FFFFFF", size=12, family="Inter", style="Bold"),
        cmd_frame("btn_sec", "Btn_Secondary", parent=ref("btn_states_row"), w=132, h=40,
                  fill="#F8F6F1", stroke="#B8B0A0", radius=8, layout="horizontal", main_align="center", cross_align="center", sizing_h="fixed", sizing_v="fixed"),
        cmd_text(None, "Lbl", "Secondary Action", parent=ref("btn_sec"), fill="#14181D", size=12, family="Inter", style="SemiBold"),
        cmd_frame("btn_dis", "Btn_Disabled", parent=ref("btn_states_row"), w=114, h=40,
                  fill="#EAE6DF", radius=8, layout="horizontal", main_align="center", cross_align="center", sizing_h="fixed", sizing_v="fixed"),
        cmd_text(None, "Lbl", "Disabled (44px)", parent=ref("btn_dis"), fill="#626A77", size=11, family="Inter", style="Medium"),

        # Source Integrity Badges
        cmd_text(None, "Badge_Label", "Lencana Integritas Sumber & Ketidakpastian (Membedakan Fakta Katalog vs Sintesis AI):",
                 parent=ref("ds_comp_card"), fill="#464E59", size=13, family="Inter", style="Medium"),
        cmd_frame("badge_col", "Badge_List", parent=ref("ds_comp_card"), w=638, h=110,
                  fill="#FFFFFF", layout="vertical", gap=8, sizing_h="fill", sizing_v="hug"),
        cmd_frame("b_ver", "Badge_Verified", parent=ref("badge_col"), w=638, h=30,
                  fill="#E6F4ED", stroke="#A7F3D0", radius=4, layout="horizontal", gap=8, padding=8, cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "T", "[TERVERIFIKASI SUMBER RESMI] Akreditasi A | BAN-PDM & PDDIKTI | Dicek: 2026-11-02",
                 parent=ref("b_ver"), w=618, fill="#14593D", size=11, family="Liberation Mono", style="Bold"),
        cmd_frame("b_cau", "Badge_Uncertainty", parent=ref("badge_col"), w=638, h=30,
                  fill="#FDF2DF", stroke="#FDE68A", radius=4, layout="horizontal", gap=8, padding=8, cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "T", "[RENTANG EKSPLORASI AI] Kecocokan 76%-84% | Berdasarkan 3 Kutipan Jawaban Siswa",
                 parent=ref("b_cau"), w=618, fill="#854D0E", size=11, family="Liberation Mono", style="Bold"),
        cmd_frame("b_mis", "Badge_Missing", parent=ref("badge_col"), w=638, h=30,
                  fill="#EAE6DF", stroke="#B8B0A0", radius=4, layout="horizontal", gap=8, padding=8, cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "T", "[DATA BELUM TERSEDIA] Rincian Biaya Asrama Belum Dipublikasikan (AI Dilarang Menebak)",
                 parent=ref("b_mis"), w=618, fill="#3F4752", size=11, family="Liberation Mono", style="Bold"),

        # Row 3: 4 Mandatory Boundary States (AetherCraft Protocol & Antislop R-27)
        cmd_frame("ds_states_sec", "Section_4_Boundary_States", parent=ref("ds_board"), w=1376, h=430,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=16, padding=20,
                  sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "Sec4_Title", "4. Empat Boundary States Wajib pada Tampilan Dinamis (AetherCraft Protocol & Antislop R-27)",
                 parent=ref("ds_states_sec"), fill="#14181D", size=16, family="Merriweather", style="Bold"),
        cmd_frame("states_grid", "Boundary_States_Row", parent=ref("ds_states_sec"), w=1336, h=340,
                  fill="#FFFFFF", layout="horizontal", gap=14, sizing_h="fill", sizing_v="hug")
    ])

    boundary_cards = [
        ("State 1: Loading Skeleton Bertahap", "#F8F6F1", "#DFD9CC", "#14181D",
         "Menampilkan tahapan nyata yang sedang dikerjakan backend:",
         "1. [SELESAI] Menghitung Skor Deterministik (12 soal)\n2. [PROSES...] Mengekstrak Kutipan Jawaban via Gemini 2.5 Flash Schema\n3. [MENUNGGU] Memfilter Katalog Institusi Pilot Bali",
         "Batalkan & Gunakan Skor Cepat"),
        ("State 2: Empty State (Filter Ketat)", "#F8F6F1", "#DFD9CC", "#14181D",
         "Tidak ditemukan program D4/S1 di Kab. Gianyar dengan filter biaya Rp 0.",
         "Penyebab: Katalog pilot terverifikasi saat ini di Gianyar baru mencakup jenjang SMK/SMA Negeri dan ISI Denpasar.\nSaran: Perluas wilayah ke Denpasar/Badung atau longgarkan filter biaya.",
         "Reset Filter Wilayah & Biaya"),
        ("State 3: Error / Fallback Deterministik", "#FDF2DF", "#F59E0B", "#854D0E",
         "Koneksi ke Layanan Gemini API Timeout (Melewati Batas 6 Detik).",
         "Mitigasi Otomatis Aktif: Sistem beralih ke Mesin Skor Deterministik.\nRekomendasi jurusan dan ranking institusi di bawah tetap akurat berdasarkan jawaban pilihan gandamu, tanpa rangkuman esai AI.",
         "Coba Panggil Ulang Analisis AI"),
        ("State 4: Feedback Toast & Konfirmasi", "#14181D", "#333C48", "#F8F6F1",
         "Prioritas Bobot & Jejak Audit Berhasil Diperbarui",
         "Perubahan: Bobot Estimasi Jarak dinaikkan ke 45%.\nDampak: SMKN 1 Denpasar naik ke peringkat #1 (jarak ~3.2 km dari titik Kecamatan Denpasar Barat).",
         "Kembalikan Bobot Semula")
    ]
    for i, (st_title, bg_c, brd_c, title_c, lead_txt, body_txt, act_txt) in enumerate(boundary_cards):
        cid = f"bstate_{i}"
        body_c = "#D0D7E2" if bg_c == "#14181D" else "#464E59"
        btn_bg = "#C84B31" if i in (1, 2) else ("#1E242B" if bg_c == "#14181D" else "#EFECE4")
        btn_fg = "#FFFFFF" if i in (1, 2) or bg_c == "#14181D" else "#14181D"
        ds_cmds.extend([
            cmd_frame(cid, st_title, parent=ref("states_grid"), w=323, h=330,
                      fill=bg_c, stroke=brd_c, radius=8, layout="vertical", gap=12, padding=16,
                      sizing_h="fill", sizing_v="fixed"),
            cmd_text(None, "St_Title", st_title, parent=ref(cid), w=290,
                     fill=title_c, size=15, family="Merriweather", style="Bold"),
            cmd_text(None, "St_Lead", lead_txt, parent=ref(cid), w=290,
                     fill=title_c, size=13, family="Inter", style="SemiBold"),
            cmd_text(None, "St_Body", body_txt, parent=ref(cid), w=290,
                     fill=body_c, size=12, family="Inter", style="Regular", line_height=18),
            cmd_frame(f"{cid}_btn", "Action_Btn", parent=ref(cid), w=290, h=38,
                      fill=btn_bg, stroke="#B8B0A0" if btn_fg == "#14181D" else None,
                      radius=6, layout="horizontal", main_align="center", cross_align="center",
                      sizing_h="fill", sizing_v="fixed"),
            cmd_text(None, "Btn_Txt", act_txt, parent=ref(f"{cid}_btn"),
                     fill=btn_fg, size=12, family="Inter", style="Bold")
        ])

    client.batch(ds_cmds, label="Build Page 1: Design System & 4 Boundary States")
    print("Built Page 1: Design System & 4 Boundary States.")

    # =========================================================================
    # PAGE 2: DESKTOP & MOBILE MVP SCREENS (6 FRAMES)
    # =========================================================================
    client.run_cmd("page.add", {"name": "02 - MVP User Flow & Judge Verification (6 Screens)"})
    client.run_cmd("page.setBackground", {"color": "#E2DDD2"})

    # -------------------------------------------------------------------------
    # FRAME 1: LANDING, BALI PILOT SCOPE & PRIVACY GATE (x=0, y=0)
    # -------------------------------------------------------------------------
    f1_cmds = [
        cmd_frame("f1_landing", "01_Landing_And_Privacy_Consent", x=0, y=0, w=1440, h=960,
                  fill="#F8F6F1", stroke="#B8B0A0", stroke_weight=2, radius=12,
                  layout="vertical", gap=0, padding=0, clip=True),

        # Top Nav Bar
        cmd_frame("f1_nav", "Top_Navbar", parent=ref("f1_landing"), w=1440, h=72,
                  fill="#14181D", layout="horizontal", gap=24, padding=[16, 48, 16, 48],
                  main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_frame("f1_brand", "Brand_Group", parent=ref("f1_nav"), fill="#14181D",
                  layout="horizontal", gap=12, cross_align="center", sizing_h="hug", sizing_v="hug"),
        cmd_frame("f1_logo", "Logo_Mark", parent=ref("f1_brand"), w=36, h=36,
                  fill="#C84B31", radius=6, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "Logo_Txt", "KM", parent=ref("f1_logo"), fill="#FFFFFF", size=15, family="Merriweather", style="Bold"),
        cmd_text(None, "Brand_Name", "KertaMarga Bali : Kompas Eksplorasi Jurusan & Pendidikan",
                 parent=ref("f1_brand"), fill="#F8F6F1", size=16, family="Merriweather", style="Bold"),
        cmd_frame("f1_nav_links", "Nav_Links", parent=ref("f1_nav"), fill="#14181D",
                  layout="horizontal", gap=20, cross_align="center", sizing_h="hug", sizing_v="hug"),
        cmd_text(None, "Nav1", "1. Alur Eksplorasi", parent=ref("f1_nav_links"), fill="#F8F6F1", size=13, family="Inter", style="Medium"),
        cmd_text(None, "Nav2", "2. Katalog Pilot Bali (18 Institusi)", parent=ref("f1_nav_links"), fill="#B8C0CC", size=13, family="Inter", style="Regular"),
        cmd_text(None, "Nav3", "3. Metodologi & Batas AI", parent=ref("f1_nav_links"), fill="#B8C0CC", size=13, family="Inter", style="Regular"),
        cmd_frame("f1_nav_cta", "Nav_Inspector_Btn", parent=ref("f1_nav_links"), w=264, h=38,
                  fill="#1E242B", stroke="#464E59", radius=6, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "Nav_Cta_Txt", "Mode Verifikasi Juri (Clean-Start)", parent=ref("f1_nav_cta"), fill="#86EFAC", size=11, family="Liberation Mono", style="Bold"),

        # Hero Body (Asymmetric 2-Column)
        cmd_frame("f1_hero", "Hero_Container", parent=ref("f1_landing"), w=1440, h=580,
                  fill="#F8F6F1", layout="horizontal", gap=40, padding=[48, 48, 36, 48],
                  sizing_h="fill", sizing_v="hug"),

        # Left Hero Column (Editorial Pitch + Privacy Consent + Dual CTAs)
        cmd_frame("f1_hero_left", "Hero_Left_Column", parent=ref("f1_hero"), w=740, h=490,
                  fill="#F8F6F1", layout="vertical", gap=20, sizing_h="fixed", sizing_v="hug"),
        cmd_text(None, "Hero_Context", "BALI DIGIFEST 2026 : EDUCATION & SMART INFORMATION SYSTEMS : WILAYAH PILOT BALI",
                 parent=ref("f1_hero_left"), fill="#C84B31", size=12, family="Liberation Mono", style="Bold"),
        cmd_text(None, "Hero_H1", "Bantu Siswa SMP & SMK/SMA di Bali Memetakan Jurusan secara Transparan, Bukan Menebak Masa Depan.",
                 parent=ref("f1_hero_left"), w=720, fill="#14181D", size=34, family="Merriweather", style="Bold", line_height=44),
        cmd_text(None, "Hero_Sub", "KertaMarga memadukan kuesioner minat terstruktur, ekstraksi alasan berbasis bukti jawaban terbuka (Gemini Structured Output), dan katalog terverifikasi SMK, SMA, serta Perguruan Tinggi di Denpasar, Badung, Gianyar, dan Buleleng.",
                 parent=ref("f1_hero_left"), w=700, fill="#464E59", size=16, family="Inter", style="Regular", line_height=25),

        # Privacy & Non-Diagnosis Consent Box
        cmd_frame("f1_consent", "Privacy_And_Disclaimer_Box", parent=ref("f1_hero_left"), w=720, h=118,
                  fill="#FFFFFF", stroke="#B8B0A0", radius=8, layout="vertical", gap=8, padding=16,
                  sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "Consent_Title", "Persetujuan Eksplorasi & Minimisasi Data Pribadi (Wajib Dibaca Sebelum Mulai):",
                 parent=ref("f1_consent"), fill="#14181D", size=13, family="Inter", style="Bold"),
        cmd_text(None, "Consent_Body", "1. Hasil aplikasi ini adalah bahan eksplorasi karier dan diskusi bersama Guru BK/orang tua, BUKAN diagnosis psikologi tervalidasi atau jaminan penerimaan.\n2. Kami tidak meminta nama lengkap, nomor telepon, atau alamat rumah detail. Lokasi hanya menggunakan titik kecamatan/kabupaten secara sukarela.",
                 parent=ref("f1_consent"), w=688, fill="#464E59", size=13, family="Inter", style="Regular", line_height=19),

        # CTA Row + Judge Quick Preset Bar
        cmd_frame("f1_cta_row", "Hero_CTA_Row", parent=ref("f1_hero_left"), w=720, h=52,
                  fill="#F8F6F1", layout="horizontal", gap=16, cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_frame("f1_btn_start", "CTA_Start_Assessment", parent=ref("f1_cta_row"), w=290, h=48,
                  fill="#C84B31", radius=8, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "Btn1_Txt", "Setuju & Mulai Eksplorasi Jurusan", parent=ref("f1_btn_start"), fill="#FFFFFF", size=15, family="Inter", style="Bold"),
        cmd_frame("f1_btn_demo", "CTA_Judge_Preset", parent=ref("f1_cta_row"), w=340, h=48,
                  fill="#FFFFFF", stroke="#14181D", stroke_weight=2, radius=8, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "Btn2_Txt", "Isi Cepat Profil Uji Juri (Live AI Call)", parent=ref("f1_btn_demo"), fill="#14181D", size=14, family="Inter", style="Bold"),

        # Right Hero Column (Interactive Preview of Hybrid Engine)
        cmd_frame("f1_hero_right", "Hero_Right_Anatomy_Card", parent=ref("f1_hero"), w=564, h=490,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=12, layout="vertical", gap=14, padding=24,
                  sizing_h="fixed", sizing_v="hug"),
        cmd_frame("f1_card_top", "Card_Top_Badge", parent=ref("f1_hero_right"), w=516, h=32,
                  fill="#EFECE4", radius=6, layout="horizontal", padding=[6, 12, 6, 12],
                  main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "T1", "ANATOMI KEPUTUSAN HIBRIDA KERTAMARGA", parent=ref("f1_card_top"), fill="#14181D", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "T2", "ZERO HALLUCINATION", parent=ref("f1_card_top"), fill="#14593D", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "Card_Title", "Bagaimana AI & Aturan Deterministik Bekerja Bersama?",
                 parent=ref("f1_hero_right"), w=516, fill="#14181D", size=18, family="Merriweather", style="Bold"),

        cmd_frame("f1_step1", "Step_1_Box", parent=ref("f1_hero_right"), w=516, h=96,
                  fill="#F8F6F1", stroke="#DFD9CC", radius=8, layout="vertical", gap=4, padding=12, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "S1_H", "Lapis 1 : Mesin Skor Deterministik (100% Terukur & Dapat Dihitung Ulang)",
                 parent=ref("f1_step1"), fill="#14181D", size=13, family="Inter", style="Bold"),
        cmd_text(None, "S1_B", "Memetakan dimensi minat (kerangka rujukan RIASEC), kesiapan belajar saat ini, dan kendala jarak/biaya menggunakan rumus bobot transparan.",
                 parent=ref("f1_step1"), w=490, fill="#464E59", size=12, family="Inter", style="Regular", line_height=18),

        cmd_frame("f1_step2", "Step_2_Box", parent=ref("f1_hero_right"), w=516, h=104,
                  fill="#FBECE8", stroke="#C84B31", radius=8, layout="vertical", gap=4, padding=12, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "S2_H", "Lapis 2 : Gemini 2.5 Flash Structured Output (Sintesis Jawaban Terbuka)",
                 parent=ref("f1_step2"), fill="#C84B31", size=13, family="Inter", style="Bold"),
        cmd_text(None, "S2_B", "Mengekstrak sinyal minat dari cerita esai siswa, menyusun 2-3 pertanyaan lanjutan adaptif, dan wajib mengutip kalimat siswa sebagai bukti alasan.",
                 parent=ref("f1_step2"), w=490, fill="#14181D", size=12, family="Inter", style="Regular", line_height=18),

        cmd_frame("f1_step3", "Step_3_Box", parent=ref("f1_hero_right"), w=516, h=104,
                  fill="#E6F4ED", stroke="#14593D", radius=8, layout="vertical", gap=4, padding=12, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "S3_H", "Lapis 3 : Katalog Pilot Bali Terverifikasi (Sumber Primer + Tanggal Cek)",
                 parent=ref("f1_step3"), fill="#14593D", size=13, family="Inter", style="Bold"),
        cmd_text(None, "S3_B", "Akreditasi, lokasi, dan biaya diambil murni dari database terverifikasi (SMKN 1 Denpasar, PNB, Unud, Undiksha, ISI, dll). Data kosong ditulis 'Belum Tersedia'.",
                 parent=ref("f1_step3"), w=490, fill="#14181D", size=12, family="Inter", style="Regular", line_height=18),

        # Bottom Strip: Pilot Scope Summary (3 Regions/Tiers in Bali)
        cmd_frame("f1_footer_strip", "Pilot_Bali_Scope_Strip", parent=ref("f1_landing"), w=1440, h=280,
                  fill="#EFECE4", stroke="#DFD9CC", layout="vertical", gap=16, padding=[28, 48, 28, 48],
                  sizing_h="fill", sizing_v="fill"),
        cmd_text(None, "Strip_Title", "Cakupan Katalog Pilot Bali (Tahap MVP Kompetisi, Terverifikasi Sumber Primer)",
                 parent=ref("f1_footer_strip"), fill="#14181D", size=18, family="Merriweather", style="Bold"),
        cmd_frame("f1_scope_row", "Scope_Cards_Row", parent=ref("f1_footer_strip"), w=1344, h=170,
                  fill="#EFECE4", layout="horizontal", gap=20, sizing_h="fill", sizing_v="hug"),

        cmd_frame("sc_1", "Scope_SMK", parent=ref("f1_scope_row"), w=434, h=160,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=8, layout="vertical", gap=8, padding=16, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "Sc1_Tag", "JENJANG SMK / VOKASI BALI", parent=ref("sc_1"), fill="#C84B31", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "Sc1_H", "SMK Negeri & Swasta Pilot (Denpasar & Badung)", parent=ref("sc_1"), fill="#14181D", size=15, family="Merriweather", style="Bold"),
        cmd_text(None, "Sc1_B", "Mencakup bidang PPLG/TJKT, DKV, Perhotelan, Kuliner, dan Teknik Energi Terbarukan (contoh: SMKN 1 Denpasar, SMKN 3 Denpasar, SMKN 1 Kuta Selatan).",
                 parent=ref("sc_1"), w=400, fill="#464E59", size=12, family="Inter", style="Regular", line_height=18),

        cmd_frame("sc_2", "Scope_SMA", parent=ref("f1_scope_row"), w=434, h=160,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=8, layout="vertical", gap=8, padding=16, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "Sc2_Tag", "JENJANG SMA / RUMPUN MAPEL PILIHAN", parent=ref("sc_2"), fill="#14593D", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "Sc2_H", "Pemetaan Mapel Pilihan Kurikulum Merdeka", parent=ref("sc_2"), fill="#14181D", size=15, family="Merriweather", style="Bold"),
        cmd_text(None, "Sc2_B", "Membantu siswa SMP memilih kombinasi mata pelajaran lintas minat (Sains Terapan, Informatika, Ekonomi & Pariwisata, Bahasa & Budaya Bali).",
                 parent=ref("sc_2"), w=400, fill="#464E59", size=12, family="Inter", style="Regular", line_height=18),

        cmd_frame("sc_3", "Scope_PT", parent=ref("f1_scope_row"), w=434, h=160,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=8, layout="vertical", gap=8, padding=16, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "Sc3_Tag", "JENJANG PERGURUAN TINGGI BALI", parent=ref("sc_3"), fill="#854D0E", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "Sc3_H", "Kampus Negeri & Swasta Terverifikasi PDDIKTI", parent=ref("sc_3"), fill="#14181D", size=15, family="Merriweather", style="Bold"),
        cmd_text(None, "Sc3_B", "Universitas Udayana, Politeknik Negeri Bali (PNB), Undiksha Singaraja, ISI Denpasar, dan ITB STIKOM Bali beserta jalur kelanjutan dari SMK.",
                 parent=ref("sc_3"), w=400, fill="#464E59", size=12, family="Inter", style="Regular", line_height=18)
    ]
    client.batch(f1_cmds, label="Build Frame 01: Landing & Privacy Gate")
    print("Built Frame 01: Landing & Privacy Gate.")

    # -------------------------------------------------------------------------
    # FRAME 2: ADAPTIVE QUESTIONNAIRE & AI PROBE (x=1520, y=0)
    # -------------------------------------------------------------------------
    f2_cmds = [
        cmd_frame("f2_quest", "02_Adaptive_Questionnaire_And_AI_Probe", x=1520, y=0, w=1440, h=960,
                  fill="#F8F6F1", stroke="#B8B0A0", stroke_weight=2, radius=12,
                  layout="vertical", gap=0, padding=0, clip=True),

        # Progress Top Bar
        cmd_frame("f2_top", "Quest_Progress_Header", parent=ref("f2_quest"), w=1440, h=76,
                  fill="#14181D", layout="horizontal", gap=24, padding=[16, 48, 16, 48],
                  main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_frame("f2_top_l", "Quest_Title_Group", parent=ref("f2_top"), fill="#14181D",
                  layout="vertical", gap=4, sizing_h="hug", sizing_v="hug"),
        cmd_text(None, "Q_Step", "LANGKAH 2 DARI 3 : KUESIONER TERSTRUKTUR + CERITA TERBUKA ADAPTIF",
                 parent=ref("f2_top_l"), fill="#E05A3F", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "Q_Title", "Eksplorasi Minat, Kesiapan Saat Ini, dan Preferensi Belajar",
                 parent=ref("f2_top_l"), fill="#F8F6F1", size=18, family="Merriweather", style="Bold"),
        cmd_frame("f2_top_r", "Session_Badge", parent=ref("f2_top"), w=340, h=42,
                  fill="#1E242B", stroke="#333C48", radius=6, layout="horizontal", padding=10,
                  main_align="spaceBetween", cross_align="center"),
        cmd_text(None, "Ses_Id", "Sesi Anonim: #KM-902 (Tanpa PII)", parent=ref("f2_top_r"), fill="#86EFAC", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "Prog_Pct", "Progres: 68%", parent=ref("f2_top_r"), fill="#F8F6F1", size=12, family="Inter", style="Bold"),

        # Main 2-Column Body
        cmd_frame("f2_body", "Quest_Body", parent=ref("f2_quest"), w=1440, h=884,
                  fill="#F8F6F1", layout="horizontal", gap=32, padding=[32, 48, 32, 48],
                  sizing_h="fill", sizing_v="fill"),

        # Left Sidebar: Minimal Student Profile & Guardrails (360px)
        cmd_frame("f2_side", "Student_Context_Sidebar", parent=ref("f2_body"), w=360, h=810,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=14, padding=20,
                  sizing_h="fixed", sizing_v="fixed"),
        cmd_text(None, "Side_H", "Profil Konteks Minimum", parent=ref("f2_side"), fill="#14181D", size=16, family="Merriweather", style="Bold"),
        cmd_text(None, "Side_Sub", "Digunakan untuk memfilter jenjang dan menghitung estimasi jarak garis lurus antar kabupaten/kota di Bali.",
                 parent=ref("f2_side"), w=320, fill="#464E59", size=12, family="Inter", style="Regular", line_height=18),

        cmd_frame("p_item1", "Profile_Item_1", parent=ref("f2_side"), w=320, h=64,
                  fill="#F8F6F1", stroke="#DFD9CC", radius=6, layout="vertical", gap=4, padding=10, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "L", "JENJANG SAAT INI & TUJUAN EKSPLORASI", parent=ref("p_item1"), fill="#626A77", size=10, family="Liberation Mono", style="Bold"),
        cmd_text(None, "V", "Siswa SMK Kelas 12 -> Lanjut D4/S1 atau Karier", parent=ref("p_item1"), w=296, fill="#14181D", size=12, family="Inter", style="Bold"),

        cmd_frame("p_item2", "Profile_Item_2", parent=ref("f2_side"), w=320, h=64,
                  fill="#F8F6F1", stroke="#DFD9CC", radius=6, layout="vertical", gap=4, padding=10, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "L", "TITIK WILAYAH SUKARELA (BUKAN ALAMAT RUMAH)", parent=ref("p_item2"), fill="#626A77", size=10, family="Liberation Mono", style="Bold"),
        cmd_text(None, "V", "Kec. Denpasar Barat, Kota Denpasar", parent=ref("p_item2"), w=296, fill="#14181D", size=12, family="Inter", style="Bold"),

        cmd_frame("p_item3", "Profile_Item_3", parent=ref("f2_side"), w=320, h=64,
                  fill="#F8F6F1", stroke="#DFD9CC", radius=6, layout="vertical", gap=4, padding=10, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "L", "PREFERENSI CARA BELAJAR UTAMA", parent=ref("p_item3"), fill="#626A77", size=10, family="Liberation Mono", style="Bold"),
        cmd_text(None, "V", "70% Praktik Lab/Proyek | 30% Teori Konseptual", parent=ref("p_item3"), w=296, fill="#14181D", size=12, family="Inter", style="Bold"),

        cmd_frame("p_item4", "Profile_Item_4", parent=ref("f2_side"), w=320, h=64,
                  fill="#F8F6F1", stroke="#DFD9CC", radius=6, layout="vertical", gap=4, padding=10, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "L", "PERTIMBANGAN KENDALA PRIBADI", parent=ref("p_item4"), fill="#626A77", size=10, family="Liberation Mono", style="Bold"),
        cmd_text(None, "V", "Utamakan Kampus di Bali & Info UKT/Beasiswa", parent=ref("p_item4"), w=296, fill="#14181D", size=12, family="Inter", style="Bold"),

        cmd_frame("p_guard", "Method_Note", parent=ref("f2_side"), w=320, h=140,
                  fill="#EFECE4", radius=6, layout="vertical", gap=6, padding=12, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "MG_H", "Pemisahan Minat vs Kesiapan Saat Ini:", parent=ref("p_guard"), fill="#14181D", size=12, family="Inter", style="Bold"),
        cmd_text(None, "MG_B", "Nilai pelajaran saat ini tidak dianggap sebagai batas kemampuan tetap. Jika kamu sangat berminat pada suatu bidang namun belum menguasai dasarnya, sistem tetap merekomendasikannya disertai peta materi pengantar.",
                 parent=ref("p_guard"), w=296, fill="#464E59", size=11, family="Inter", style="Regular", line_height=16),

        # Right Workspace: Structured Question + Open Answer + Adaptive AI Probe (952px)
        cmd_frame("f2_main", "Questionnaire_Main_Workspace", parent=ref("f2_body"), w=952, h=810,
                  fill="#F8F6F1", layout="vertical", gap=16, sizing_h="fill", sizing_v="fixed"),

        # Card A: Structured Item
        cmd_frame("q_card1", "Question_Structured_Card", parent=ref("f2_main"), w=952, h=220,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=12, padding=20, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "Q1_Tag", "BAGIAN A : ITEM PILIHAN TERSTRUKTUR (SKOR DETERMINISTIK | DIMENSI INVESTIGATIVE & REALISTIC)",
                 parent=ref("q_card1"), fill="#626A77", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "Q1_Prompt", "1. Saat menghadapi masalah teknis pada proyek sekolah atau tempat PKL, aktivitas mana yang paling membuatmu tertantang?",
                 parent=ref("q_card1"), w=900, fill="#14181D", size=16, family="Merriweather", style="Bold"),
        cmd_frame("q1_opts", "Q1_Options_Row", parent=ref("q_card1"), w=912, h=96,
                  fill="#FFFFFF", layout="horizontal", gap=12, sizing_h="fill", sizing_v="hug"),
        cmd_frame("q1_o1", "Opt_Selected", parent=ref("q1_opts"), w=296, h=88,
                  fill="#FBECE8", stroke="#C84B31", stroke_weight=2, radius=8, layout="vertical", gap=4, padding=12, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "O1_T", "[DIPILIH] Menguji kode program, jaringan, atau alur data sampai ketemu akar masalahnya",
                 parent=ref("q1_o1"), w=270, fill="#14181D", size=12, family="Inter", style="Bold", line_height=17),
        cmd_frame("q1_o2", "Opt_2", parent=ref("q1_opts"), w=296, h=88,
                  fill="#F8F6F1", stroke="#DFD9CC", radius=8, layout="vertical", gap=4, padding=12, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "O2_T", "Merancang ulang tampilan visual, poster, atau antarmuka agar mudah dipahami pengguna",
                 parent=ref("q1_o2"), w=270, fill="#464E59", size=12, family="Inter", style="Regular", line_height=17),
        cmd_frame("q1_o3", "Opt_3", parent=ref("q1_opts"), w=296, h=88,
                  fill="#F8F6F1", stroke="#DFD9CC", radius=8, layout="vertical", gap=4, padding=12, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "O3_T", "Mengatur pembagian tugas tim, menghitung biaya, dan mempresentasikan solusi ke klien",
                 parent=ref("q1_o3"), w=270, fill="#464E59", size=12, family="Inter", style="Regular", line_height=17),

        # Card B: Open-Ended Essay Answer
        cmd_frame("q_card2", "Question_Open_Essay_Card", parent=ref("f2_main"), w=952, h=190,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=10, padding=20, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "Q2_Tag", "BAGIAN B : JAWABAN TERBUKA (DIANALISIS GEMINI 2.5 FLASH KE LABEL TERKONTROL | BATAS 400 KARAKTER)",
                 parent=ref("q_card2"), fill="#626A77", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "Q2_Prompt", "2. Ceritakan satu proyek atau kegiatan praktik yang pernah kamu kerjakan, apa yang kamu sukai, dan bagian apa yang terasa membingungkan?",
                 parent=ref("q_card2"), w=900, fill="#14181D", size=15, family="Merriweather", style="Bold"),
        cmd_frame("q2_input", "Essay_Input_Box", parent=ref("q_card2"), w=912, h=76,
                  fill="#F8F6F1", stroke="#B8B0A0", radius=8, layout="vertical", gap=4, padding=12, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "Q2_Val", "\"Waktu PKL aku bantu bikin sistem pencatatan stok sama konfigurasi WiFi di toko kerajinan Gianyar. Aku senang pas sistemnya langsung dipakai kasir, tapi masih sering bingung kalau harus nulis kueri database yang rumit atau hitung statistik.\"",
                 parent=ref("q2_input"), w=888, fill="#14181D", size=13, family="Inter", style="Regular", line_height=19),

        # Card C: Adaptive Follow-Up Probe (Controlled AI Probe)
        cmd_frame("q_card3", "Adaptive_AI_Probe_Card", parent=ref("f2_main"), w=952, h=270,
                  fill="#FFFFFF", stroke="#C84B31", stroke_weight=2, radius=10, layout="vertical", gap=10, padding=20, sizing_h="fill", sizing_v="hug"),
        cmd_frame("q3_hdr", "Probe_Header", parent=ref("q_card3"), w=912, h=28,
                  fill="#FBECE8", radius=4, layout="horizontal", padding=[4, 10, 4, 10],
                  main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "P_Tag", "CABANG PERTANYAAN ADAPTIF (MAKS 2 SOAL BANK TERVERIFIKASI)",
                 parent=ref("q3_hdr"), fill="#C84B31", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "P_Reason", "Sinyal Terdeteksi: Sistem Kasir UMKM + Konfigurasi WiFi",
                 parent=ref("q3_hdr"), fill="#14181D", size=11, family="Inter", style="Medium"),
        cmd_text(None, "Q3_Prompt", "3. Dari pengalaman PKL di toko kerajinan tersebut, jalur mana yang ingin kamu dalami lebih jauh setelah lulus SMK?",
                 parent=ref("q_card3"), w=900, fill="#14181D", size=15, family="Merriweather", style="Bold"),
        cmd_frame("q3_opts", "Probe_Options", parent=ref("q_card3"), w=912, h=78,
                  fill="#FFFFFF", layout="horizontal", gap=12, sizing_h="fill", sizing_v="hug"),
        cmd_frame("p_o1", "Probe_Opt_1", parent=ref("q3_opts"), w=448, h=72,
                  fill="#FBECE8", stroke="#C84B31", radius=8, layout="vertical", gap=4, padding=10, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "PO1", "[DIPILIH] Membangun aplikasi bisnis & sistem informasi yang langsung membantu operasional UMKM/pariwisata (Sistem Informasi / TRPL)",
                 parent=ref("p_o1"), w=424, fill="#14181D", size=12, family="Inter", style="Bold", line_height=17),
        cmd_frame("p_o2", "Probe_Opt_2", parent=ref("q3_opts"), w=448, h=72,
                  fill="#F8F6F1", stroke="#DFD9CC", radius=8, layout="vertical", gap=4, padding=10, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "PO2", "Merancang infrastruktur server, keamanan jaringan, dan perangkat keras IoT lapangan (Teknik Komputer & Jaringan)",
                 parent=ref("p_o2"), w=424, fill="#464E59", size=12, family="Inter", style="Regular", line_height=17),

        # Bottom Action Row inside Workspace
        cmd_frame("f2_actions", "Quest_Action_Footer", parent=ref("f2_main"), w=952, h=56,
                  fill="#F8F6F1", layout="horizontal", main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_frame("btn_skip", "Btn_Skip_Probe", parent=ref("f2_actions"), w=280, h=44,
                  fill="#EFECE4", stroke="#B8B0A0", radius=8, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "Skip_Txt", "Belum Tahu / Lewati Pertanyaan Lanjutan", parent=ref("btn_skip"), fill="#14181D", size=13, family="Inter", style="SemiBold"),
        cmd_frame("btn_analyze", "Btn_Submit_Assessment", parent=ref("f2_actions"), w=380, h=48,
                  fill="#C84B31", radius=8, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "Sub_Txt", "Proses Analisis Gabungan & Lihat Rekomendasi", parent=ref("btn_analyze"), fill="#FFFFFF", size=14, family="Inter", style="Bold")
    ]
    client.batch(f2_cmds, label="Build Frame 02: Adaptive Questionnaire")
    print("Built Frame 02: Adaptive Questionnaire.")

    # -------------------------------------------------------------------------
    # FRAME 3: RECOMMENDATIONS & INTERACTIVE PRIORITY SLIDERS (x=3040, y=0)
    # -------------------------------------------------------------------------
    f3_cmds = [
        cmd_frame("f3_rec", "03_Recommendations_And_Priority_Simulator", x=3040, y=0, w=1440, h=1040,
                  fill="#F8F6F1", stroke="#B8B0A0", stroke_weight=2, radius=12,
                  layout="vertical", gap=0, padding=0, clip=True),

        # Top Header
        cmd_frame("f3_top", "Rec_Header", parent=ref("f3_rec"), w=1440, h=76,
                  fill="#14181D", layout="horizontal", gap=24, padding=[16, 48, 16, 48],
                  main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_frame("f3_top_l", "Rec_Title_Group", parent=ref("f3_top"), fill="#14181D",
                  layout="vertical", gap=4, sizing_h="hug", sizing_v="hug"),
        cmd_text(None, "R_Step", "LANGKAH 3 DARI 3 : HASIL EKSPLORASI BIDANG & PEMERINGKATAN INSTITUSI PILOT BALI",
                 parent=ref("f3_top_l"), fill="#E05A3F", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "R_Title", "3 Rekomendasi Bidang Studi & Simulasi Bobot Prioritas Institusi",
                 parent=ref("f3_top_l"), fill="#F8F6F1", size=18, family="Merriweather", style="Bold"),
        cmd_frame("f3_top_btns", "Rec_Header_Btns", parent=ref("f3_top"), fill="#14181D",
                  layout="horizontal", gap=12, cross_align="center", sizing_h="hug", sizing_v="hug"),
        cmd_frame("f3_btn_insp", "Btn_Open_Inspector", parent=ref("f3_top_btns"), w=260, h=40,
                  fill="#1E242B", stroke="#86EFAC", radius=6, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "Insp_Txt", "Buka Drawer Audit AI & Bandingkan", parent=ref("f3_btn_insp"), fill="#86EFAC", size=12, family="Liberation Mono", style="Bold"),

        # Main 2-Column Content
        cmd_frame("f3_body", "Rec_Body", parent=ref("f3_rec"), w=1440, h=964,
                  fill="#F8F6F1", layout="horizontal", gap=28, padding=[28, 48, 28, 48],
                  sizing_h="fill", sizing_v="fill"),

        # Left Column (420px): Dimension Breakdown + Interactive Weight Sliders
        cmd_frame("f3_left", "Left_Analytics_And_Sliders", parent=ref("f3_body"), w=420, h=900,
                  fill="#F8F6F1", layout="vertical", gap=18, sizing_h="fixed", sizing_v="fixed"),

        # Card 1: Interest vs Current Readiness Breakdown
        cmd_frame("f3_dim_card", "Interest_Vs_Readiness_Card", parent=ref("f3_left"), w=420, h=380,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=12, padding=20, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "Dim_H", "Peta Sinyal Minat vs Kesiapan Saat Ini", parent=ref("f3_dim_card"), fill="#14181D", size=16, family="Merriweather", style="Bold"),
        cmd_text(None, "Dim_Sub", "Memisahkan seberapa tinggi ketertarikanmu dari kesiapan teknis awal agar pilihan tidak terkunci nilai semata.",
                 parent=ref("f3_dim_card"), w=380, fill="#464E59", size=12, family="Inter", style="Regular", line_height=17),

        # Bar 1
        cmd_frame("d_b1", "Dim_Bar_1", parent=ref("f3_dim_card"), w=380, h=64,
                  fill="#F8F6F1", radius=6, layout="vertical", gap=6, padding=10, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "DB1_T", "Sistem Informasi & Rekayasa Web : Minat 88% | Kesiapan 76%",
                 parent=ref("d_b1"), w=360, fill="#14181D", size=11, family="Inter", style="Bold"),
        cmd_rect(None, "Bar1_Fill", parent=ref("d_b1"), w=330, h=10, fill="#C84B31", radius=4),

        # Bar 2
        cmd_frame("d_b2", "Dim_Bar_2", parent=ref("f3_dim_card"), w=380, h=64,
                  fill="#F8F6F1", radius=6, layout="vertical", gap=6, padding=10, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "DB2_T", "Teknik Jaringan & Infrastruktur IoT : Minat 81% | Kesiapan 72%",
                 parent=ref("d_b2"), w=360, fill="#14181D", size=11, family="Inter", style="Bold"),
        cmd_rect(None, "Bar2_Fill", parent=ref("d_b2"), w=295, h=10, fill="#14593D", radius=4),

        # Bar 3
        cmd_frame("d_b3", "Dim_Bar_3", parent=ref("f3_dim_card"), w=380, h=64,
                  fill="#F8F6F1", radius=6, layout="vertical", gap=6, padding=10, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "DB3_T", "Bisnis Digital & Operasional UMKM : Minat 74% | Kesiapan 78%",
                 parent=ref("d_b3"), w=360, fill="#14181D", size=11, family="Inter", style="Bold"),
        cmd_rect(None, "Bar3_Fill", parent=ref("d_b3"), w=265, h=10, fill="#854D0E", radius=4),

        cmd_frame("dim_edit", "Btn_Correct_Signal", parent=ref("f3_dim_card"), w=380, h=36,
                  fill="#EFECE4", stroke="#B8B0A0", radius=6, layout="horizontal", main_align="center", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "Ed_Txt", "Rangkuman Kurang Sesuai? Koreksi Sinyal Minat", parent=ref("dim_edit"), fill="#14181D", size=12, family="Inter", style="SemiBold"),

        # Card 2: Interactive Priority Weight Sliders (Deterministic Ranking Simulator)
        cmd_frame("f3_slider_card", "Priority_Weight_Sliders_Card", parent=ref("f3_left"), w=420, h=490,
                  fill="#FFFFFF", stroke="#14181D", stroke_weight=2, radius=10, layout="vertical", gap=12, padding=20, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "Sl_Tag", "SIMULASI DETERMINISTIK REAL-TIME (TANPA PANGGIL ULANG AI)",
                 parent=ref("f3_slider_card"), fill="#C84B31", size=10, family="Liberation Mono", style="Bold"),
        cmd_text(None, "Sl_H", "Atur Bobot Prioritas Pemilihan Institusi", parent=ref("f3_slider_card"), fill="#14181D", size=16, family="Merriweather", style="Bold"),
        cmd_text(None, "Sl_Sub", "Geser bobot di bawah untuk melihat bagaimana perubahan prioritasmu mengubah urutan rekomendasi kampus/sekolah secara transparan.",
                 parent=ref("f3_slider_card"), w=380, fill="#464E59", size=12, family="Inter", style="Regular", line_height=17),

        # 4 Sliders
        cmd_frame("sl_1", "Slider_Program_Match", parent=ref("f3_slider_card"), w=380, h=56,
                  fill="#F8F6F1", radius=6, layout="vertical", gap=6, padding=10, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "S1_L", "1. Kecocokan Kurikulum & Praktik Program: 40%", parent=ref("sl_1"), fill="#14181D", size=12, family="Inter", style="Bold"),
        cmd_rect(None, "S1_Bar", parent=ref("sl_1"), w=280, h=8, fill="#C84B31", radius=4),

        cmd_frame("sl_2", "Slider_Distance", parent=ref("f3_slider_card"), w=380, h=56,
                  fill="#F8F6F1", radius=6, layout="vertical", gap=6, padding=10, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "S2_L", "2. Estimasi Jarak dari Kota Denpasar: 25%", parent=ref("sl_2"), fill="#14181D", size=12, family="Inter", style="Bold"),
        cmd_rect(None, "S2_Bar", parent=ref("sl_2"), w=190, h=8, fill="#14181D", radius=4),

        cmd_frame("sl_3", "Slider_Accreditation", parent=ref("f3_slider_card"), w=380, h=56,
                  fill="#F8F6F1", radius=6, layout="vertical", gap=6, padding=10, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "S3_L", "3. Akreditasi & Kredibilitas Resmi: 20%", parent=ref("sl_3"), fill="#14181D", size=12, family="Inter", style="Bold"),
        cmd_rect(None, "S3_Bar", parent=ref("sl_3"), w=150, h=8, fill="#14593D", radius=4),

        cmd_frame("sl_4", "Slider_Cost", parent=ref("f3_slider_card"), w=380, h=56,
                  fill="#F8F6F1", radius=6, layout="vertical", gap=6, padding=10, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "S4_L", "4. Keterjangkauan UKT & Beasiswa KIP-K: 15%", parent=ref("sl_4"), fill="#14181D", size=12, family="Inter", style="Bold"),
        cmd_rect(None, "S4_Bar", parent=ref("sl_4"), w=115, h=8, fill="#854D0E", radius=4),

        cmd_text(None, "Formula_Note", "Rumus: Score = 0.40(Fit) + 0.25(Dist) + 0.20(Accred) + 0.15(Cost)",
                 parent=ref("f3_slider_card"), w=376, fill="#464E59", size=10, family="Liberation Mono", style="Bold"),

        # Right Column (896px): Recommended Majors + Verified Bali Pilot Institutions
        cmd_frame("f3_right", "Right_Recommendations_List", parent=ref("f3_body"), w=896, h=900,
                  fill="#F8F6F1", layout="vertical", gap=18, sizing_h="fill", sizing_v="fixed"),

        # Recommendation Card 1 (Primary Match, Expanded with Bali Institutions)
        cmd_frame("rec_1", "Major_Card_1_Primary", parent=ref("f3_right"), w=896, h=540,
                  fill="#FFFFFF", stroke="#C84B31", stroke_weight=2, radius=12, layout="vertical", gap=12, padding=24, sizing_h="fill", sizing_v="hug"),
        cmd_frame("r1_top", "Rec1_Top_Row", parent=ref("rec_1"), w=848, h=30,
                  fill="#FFFFFF", layout="horizontal", main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_frame("r1_badge", "Confidence_Badge", parent=ref("r1_top"), w=370, h=28,
                  fill="#E6F4ED", radius=4, layout="horizontal", padding=[4, 10, 4, 10], cross_align="center"),
        cmd_text(None, "CB_T", "PILIHAN EKSPLORASI #1 : RENTANG KECOCOKAN: 82% - 89%",
                 parent=ref("r1_badge"), fill="#14593D", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "R1_Cat", "Rumpun: Teknologi Informasi, Rekayasa Perangkat Lunak & Sistem Bisnis",
                 parent=ref("r1_top"), fill="#626A77", size=12, family="Inter", style="SemiBold"),

        cmd_text(None, "R1_Title", "Teknologi Rekayasa Perangkat Lunak (D4) / Sistem Informasi (S1)",
                 parent=ref("rec_1"), w=848, fill="#14181D", size=22, family="Merriweather", style="Bold"),

        # AI Evidence Quote & Uncertainty Box
        cmd_frame("r1_reason", "Evidence_And_Uncertainty_Box", parent=ref("rec_1"), w=848, h=92,
                  fill="#F8F6F1", stroke="#DFD9CC", radius=8, layout="vertical", gap=6, padding=12, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "Ev_Line", "Alasan Berdasarkan Kutipan Jawabanmu: Kamu menyukai pembuatan sistem stok kasir saat PKL di Gianyar dan memilih fokus membangun aplikasi yang langsung membantu operasional UMKM.",
                 parent=ref("r1_reason"), w=820, fill="#14181D", size=13, family="Inter", style="Medium", line_height=18),
        cmd_text(None, "Unc_Line", "Catatan Ketidakpastian & Tantangan: Kamu menyebut masih bingung menulis kueri database rumit dan statistik; di program ini kamu akan menemui mata kuliah Basis Data Lanjut di semester 2-3.",
                 parent=ref("r1_reason"), w=820, fill="#854D0E", size=12, family="Inter", style="SemiBold", line_height=17),

        # Verified Institutions Sub-table inside Card 1
        cmd_text(None, "Inst_Hdr", "Institusi Pilot di Bali dengan Program Relevan (Diurutkan Sesuai Slider Bobotmu):",
                 parent=ref("rec_1"), fill="#14181D", size=14, family="Inter", style="Bold"),

        cmd_frame("inst_1", "Inst_Row_PNB", parent=ref("rec_1"), w=848, h=86,
                  fill="#EFECE4", stroke="#B8B0A0", radius=8, layout="vertical", gap=6, padding=12, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "I1_Name", "#1 : Politeknik Negeri Bali (PNB) : D4 Teknologi Rekayasa Perangkat Lunak (Skor Ranking: 87.4)",
                 parent=ref("inst_1"), fill="#14181D", size=14, family="Inter", style="Bold"),
        cmd_text(None, "I1_Meta", "Lokasi: Bukit Jimbaran, Badung (~18.2 km garis lurus dari Denpasar Barat) | Akreditasi: Baik Sekali (BAN-PT, Cek: 2026-11-02)",
                 parent=ref("inst_1"), fill="#464E59", size=12, family="Inter", style="Regular"),
        cmd_text(None, "I1_Src", "Biaya: UKT Gol. I-VIII Rp 500rb - Rp 6.5jt/smt + KIP Kuliah Tersedia | Sumber: pnb.ac.id & PDDIKTI (Terverifikasi)",
                 parent=ref("inst_1"), fill="#14593D", size=11, family="Liberation Mono", style="Bold"),

        cmd_frame("inst_2", "Inst_Row_Unud", parent=ref("rec_1"), w=848, h=86,
                  fill="#F8F6F1", stroke="#DFD9CC", radius=8, layout="vertical", gap=6, padding=12, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "I2_Name", "#2 : Universitas Udayana (Unud) : S1 Teknologi Informasi (Skor Ranking: 84.1)",
                 parent=ref("inst_2"), fill="#14181D", size=14, family="Inter", style="Bold"),
        cmd_text(None, "I2_Meta", "Lokasi: Kampus Jimbaran/Sudirman (~17.5 km dari Denpasar Barat) | Akreditasi: Unggul (LAM INFOKOM, Cek: 2026-11-02)",
                 parent=ref("inst_2"), fill="#464E59", size=12, family="Inter", style="Regular"),
        cmd_text(None, "I2_Src", "Biaya: UKT Negeri (Sumber: udayana.ac.id) | Kuota Bengkel Vokasi Khusus: [DATA BELUM TERSEDIA, TIDAK DITEBAK AI]",
                 parent=ref("inst_2"), fill="#854D0E", size=11, family="Liberation Mono", style="Bold"),

        # Action Bar on Recommendation 1
        cmd_frame("r1_acts", "Rec1_Actions", parent=ref("rec_1"), w=848, h=46,
                  fill="#FFFFFF", layout="horizontal", main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_frame("btn_cmp1", "Btn_Compare_Inst", parent=ref("r1_acts"), w=320, h=42,
                  fill="#F8F6F1", stroke="#14181D", radius=8, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "Cmp_T", "Bandingkan Detail Institusi & Cek Sumber", parent=ref("btn_cmp1"), fill="#14181D", size=13, family="Inter", style="Bold"),
        cmd_frame("btn_conf1", "Btn_Confirm_Major", parent=ref("r1_acts"), w=390, h=42,
                  fill="#C84B31", radius=8, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "Conf_T", "Konfirmasi Pilihan Ini & Baca Peta Bidang Lengkap", parent=ref("btn_conf1"), fill="#FFFFFF", size=13, family="Inter", style="Bold"),

        # Recommendation Card 2 (Alternative Match Compact)
        cmd_frame("rec_2", "Major_Card_2_Alternative", parent=ref("f3_right"), w=896, h=168,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=12, layout="vertical", gap=8, padding=20, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "R2_Tag", "ALTERNATIF EKSPLORASI #2 · RENTANG KECOCOKAN: 76% - 83% · JALUR TEKNIS JARINGAN & HARDWARE",
                 parent=ref("rec_2"), fill="#854D0E", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "R2_Title", "Teknik Komputer & Jaringan / Teknologi Rekayasa Jaringan (PNB, Undiksha, STIKOM Bali)",
                 parent=ref("rec_2"), w=848, fill="#14181D", size=18, family="Merriweather", style="Bold"),
        cmd_text(None, "R2_Desc", "Cocok bila kamu ingin lebih fokus pada konfigurasi infrastruktur WiFi/router dan administrasi server dibanding penulisan kueri aplikasi kasir. Tersedia pula rujukan jenjang SMK di SMKN 1 Denpasar (TJKT).",
                 parent=ref("rec_2"), w=848, fill="#464E59", size=13, family="Inter", style="Regular", line_height=19),

        # Recommendation Card 3 (Alternative Match Compact)
        cmd_frame("rec_3", "Major_Card_3_Alternative", parent=ref("f3_right"), w=896, h=148,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=12, layout="vertical", gap=8, padding=20, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "R3_Tag", "ALTERNATIF EKSPLORASI #3 · RENTANG KECOCOKAN: 70% - 77% · JALUR TERAPAN UMKM & PARIWISATA",
                 parent=ref("rec_3"), fill="#464E59", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "R3_Title", "Bisnis Digital & Manajemen E-Commerce Pariwisata (PNB, Undiksha, Unud)",
                 parent=ref("rec_3"), w=848, fill="#14181D", size=18, family="Merriweather", style="Bold"),
        cmd_text(None, "R3_Desc", "Opsi eksplorasi jika ketertarikan utamamu bergeser dari teknis pemrograman menuju penerapan teknologi untuk pemasaran dan operasional usaha kerajinan/pariwisata di Bali.",
                 parent=ref("rec_3"), w=848, fill="#464E59", size=13, family="Inter", style="Regular", line_height=19)
    ]
    client.batch(f3_cmds, label="Build Frame 03: Recommendations & Priority Sliders")
    print("Built Frame 03: Recommendations & Priority Sliders.")

    # -------------------------------------------------------------------------
    # FRAME 4: INSTITUTION COMPARISON & AI TRANSPARENCY DRAWER (x=0, y=1120)
    # -------------------------------------------------------------------------
    f4_cmds = [
        cmd_frame("f4_insp", "04_Comparison_And_AI_Transparency_Inspector", x=0, y=1120, w=1440, h=960,
                  fill="#F8F6F1", stroke="#B8B0A0", stroke_weight=2, radius=12,
                  layout="horizontal", gap=0, padding=0, clip=True),

        # Left Area (860px): Side-by-Side Institution Comparison Table & Source Audit
        cmd_frame("f4_left", "Comparison_Workspace", parent=ref("f4_insp"), w=860, h=960,
                  fill="#F8F6F1", layout="vertical", gap=18, padding=32, sizing_h="fixed", sizing_v="fixed"),
        cmd_text(None, "F4_Tag", "KOMPARASI FAKTA KATALOG BERSUMBER · TANPA DATA KARANGAN AI",
                 parent=ref("f4_left"), fill="#C84B31", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "F4_Title", "Perbandingan Institusi Pilot Bali & Jejak Verifikasi Sumber",
                 parent=ref("f4_left"), fill="#14181D", size=24, family="Merriweather", style="Bold"),
        cmd_text(None, "F4_Sub", "Setiap klaim akreditasi, lokasi, dan biaya ditautkan ke sumber resmi beserta tanggal pemeriksaan terakhir oleh tim. Faktor tanpa sumber ditandai 'Belum Tersedia'.",
                 parent=ref("f4_left"), w=790, fill="#464E59", size=13, family="Inter", style="Regular", line_height=19),

        # Comparison Columns Row (2 Institutions Side-by-Side + 1 SMK Reference)
        cmd_frame("cmp_grid", "Comparison_Columns", parent=ref("f4_left"), w=796, h=660,
                  fill="#F8F6F1", layout="horizontal", gap=16, sizing_h="fill", sizing_v="hug"),

        # Col 1: PNB D4 TRPL
        cmd_frame("c_col1", "Col_PNB_TRPL", parent=ref("cmp_grid"), w=254, h=650,
                  fill="#FFFFFF", stroke="#C84B31", stroke_weight=2, radius=10, layout="vertical", gap=10, padding=16, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "C1_Rank", "PERINGKAT #1 · SKOR 87.4", parent=ref("c_col1"), fill="#C84B31", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "C1_Title", "Politeknik Negeri Bali (D4 TRPL)", parent=ref("c_col1"), w=220, fill="#14181D", size=16, family="Merriweather", style="Bold"),
        cmd_text(None, "C1_R1", "Jenjang: Sarjana Terapan (D4 Vokasi)\nProporsi: ~65% Praktik Lab / 35% Teori", parent=ref("c_col1"), w=220, fill="#464E59", size=12, family="Inter", style="Regular", line_height=18),
        cmd_text(None, "C1_R2", "Akreditasi: Baik Sekali\nSumber: BAN-PT & PDDIKTI\nTanggal Cek: 2026-11-02", parent=ref("c_col1"), w=220, fill="#14593D", size=12, family="Liberation Mono", style="Bold", line_height=17),
        cmd_text(None, "C1_R3", "Estimasi Jarak: ~18.2 km (Garis Lurus dari Kec. Denpasar Barat ke Bukit Jimbaran, Badung)", parent=ref("c_col1"), w=220, fill="#14181D", size=12, family="Inter", style="Regular", line_height=17),
        cmd_text(None, "C1_R4", "Estimasi Biaya: UKT Rp 500.000 - Rp 6.500.000 / semester (Sumber: pnb.ac.id, Cek: 2026-11-02)", parent=ref("c_col1"), w=220, fill="#14181D", size=12, family="Inter", style="Regular", line_height=17),
        cmd_text(None, "C1_R5", "Fasilitas Lab: Lab Rekayasa Perangkat Lunak, Lab Jaringan, Inkubator Bisnis", parent=ref("c_col1"), w=220, fill="#464E59", size=12, family="Inter", style="Regular", line_height=17),
        cmd_text(None, "C1_R6", "Rasio Serapan Kerja Alumni: [BELUM TERSEDIA SUMBER PUBLIK RESMI]", parent=ref("c_col1"), w=220, fill="#854D0E", size=11, family="Liberation Mono", style="Bold", line_height=16),

        # Col 2: Unud S1 TI
        cmd_frame("c_col2", "Col_Unud_TI", parent=ref("cmp_grid"), w=254, h=650,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=10, padding=16, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "C2_Rank", "PERINGKAT #2 · SKOR 84.1", parent=ref("c_col2"), fill="#14593D", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "C2_Title", "Universitas Udayana (S1 Tek. Informasi)", parent=ref("c_col2"), w=220, fill="#14181D", size=16, family="Merriweather", style="Bold"),
        cmd_text(None, "C2_R1", "Jenjang: Sarjana Akademik (S1)\nProporsi: ~45% Praktik / 55% Riset & Teori", parent=ref("c_col2"), w=220, fill="#464E59", size=12, family="Inter", style="Regular", line_height=18),
        cmd_text(None, "C2_R2", "Akreditasi: Unggul\nSumber: LAM INFOKOM & PDDIKTI\nTanggal Cek: 2026-11-02", parent=ref("c_col2"), w=220, fill="#14593D", size=12, family="Liberation Mono", style="Bold", line_height=17),
        cmd_text(None, "C2_R3", "Estimasi Jarak: ~17.5 km (Garis Lurus dari Kec. Denpasar Barat ke Kampus Jimbaran)", parent=ref("c_col2"), w=220, fill="#14181D", size=12, family="Inter", style="Regular", line_height=17),
        cmd_text(None, "C2_R4", "Estimasi Biaya: UKT Kelompok I-V Negeri (Sumber: udayana.ac.id, Cek: 2026-11-02)", parent=ref("c_col2"), w=220, fill="#14181D", size=12, family="Inter", style="Regular", line_height=17),
        cmd_text(None, "C2_R5", "Fasilitas Lab: Lab Smart System, Lab Cloud & Jaringan, Lab Tata Kelola TI", parent=ref("c_col2"), w=220, fill="#464E59", size=12, family="Inter", style="Regular", line_height=17),
        cmd_text(None, "C2_R6", "Biaya Hidup Sekitar Kampus: [BELUM TERSEDIA SUMBER PUBLIK RESMI]", parent=ref("c_col2"), w=220, fill="#854D0E", size=11, family="Liberation Mono", style="Bold", line_height=16),

        # Col 3: SMKN 1 Denpasar (Jalur Siswa SMP -> SMK)
        cmd_frame("c_col3", "Col_SMKN1_Denpasar", parent=ref("cmp_grid"), w=254, h=650,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=10, padding=16, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "C3_Rank", "RUJUKAN JENJANG SMK · KOTA DENPASAR", parent=ref("c_col3"), fill="#854D0E", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "C3_Title", "SMK Negeri 1 Denpasar (PPLG & TJKT)", parent=ref("c_col3"), w=220, fill="#14181D", size=16, family="Merriweather", style="Bold"),
        cmd_text(None, "C3_R1", "Jenjang: SMK Pusat Keunggulan (3 Tahun)\nProporsi: ~70% Praktik & PKL Industri", parent=ref("c_col3"), w=220, fill="#464E59", size=12, family="Inter", style="Regular", line_height=18),
        cmd_text(None, "C3_R2", "Akreditasi: A (Unggul)\nSumber: BAN-PDM Kemendikdasmen\nTanggal Cek: 2026-11-02", parent=ref("c_col3"), w=220, fill="#14593D", size=12, family="Liberation Mono", style="Bold", line_height=17),
        cmd_text(None, "C3_R3", "Estimasi Jarak: ~3.2 km (Garis Lurus ke Jl. HOS Cokroaminoto No. 84, Denpasar Utara)", parent=ref("c_col3"), w=220, fill="#14181D", size=12, family="Inter", style="Regular", line_height=17),
        cmd_text(None, "C3_R4", "Estimasi Biaya: Sekolah Negeri Provinsi Bali (Sumber: smkn1denpasar.sch.id)", parent=ref("c_col3"), w=220, fill="#14181D", size=12, family="Inter", style="Regular", line_height=17),
        cmd_text(None, "C3_R5", "Fasilitas Lab: Lab Fiber Optik, Server Room TKJ, Studio PPLG & Kemitraan DUDIKA", parent=ref("c_col3"), w=220, fill="#464E59", size=12, family="Inter", style="Regular", line_height=17),
        cmd_text(None, "C3_R6", "Catatan: Relevan bila pengguna adalah siswa SMP yang mencari fondasi SMK sebelum kuliah.", parent=ref("c_col3"), w=220, fill="#14593D", size=11, family="Inter", style="Medium", line_height=16),

        # Right Area (580px): Dark Volcanic Basalt AI Transparency & Technical Verification Drawer
        cmd_frame("f4_drawer", "AI_Transparency_And_Judge_Verification_Drawer", parent=ref("f4_insp"), w=580, h=960,
                  fill="#14181D", layout="vertical", gap=16, padding=28, sizing_h="fixed", sizing_v="fixed"),
        cmd_frame("dr_badge", "Judge_Badge", parent=ref("f4_drawer"), w=524, h=30,
                  fill="#1E242B", stroke="#34D399", radius=4, layout="horizontal", padding=[6, 12, 6, 12],
                  main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "JB_1", "TECHNICAL VERIFICATION INSPECTOR (HALAMAN 9 PANDUAN LOMBA)",
                 parent=ref("dr_badge"), fill="#86EFAC", size=10, family="Liberation Mono", style="Bold"),
        cmd_text(None, "JB_2", "LIVE TRACE", parent=ref("dr_badge"), fill="#F8F6F1", size=10, family="Liberation Mono", style="Bold"),

        cmd_text(None, "Dr_Title", "Panel Transparansi AI, Privasi Data & Uji Fallback",
                 parent=ref("f4_drawer"), w=524, fill="#F8F6F1", size=20, family="Merriweather", style="Bold"),
        cmd_text(None, "Dr_Desc", "Dirancang khusus agar siswa, guru, dan juri dapat memverifikasi data apa yang dikirim ke model AI, bagaimana skema JSON divalidasi, serta membuktikan sistem tetap berjalan saat AI dimatikan.",
                 parent=ref("f4_drawer"), w=524, fill="#B8C0CC", size=12, family="Inter", style="Regular", line_height=18),

        # Box 1: Sanitized Request Payload sent to Gemini
        cmd_frame("dr_box1", "Sanitized_Payload_Box", parent=ref("f4_drawer"), w=524, h=220,
                  fill="#1E242B", stroke="#333C48", radius=8, layout="vertical", gap=8, padding=14, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "B1_H", "1. Payload Anonim yang Dikirim ke Gemini 2.5 Flash (Zero PII):",
                 parent=ref("dr_box1"), fill="#86EFAC", size=12, family="Liberation Mono", style="Bold"),
        cmd_text(None, "B1_Code", "{\n  \"session_type\": \"anonymous_ephemeral\",\n  \"current_stage\": \"SMK_12\",\n  \"region_coarse\": \"KOTA_DENPASAR\",\n  \"deterministic_vector\": {\"R\": 0.82, \"I\": 0.88, \"E\": 0.74},\n  \"open_essay_redacted\": \"Waktu PKL aku bantu bikin sistem pencatatan stok sama konfigurasi WiFi di toko kerajinan Gianyar...\",\n  \"allowed_major_ids\": [\"TRPL_D4\", \"SI_S1\", \"TI_S1\", \"TJKT_SMK\", \"DKV_S1\"]\n}",
                 parent=ref("dr_box1"), w=496, fill="#F8F6F1", size=11, family="Liberation Mono", style="Regular", line_height=16),

        # Box 2: Structured Output Response & Guardrail Check
        cmd_frame("dr_box2", "Structured_Response_Box", parent=ref("f4_drawer"), w=524, h=230,
                  fill="#1E242B", stroke="#333C48", radius=8, layout="vertical", gap=8, padding=14, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "B2_H", "2. Hasil Ekstraksi Tervalidasi Zod Schema (Tanpa Mengarang Fakta):",
                 parent=ref("dr_box2"), fill="#FBBF24", size=12, family="Liberation Mono", style="Bold"),
        cmd_text(None, "B2_Code", "{\n  \"schema_valid\": true,\n  \"model\": \"gemini-2.5-flash\",\n  \"extracted_signals\": [\"practical_pos_system\", \"umkm_operations\", \"network_setup\"],\n  \"evidence_quotes\": [\"senang pas sistemnya langsung dipakai kasir\"],\n  \"identified_gaps\": [\"kueri database yang rumit\", \"hitung statistik\"],\n  \"confidence_interval\": [0.82, 0.89],\n  \"institution_facts_source\": \"DATABASE_ONLY_NO_AI_GENERATION\"\n}",
                 parent=ref("dr_box2"), w=496, fill="#F8F6F1", size=11, family="Liberation Mono", style="Regular", line_height=16),

        # Box 3: Live Fallback Toggle for Judges
        cmd_frame("dr_box3", "Fallback_Simulator_Box", parent=ref("f4_drawer"), w=524, h=170,
                  fill="#262E38", stroke="#E05A3F", radius=8, layout="vertical", gap=10, padding=16, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "B3_H", "3. Tombol Simulasi Kegagalan AI (Untuk Sesi Technical Verification Juri):",
                 parent=ref("dr_box3"), fill="#F8F6F1", size=13, family="Inter", style="Bold"),
        cmd_text(None, "B3_B", "Klik tombol di bawah untuk menguji skenario apabila API Gemini gagal/timeout. Aplikasi akan otomatis menonaktifkan sintesis esai dan menjalankan Deterministic Fallback Engine.",
                 parent=ref("dr_box3"), w=492, fill="#B8C0CC", size=12, family="Inter", style="Regular", line_height=17),
        cmd_frame("dr_btns", "Drawer_Action_Buttons", parent=ref("dr_box3"), w=492, h=40,
                  fill="#262E38", layout="horizontal", gap=12, sizing_h="fill", sizing_v="hug"),
        cmd_frame("btn_sim_err", "Btn_Trigger_Fallback", parent=ref("dr_btns"), w=250, h=38,
                  fill="#C84B31", radius=6, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "Sim_T", "Uji Mode Fallback Deterministik", parent=ref("btn_sim_err"), fill="#FFFFFF", size=12, family="Inter", style="Bold"),
        cmd_frame("btn_go_fg", "Btn_Proceed_Field_Guide", parent=ref("dr_btns"), w=228, h=38,
                  fill="#14593D", radius=6, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "FG_T", "Lanjut ke Peta Bidang Pilihan", parent=ref("btn_go_fg"), fill="#FFFFFF", size=12, family="Inter", style="Bold")
    ]
    client.batch(f4_cmds, label="Build Frame 04: Comparison & AI Transparency Drawer")
    print("Built Frame 04: Comparison & AI Transparency Drawer.")

    # -------------------------------------------------------------------------
    # FRAME 5: CONFIRMED FIELD GUIDE & BALI CAREER ROADMAP (x=1520, y=1120)
    # -------------------------------------------------------------------------
    f5_cmds = [
        cmd_frame("f5_guide", "05_Field_Guide_And_Bali_Career_Roadmap", x=1520, y=1120, w=1440, h=960,
                  fill="#F8F6F1", stroke="#B8B0A0", stroke_weight=2, radius=12,
                  layout="vertical", gap=0, padding=0, clip=True),

        # Header
        cmd_frame("f5_top", "Field_Guide_Header", parent=ref("f5_guide"), w=1440, h=92,
                  fill="#14181D", layout="horizontal", gap=24, padding=[18, 48, 18, 48],
                  main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_frame("f5_top_l", "FG_Header_Left", parent=ref("f5_top"), fill="#14181D",
                  layout="vertical", gap=4, sizing_h="hug", sizing_v="hug"),
        cmd_text(None, "FG_Step", "PILIHAN DIKONFIRMASI · PETA BIDANG BERBASIS KONTEN RUJUKAN TERVERIFIKASI",
                 parent=ref("f5_top_l"), fill="#86EFAC", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "FG_Title", "Peta Bidang: Teknologi Rekayasa Perangkat Lunak & Sistem Informasi",
                 parent=ref("f5_top_l"), fill="#F8F6F1", size=22, family="Merriweather", style="Bold"),
        cmd_frame("f5_top_r", "FG_Header_Actions", parent=ref("f5_top"), fill="#14181D",
                  layout="horizontal", gap=12, cross_align="center", sizing_h="hug", sizing_v="hug"),
        cmd_frame("btn_chg", "Btn_Change_Major", parent=ref("f5_top_r"), w=180, h=40,
                  fill="#1E242B", stroke="#B8C0CC", radius=6, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "Chg_T", "Ganti Pilihan Jurusan", parent=ref("btn_chg"), fill="#F8F6F1", size=12, family="Inter", style="SemiBold"),
        cmd_frame("btn_pdf", "Btn_Export_PDF", parent=ref("f5_top_r"), w=240, h=40,
                  fill="#C84B31", radius=6, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "Pdf_T", "Cetak Ringkasan Diskusi Guru BK", parent=ref("btn_pdf"), fill="#FFFFFF", size=12, family="Inter", style="Bold"),

        # Content Grid (2x2 Asymmetric Editorial Cards + Bottom Preparation Banner)
        cmd_frame("f5_body", "FG_Body_Container", parent=ref("f5_guide"), w=1440, h=868,
                  fill="#F8F6F1", layout="vertical", gap=20, padding=[28, 48, 28, 48],
                  sizing_h="fill", sizing_v="fill"),

        # Row 1 of Field Guide
        cmd_frame("fg_row1", "FG_Row_1", parent=ref("f5_body"), w=1344, h=330,
                  fill="#F8F6F1", layout="horizontal", gap=20, sizing_h="fill", sizing_v="hug"),

        # Card 1: What You Study & Bridging the Gap
        cmd_frame("fg_c1", "Card_What_You_Study", parent=ref("fg_row1"), w=662, h=320,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=10, padding=22, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "FG1_Tag", "1. APA YANG DIPELAJARI & CARA MENUTUP KESENJANGAN AWAL",
                 parent=ref("fg_c1"), fill="#C84B31", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "FG1_H", "Gambaran Materi Kuliah & Praktik Laboratorium",
                 parent=ref("fg_c1"), fill="#14181D", size=18, family="Merriweather", style="Bold"),
        cmd_text(None, "FG1_B", "• Tahun 1: Dasar Algoritma & Pemrograman, Pemodelan Basis Data (SQL), Desain Antarmuka Web, dan Matematika Diskrit Terapan.\n• Tahun 2: Rekayasa Perangkat Lunak Berorientasi Objek, Integrasi REST API, Administrasi Server Linux, dan Proyek Aplikasi UMKM.\n• Tahun 3-4: Keamanan Aplikasi, Arsitektur Cloud, Magang Industri 1-2 Semester.",
                 parent=ref("fg_c1"), w=618, fill="#464E59", size=13, family="Inter", style="Regular", line_height=20),
        cmd_frame("fg1_bridge", "Bridge_Gap_Box", parent=ref("fg_c1"), w=618, h=76,
                  fill="#FDF2DF", stroke="#F59E0B", radius=6, layout="vertical", gap=4, padding=10, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "BG_H", "Jembatan Kesiapan (Menjawab Kendala Database & Statistik yang Kamu Sebut):",
                 parent=ref("fg1_bridge"), fill="#854D0E", size=12, family="Inter", style="Bold"),
        cmd_text(None, "BG_B", "Kamu tidak perlu mahir kueri rumit sebelum masuk. Mulailah dari latihan visual tabel relasional (SELECT, JOIN, GROUP BY) menggunakan studi kasus stok barang toko tempatmu PKL.",
                 parent=ref("fg1_bridge"), w=596, fill="#14181D", size=12, family="Inter", style="Regular", line_height=17),

        # Card 2: Real Problems Solved in Bali Context
        cmd_frame("fg_c2", "Card_Bali_Real_Problems", parent=ref("fg_row1"), w=662, h=320,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=10, padding=22, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "FG2_Tag", "2. CONTOH MASALAH NYATA DI BALI YANG DISELESAIKAN BIDANG INI",
                 parent=ref("fg_c2"), fill="#14593D", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "FG2_H", "Dampak Langsung pada Ekosistem Lokal Bali",
                 parent=ref("fg_c2"), fill="#14181D", size=18, family="Merriweather", style="Bold"),
        cmd_text(None, "FG2_B", "• Digitalisasi Operasional UMKM & Kerajinan (Gianyar/Denpasar): Membangun sistem inventaris lintas gudang, kasir terpadu, dan pelacakan pesanan ekspor kerajinan.\n• Pariwisata Berkelanjutan & Desa Wisata: Sistem manajemen reservasi homestay lokal, pemantauan kapasitas kunjungan, dan transparansi retribusi desa.\n• Sistem Informasi Pertanian & Subak: Dashboard pencatatan jadwal distribusi air dan rantai pasok hasil panen petani lokal langsung ke hotel/restoran.",
                 parent=ref("fg_c2"), w=618, fill="#464E59", size=13, family="Inter", style="Regular", line_height=20),
        cmd_frame("fg2_src", "Source_Label_Box", parent=ref("fg_c2"), w=618, h=52,
                  fill="#E6F4ED", radius=6, layout="vertical", gap=4, padding=10, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "SL_T", "[SUMBER KONTEN TERVERIFIKASI] Dirangkum dari Profil Lulusan PNB & Kurikulum Kemendikdasmen, Ditinjau Tim (Bukan Teks Bebas AI).",
                 parent=ref("fg2_src"), w=596, fill="#14593D", size=11, family="Liberation Mono", style="Bold"),

        # Row 2 of Field Guide
        cmd_frame("fg_row2", "FG_Row_2", parent=ref("f5_body"), w=1344, h=320,
                  fill="#F8F6F1", layout="horizontal", gap=20, sizing_h="fill", sizing_v="hug"),

        # Card 3: Career Paths & Core Competencies
        cmd_frame("fg_c3", "Card_Career_And_Skills", parent=ref("fg_row2"), w=662, h=310,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=10, padding=22, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "FG3_Tag", "3. JALUR KARIER & KETERAMPILAN INTI (TANPA JANJI PENGHASILAN MULUK)",
                 parent=ref("fg_c3"), fill="#14181D", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "FG3_H", "Peran Profesional & Kompetensi yang Dibangun",
                 parent=ref("fg_c3"), fill="#14181D", size=18, family="Merriweather", style="Bold"),
        cmd_text(None, "FG3_B", "• Full-Stack / Backend Web Developer: Merancang struktur database, API, dan keamanan transaksi aplikasi web.\n• System Analyst / Implementor ERP UMKM: Menerjemahkan kebutuhan bisnis toko, hotel, atau koperasi menjadi alur sistem informasi yang efisien.\n• DevOps & Network Support Engineer: Mengelola server Linux, jaringan lokal, dan deployment aplikasi.",
                 parent=ref("fg_c3"), w=618, fill="#464E59", size=13, family="Inter", style="Regular", line_height=20),
        cmd_text(None, "FG3_Note", "Keterampilan Non-Teknis Kunci: Komunikasi dengan pengguna awam, dokumentasi sistem, dan pemecahan masalah bertahap.",
                 parent=ref("fg_c3"), w=618, fill="#14181D", size=12, family="Inter", style="SemiBold"),

        # Card 4: Entrepreneurship & Local Venture Opportunities
        cmd_frame("fg_c4", "Card_Entrepreneurship", parent=ref("fg_row2"), w=662, h=310,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=10, padding=22, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "FG4_Tag", "4. PELUANG WIRAUSAHA MANDIRI & KOLABORASI LINTAS BIDANG",
                 parent=ref("fg_c4"), fill="#854D0E", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "FG4_H", "Contoh Peluang Usaha Berbasis Kompetensi",
                 parent=ref("fg_c4"), fill="#14181D", size=18, family="Merriweather", style="Bold"),
        cmd_text(None, "FG4_B", "• Studio Integrasi Sistem Kasir & Inventaris Lokal: Menyediakan paket instalasi WiFi + aplikasi pencatatan stok kustom untuk toko kerajinan, kafe, dan klinik di Bali.\n• Mitra Transformasi Digital Desa & Koperasi: Layanan pembuatan serta pemeliharaan sistem informasi layanan warga dan pengelolaan sampah berbasis web.\n• Kolaborasi dengan Lulusan DKV & Kuliner/Perhotelan: Membangun produk pemesanan langsung tanpa komisi platform tinggi.",
                 parent=ref("fg_c4"), w=618, fill="#464E59", size=13, family="Inter", style="Regular", line_height=20),

        # Bottom Disclaimer & Session Control
        cmd_frame("fg_foot", "FG_Footer_Bar", parent=ref("f5_body"), w=1344, h=88,
                  fill="#EFECE4", stroke="#B8B0A0", radius=8, layout="horizontal", padding=18,
                  main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "FGF_Txt", "Langkah Selanjutnya yang Disarankan: Verifikasi jadwal penerimaan terbaru langsung di situs resmi institusi (pnb.ac.id / udayana.ac.id) dan diskusikan lembar eksplorasi ini dengan Guru BK.",
                 parent=ref("fg_foot"), w=960, fill="#14181D", size=13, family="Inter", style="Medium", line_height=19),
        cmd_frame("btn_del_ses", "Btn_Delete_Session", parent=ref("fg_foot"), w=280, h=42,
                  fill="#FFFFFF", stroke="#B91C1C", radius=6, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "Del_T", "Hapus Seluruh Data Sesi Sekarang", parent=ref("btn_del_ses"), fill="#B91C1C", size=12, family="Inter", style="Bold")
    ]
    client.batch(f5_cmds, label="Build Frame 05: Confirmed Field Guide")
    print("Built Frame 05: Confirmed Field Guide.")

    # -------------------------------------------------------------------------
    # FRAME 6: MOBILE RESPONSIVE BREAKPOINTS SHOWCASE (x=3040, y=1120)
    # -------------------------------------------------------------------------
    f6_cmds = [
        cmd_frame("f6_mobile", "06_Mobile_Responsive_Breakpoints_390px", x=3040, y=1120, w=1440, h=960,
                  fill="#EFECE4", stroke="#B8B0A0", stroke_weight=2, radius=12,
                  layout="vertical", gap=20, padding=32, clip=True),
        cmd_frame("f6_hdr", "Mobile_Board_Header", parent=ref("f6_mobile"), w=1376, h=52,
                  fill="#EFECE4", layout="horizontal", main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "M_Title", "Responsivitas Layar Ponsel (390x844px, Target Sentuh >= 44px, Zero Horizontal Overflow, Antislop R-03)",
                 parent=ref("f6_hdr"), w=920, fill="#14181D", size=18, family="Merriweather", style="Bold"),
        cmd_text(None, "M_Tag", "VERIFIED BREAKPOINTS: 375px / 390px / 768px / 1440px",
                 parent=ref("f6_hdr"), fill="#14593D", size=12, family="Liberation Mono", style="Bold"),

        cmd_frame("m_row", "Phones_Row", parent=ref("f6_mobile"), w=1376, h=820,
                  fill="#EFECE4", layout="horizontal", gap=48, main_align="center", cross_align="min", sizing_h="fill", sizing_v="fill"),

        # Phone 1: Mobile Questionnaire & Adaptive Probe
        cmd_frame("mob_1", "Phone_1_Questionnaire", parent=ref("m_row"), w=390, h=800,
                  fill="#F8F6F1", stroke="#14181D", stroke_weight=3, radius=20, layout="vertical", gap=12, padding=16, sizing_h="fixed", sizing_v="fixed", clip=True),
        cmd_frame("m1_top", "M1_Nav", parent=ref("mob_1"), w=358, h=48,
                  fill="#14181D", radius=8, layout="horizontal", padding=12, main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "M1_T", "KertaMarga · Langkah 2/3", parent=ref("m1_top"), fill="#F8F6F1", size=13, family="Merriweather", style="Bold"),
        cmd_text(None, "M1_P", "68%", parent=ref("m1_top"), fill="#86EFAC", size=12, family="Liberation Mono", style="Bold"),
        cmd_frame("m1_ctx", "M1_Context_Pill", parent=ref("mob_1"), w=358, h=38,
                  fill="#EFECE4", stroke="#DFD9CC", radius=6, layout="horizontal", padding=10, cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "M1_C", "Profil: SMK Kelas 12 · Kota Denpasar (Ubah)", parent=ref("m1_ctx"), fill="#14181D", size=12, family="Inter", style="SemiBold"),

        cmd_frame("m1_q", "M1_Question_Card", parent=ref("mob_1"), w=358, h=290,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=10, padding=14, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "M1_QT", "Pertanyaan 1 (Pilihan Terstruktur):", parent=ref("m1_q"), fill="#626A77", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "M1_QP", "Bagian proyek mana yang paling membuatmu betah saat praktik?",
                 parent=ref("m1_q"), w=330, fill="#14181D", size=15, family="Merriweather", style="Bold"),
        cmd_frame("m1_o1", "M1_Opt1_48px", parent=ref("m1_q"), w=330, h=56,
                  fill="#FBECE8", stroke="#C84B31", stroke_weight=2, radius=8, layout="horizontal", padding=10, cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "T", "[DIPILIH] Menguji kode web & jaringan sampai berjalan", parent=ref("m1_o1"), w=308, fill="#14181D", size=12, family="Inter", style="Bold"),
        cmd_frame("m1_o2", "M1_Opt2_48px", parent=ref("m1_q"), w=330, h=56,
                  fill="#F8F6F1", stroke="#DFD9CC", radius=8, layout="horizontal", padding=10, cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "T", "Merancang ilustrasi visual & antarmuka pengguna", parent=ref("m1_o2"), w=308, fill="#464E59", size=12, family="Inter", style="Regular"),

        cmd_frame("m1_probe", "M1_Probe_Card", parent=ref("mob_1"), w=358, h=240,
                  fill="#FFFFFF", stroke="#C84B31", stroke_weight=2, radius=10, layout="vertical", gap=8, padding=14, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "MP_Tag", "PERTANYAAN LANJUTAN ADAPTIF AI", parent=ref("m1_probe"), fill="#C84B31", size=10, family="Liberation Mono", style="Bold"),
        cmd_text(None, "MP_Q", "Dari cerita PKL di Gianyar, apakah kamu ingin fokus ke aplikasi UMKM atau jaringan?",
                 parent=ref("m1_probe"), w=330, fill="#14181D", size=14, family="Merriweather", style="Bold"),
        cmd_frame("m1_skip", "M1_Skip_Btn_44px", parent=ref("m1_probe"), w=330, h=44,
                  fill="#EFECE4", stroke="#B8B0A0", radius=8, layout="horizontal", main_align="center", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "T", "Belum Tahu / Lewati Pertanyaan Ini", parent=ref("m1_skip"), fill="#14181D", size=12, family="Inter", style="SemiBold"),

        cmd_frame("m1_cta", "M1_Sticky_CTA_48px", parent=ref("mob_1"), w=358, h=48,
                  fill="#C84B31", radius=8, layout="horizontal", main_align="center", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "T", "Analisis & Lihat 3 Rekomendasi", parent=ref("m1_cta"), fill="#FFFFFF", size=14, family="Inter", style="Bold"),

        # Phone 2: Mobile Recommendations & Collapsible Priority Sliders
        cmd_frame("mob_2", "Phone_2_Recommendations", parent=ref("m_row"), w=390, h=800,
                  fill="#F8F6F1", stroke="#14181D", stroke_weight=3, radius=20, layout="vertical", gap=12, padding=16, sizing_h="fixed", sizing_v="fixed", clip=True),
        cmd_frame("m2_top", "M2_Nav", parent=ref("mob_2"), w=358, h=48,
                  fill="#14181D", radius=8, layout="horizontal", padding=12, main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "M2_T", "Hasil Eksplorasi (3 Jurusan)", parent=ref("m2_top"), fill="#F8F6F1", size=13, family="Merriweather", style="Bold"),
        cmd_text(None, "M2_A", "Audit AI", parent=ref("m2_top"), fill="#86EFAC", size=11, family="Liberation Mono", style="Bold"),

        cmd_frame("m2_sl", "M2_Weight_Accordion", parent=ref("mob_2"), w=358, h=110,
                  fill="#FFFFFF", stroke="#14181D", radius=8, layout="vertical", gap=6, padding=12, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "M2_SH", "Simulasi Bobot Prioritas (Aktif):", parent=ref("m2_sl"), fill="#C84B31", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "M2_SB", "Kecocokan 40% · Jarak 25% · Akreditasi 20% · Biaya 15%\n[Ketuk untuk Menggeser Prioritas Secara Real-Time]",
                 parent=ref("m2_sl"), w=334, fill="#14181D", size=12, family="Inter", style="Medium", line_height=17),

        cmd_frame("m2_c1", "M2_Rec1_Card", parent=ref("mob_2"), w=358, h=420,
                  fill="#FFFFFF", stroke="#C84B31", stroke_weight=2, radius=10, layout="vertical", gap=10, padding=14, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "M2_Badge", "REKOMENDASI #1 · RENTANG KEYAKINAN 82%-89%", parent=ref("m2_c1"), fill="#14593D", size=10, family="Liberation Mono", style="Bold"),
        cmd_text(None, "M2_H", "D4 Teknologi Rekayasa Perangkat Lunak / S1 Sistem Informasi",
                 parent=ref("m2_c1"), w=330, fill="#14181D", size=16, family="Merriweather", style="Bold"),
        cmd_text(None, "M2_Reason", "Bukti Jawaban: Pengalaman membuat sistem stok kasir UMKM di Gianyar & minat praktik tinggi.",
                 parent=ref("m2_c1"), w=330, fill="#464E59", size=12, family="Inter", style="Regular", line_height=17),
        cmd_frame("m2_i1", "M2_Inst1", parent=ref("m2_c1"), w=330, h=92,
                  fill="#EFECE4", radius=6, layout="vertical", gap=4, padding=10, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "T1", "#1 Politeknik Negeri Bali (Skor 87.4)", parent=ref("m2_i1"), fill="#14181D", size=13, family="Inter", style="Bold"),
        cmd_text(None, "T2", "Akreditasi Baik Sekali · ~18.2 km · UKT Rp 500rb-6.5jt\n[TERVERIFIKASI: pnb.ac.id · 2026-11-02]",
                 parent=ref("m2_i1"), w=310, fill="#14593D", size=11, family="Liberation Mono", style="Bold", line_height=16),
        cmd_frame("m2_btn", "M2_Confirm_48px", parent=ref("m2_c1"), w=330, h=46,
                  fill="#C84B31", radius=8, layout="horizontal", main_align="center", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "T", "Konfirmasi & Buka Peta Bidang", parent=ref("m2_btn"), fill="#FFFFFF", size=13, family="Inter", style="Bold"),

        # Phone 3: Mobile Field Guide & Source Audit Sheet
        cmd_frame("mob_3", "Phone_3_Field_Guide_And_Audit", parent=ref("m_row"), w=390, h=800,
                  fill="#F8F6F1", stroke="#14181D", stroke_weight=3, radius=20, layout="vertical", gap=12, padding=16, sizing_h="fixed", sizing_v="fixed", clip=True),
        cmd_frame("m3_top", "M3_Nav", parent=ref("mob_3"), w=358, h=48,
                  fill="#14181D", radius=8, layout="horizontal", padding=12, main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "M3_T", "Peta Bidang: D4 TRPL / S1 SI", parent=ref("m3_top"), fill="#F8F6F1", size=13, family="Merriweather", style="Bold"),
        cmd_text(None, "M3_B", "Ubah", parent=ref("m3_top"), fill="#E05A3F", size=12, family="Inter", style="Bold"),

        cmd_frame("m3_s1", "M3_Study_Card", parent=ref("mob_3"), w=358, h=190,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=6, padding=14, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "H", "1. Apa yang Dipelajari & Prasyarat", parent=ref("m3_s1"), fill="#14181D", size=15, family="Merriweather", style="Bold"),
        cmd_text(None, "B", "Algoritma, Basis Data Relasional, REST API, Server Linux, dan Proyek Aplikasi UMKM.\nJembatan Kesiapan: Latihan bertahap SQL dasar dari studi kasus stok toko.",
                 parent=ref("m3_s1"), w=330, fill="#464E59", size=12, family="Inter", style="Regular", line_height=18),

        cmd_frame("m3_s2", "M3_Bali_Impact_Card", parent=ref("mob_3"), w=358, h=190,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=6, padding=14, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "H", "2. Masalah Nyata di Bali & Wirausaha", parent=ref("m3_s2"), fill="#14181D", size=15, family="Merriweather", style="Bold"),
        cmd_text(None, "B", "• Sistem Kasir & Inventaris Kerajinan Gianyar\n• Reservasi Homestay Desa Wisata Tanpa Komisi Tinggi\n• Dashboard Distribusi Rantai Pasok Pangan Lokal",
                 parent=ref("m3_s2"), w=330, fill="#464E59", size=12, family="Inter", style="Regular", line_height=18),

        cmd_frame("m3_aud", "M3_Audit_Bottom_Sheet", parent=ref("mob_3"), w=358, h=220,
                  fill="#14181D", radius=10, layout="vertical", gap=8, padding=14, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "AH", "RINGKASAN TRANSPARANSI AI & PRIVASI", parent=ref("m3_aud"), fill="#86EFAC", size=10, family="Liberation Mono", style="Bold"),
        cmd_text(None, "AB", "• Fakta Institusi: 100% Database Terverifikasi\n• Jawaban Terbuka: Dianonimkan sebelum dikirim ke Gemini\n• Status Fallback Deterministik: Siap Aktif Otomatis",
                 parent=ref("m3_aud"), w=330, fill="#F8F6F1", size=12, family="Inter", style="Regular", line_height=18),
        cmd_frame("m3_pdf", "M3_Export_Btn_44px", parent=ref("m3_aud"), w=330, h=44,
                  fill="#C84B31", radius=8, layout="horizontal", main_align="center", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "T", "Unduh Lembar Diskusi Guru BK (PDF)", parent=ref("m3_pdf"), fill="#FFFFFF", size=12, family="Inter", style="Bold")
    ]
    client.batch(f6_cmds, label="Build Frame 06: Mobile Responsive Views")
    print("Built Frame 06: Mobile Responsive Views.")

    # Wire Prototype Navigation Interactions between the Desktop Frames on Page 2
    try:
        doc_tree = client.call_tool("inspect_document", {"depth": 3})
        # Find frame IDs on Page 2
        frames_by_name = {}
        for node in doc_tree.get("children", []):
            frames_by_name[node.get("name")] = node.get("id")

        f1_id = frames_by_name.get("01_Landing_And_Privacy_Consent")
        f2_id = frames_by_name.get("02_Adaptive_Questionnaire_And_AI_Probe")
        f3_id = frames_by_name.get("03_Recommendations_And_Priority_Simulator")
        f4_id = frames_by_name.get("04_Comparison_And_AI_Transparency_Inspector")
        f5_id = frames_by_name.get("05_Field_Guide_And_Bali_Career_Roadmap")

        if f1_id and f2_id and f3_id and f4_id and f5_id:
            client.batch([
                {"command": "proto.interaction.add", "params": {
                    "id": f1_id, "dest": f2_id,
                    "transition": {"type": "smartAnimate"}, "durationMs": 240, "easing": "easeOut"
                }},
                {"command": "proto.interaction.add", "params": {
                    "id": f2_id, "dest": f3_id,
                    "transition": {"type": "smartAnimate"}, "durationMs": 240, "easing": "easeOut"
                }},
                {"command": "proto.interaction.add", "params": {
                    "id": f3_id, "dest": f4_id,
                    "transition": {"type": "smartAnimate"}, "durationMs": 240, "easing": "easeOut"
                }},
                {"command": "proto.interaction.add", "params": {
                    "id": f4_id, "dest": f5_id,
                    "transition": {"type": "smartAnimate"}, "durationMs": 240, "easing": "easeOut"
                }},
                {"command": "proto.interaction.add", "params": {
                    "id": f5_id, "dest": f1_id,
                    "transition": {"type": "dissolve"}, "durationMs": 200, "easing": "easeIn"
                }}
            ], label="Wire Interactive Prototype Flow")
            print("Wired interactive prototype connections across Frames 01 -> 02 -> 03 -> 04 -> 05.")
    except Exception as e:
        print("Prototype wiring note:", e)

    # Fit view in the live GUI window so the user immediately sees the full canvas
    client.run_cmd("view.zoomFit", {})

    # Save .figcraft file to /var/www/mega-project/design/kertamarga-bali-digifest.figcraft
    save_res = client.call_tool("save_file", {
        "path": "/var/www/mega-project/design/kertamarga-bali-digifest.figcraft"
    })
    print("Saved FigCraft document:", save_res)

    client.close()


if __name__ == "__main__":
    build_all()
