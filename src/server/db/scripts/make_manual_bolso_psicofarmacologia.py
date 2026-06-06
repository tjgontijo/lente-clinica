#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Manual de Bolso da Psicofarmacologia para Terapeutas
Gerador de PDF Editorial - Versão Completa (Fix HTML Tags)
"""

from __future__ import annotations

import os
import re
import json

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    NextPageTemplate,
    HRFlowable,
)


HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "manual_bolso_psicofarmacologia.pdf")

W, H = A4
ML = MR = 2.5 * cm
MT = 2.5 * cm
MB = 2.0 * cm
CW = W - ML - MR

INK = HexColor("#1A2E2A")
MUTED = HexColor("#5C706B")
LINE = HexColor("#D8E3E0")
GREEN = HexColor("#2D574C")
GREEN_SOFT = HexColor("#F2F7F6")
TERRACOTTA = HexColor("#B8653C")
CREAM = HexColor("#FFF7F0")
Y_BG = HexColor("#FFF9E5")
Y_TXT = HexColor("#8F5600")
R_BG = HexColor("#FFF0F0")
R_TXT = HexColor("#A61B1B")


def ps(name, font="Helvetica", size=10, lead=None, color=None, align=TA_LEFT, after=0, indent=0, first_indent=0):
    return ParagraphStyle(
        name,
        fontName=font,
        fontSize=size,
        leading=lead or round(size * 1.4, 1),
        textColor=color or INK,
        alignment=align,
        spaceAfter=after,
        leftIndent=indent,
        firstLineIndent=first_indent,
    )


ST = {
    "top": ps("top", "Helvetica-Bold", 8.0, 10.0, MUTED),
    "top_r": ps("top_r", "Helvetica", 8.0, 10.0, MUTED, TA_RIGHT),
    "num": ps("num", "Helvetica-Bold", 24.0, 24.0, TERRACOTTA),
    "title": ps("title", "Helvetica-Bold", 26.0, 30.0, GREEN),
    "class": ps("class", "Helvetica", 13.0, 16.0, MUTED),
    "section": ps("section", "Helvetica-Bold", 12.0, 16.0, GREEN, after=2),
    "body": ps("body", "Helvetica", 10.5, 15.0, INK, after=4),
    "small": ps("small", "Helvetica", 10.0, 14.5, INK, after=4),
    "quote": ps("quote", "Helvetica-Oblique", 11.5, 16.0, GREEN),
    "yellow": ps("yellow", "Helvetica", 10.0, 14.5, Y_TXT),
    "red": ps("red", "Helvetica", 10.0, 14.5, R_TXT),
    "label_y": ps("label_y", "Helvetica-Bold", 11.0, 15.0, Y_TXT, after=4),
    "label_r": ps("label_r", "Helvetica-Bold", 11.0, 15.0, R_TXT, after=4),
    "footer": ps("footer", "Helvetica", 8.0, 10.0, MUTED),
    "bullet": ps("bullet", "Helvetica", 10.0, 15.0, INK, after=6, indent=12, first_indent=-12),
    "bullet_body": ps("bullet_body", "Helvetica", 10.5, 15.5, INK, after=6, indent=12, first_indent=-12),
    "bullet_yellow": ps("bullet_yellow", "Helvetica", 10.0, 14.5, Y_TXT, after=4, indent=12, first_indent=-12),
    "bullet_red": ps("bullet_red", "Helvetica", 10.0, 14.5, R_TXT, after=4, indent=12, first_indent=-12),
}

ST["label"] = ParagraphStyle(
    name="label",
    parent=ST["body"],
    fontName="Helvetica-Bold",
    fontSize=11,
    textColor=GREEN,
    spaceBefore=8,
    spaceAfter=0,
    keepWithNext=True
)


def clean_txt(text: str) -> str:
    """Limpa o texto mantendo as tags HTML para o ReportLab."""
    if not text: return ""
    return str(text).replace("&", "&amp;").replace("—", "-").replace("–", "-").strip()


def p(text: str, style="body") -> Paragraph:
    return Paragraph(clean_txt(text), ST[style])


def list_items(items: list[str], style="bullet") -> list[Paragraph]:
    return [Paragraph(f"• &nbsp;{clean_txt(item)}", ST[style]) for item in items]


from reportlab.platypus import Flowable

class BookmarkFlowable(Flowable):
    """Flowable invisível para inserir bookmarks no PDF."""
    def __init__(self, title, level=0):
        Flowable.__init__(self)
        self.title = title
        self.level = level

    def draw(self):
        key = f"dest_{self.title.replace(' ', '_')}"
        self.canv.bookmarkPage(key)
        self.canv.addOutlineEntry(self.title, key, level=self.level)

def quoted_items(items):
    """Garante que cada item da lista esteja entre aspas."""
    if not items: return []
    if isinstance(items, str):
        items = [items]
    return [f'"{i.strip().replace("\"", "")}"' for i in items if i]


def comma_items(text: str) -> list[str]:
    return [item.strip().strip(".") for item in text.split(", ") if item.strip()]



def draw_page(canvas, doc):
    canvas.saveState()
    if doc.page == 1:
        canvas.setAuthor("Dra. Tatiana Gontijo")
        canvas.setTitle("Manual de Bolso da Psicofarmacologia")
    
    canvas.setStrokeColor(LINE); canvas.setLineWidth(1.0)
    canvas.line(ML, H - MT + 15, ML + CW, H - MT + 15)
    canvas.setFillColor(MUTED); canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(ML, H - MT + 22, "MANUAL DE BOLSO DA PSICOFARMACOLOGIA")
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(ML + CW, H - MT + 22, "Dra. Tatiana Gontijo")
    canvas.setStrokeColor(LINE); canvas.line(ML, MB - 10, ML + CW, MB - 10)
    canvas.setFont("Helvetica", 8); canvas.setFillColor(MUTED)
    canvas.drawCentredString(W / 2, MB - 24, "Manual de Bolso da Psicofarmacologia para Terapeutas")
    canvas.drawRightString(ML + CW, MB - 24, f"Página {doc.page}")
    canvas.restoreState()


def draw_cover(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(INK); canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFillColor(GREEN); canvas.circle(W * 0.86, H * 0.78, 88, fill=1, stroke=0)
    canvas.setFillColor(HexColor("#162824")); canvas.circle(W * 0.80, H * 0.70, 52, fill=1, stroke=0)
    canvas.setFillColor(TERRACOTTA); canvas.rect(0, H - 5 * mm, W, 5 * mm, fill=1, stroke=0)
    canvas.setFillColor(GREEN); canvas.rect(0, 0, W, 2.8 * cm, fill=1, stroke=0)
    canvas.setFont("Helvetica", 7.5); canvas.setFillColor(HexColor("#A3C4BC"))
    canvas.drawString(ML, 1.15 * cm, "Uso exclusivo para fins educativos")
    canvas.setFont("Helvetica-Bold", 7.5); canvas.setFillColor(TERRACOTTA)
    canvas.drawRightString(W - MR, 1.15 * cm, "Dra. Tatiana Gontijo")
    canvas.restoreState()


def make_doc(path):
    doc = BaseDocTemplate(path, pagesize=A4, leftMargin=ML, rightMargin=MR, topMargin=MT, bottomMargin=MB)
    frame = Frame(ML, MB, CW, H - MT - MB, id="content")
    doc.addPageTemplates([
        PageTemplate(id="Cover", frames=[frame], onPage=draw_cover),
        PageTemplate(id="page", frames=[frame], onPage=draw_page)
    ])
    return doc


def soft_box(title, body, width, bg, line_color, label_style, body_style, pad_v=12):
    """Cria um quadro colorido que pode quebrar páginas, repetindo o título se necessário."""
    # Preparar as linhas da tabela: a primeira é o título, as outras são os itens
    rows = [[p(title, label_style)]]
    
    if isinstance(body, list):
        for item in body:
            rows.append([item])
    else:
        rows.append([p(body, body_style)])
        
    # Criar a tabela permitindo quebra entre linhas (splitByRow=1)
    # repeatRows=1 faz o título aparecer de novo se a tabela pular de página
    table = Table(rows, colWidths=[width], repeatRows=1, splitByRow=1)
    
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LINEBEFORE", (0, 0), (0, -1), 4, line_color),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        # Padding do título (primeira linha)
        ("TOPPADDING", (0, 0), (0, 0), pad_v),
        ("BOTTOMPADDING", (0, 0), (0, 0), 2),
        # Padding dos itens (demais linhas)
        ("TOPPADDING", (0, 1), (0, -1), 2),
        ("BOTTOMPADDING", (0, 1), (0, -2), 2),
        ("BOTTOMPADDING", (0, -1), (0, -1), pad_v),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    
    return table


def section(title, content, width, body_style="body"):
    """Cria uma seção garantindo que o título não fique órfão."""
    title_para = Paragraph(title, ST["label"])
    
    if isinstance(content, str):
        content_para = Paragraph(content, ST[body_style])
        return KeepTogether([title_para, content_para])
    
    elif isinstance(content, list) and len(content) > 0:
        first_item = content[0]
        remaining_items = content[1:]
        
        header_block = KeepTogether([title_para, Spacer(1, 1*mm), first_item])
        
        return [header_block] + remaining_items
    
    return [title_para]


def make_cover() -> list:
    return [
        Spacer(1, 7.1 * cm),
        Paragraph("Manual de Bolso da<br/>Psicofarmacologia", ps("cover_title", "Helvetica-Bold", 32, 38, HexColor("#FFFFFF"), TA_LEFT, after=8)),
        HRFlowable(width=6.0 * cm, color=TERRACOTTA, thickness=2.5, spaceAfter=10, spaceBefore=4, hAlign='LEFT'),
        Paragraph("Guia de consulta rápida para terapeutas", ps("cover_sub", "Helvetica", 14, 20, HexColor("#C5D9D4"), TA_LEFT, after=6)),
        Spacer(1, 3 * mm),
        Paragraph("Dra. Tatiana Gontijo", ps("cover_author", "Helvetica", 11, 16, HexColor("#A3C4BC"), TA_LEFT)),
        NextPageTemplate("page"),
        PageBreak()
    ]


def make_toc(fichas) -> list:
    story = [
        Spacer(1, 4 * mm),
        Paragraph("<a name='toc'/>Sumário", ps("title", "Helvetica-Bold", 22, 26, GREEN, after=12)),
        Spacer(1, 4 * mm),
    ]
    pub_sections = [
        ("Introdução", 3),
        ("Como usar o manual", 4),
        ("As Grandes Classes", 5),
    ]
    rows = []
    for title, page in pub_sections:
        rows.append([
            Paragraph("", ps("empty")),
            Paragraph(title, ps("toc_sec", "Helvetica-Bold", 10, 14, INK)),
            Paragraph("", ps("empty")),
            Paragraph(str(page), ps("toc_page", "Helvetica-Bold", 10, 14, INK, align=TA_RIGHT))
        ])
    rows.append([Spacer(1, 4*mm)]*4)
    rows.append([Paragraph("", ps("empty")), Paragraph("MEDICAÇÕES", ps("toc_head", "Helvetica-Bold", 8, 10, MUTED)), Paragraph("", ps("empty")), Paragraph("", ps("empty"))])
    for idx, f in enumerate(fichas):
        num = f.get("Número", "")
        nome_prod = f.get("Título", "").upper()
        substancia = f.get("Substância", "")
        classe = f.get("Classe", "").split(".")[0].split(",")[0].strip()[:40]
        page_num = idx + 8
        
        anchor_name = f"med_{num}"
        
        # Nome exibido: PRODUTO (Substância)
        nome_display = f"<a href='#{anchor_name}'>{nome_prod}</a> <font size='7' color='#777777'>({substancia})</font>"
        
        rows.append([
            Paragraph(num, ps("toc_num", "Helvetica-Bold", 9, 12, TERRACOTTA)),
            Paragraph(nome_display, ps("toc_name", "Helvetica-Bold", 9, 12, INK)),
            Paragraph(classe, ps("toc_class", "Helvetica", 8, 12, MUTED)),
            Paragraph(f"<a href='#{anchor_name}'>{page_num}</a>", ps("toc_page", "Helvetica-Bold", 9, 12, INK, align=TA_RIGHT))
        ])
    rows.append([Spacer(1, 4*mm)]*4)
    toc_table = Table(rows, colWidths=[10*mm, 65*mm, CW - 85*mm, 10*mm])
    toc_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"), ("BOTTOMPADDING", (0, 0), (-1, -1), 2), ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("LINEBELOW", (0, 0), (-1, 0), 0.2, LINE), ("LINEBELOW", (0, 1), (-1, 1), 0.2, LINE), ("LINEBELOW", (0, -1), (-1, -1), 0.2, LINE),
    ]))
    story.append(toc_table); story.append(PageBreak())
    return story



def make_intro_page() -> list:
    return [
        Spacer(1, 4 * mm),
        Paragraph("<a name='intro'/>Introdução", ps("title", "Helvetica-Bold", 22, 26, GREEN, after=12)),
        Paragraph(
            "O paciente menciona um nome que você não reconhece. Ou traz uma bula dobrada e "
            "pergunta: \"Você sabe o que isso faz?\" Você sabe que a pergunta importa. E sabe "
            "que responder com clareza faz parte do acompanhamento.",
            ST["body"]),
        Spacer(1, 4 * mm),
        Paragraph(
            "Somos nós que acompanhamos o paciente toda semana, que notamos quando algo mudou, "
            "que ouvimos o que ele não contou ao psiquiatra. "
            "Essa posição tem valor clínico, e ela exige um tipo específico de conhecimento: "
            "o da leitura do que aparece na sessão.",
            ST["body"]),
        Spacer(1, 4 * mm),
        Paragraph(
            "Este manual foi criado para isso. Cada ficha apresenta uma medicação do ponto de vista "
            "do que aparece na sessão: o que o paciente relata, o que é possível observar, onde a "
            "leitura clínica pode se confundir e quais perguntas ajudam a investigar sem invadir. "
            "O objetivo não é decorar classes farmacológicas. É reconhecer o que a medicação faz "
            "na presença do sujeito que você acompanha.",
            ST["body"]),
        PageBreak()
    ]


def make_how_to_use() -> list:
    return [
        Spacer(1, 4 * mm),
        Paragraph("<a name='how'/>Como usar este manual", ps("title", "Helvetica-Bold", 22, 26, GREEN, after=12)),
        Paragraph("Este material foi desenhado para ser uma consulta rápida e prática. Cada ficha está dividida em campos que respondem às dúvidas mais comuns do terapeuta:", ST["body"]),
        Spacer(1, 2 * mm),
        *list_items([
            "<b>O que o paciente relata:</b> A linguagem subjetiva do efeito.",
            "<b>O que observar:</b> Mudanças objetivas de comportamento e afeto.",
            "<b>Efeitos que confundem:</b> Onde a clínica pode 'enganar' o terapeuta.",
            "<b>Perguntas úteis:</b> Como investigar o efeito sem ser invasiva.",
            "<b>Alertas de Urgência:</b> Sinais que exigem contato imediato com o médico."
        ], "bullet_body"),
        Spacer(1, 4 * mm),
        Paragraph("Tenha-o sempre à mão (ou no tablet/celular) durante o atendimento ou na preparação do caso.", ST["body"]),
        PageBreak()
    ]



def make_classes_guide() -> list:
    story = [
        Spacer(1, 4 * mm),
        Paragraph("<a name='classes'/>As Grandes Classes", ps("title", "Helvetica-Bold", 22, 26, GREEN, after=12)),
        Paragraph("Antes de entrar nas fichas individuais, é útil entender como as seis grandes famílias de psicofármacos funcionam na prática e como seus efeitos aparecem no setting terapêutico.", ST["body"]),
        Spacer(1, 6 * mm),
        
        Paragraph("1. Antidepressivos (ISRS, Duais, Tricíclicos)", ps("section", "Helvetica-Bold", 14, 18, TERRACOTTA, after=6)),
        Paragraph("<b>O que fazem:</b> Alteram a disponibilidade de neurotransmissores (como serotonina e noradrenalina) para melhorar humor, energia e ansiedade crônica. Não são pílulas da felicidade; eles 'limpam a lente' para o paciente conseguir trabalhar em terapia.", ST["body"]),
        Paragraph("<b>Na clínica:</b> Demoram de 2 a 4 semanas para fazer efeito. Nos primeiros dias, o paciente pode sentir <i>piora</i> da ansiedade. Em longo prazo ou doses altas, preste atenção no <i>embotamento emocional</i> ('fiquei anestesiado, não consigo chorar').", ST["body"]),
        Spacer(1, 8 * mm),

        Paragraph("2. Benzodiazepínicos e Ansiolíticos", ps("section", "Helvetica-Bold", 14, 18, TERRACOTTA, after=6)),
        Paragraph("<b>O que fazem:</b> 'Freiam' o sistema nervoso central. São apagadores de incêndio para picos de ansiedade aguda, ataques de pânico e insônia pontual.", ST["body"]),
        Paragraph("<b>Na clínica:</b> O efeito é imediato (minutos a horas). O grande risco é a dependência e a tolerância (precisar de mais para o mesmo efeito). Na sessão, o paciente sob efeito pode parecer mais lento, levemente sedado ou com lapsos de memória recente.", ST["body"]),
        Spacer(1, 8 * mm),

        Paragraph("3. Estabilizadores de Humor", ps("section", "Helvetica-Bold", 14, 18, TERRACOTTA, after=6)),
        Paragraph("<b>O que fazem:</b> Seguram os 'polos'. Evitam as subidas (manias/hipomanias) e descidas (depressões) abruptas, formando a base do tratamento da bipolaridade.", ST["body"]),
        Paragraph("<b>Na clínica:</b> Eles ajudam o paciente a ter uma linha de base emocional para poder elaborar questões na terapia. Não tiram a tristeza normal da vida, mas evitam que a tristeza vire um buraco negro. Exigem adesão rigorosa.", ST["body"]),
        PageBreak(),

        Spacer(1, 4 * mm),
        Paragraph("4. Antipsicóticos (Neurolépticos)", ps("section", "Helvetica-Bold", 14, 18, TERRACOTTA, after=6)),
        Paragraph("<b>O que fazem:</b> Desenvolvidos para delírios e alucinações (psicoses), hoje são muito usados em doses baixinhas para 'desligar a mente' à noite, tratar ansiedade severa ou irritabilidade grave.", ST["body"]),
        Paragraph("<b>Na clínica:</b> Costumam 'esfriar' e sedar bastante no início. Podem causar rigidez muscular, tremores leves ou lentificação motora (efeitos extrapiramidais) que você consegue notar visualmente na sessão.", ST["body"]),
        Spacer(1, 8 * mm),

        Paragraph("5. Estimulantes (Medicações para TDAH)", ps("section", "Helvetica-Bold", 14, 18, TERRACOTTA, after=6)),
        Paragraph("<b>O que fazem:</b> Aumentam dopamina e noradrenalina no córtex pré-frontal. O objetivo não é 'acelerar', mas dar <i>foco, atenção e controle de impulsos</i> para mentes dispersas.", ST["body"]),
        Paragraph("<b>Na clínica:</b> O paciente medicado costuma ficar mais linear e organizado na fala. Como o efeito passa em algumas horas, observe o horário da sessão: um paciente à noite pode estar em 'rebote' (exausto ou muito irritado quando o remédio sai do corpo).", ST["body"]),
        Spacer(1, 8 * mm),

        Paragraph("6. Medicações para o Sono (Hipnóticos/Sedativos)", ps("section", "Helvetica-Bold", 14, 18, TERRACOTTA, after=6)),
        Paragraph("<b>O que fazem:</b> Induzem ou mantêm o sono, 'desligando' a vigília do cérebro.", ST["body"]),
        Paragraph("<b>Na clínica:</b> Extremamente úteis para tirar o paciente do esgotamento agudo, mas não curam a causa emocional da insônia. Se o paciente toma muito tarde, pode chegar 'de ressaca' (sonolento, confuso) na sessão da manhã seguinte. Alguns causam comportamentos noturnos sem memória no dia seguinte.", ST["body"]),
        PageBreak()
    ]
    return story


def append_medication_page(story, idx, num, nome_titulo, classe, nome, uso_comum, relato, observacao, confusao, perguntas, alinhar, urgencia, frase, cuidado):
    """Adiciona uma ficha de medicação ao story de forma compacta."""
    
    # 1. Preparar o Cabeçalho (Número + Título + Marcas)
    header_elements = []
    
    # Se não for a primeira do manual, adiciona um espaço de respiro
    if idx > 0:
        header_elements.append(Spacer(1, 15 * mm))
    
    # Âncora para o sumário
    anchor_name = f"med_{num}"
    header_elements.append(Paragraph(f"<a name='{anchor_name}'/>", ST["body"]))
    
    # Tabela do cabeçalho
    h_table = Table([
        [Paragraph("", ST["body"]), Paragraph(num, ST["num"]), Paragraph(nome_titulo.upper(), ST["title"])],
        ["", "", Paragraph(classe, ST["class"])],
    ], colWidths=[1*mm, 15*mm, CW - 16*mm])
    h_table.setStyle(TableStyle([
        ("SPAN", (1, 0), (1, 1)), ("VALIGN", (1, 0), (1, 1), "TOP"),
        ("VALIGN", (2, 0), (2, 1), "BOTTOM"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (2, 0), (2, 0), 4),
    ]))
    header_elements.append(h_table)
    header_elements.append(Spacer(1, 4 * mm))

    # 2. Preparar Conteúdo Inicial (Cabeçalho + Uso Comum)
    # Tenta manter o cabeçalho E a primeira seção juntos na mesma página
    primeira_secao = section("Uso comum", list_items(uso_comum, "bullet"), CW)
    
    bloco_inicial = header_elements + (primeira_secao if isinstance(primeira_secao, list) else [primeira_secao])
    
    story.append(KeepTogether(bloco_inicial))
    story.append(Spacer(1, 2 * mm))
    
    # 3. Demais Conteúdos Clínicos (que podem quebrar página se necessário)
    story.extend(section("O paciente pode relatar", list_items(quoted_items(relato), "bullet"), CW))
    story.append(Spacer(1, 2 * mm))
    story.extend(section("O que observar em sessão", list_items(observacao, "bullet"), CW))
    story.append(Spacer(1, 2 * mm))
    story.extend(section("Efeitos que confundem a leitura clínica", list_items(confusao, "bullet"), CW))
    story.append(Spacer(1, 2 * mm))
    story.extend(section("Perguntas úteis", list_items(quoted_items(perguntas), "bullet"), CW))
    story.append(Spacer(1, 6 * mm))
    
    # Quadros de Alerta
    story.append(soft_box("Amarelo: alinhar em breve", list_items(comma_items(alinhar), "bullet_yellow"), CW, Y_BG, Y_TXT, "label_y", "yellow"))
    story.append(Spacer(1, 6 * mm))
    story.append(soft_box("Vermelho: tratar como urgência", list_items(comma_items(urgencia), "bullet_red"), CW, R_BG, R_TXT, "label_r", "red"))
    story.append(Spacer(1, 6 * mm))
    
    story.append(section("Frase clínica", frase, CW, body_style="quote"))


def load_manual_data():
    """Carrega os dados enriquecidos v5.0 gerados pelo export-manual-data.ts."""
    json_path = os.path.join(os.getcwd(), "manual_data.json")
    if not os.path.exists(json_path):
        print(f"⚠️ Erro: Arquivo {json_path} não encontrado. Rode 'npm run manual:export' primeiro.")
        return []
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Erro ao carregar manual_data.json: {e}")
        return []

def append_all_medications(story):
    classes_data = load_manual_data()
    
    toc_items = []
    med_idx = 0
    current_class = None

    for class_item in classes_data:
        class_name = class_item["className"]
        
        # Bookmark de Classe
        if class_name != current_class:
            story.append(BookmarkFlowable(class_name, level=0))
            current_class = class_name
            
        for med in class_item["medications"]:
            num = f"{med_idx + 1:03d}"
            
            # Bookmark da Medicação
            display_title = f"{med['substance']} ({med['commercialNames'].split(',')[0]})"
            story.append(BookmarkFlowable(display_title, level=1))
            
            # Adicionar ao Sumário
            toc_items.append({
                "Número": num, 
                "Título": med['substance'], 
                "Substância": med['commercialNames'].split(',')[0],
                "Classe": class_name
            })
            
            # Converter strings formatadas do v5.0 para listas que o seu novo PDF espera
            uso_list = [med["description"]]
            
            # Domínios clínicos vêm com tags <b> e <br/>, vamos tratá-los como um bloco único ou split
            relato_list = [med["domains"]] 
            
            # Passar strings para as funções que fazem o split interno no Python
            perguntas_str = med["discriminationQuestions"].replace("|", ",")
            alinhar_str = med["communicationScenarios"].replace("|", ",")
            urgencia_str = med["urgencySignals"].replace("|", ",")

            append_medication_page(
                story,
                idx=med_idx,
                num=num,
                nome_titulo=med["substance"],
                classe=f"Substância: {med['substance']}. <br/><b>Nomes Comerciais:</b> {med['commercialNames']}",
                nome=f"<b>{med['substance']}</b>",
                uso_comum=[med["description"]],
                relato=[med["domains"]],
                observacao=[med["domains"]],
                confusao=[med["description"]],
                perguntas=perguntas_str,
                alinhar=alinhar_str,
                urgencia=urgencia_str,
                frase=med["clinicalPhrase"],
                cuidado="Observe o impacto subjetivo. Toda alteração exige alinhamento médico."
            )
            med_idx += 1

    return toc_items


def make_conclusion() -> list:
    return [
        Spacer(1, 6 * cm),
        Paragraph("<a name='conc'/>Conclusão", ps("title", "Helvetica-Bold", 22, 26, GREEN, align=TA_CENTER, after=16)),
        Paragraph("A jornada da integração entre mente e corpo é contínua.", ps("body", "Helvetica", 12, 18, INK, align=TA_CENTER, after=10)),
        Paragraph("Que este manual seja seu companheiro de bolso para que nenhuma mudança passe despercebida e para que a sua escuta seja sempre fortalecida pelo conhecimento técnico, sem nunca perder a essência do cuidado humano.", ps("body", "Helvetica", 11, 16, INK, align=TA_CENTER, after=20)),
        Spacer(1, 1 * cm),
        Paragraph("Dra. Tatiana Gontijo", ps("auth", "Helvetica-Bold", 12, 16, TERRACOTTA, align=TA_CENTER)),
        PageBreak()
    ]


def build():
    story = []
    story.append(Paragraph("<a name='cover'/>", ST["body"]))
    story.extend(make_cover())

    # Montagem explícita de fichas para permitir PageBreak() em qualquer ponto.
    meds_story = []
    toc_items = append_all_medications(meds_story)

    story.extend(make_toc(toc_items))
    story.extend(make_intro_page())
    story.extend(make_how_to_use())
    story.extend(make_classes_guide())
    story.extend(meds_story)
    doc = make_doc(OUT)
    doc.title = "Manual de Bolso da Psicofarmacologia"
    doc.author = "Dra. Tatiana Gontijo"
    doc.subject = "Psicofarmacologia para Terapeutas"
    doc.build(story)
    return OUT


if __name__ == "__main__": print(build())
