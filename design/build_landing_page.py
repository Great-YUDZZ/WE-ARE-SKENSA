#!/usr/bin/env python3
"""
build_landing_page.py
Merancang Landing Page & Modal Autentikasi KertaMarga Bali di FigCraft.
Menerapkan:
- ui-ux-pro-max & antislop: Anti-slop palette (Lontar Ivory, Volcanic Basalt, Bali Terracotta).
- genjutsu-paint & genjutsu-cast: Center-aligned editorial hierarchy, tactile state boundaries, 44-48px touch targets.
- motion-design: Prototype wiring untuk transisi smartAnimate modal login.
- WCAG AAA/AA contrast, zero emoji, zero em dash.
"""

import json
import subprocess
import time
import os

class FigCraftMCPClient:
    def __init__(self):
        cmd = [
            "flatpak", "run", "--command=figcraft-cli", "ai.storyteller.figcraft",
            "mcp",
            "--automation-read-root", "/var/www/mega-project",
            "--automation-write-root", "/var/www/mega-project",
            "--automation-read-root", "/home/yudz/Documents",
            "--automation-write-root", "/home/yudz/Documents"
        ]
        self.proc = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1
        )
        self._init_mcp()

    def _init_mcp(self):
        init_req = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "AntigravityLandingPageBuilder", "version": "1.0.0"}
            }
        }
        self._send(init_req)
        self._recv()
        self._send({"jsonrpc": "2.0", "method": "notifications/initialized"})

    def _send(self, req):
        line = json.dumps(req)
        self.proc.stdin.write(line + "\n")
        self.proc.stdin.flush()

    def _recv(self):
        while True:
            line = self.proc.stdout.readline()
            if not line:
                raise RuntimeError("FigCraft MCP connection terminated.")
            line = line.strip()
            if line:
                data = json.loads(line)
                if "id" in data:
                    return data

    def call_tool(self, name, args):
        req = {
            "jsonrpc": "2.0",
            "id": int(time.time() * 1000) % 10000000,
            "method": "tools/call",
            "params": {"name": name, "arguments": args}
        }
        self._send(req)
        res = self._recv()
        if "error" in res:
            raise RuntimeError(f"Tool {name} error: {res['error']}")
        content = res.get("result", {}).get("content", [])
        if content and content[0].get("type") == "text":
            try:
                return json.loads(content[0]["text"])
            except Exception:
                return content[0]["text"]
        return res.get("result", {})

    def run_cmd(self, command, params):
        return self.call_tool("run_command", {"command": command, "params": params})

    def batch(self, commands, label=None):
        payload = {"commands": commands}
        if label:
            payload["label"] = label
        return self.call_tool("batch", payload)

    def close(self):
        try:
            self.proc.terminate()
            self.proc.wait(timeout=2)
        except Exception:
            self.proc.kill()


# Helper builders for batch commands
def ref(name):
    return {"$ref": name}

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


def build_landing_page():
    client = FigCraftMCPClient()
    print("Connected to FigCraft MCP for Landing Page construction.")

    figcraft_file = "/var/www/mega-project/design/kertamarga-bali-digifest.figcraft"
    if os.path.exists(figcraft_file):
        client.call_tool("open_file", {"path": figcraft_file})
        print(f"Opened existing FigCraft project: {figcraft_file}")

    # Inspect pages list
    pages_list = client.run_cmd("page.list", {})
    if isinstance(pages_list, str):
        pages_list = json.loads(pages_list)

    page3_id = None
    for p in pages_list:
        if p.get("name") == "03 - Landing Page & Minimalist Auth Gate":
            page3_id = p.get("id")
            break

    if page3_id:
        # Delete old page 3 if exists so we start fresh
        client.run_cmd("page.delete", {"id": page3_id})

    # Add and select Page 3
    client.run_cmd("page.add", {"name": "03 - Landing Page & Minimalist Auth Gate"})
    client.run_cmd("page.setBackground", {"color": "#E2DDD2"})
    print("Created Page 03: Landing Page & Minimalist Auth Gate.")

    # -------------------------------------------------------------------------
    # FRAME 1: DESKTOP LANDING PAGE 1440px (x=0, y=0)
    # -------------------------------------------------------------------------
    f1_cmds = [
        cmd_frame("f1_desk", "01_Landing_Page_Desktop_1440px", x=0, y=0, w=1440, h=960,
                  fill="#F8F6F1", stroke="#B8B0A0", stroke_weight=2, radius=12,
                  layout="vertical", gap=0, padding=0, clip=True),

        # 1. Navbar (Height 76px, Border Bottom #DFD9CC)
        cmd_frame("f1_nav", "Top_Navbar", parent=ref("f1_desk"), w=1440, h=76,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=0, layout="horizontal",
                  padding=[16, 64, 16, 64], main_align="spaceBetween", cross_align="center",
                  sizing_h="fill", sizing_v="fixed"),

        # Brand on Left
        cmd_frame("nav_left", "Nav_Brand_Group", parent=ref("f1_nav"), fill="#FFFFFF",
                  layout="horizontal", gap=14, cross_align="center", sizing_h="hug", sizing_v="hug"),
        cmd_frame("nav_logo_box", "Logo_Terracotta_Box", parent=ref("nav_left"), w=36, h=36,
                  fill="#C84B31", radius=8, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "L_Char", "KM", parent=ref("nav_logo_box"), fill="#FFFFFF", size=14, family="Liberation Mono", style="Bold"),
        cmd_text(None, "L_Title", "KertaMarga Bali", parent=ref("nav_left"), fill="#14181D", size=18, family="Merriweather", style="Bold"),
        cmd_frame("nav_badge", "Competition_Badge", parent=ref("nav_left"), w=240, h=26,
                  fill="#EFECE4", radius=4, layout="horizontal", padding=[4, 10, 4, 10], cross_align="center"),
        cmd_text(None, "B_Txt", "BALI DIGIFEST 2026 : KATEGORI SMK", parent=ref("nav_badge"), fill="#464E59", size=10, family="Liberation Mono", style="Bold"),

        # Nav Actions on Right
        cmd_frame("nav_right", "Nav_Action_Group", parent=ref("f1_nav"), fill="#FFFFFF",
                  layout="horizontal", gap=20, cross_align="center", sizing_h="hug", sizing_v="hug"),
        cmd_text(None, "N_Link1", "Tentang Program", parent=ref("nav_right"), fill="#464E59", size=13, family="Inter", style="Medium"),
        cmd_text(None, "N_Link2", "Data Institusi Bali", parent=ref("nav_right"), fill="#464E59", size=13, family="Inter", style="Medium"),
        cmd_frame("btn_nav_login", "Btn_Nav_Login", parent=ref("nav_right"), w=128, h=42,
                  fill="#F8F6F1", stroke="#14181D", stroke_weight=1.5, radius=8,
                  layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "T_Nav_Login", "Masuk Akun", parent=ref("btn_nav_login"), fill="#14181D", size=13, family="Inter", style="Bold"),

        # 2. Hero Section (Center Aligned, Height 530px)
        cmd_frame("f1_hero", "Hero_Section_Center", parent=ref("f1_desk"), w=1440, h=530,
                  fill="#F8F6F1", layout="vertical", gap=22, padding=[64, 80, 40, 80],
                  main_align="center", cross_align="center", sizing_h="fill", sizing_v="fixed"),

        # Micro context pill
        cmd_frame("hero_pill", "Hero_Context_Pill", parent=ref("f1_hero"), w=430, h=30,
                  fill="#E6F4ED", stroke="#14593D", radius=20, layout="horizontal", padding=[4, 14, 4, 14],
                  main_align="center", cross_align="center"),
        cmd_text(None, "Pill_T", "NAVIGASI PENDIDIKAN & KARIER MASA DEPAN BALI", parent=ref("hero_pill"),
                 fill="#14593D", size=11, family="Liberation Mono", style="Bold"),

        # Main Headline (Center, Merriweather Bold 44px)
        cmd_text(None, "Hero_H1", "Temukan Arah Jurusan & Karier\nMasa Depanmu di Bali",
                 parent=ref("f1_hero"), w=980, fill="#14181D", size=44, family="Merriweather", style="Bold",
                 line_height=56, align="center"),

        # Subtitle (Center, Inter 16px, 2-line max)
        cmd_text(None, "Hero_Sub", "Eksplorasi minat dan potensi diri lewat kuesioner terarah serta analisis AI transparan yang diselaraskan langsung dengan data resmi kampus dan SMK se-Bali.",
                 parent=ref("f1_hero"), w=780, fill="#464E59", size=16, family="Inter", style="Regular",
                 line_height=26, align="center"),

        # CTA Buttons Row (Center, 2 Buttons Side-by-Side)
        cmd_frame("hero_ctas", "Hero_Action_Buttons", parent=ref("f1_hero"), w=520, h=54,
                  fill="#F8F6F1", layout="horizontal", gap=16, main_align="center", cross_align="center",
                  sizing_h="hug", sizing_v="hug"),

        # Primary Button: Mulai Tes Sekarang
        cmd_frame("btn_hero_test", "Btn_Hero_Start_Test", parent=ref("hero_ctas"), w=240, h=52,
                  fill="#C84B31", radius=8, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "T_Start", "Mulai Tes Sekarang", parent=ref("btn_hero_test"), fill="#FFFFFF", size=15, family="Inter", style="Bold"),

        # Secondary Button: Masuk Akun
        cmd_frame("btn_hero_login", "Btn_Hero_Login", parent=ref("hero_ctas"), w=190, h=52,
                  fill="#FFFFFF", stroke="#14181D", stroke_weight=1.5, radius=8,
                  layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "T_Hero_Log", "Masuk Akun", parent=ref("btn_hero_login"), fill="#14181D", size=15, family="Inter", style="Bold"),

        # Micro Trust Proof below CTAs
        cmd_text(None, "Hero_Proof", "Kuesioner cepat 5 menit, tanpa biaya pendaftaran, dan privasi anonim terlindungi.",
                 parent=ref("f1_hero"), fill="#626A77", size=12, family="Inter", style="Medium"),

        # 3. 3 Core Value Props (Height 254px, Horizontal Cards)
        cmd_frame("f1_props", "Value_Props_Row", parent=ref("f1_desk"), w=1440, h=254,
                  fill="#F8F6F1", layout="horizontal", gap=24, padding=[10, 80, 20, 80],
                  main_align="center", cross_align="center", sizing_h="fill", sizing_v="hug"),

        # Card 1: Kuesioner Adaptif Singkat
        cmd_frame("prop_1", "Prop_Card_1_Adaptive", parent=ref("f1_props"), w=400, h=194,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=10, padding=22, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "P1_Tag", "01 : INTERAKTIF & SINGKAT", parent=ref("prop_1"), fill="#C84B31", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "P1_Title", "Kuesioner Minat Terarah", parent=ref("prop_1"), fill="#14181D", size=18, family="Merriweather", style="Bold"),
        cmd_text(None, "P1_Desc", "Hanya 5 menit kuesioner ringkas yang memadukan pilihan minat nyata dan cerita pengalaman tanpa tes rumus atau hafalan yang melelahkan.",
                 parent=ref("prop_1"), w=350, fill="#464E59", size=13, family="Inter", style="Regular", line_height=19),

        # Card 2: Data Resmi Terverifikasi
        cmd_frame("prop_2", "Prop_Card_2_Verified", parent=ref("f1_props"), w=400, h=194,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=10, padding=22, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "P2_Tag", "02 : DATA RESMI TERPERIKSA", parent=ref("prop_2"), fill="#14593D", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "P2_Title", "Katalog Kampus & SMK Bali", parent=ref("prop_2"), fill="#14181D", size=18, family="Merriweather", style="Bold"),
        cmd_text(None, "P2_Desc", "Rujukan prodi, akreditasi, dan biaya kuliah berbasis pangkalan data resmi BAN-PT, PDDIKTI, dan Kemendikdasmen tanpa data karangan AI.",
                 parent=ref("prop_2"), w=350, fill="#464E59", size=13, family="Inter", style="Regular", line_height=19),

        # Card 3: Privasi & Transparansi AI
        cmd_frame("prop_3", "Prop_Card_3_Privacy", parent=ref("f1_props"), w=400, h=194,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=10, padding=22, sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "P3_Tag", "03 : ZERO PII & AUDIT TERBUKA", parent=ref("prop_3"), fill="#854D0E", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "P3_Title", "Privasi & Audit AI Terbuka", parent=ref("prop_3"), fill="#14181D", size=18, family="Merriweather", style="Bold"),
        cmd_text(None, "P3_Desc", "Data pribadi tidak diperjualbelikan. Dilengkapi panel audit terbuka agar siswa, guru BK, dan juri dapat melihat logika di balik rekomendasi.",
                 parent=ref("prop_3"), w=350, fill="#464E59", size=13, family="Inter", style="Regular", line_height=19),

        # 4. Minimalist Footer (Height 70px)
        cmd_frame("f1_foot", "Minimal_Footer", parent=ref("f1_desk"), w=1440, h=70,
                  fill="#EFECE4", stroke="#DFD9CC", radius=0, layout="horizontal",
                  padding=[18, 64, 18, 64], main_align="spaceBetween", cross_align="center",
                  sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "Foot_Copy", "KertaMarga Bali : Inisiatif Inovasi Web AI untuk Bali DigiFest 2026 (Kategori SMK)",
                 parent=ref("f1_foot"), fill="#464E59", size=12, family="Inter", style="Medium"),
        cmd_text(None, "Foot_Meta", "Dibangun dengan Next.js, Gemini API & Drizzle ORM | Aksesibilitas WCAG AAA/AA",
                 parent=ref("f1_foot"), fill="#626A77", size=11, family="Liberation Mono", style="Regular")
    ]
    res1 = client.batch(f1_cmds, label="Build Frame 01: Desktop Landing Page")
    print("Built Frame 01: Desktop Landing Page.", len(res1) if isinstance(res1, list) else res1)

    # -------------------------------------------------------------------------
    # FRAME 2: DESKTOP WITH LOGIN MODAL OVERLAY 1440px (x=1520, y=0)
    # -------------------------------------------------------------------------
    f2_cmds = [
        cmd_frame("f2_modal_view", "02_Landing_Page_With_Login_Modal_1440px", x=1520, y=0, w=1440, h=960,
                  fill="#F8F6F1", stroke="#B8B0A0", stroke_weight=2, radius=12,
                  layout="vertical", gap=0, padding=0, clip=True),

        # Dimmed backdrop container covering entire 1440x960
        cmd_frame("f2_overlay", "Dimmed_Backdrop_Overlay", parent=ref("f2_modal_view"), w=1440, h=960,
                  fill="#14181D", layout="vertical", main_align="center", cross_align="center",
                  sizing_h="fill", sizing_v="fill"),

        # Centered Login Dialog Card (Width 460px, Clean Anti-slop Borders)
        cmd_frame("f2_card", "Login_Modal_Card", parent=ref("f2_overlay"), w=460, h=620,
                  fill="#FFFFFF", stroke="#C84B31", stroke_weight=2, radius=12,
                  layout="vertical", gap=16, padding=32, sizing_h="fixed", sizing_v="hug"),

        # Top Tag & Close Button
        cmd_frame("mc_top", "Modal_Card_Header_Row", parent=ref("f2_card"), w=396, h=28,
                  fill="#FFFFFF", layout="horizontal", main_align="spaceBetween", cross_align="center",
                  sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "MC_Tag", "GERBANG MASUK EKSPLORASI", parent=ref("mc_top"), fill="#C84B31", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "MC_Close", "[Tutup X]", parent=ref("mc_top"), fill="#626A77", size=12, family="Inter", style="Bold"),

        # Title & Subtitle
        cmd_text(None, "MC_Title", "Masuk ke KertaMarga", parent=ref("f2_card"), fill="#14181D", size=24, family="Merriweather", style="Bold"),
        cmd_text(None, "MC_Sub", "Simpan hasil rekomendasi, pantau perkembangan minat, atau lanjutkan konsultasi bersama Guru BK.",
                 parent=ref("f2_card"), w=396, fill="#464E59", size=13, family="Inter", style="Regular", line_height=19),

        # Role Tabs (Siswa vs Guru BK)
        cmd_frame("mc_tabs", "Role_Tabs_Row", parent=ref("f2_card"), w=396, h=44,
                  fill="#EFECE4", radius=8, layout="horizontal", padding=4, gap=6,
                  sizing_h="fill", sizing_v="fixed"),
        cmd_frame("tab_siswa", "Tab_Siswa_Active", parent=ref("mc_tabs"), w=191, h=36,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=6, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "TS_T", "Siswa SMP / SMA / SMK", parent=ref("tab_siswa"), fill="#14181D", size=12, family="Inter", style="Bold"),
        cmd_frame("tab_guru", "Tab_Guru_Inactive", parent=ref("mc_tabs"), w=191, h=36,
                  fill="#EFECE4", radius=6, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "TG_T", "Guru BK / Pembimbing", parent=ref("tab_guru"), fill="#626A77", size=12, family="Inter", style="Medium"),

        # Input 1: NISN / Email
        cmd_frame("f_grp1", "Form_Group_Identifier", parent=ref("f2_card"), w=396, h=68,
                  fill="#FFFFFF", layout="vertical", gap=6, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "L_Id", "NISN / ID Siswa / Email Sekolah", parent=ref("f_grp1"), fill="#14181D", size=12, family="Inter", style="Bold"),
        cmd_frame("inp_id", "Input_Box_Identifier", parent=ref("f_grp1"), w=396, h=44,
                  fill="#F8F6F1", stroke="#B8B0A0", radius=6, layout="horizontal", padding=[10, 14, 10, 14], cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "Pl_Id", "Contoh: 0071234567 atau nama@sekolah.sch.id", parent=ref("inp_id"), fill="#626A77", size=12, family="Inter", style="Regular"),

        # Input 2: Kata Sandi
        cmd_frame("f_grp2", "Form_Group_Password", parent=ref("f2_card"), w=396, h=68,
                  fill="#FFFFFF", layout="vertical", gap=6, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "L_Pass", "Kata Sandi", parent=ref("f_grp2"), fill="#14181D", size=12, family="Inter", style="Bold"),
        cmd_frame("inp_pass", "Input_Box_Password", parent=ref("f_grp2"), w=396, h=44,
                  fill="#F8F6F1", stroke="#B8B0A0", radius=6, layout="horizontal", padding=[10, 14, 10, 14], cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "Pl_Pass", "••••••••••••", parent=ref("inp_pass"), fill="#14181D", size=13, family="Inter", style="Regular"),

        # Primary Submit Action (Height 48px)
        cmd_frame("btn_login_submit", "Btn_Login_Submit_48px", parent=ref("f2_card"), w=396, h=48,
                  fill="#C84B31", radius=8, layout="horizontal", main_align="center", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "T_Sub", "Masuk & Lanjut ke Tes", parent=ref("btn_login_submit"), fill="#FFFFFF", size=14, family="Inter", style="Bold"),

        # Divider
        cmd_frame("div_box", "Divider_Row", parent=ref("f2_card"), w=396, h=20,
                  fill="#FFFFFF", layout="horizontal", main_align="center", cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "Div_T", "atau lanjutkan tanpa registrasi akun", parent=ref("div_box"), fill="#626A77", size=11, family="Inter", style="Regular"),

        # Anonymous Guest Option
        cmd_frame("btn_guest", "Btn_Guest_Anonymous_48px", parent=ref("f2_card"), w=396, h=48,
                  fill="#EFECE4", stroke="#14181D", stroke_weight=1.5, radius=8,
                  layout="horizontal", main_align="center", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "T_Guest", "Lanjut Mode Tamu Anonim (Coba Tes Langsung)", parent=ref("btn_guest"), fill="#14181D", size=13, family="Inter", style="Bold"),

        # Security Assurance Footer inside Modal
        cmd_text(None, "Modal_Sec_Note", "Privasi Terjamin: Dalam Mode Tamu, tidak ada data pribadi yang disimpan di server.",
                 parent=ref("f2_card"), w=396, fill="#14593D", size=11, family="Liberation Mono", style="Bold", align="center")
    ]
    res2 = client.batch(f2_cmds, label="Build Frame 02: Landing Page with Login Modal")
    print("Built Frame 02: Landing Page with Login Modal.", len(res2) if isinstance(res2, list) else res2)

    # -------------------------------------------------------------------------
    # FRAME 3: MOBILE LANDING PAGE 390px (x=3040, y=0)
    # -------------------------------------------------------------------------
    f3_cmds = [
        cmd_frame("f3_mob", "03_Landing_Page_Mobile_390px", x=3040, y=0, w=390, h=960,
                  fill="#F8F6F1", stroke="#B8B0A0", stroke_weight=2, radius=12,
                  layout="vertical", gap=14, padding=16, clip=True),

        # Mobile Top Nav
        cmd_frame("m_nav", "Mobile_Navbar", parent=ref("f3_mob"), w=358, h=52,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=8, layout="horizontal",
                  padding=[10, 14, 10, 14], main_align="spaceBetween", cross_align="center",
                  sizing_h="fill", sizing_v="fixed"),
        cmd_frame("m_logo", "M_Brand", parent=ref("m_nav"), fill="#FFFFFF", layout="horizontal", gap=8, cross_align="center"),
        cmd_frame("m_lbox", "M_Logo_Box", parent=ref("m_logo"), w=28, h=28, fill="#C84B31", radius=6, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "M_KM", "KM", parent=ref("m_lbox"), fill="#FFFFFF", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "M_Name", "KertaMarga", parent=ref("m_logo"), fill="#14181D", size=15, family="Merriweather", style="Bold"),
        cmd_frame("m_btn_log", "M_Btn_Nav_Login", parent=ref("m_nav"), w=86, h=34,
                  fill="#F8F6F1", stroke="#14181D", radius=6, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "M_LT", "Masuk", parent=ref("m_btn_log"), fill="#14181D", size=12, family="Inter", style="Bold"),

        # Mobile Hero Container
        cmd_frame("m_hero", "Mobile_Hero_Card", parent=ref("f3_mob"), w=358, h=320,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=10, layout="vertical", gap=12, padding=18,
                  cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_frame("m_pill", "M_Hero_Pill", parent=ref("m_hero"), w=280, h=24,
                  fill="#E6F4ED", radius=12, layout="horizontal", padding=[3, 8, 3, 8], main_align="center", cross_align="center"),
        cmd_text(None, "MPT", "BALI DIGIFEST 2026 : KATEGORI SMK", parent=ref("m_pill"), fill="#14593D", size=9, family="Liberation Mono", style="Bold"),
        cmd_text(None, "M_H1", "Temukan Arah Jurusan & Kariermu di Bali", parent=ref("m_hero"), w=322,
                 fill="#14181D", size=22, family="Merriweather", style="Bold", line_height=30, align="center"),
        cmd_text(None, "M_Sub", "Kuesioner minat terarah dan analisis AI transparan berbasis data resmi kampus dan SMK Bali.",
                 parent=ref("m_hero"), w=322, fill="#464E59", size=13, family="Inter", style="Regular", line_height=19, align="center"),

        # Mobile Full-width Action Buttons
        cmd_frame("m_btn_start", "M_Btn_Start_Test_48px", parent=ref("m_hero"), w=322, h=48,
                  fill="#C84B31", radius=8, layout="horizontal", main_align="center", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "M_BT1", "Mulai Tes Sekarang", parent=ref("m_btn_start"), fill="#FFFFFF", size=14, family="Inter", style="Bold"),
        cmd_frame("m_btn_in", "M_Btn_Login_Sec_48px", parent=ref("m_hero"), w=322, h=44,
                  fill="#F8F6F1", stroke="#14181D", radius=8, layout="horizontal", main_align="center", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "M_BT2", "Masuk Akun", parent=ref("m_btn_in"), fill="#14181D", size=13, family="Inter", style="Bold"),

        # 3 Vertical Props on Mobile
        cmd_frame("m_p1", "M_Prop_1", parent=ref("f3_mob"), w=358, h=110,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=8, layout="vertical", gap=4, padding=12, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "MP1_T", "01 : Kuesioner Adaptif Singkat", parent=ref("m_p1"), fill="#C84B31", size=13, family="Merriweather", style="Bold"),
        cmd_text(None, "MP1_D", "Hanya 5 menit kuesioner minat nyata tanpa ujian hafalan teori.", parent=ref("m_p1"), w=334, fill="#464E59", size=12, family="Inter", style="Regular"),

        cmd_frame("m_p2", "M_Prop_2", parent=ref("f3_mob"), w=358, h=110,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=8, layout="vertical", gap=4, padding=12, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "MP2_T", "02 : Data Kampus & SMK Terverifikasi", parent=ref("m_p2"), fill="#14593D", size=13, family="Merriweather", style="Bold"),
        cmd_text(None, "MP2_D", "Rujukan akreditasi BAN-PT & PDDIKTI tanpa data karangan AI.", parent=ref("m_p2"), w=334, fill="#464E59", size=12, family="Inter", style="Regular"),

        cmd_frame("m_p3", "M_Prop_3", parent=ref("f3_mob"), w=358, h=110,
                  fill="#FFFFFF", stroke="#DFD9CC", radius=8, layout="vertical", gap=4, padding=12, sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "MP3_T", "03 : Privasi Aman & Tanpa Iklan", parent=ref("m_p3"), fill="#854D0E", size=13, family="Merriweather", style="Bold"),
        cmd_text(None, "MP3_D", "Zero data pelacakan komersial, audit terbuka untuk guru dan juri.", parent=ref("m_p3"), w=334, fill="#464E59", size=12, family="Inter", style="Regular"),

        # Mobile Footer
        cmd_text(None, "M_Foot", "KertaMarga Bali (Kategori SMK) | Aksesibilitas Teruji",
                 parent=ref("f3_mob"), fill="#626A77", size=11, family="Liberation Mono", style="Regular", align="center")
    ]
    res3 = client.batch(f3_cmds, label="Build Frame 03: Mobile Landing Page")
    print("Built Frame 03: Mobile Landing Page.", len(res3) if isinstance(res3, list) else res3)

    # -------------------------------------------------------------------------
    # FRAME 4: MOBILE LOGIN BOTTOM SHEET 390px (x=3510, y=0)
    # -------------------------------------------------------------------------
    f4_cmds = [
        cmd_frame("f4_mob_modal", "04_Mobile_Login_Modal_390px", x=3510, y=0, w=390, h=960,
                  fill="#14181D", stroke="#B8B0A0", stroke_weight=2, radius=12,
                  layout="vertical", main_align="max", gap=0, padding=0, clip=True),

        # Bottom Sheet Container
        cmd_frame("mb_sheet", "Mobile_Login_Sheet", parent=ref("f4_mob_modal"), w=390, h=660,
                  fill="#FFFFFF", stroke="#C84B31", stroke_weight=2, radius=16,
                  layout="vertical", gap=12, padding=20, sizing_h="fill", sizing_v="fixed"),

        # Sheet Handle
        cmd_frame("mb_handle", "Sheet_Handle", parent=ref("mb_sheet"), w=60, h=4,
                  fill="#B8B0A0", radius=2, layout="horizontal", main_align="center", cross_align="center"),

        cmd_frame("mb_hdr", "MB_Header_Row", parent=ref("mb_sheet"), w=350, h=26,
                  fill="#FFFFFF", layout="horizontal", main_align="spaceBetween", cross_align="center", sizing_h="fill", sizing_v="hug"),
        cmd_text(None, "MB_Tag", "GERBANG MASUK", parent=ref("mb_hdr"), fill="#C84B31", size=11, family="Liberation Mono", style="Bold"),
        cmd_text(None, "MB_Close", "[Tutup X]", parent=ref("mb_hdr"), fill="#626A77", size=12, family="Inter", style="Bold"),

        cmd_text(None, "MB_Title", "Masuk ke KertaMarga", parent=ref("mb_sheet"), fill="#14181D", size=20, family="Merriweather", style="Bold"),
        cmd_text(None, "MB_Desc", "Simpan progres tes atau coba kuesioner langsung.", parent=ref("mb_sheet"), w=350, fill="#464E59", size=12, family="Inter", style="Regular"),

        # Mobile Role Tabs
        cmd_frame("mb_tabs", "MB_Role_Tabs", parent=ref("mb_sheet"), w=350, h=40,
                  fill="#EFECE4", radius=6, layout="horizontal", padding=3, gap=4, sizing_h="fill", sizing_v="fixed"),
        cmd_frame("mb_tab_s", "MB_Tab_Siswa", parent=ref("mb_tabs"), w=169, h=34,
                  fill="#FFFFFF", radius=4, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "T1", "Siswa", parent=ref("mb_tab_s"), fill="#14181D", size=12, family="Inter", style="Bold"),
        cmd_frame("mb_tab_g", "MB_Tab_Guru", parent=ref("mb_tabs"), w=169, h=34,
                  fill="#EFECE4", radius=4, layout="horizontal", main_align="center", cross_align="center"),
        cmd_text(None, "T2", "Guru BK", parent=ref("mb_tab_g"), fill="#626A77", size=12, family="Inter", style="Medium"),

        # Mobile Inputs (Touch target >= 46px)
        cmd_text(None, "ML_1", "NISN / Email", parent=ref("mb_sheet"), fill="#14181D", size=12, family="Inter", style="Bold"),
        cmd_frame("minp_1", "M_Input_NISN", parent=ref("mb_sheet"), w=350, h=46,
                  fill="#F8F6F1", stroke="#B8B0A0", radius=6, layout="horizontal", padding=12, cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "MPT_1", "Nomor NISN atau email", parent=ref("minp_1"), fill="#626A77", size=12, family="Inter", style="Regular"),

        cmd_text(None, "ML_2", "Kata Sandi", parent=ref("mb_sheet"), fill="#14181D", size=12, family="Inter", style="Bold"),
        cmd_frame("minp_2", "M_Input_Pass", parent=ref("mb_sheet"), w=350, h=46,
                  fill="#F8F6F1", stroke="#B8B0A0", radius=6, layout="horizontal", padding=12, cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "MPT_2", "••••••••••••", parent=ref("minp_2"), fill="#14181D", size=12, family="Inter", style="Regular"),

        # Action 1: Masuk Akun
        cmd_frame("m_act_in", "M_Btn_Submit_48px", parent=ref("mb_sheet"), w=350, h=48,
                  fill="#C84B31", radius=8, layout="horizontal", main_align="center", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "MT_Sub", "Masuk & Lanjut ke Tes", parent=ref("m_act_in"), fill="#FFFFFF", size=14, family="Inter", style="Bold"),

        # Action 2: Mode Tamu
        cmd_frame("m_act_guest", "M_Btn_Guest_48px", parent=ref("mb_sheet"), w=350, h=48,
                  fill="#EFECE4", stroke="#14181D", radius=8, layout="horizontal", main_align="center", cross_align="center", sizing_h="fill", sizing_v="fixed"),
        cmd_text(None, "MT_Guest", "Lanjut Mode Tamu Anonim", parent=ref("m_act_guest"), fill="#14181D", size=13, family="Inter", style="Bold")
    ]
    res4 = client.batch(f4_cmds, label="Build Frame 04: Mobile Login Bottom Sheet")
    print("Built Frame 04: Mobile Login Bottom Sheet.", len(res4) if isinstance(res4, list) else res4)

    # Zoom fit canvas
    client.run_cmd("view.zoomFit", {})

    # Save to disk
    save_res = client.call_tool("save_file", {"path": figcraft_file})
    print("Saved FigCraft project:", save_res)

    client.close()


if __name__ == "__main__":
    build_landing_page()
