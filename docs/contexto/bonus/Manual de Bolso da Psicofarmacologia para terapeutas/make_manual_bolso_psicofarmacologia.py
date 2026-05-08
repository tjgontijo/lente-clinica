#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Manual de Bolso da Psicofarmacologia para Terapeutas
Gerador de PDF Editorial - Versão Completa (Fix HTML Tags)
"""

from __future__ import annotations

import os
import re

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


def clean_txt(text: str) -> str:
    """Limpa o texto mantendo as tags HTML para o ReportLab."""
    if not text: return ""
    # Escapa apenas o símbolo de E comercial que quebra o XML do ReportLab
    return str(text).replace("&", "&amp;").replace("—", "-").replace("–", "-").strip()


def p(text: str, style="body") -> Paragraph:
    return Paragraph(clean_txt(text), ST[style])


def list_items(items: list[str], style="bullet") -> list[Paragraph]:
    return [Paragraph(f"• &nbsp;{clean_txt(item)}", ST[style]) for item in items]


def quoted_items(text: str) -> list[str]:
    found = re.findall(r'"([^"]+)"', text)
    return found or [text]


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
    if isinstance(body, str): body_flow = [p(body, body_style)]
    elif isinstance(body, list): body_flow = body
    else: body_flow = [body]
    table = Table([[p(title, label_style)], [body_flow]], colWidths=[width])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LINEBEFORE", (0, 0), (0, -1), 4, line_color),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (0, 0), pad_v),
        ("BOTTOMPADDING", (0, 0), (0, 0), 2),
        ("TOPPADDING", (0, 1), (0, 1), 2),
        ("BOTTOMPADDING", (0, 1), (0, 1), pad_v),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return table


def section(title: str, body, width, bg=None, title_style="section", body_style="body", pad=12, line=False):
    if isinstance(body, str): body_flow = [p(body, body_style)]
    elif isinstance(body, list): body_flow = body
    else: body_flow = [body]
    rows = [[p(title, title_style)], [body_flow]]
    table = Table(rows, colWidths=[width])
    style = [
        ("LEFTPADDING", (0, 0), (-1, -1), pad if bg else 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), pad if bg else 0),
        ("TOPPADDING", (0, 0), (0, 0), pad if bg else 6),
        ("BOTTOMPADDING", (0, 0), (0, 0), 2),
        ("TOPPADDING", (0, 1), (0, 1), 2),
        ("BOTTOMPADDING", (0, 1), (0, 1), pad if bg else 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]
    if line and not bg: style.append(("LINEBELOW", (0, 1), (-1, 1), 0.5, LINE))
    if bg: style.append(("BACKGROUND", (0, 0), (-1, -1), bg))
    table.setStyle(TableStyle(style))
    return table


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
        num = f.get("Número", ""); nome = f.get("Título", "").upper()
        classe = f.get("Classe", "").split(".")[0].split(",")[0].strip()[:40]
        page_num = idx + 8 # 5 (Classes has 3 pages) -> 8
        rows.append([
            Paragraph(num, ps("toc_num", "Helvetica-Bold", 9, 12, TERRACOTTA)),
            Paragraph(nome, ps("toc_name", "Helvetica-Bold", 9, 12, INK)),
            Paragraph(classe, ps("toc_class", "Helvetica", 8.5, 12, MUTED)),
            Paragraph(str(page_num), ps("toc_page", "Helvetica-Bold", 9, 12, INK, align=TA_RIGHT))
        ])
    rows.append([Spacer(1, 4*mm)]*4)
    toc_table = Table(rows, colWidths=[10*mm, 45*mm, CW - 65*mm, 10*mm])
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
    header = Table([
        [Paragraph(f"<a name='med_{idx}'/>", ST["body"]), Paragraph(num, ST["num"]), Paragraph(nome_titulo.upper(), ST["title"])],
        ["", "", Paragraph(classe, ST["class"])],
    ], colWidths=[1*mm, 15*mm, CW - 16*mm])
    header.setStyle(TableStyle([
        ("SPAN", (1, 0), (1, 1)), ("VALIGN", (1, 0), (1, 1), "TOP"),
        ("VALIGN", (2, 0), (2, 1), "BOTTOM"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (2, 0), (2, 0), 4),
    ]))
    story.append(header)
    story.append(Spacer(1, 8 * mm))
    story.append(section("Nome", nome, CW))
    story.append(Spacer(1, 2 * mm))
    story.append(section("Uso comum", uso_comum, CW))
    story.append(Spacer(1, 2 * mm))
    story.append(section("O paciente pode relatar", list_items(quoted_items(relato), "bullet"), CW))
    story.append(Spacer(1, 2 * mm))
    story.append(section("O que observar em sessão", observacao, CW))
    story.append(Spacer(1, 2 * mm))
    story.append(section("Efeitos que confundem a leitura clínica", confusao, CW))
    story.append(Spacer(1, 2 * mm))
    story.append(section("Perguntas úteis", list_items(quoted_items(perguntas), "bullet"), CW))
    story.append(Spacer(1, 6 * mm))
    story.append(soft_box("Amarelo: alinhar em breve", list_items(comma_items(alinhar), "bullet_yellow"), CW, Y_BG, Y_TXT, "label_y", "yellow"))
    story.append(Spacer(1, 6 * mm))
    story.append(soft_box("Vermelho: tratar como urgência", list_items(comma_items(urgencia), "bullet_red"), CW, R_BG, R_TXT, "label_r", "red"))
    story.append(Spacer(1, 6 * mm))
    story.append(section("Frase clínica", frase, CW, body_style="quote"))
    story.append(Spacer(1, 2 * mm))
    story.append(section("Cuidado ético", cuidado, CW))
    story.append(PageBreak())


def append_all_medications(story):
    toc_items = []
    toc_items.append({"Número": "01", "Título": "Escitalopram"})
    append_medication_page(
        story,
        idx=0,
        num='01',
        nome_titulo='Escitalopram',
        classe='ISRS, inibidor seletivo da recaptação de serotonina. Na linguagem da sessão: antidepressivo usado com frequência em depressão e ansiedade.',
        nome='Escitalopram. Também aparece como oxalato de escitalopram. Nomes comerciais comuns incluem Lexapro, Exodus, Reconter, Esc e similares.',
        uso_comum='Quadros depressivos, ansiedade generalizada, pânico, ansiedade social e outros quadros ansiosos, conforme avaliação médica.',
        relato='"Estou menos desesperado", "parece que a ansiedade baixou", "não choro mais", "minha libido sumiu", "não estou triste, mas também não sinto muita coisa", "nas primeiras semanas fiquei enjoado ou estranho".',
        observacao='Redução de ansiedade corporal, menos choro, mais estabilidade para elaborar temas difíceis, mas também possível diminuição de reatividade emocional, menor acesso afetivo, sonolência, inquietação inicial ou queda de desejo sexual.',
        confusao='A melhora pode parecer "frieza" quando há embotamento. A adaptação inicial pode parecer piora da ansiedade. A disfunção sexual pode virar afastamento relacional ou abandono silencioso. Uma melhora rápida demais, com menos sono e aceleração, pode exigir atenção para ativação maniforme.',
        perguntas='"Isso começou antes ou depois da medicação?", "Você está melhor ou está sentindo menos tudo?", "Como ficaram sono, energia, libido e apetite?", "Você pensou em parar por conta própria?", "Essa mudança parece uma melhora estável ou uma aceleração fora do seu padrão?"',
        alinhar='Embotamento importante, disfunção sexual com risco de abandono, náusea ou sonolência que ameaça adesão, piora nas primeiras semanas, desejo de parar sem consulta, sintomas persistentes apesar de uso regular.',
        urgencia='Ideação suicida nova ou intensificada, agitação intensa com impulsividade, redução de sono sem cansaço, sinais de síndrome serotoninérgica, confusão mental importante ou comportamento muito diferente do padrão basal.',
        frase='"A tristeza baixou, mas a vida inteira também ficou mais baixa."',
        cuidado='Não dizer que o escitalopram "causou" o quadro. Organize temporalidade, impacto funcional e fala literal do paciente para o psiquiatra avaliar.',
    )

    toc_items.append({"Número": '02', "Título": 'Clonazepam'})
    append_medication_page(
        story,
        idx=1,
        num='02',
        nome_titulo='Clonazepam',
        classe='Benzodiazepínico. Na linguagem da sessão: medicação com efeito ansiolítico, sedativo, anticonvulsivante e relaxante, usada em contextos específicos conforme avaliação médica.',
        nome='Clonazepam. Nome comercial muito conhecido: Rivotril. Também aparece como genérico.',
        uso_comum='Crises de ansiedade, pânico, insônia associada à ansiedade, alguns quadros neurológicos e situações em que o médico considera necessário reduzir ativação intensa.',
        relato='"Só durmo se tomar", "sem ele eu não funciono", "me acalma rápido", "acordo grogue", "minha memória piorou", "fui aumentando porque parou de fazer efeito", "tenho medo de ficar sem".',
        observacao='Sonolência, lentificação, fala mais arrastada, menor elaboração emocional, esquecimento de conteúdos trabalhados, dependência psicológica da medicação como recurso único de regulação, ansiedade antecipatória quando o paciente imagina ficar sem.',
        confusao='Sedação pode parecer depressão ou desmotivação. Lentificação cognitiva pode parecer déficit atencional. Abstinência ou uso irregular pode parecer recaída ansiosa. Tolerância pode levar o paciente a acreditar que "o problema voltou", quando o padrão precisa ser reavaliado pelo prescritor.',
        perguntas='"Há quanto tempo você usa?", "É uso diário ou eventual?", "O que acontece quando você não toma?", "Você já precisou aumentar para ter o mesmo efeito?", "Você mistura com álcool ou outros sedativos?", "Você lembra bem do que conversamos nas sessões?"',
        alinhar='Uso diário por semanas ou meses, medo intenso de ficar sem, aumento progressivo, queixa de memória ou lentidão, sedação diurna, uso junto com álcool ou outras substâncias, paciente tentando parar sozinho.',
        urgencia='Confusão importante, queda ou risco físico por sedação, mistura com álcool/opioides/outros depressores, desmame abrupto com sintomas intensos, risco de abstinência grave, ideação suicida associada a uso impulsivo de medicação.',
        frase='"O remédio que acalma a crise começou a organizar a vida inteira em torno dele."',
        cuidado='Retirada de benzodiazepínicos exige avaliação e plano médico. Se o paciente mencionar intenção de reduzir, informe ao psiquiatra antes de qualquer orientação.',
    )

    toc_items.append({"Número": '03', "Título": 'Quetiapina'})
    append_medication_page(
        story,
        idx=2,
        num='03',
        nome_titulo='Quetiapina',
        classe='Antipsicótico atípico. Na linguagem da sessão: medicação que pode aparecer em quadros psicóticos, transtorno bipolar, estabilização do humor e, em alguns contextos médicos, sono.',
        nome='Quetiapina. Também aparece como hemifumarato de quetiapina. Nome comercial muito conhecido: Seroquel.',
        uso_comum='Esquizofrenia, transtorno bipolar, episódios de mania, depressão bipolar e outros contextos em que o médico busca reduzir desorganização, agitação, alteração perceptiva, instabilidade de humor ou insônia relevante.',
        relato='"Esse remédio me derruba", "eu durmo, mas acordo pesado", "minha fome aumentou muito", "engordei rápido", "fico mais lento", "as vozes ou pensamentos estranhos diminuíram", "tomo só para dormir".',
        observacao='Sonolência, lentificação, queda de energia, menor agitação, discurso mais organizado quando havia desorganização prévia, mas também possível embotamento, prejuízo de atenção, ganho de peso, vergonha corporal, tontura ao levantar e menor participação ativa na sessão.',
        confusao='Sedação pode parecer depressão, desmotivação ou resistência. Redução de agitação pode ser melhora real, mas também pode vir com prejuízo de funcionamento. Ganho de peso pode gerar abandono silencioso. Uso entendido pelo paciente como "remédio para dormir" pode esconder que há uma indicação psiquiátrica mais ampla.',
        perguntas='"Você sabe qual foi o objetivo do médico ao prescrever?", "Você está usando para sono, humor, pensamentos acelerados ou outro motivo?", "Como ficam seu corpo e sua cabeça no dia seguinte?", "Percebeu aumento de fome ou peso?", "Tem tontura ao levantar?", "A terapia ficou mais possível ou mais distante?", "Apareceu rigidez, tremor, febre ou confusão?"',
        alinhar='Sonolência que impede participação na sessão, lentificação importante, ganho de peso rápido, aumento de apetite com sofrimento, tontura ou quedas, constipação relevante, abandono por efeito colateral, paciente usando de forma diferente da prescrição, dúvida sobre objetivo clínico do uso.',
        urgencia='Febre alta com rigidez, confusão, sudorese ou alteração de pressão; movimentos involuntários intensos; queda com risco físico; desorganização grave; ideação suicida nova ou intensificada; sinais físicos importantes associados a alteração do estado mental.',
        frase='"O paciente ficou mais calmo, mas a sessão também ficou mais lenta e distante."',
        cuidado='Não reduzir a quetiapina a "remédio para dormir" nem interpretar sedação como melhora automática. Observe impacto funcional e alinhe com o psiquiatra quando o efeito atrapalha o trabalho terapêutico.',
    )

    toc_items.append({"Número": '04', "Título": 'Metilfenidato'})
    append_medication_page(
        story,
        idx=3,
        num='04',
        nome_titulo='Metilfenidato',
        classe='Estimulante do sistema nervoso central. Na linguagem da sessão: medicação usada principalmente em TDAH para atenção, impulsividade e funcionamento executivo, conforme avaliação médica.',
        nome='Metilfenidato. Nomes comerciais conhecidos incluem Ritalina e Concerta, além de apresentações genéricas.',
        uso_comum='TDAH em crianças, adolescentes e adultos, além de outros contextos específicos avaliados pelo médico. No consultório, costuma aparecer quando o paciente relata dificuldade persistente de foco, organização, impulsividade, procrastinação ou desregulação de rotina.',
        relato='"Agora consigo começar e terminar tarefas", "minha cabeça ficou mais silenciosa", "fiquei mais ansioso", "perdi a fome", "não consigo dormir", "quando passa o efeito eu desabo", "tomei a mais porque precisava render".',
        observacao='Mais organização no discurso, menor dispersão, maior capacidade de cumprir combinados, mas também irritabilidade, aceleração, ansiedade corporal, redução de apetite, insônia, tiques, pressão por desempenho e uso da medicação como solução para excesso de demanda.',
        confusao='Produtividade pode parecer melhora global mesmo quando sono e corpo pioraram. Ansiedade induzida ou intensificada pode parecer piora do transtorno ansioso. Insônia pode agravar humor e impulsividade. Uso fora da prescrição pode parecer "comprometimento com melhora", mas exige cuidado clínico e médico.',
        perguntas='"Você percebe mais foco ou mais aceleração?", "Como ficaram sono, apetite e irritabilidade?", "Quando o efeito passa, o que acontece?", "Você já tomou diferente do combinado com o médico?", "Alguém já pediu seu remédio emprestado?", "A melhora está ajudando sua vida ou só aumentando sua exigência consigo?"',
        alinhar='Insônia persistente, ansiedade ou irritabilidade novas, perda de apetite ou peso, palpitações, tiques, piora de impulsividade, uso diferente da prescrição, uso para desempenho sem indicação clara, queda importante quando o efeito passa, suspeita de mistura com álcool ou outras substâncias.',
        urgencia='Dor no peito, desmaio, palpitações intensas, agitação grave, sintomas psicóticos, sintomas maniformes, ideação suicida, uso excessivo ou impulsivo, comportamento de risco, ereção dolorosa ou prolongada relatada pelo paciente.',
        frase='"O foco melhorou, mas o corpo começou a pagar a conta."',
        cuidado='Observe o impacto em sono, apetite, ansiedade, vínculo e rotina. Sinais de uso irregular ou fora do padrão prescrito merecem comunicação com o psiquiatra.',
    )

    toc_items.append({"Número": '05', "Título": 'Sertralina'})
    append_medication_page(
        story,
        idx=4,
        num='05',
        nome_titulo='Sertralina',
        classe='ISRS, inibidor seletivo da recaptação de serotonina. Na linguagem da sessão: antidepressivo muito comum para ansiedade e humor.',
        nome='Sertralina. Também aparece como cloridrato de sertralina. Nomes comerciais muito conhecidos: Zoloft, Tolrest, Serenata.',
        uso_comum='Depressão, transtorno do pânico, ansiedade social, TOC, transtorno de estresse pós-traumático (TEPT) e TPM severa.',
        relato='"Estou lidando melhor com meus medos", "parece que as coisas não me afetam tanto", "tenho tido dor de barriga ou queimação", "minha libido diminuiu bastante", "minha ansiedade piorou nos primeiros dias".',
        observacao='Menos labilidade emocional, maior tolerância à exposição (ótimo para pânico e TOC), mas também possível inquietação nos primeiros dias, diminuição do desejo sexual ou queixas gastrointestinais que o incomodam.',
        confusao='A piora inicial da ansiedade nas primeiras duas semanas pode parecer que "o remédio fez mal" ou resistência. O afeto mais "reto" (embotamento leve) pode parecer que o paciente não liga mais para a própria vida, mascarando empatia.',
        perguntas='"A queimação no estômago ou diarreia começaram junto com o remédio?", "Como ficou sua vontade de se relacionar sexualmente?", "Sentiu mais agitação física no começo?", "O choro parou porque a dor passou, ou porque você não consegue chorar mesmo querendo?"',
        alinhar='Efeitos gastrointestinais persistentes (intolerância gástrica), apatia forte, disfunção sexual que causa sofrimento relacional, ansiedade paradoxal forte e persistente, abandono por conta dos efeitos colaterais.',
        urgencia='Ideação suicida nova ou intensificada na fase inicial de ativação (o paciente ganha energia antes de ganhar humor), virada maníaca (aceleração forte do pensamento, menos necessidade de sono).',
        frase='"As obsessões diminuíram o volume, mas a digestão e a libido sentiram o baque."',
        cuidado='Não sugira que a dor de estômago ou falta de libido "são fundo emocional", pois são efeitos adversos reais e comuns. Organize o relato para ele levar ao médico.',
    )

    toc_items.append({"Número": '06', "Título": 'Fluoxetina'})
    append_medication_page(
        story,
        idx=5,
        num='06',
        nome_titulo='Fluoxetina',
        classe='ISRS. Na linguagem clínica: antidepressivo com perfil frequentemente mais "ativador" ou energizante, de eliminação muito lenta.',
        nome='Fluoxetina. Também cloridrato de fluoxetina. Nomes comerciais comuns: Prozac, Daforin, Verotina.',
        uso_comum='Depressão (especialmente com lentificação), bulimia nervosa, TOC, transtorno disfórico pré-menstrual (TDPM).',
        relato='"Tô com mais energia pra sair da cama", "perdi um pouco a fome", "tô meio elétrico ou inquieto", "não consigo dormir direito se tomar à tarde", "meus episódios de comer demais diminuíram".',
        observacao='Maior ativação motora, melhora do retardo psicomotor típico da depressão melancólica, redução de episódios de compulsão alimentar, mas também possível insônia, tremor fino e aceleração verbal.',
        confusao='A energia aumentada pode parecer melhora, mas se vier com insônia, a irritabilidade vai piorar logo depois. Pode ser confundida com piora da ansiedade de base ou desencadear quadros acelerados difíceis de frear.',
        perguntas='"Que horas você está tomando a medicação?", "Sentiu que sua energia aumentou, mas o corpo continua tenso?", "A compulsão alimentar diminuiu?", "Está com dificuldade para pegar no sono à noite?"',
        alinhar='Insônia persistente, agitação motora ou ansiedade exacerbada que não passa, perda de peso severa indesejada, tremores finos que atrapalham rotina.',
        urgencia='Aceleração aguda e intensa do pensamento e do corpo (mania), agressividade atípica, ideação suicida no começo do tratamento, sinais de síndrome serotoninérgica.',
        frase='"Tirou a pessoa da cama com mais energia, mas às vezes esquece de deixar ela dormir à noite."',
        cuidado='Como a fluoxetina fica semanas no organismo mesmo após suspensa, não sugira "parar uns dias para ver se o sono volta". Toda alteração exige paciência metabólica e manejo médico.',
    )

    toc_items.append({"Número": '07', "Título": 'Alprazolam'})
    append_medication_page(
        story,
        idx=6,
        num='07',
        nome_titulo='Alprazolam',
        classe='Benzodiazepínico. Na linguagem da sessão: calmante de ação muito rápida e curta, alto poder ansiolítico.',
        nome='Alprazolam. Nome comercial muito conhecido: Frontal, Apraz.',
        uso_comum='Crises agudas de ansiedade, ataques de pânico.',
        relato='"Faz efeito super rápido na hora do sufoco", "quando passa o efeito, a ansiedade volta mais forte", "ando meio esquecido", "preciso carregar ele na bolsa por garantia, senão entro em pânico".',
        observacao='Alívio muito veloz do pico de ansiedade, mas presença de ansiedade de rebote (sofrimento sobe rápido entre uma dose e outra), amnésia para fatos recentes da sessão, dependência psicológica (medicamento vira "objeto contrafóbico").',
        confusao='A piora da ansiedade no meio do dia pode não ser agravamento do quadro original, mas sim "ansiedade de rebote" provocada pela meia-vida curta (o corpo sentindo a falta repentina). Parecer esquecido pode ser lido como desatenção.',
        perguntas='"A ansiedade ataca nos horários em que o remédio está perdendo o efeito?", "Você sente necessidade de antecipar a dose?", "Lembra do principal que conversamos na sessão passada?", "O que acontece se você sair e esquecer o remédio em casa?"',
        alinhar='Uso em doses crescentes, paciente sentindo montanha-russa emocional no mesmo dia (rebote), queixa persistente de falha de memória, uso impulsivo para qualquer emoção negativa leve.',
        urgencia='Quedas (especialmente idosos), mistura com álcool (depressão respiratória grave), tentativa do paciente de parar de vez por conta própria (risco real de abstinência e convulsão).',
        frase='"Apaga o incêndio muito rápido, mas o fogo volta mais alto horas depois, e a memória fica na fumaça."',
        cuidado='A cartela na bolsa pode funcionar como objeto contrafóbico. Sugerir a retirada sem manejo gradual pode intensificar o pânico. Alinhe com o psiquiatra o timing adequado.',
    )

    toc_items.append({"Número": '08', "Título": 'Diazepam'})
    append_medication_page(
        story,
        idx=7,
        num='08',
        nome_titulo='Diazepam',
        classe='Benzodiazepínico. Na linguagem clínica: calmante, relaxante muscular e anticonvulsivante de ação e permanência muito longas no corpo.',
        nome='Diazepam. Nome comercial histórico: Valium, Dienpax.',
        uso_comum='Ansiedade generalizada forte, espasmos e tensões musculares, síndromes de abstinência alcoólica, e pacientes antigos em uso crônico.',
        relato='"Fico meio morgado o dia todo", "minhas costas e o corpo relaxaram muito", "durmo à noite, mas acordo de ressaca e pesado", "tomo essa pílula amarelinha há 15 anos".',
        observacao='Lentificação motora e cognitiva contínua, postura fisicamente relaxada (menos tônus), sonolência prolongada tipo "ressaca" (efeito residual no dia seguinte), discurso mais arrastado, e muitas vezes um apego inegociável ao uso diário contínuo.',
        confusao='A sedação constante pode ser lida como depressão refratária, apatia ou "falta de energia vital". Na verdade, pode ser o acúmulo da medicação, já que ela tem metabólitos ativos que ficam muitos dias no corpo.',
        perguntas='"Você acorda sentindo uma ressaca ou peso na cabeça?", "Sente os músculos muito moles ou fraqueza nas pernas?", "Há quantos anos você faz uso contínuo?", "O seu tempo de reação no trânsito ou no trabalho piorou?"',
        alinhar='Pacientes idosos usando cronicamente (risco imenso de queda e confusão mental silenciosa), sonolência diurna excessiva, paciente tentando aumentar dose sem avisar.',
        urgencia='Sedação excessiva impedindo o despertar, mistura consciente com grandes quantidades de álcool, falta de coordenação grave (ataxia).',
        frase='"A ansiedade dormiu, mas o corpo ficou pesado e a mente arrastada dia sim, dia não."',
        cuidado='Não julgue ou demonize o "uso contínuo há 20 anos". O desmame de um diazepam usado cronicamente é uma intervenção médica delicadíssima e demorada.',
    )

    toc_items.append({"Número": '09', "Título": 'Risperidona'})
    append_medication_page(
        story,
        idx=8,
        num='09',
        nome_titulo='Risperidona',
        classe='Antipsicótico atípico. Na linguagem clínica: organizador profundo do pensamento e freio potente de impulsividade, agitação e psicose.',
        nome='Risperidona. Nome comercial conhecido: Risperdal.',
        uso_comum='Esquizofrenia, transtorno bipolar, controle de agitação grave e autolesão, irritabilidade em TEA (Autismo).',
        relato='"A barulheira na minha cabeça parou", "sinto meu corpo meio travado", "engordei", "minha menstruação desregulou toda", "surgiu leite no meu peito (mulheres)", "tenho uma agonia sem fim nas pernas".',
        observacao='Controle impressionante de delírios, alucinações ou agressividade. Porém, pode surgir rigidez corporal, rosto "sem expressão" (fácies em máscara), ganho de peso, lentidão e uma inquietação motora onde o paciente não consegue ficar parado sentado.',
        confusao='O rosto sem emoção (fácies em máscara) pode parecer "frieza", "falta de empatia" ou "depressão grave". A inquietação desesperadora nas pernas (acatisia) é frequentemente confundida com "piora violenta da ansiedade" ou crise de pânico.',
        perguntas='"Você está sentindo os músculos duros, como se estivesse engessado?", "Tem uma inquietação insuportável nas pernas, vontade de ficar andando?", "Notou mudança no peso, atraso na menstruação ou sensibilidade na mama?"',
        alinhar='Inquietação persistente (acatisia), tremores nas mãos, corpo travado afetando rotina, aumento de mamas ou saída de leite (galactorreia, alerta de aumento de prolactina), ganho de peso relevante.',
        urgencia='Febre alta associada a rigidez severa e confusão mental (Sinal de Síndrome Neuroléptica Maligna, emergência grave!), movimentos musculares involuntários de língua ou pescoço.',
        frase='"O pensamento alinhou e acalmou, mas o corpo travou e o metabolismo desregulou."',
        cuidado='Se observar "ansiedade física nas pernas" onde o paciente não consegue ficar sentado (acatisia), não trate isso com "técnicas de respiração". É um sofrimento neurológico medicamentoso; encaminhe para o médico agir na prescrição.',
    )

    toc_items.append({"Número": '10', "Título": 'Olanzapina'})
    append_medication_page(
        story,
        idx=9,
        num='10',
        nome_titulo='Olanzapina',
        classe='Antipsicótico atípico. Na linguagem clínica: estabilizador potente, muito sedativo e freio radical para episódios agudos de elevação e agressividade.',
        nome='Olanzapina. Nome comercial muito conhecido: Zyprexa.',
        uso_comum='Transtorno bipolar (fase de mania ou manutenção forte), esquizofrenia, agitação grave, depressões resistentes específicas.',
        relato='"Eu apago e durmo 12 horas seguidas", "nunca tive tanta fome na minha vida, devoro carboidrato", "engordei 10 kg em um mês e tô desesperado com isso", "minha mania sumiu".',
        observacao='Excelente controle rápido de quadros de mania e agitação desorganizada. Mas vem com sedação extrema, letargia aparente ("preguiça" profunda) e ganho de peso acelerado. O desespero corporal do paciente fica óbvio.',
        confusao='O sono prolongado pode parecer comportamento evasivo, fuga, "sintoma negativo" de esquizofrenia ou depressão. O intenso ganho de peso gera uma crise de autoestima e vergonha que o paciente culpa na terapia ou abandona a medicação em segredo.',
        perguntas='"Você consegue acordar a tempo para suas responsabilidades ou o remédio te prende na cama?", "A fome intensa acontece mais à noite?", "O ganho de peso está fazendo você pensar em parar o remédio por conta própria?"',
        alinhar='Ganho de peso rápido e forte (risco metabólico é a regra aqui), sedação diurna incapacitante, exames apontando aumento brusco de colesterol e glicemia (açúcar).',
        urgencia='Quedas ou desmaios ao levantar, confusão extrema, sinais de hiperglicemia aguda (muitíssima sede, muita urina), ou intenção de abandono letal.',
        frase='"Cortou a mania pela raiz como um machado, mas trouxe um sono de pedra e uma fome incontrolável por doce."',
        cuidado='Não reduza o aumento de peso a "falta de força de vontade" ou "compulsão emocional". O impulso alimentar induzido pela olanzapina é um roubo metabólico fortíssimo. Apoie a conversa do paciente com o psiquiatra.',
    )

    toc_items.append({"Número": '11', "Título": 'Aripiprazol'})
    append_medication_page(
        story,
        idx=10,
        num='11',
        nome_titulo='Aripiprazol',
        classe='Antipsicótico atípico. Na linguagem clínica: modulador de humor mais "limpo" metabolicamente, pouco sedativo, que tende a ativar mais do que derrubar.',
        nome='Aripiprazol. Nomes comerciais comuns: Aristab, Abilify.',
        uso_comum='Transtorno bipolar, esquizofrenia, irritabilidade no autismo e usado em dose baixa como acelerador de antidepressivos em quadros depressivos teimosos.',
        relato='"Não engordei nem fiquei dopado como em outros remédios", "tô agitado, sinto um formigamento dentro das pernas", "meu humor firmou", "ando com vontade louca de gastar no shopping ou jogar".',
        observacao='Preservação do peso, menor letargia. Boa melhora no afeto e humor. Porém, a observação crítica é notar o paciente balançando a perna o tempo todo (acatisia) e relatar perda do freio de impulsos (compras impulsivas e compulsão sexual atípica para ele).',
        confusao='A agitação física da acatisia é quase idêntica à de um ataque de pânico severo se o terapeuta não estiver atento. A perda de controle de impulsos (jogo, sexo, compras) pode ser lida erradamente como "virada para Mania do transtorno Bipolar", quando pode ser puramente induzida pelo remédio (efeito raro, mas notório).',
        perguntas='"Essa agitação é preocupação mental ou é uma agonia física nos músculos que te obriga a se mexer?", "Você notou impulsos compulsivos recentes por jogo, pornografia, compras, que não são da sua personalidade?", "Sente-se mais \'aceso\' à noite?"',
        alinhar='Relato de acatisia (agonia nas pernas), perda de freio moral e financeiro (compulsão por jogo, compras ou sexo de risco), insônia contínua.',
        urgencia='Acatisia que se torna insuportável gerando ideação suicida abrupta de fuga (frequente em acatisia grave), impulsos que colocam o paciente ou a família em risco de ruína financeira ou física imediata.',
        frase='"Salvou o paciente do ganho de peso e do sono, mas pode ter acendido uma fogueira de agitação nas pernas e nos impulsos."',
        cuidado='O controle de impulsos perdido com aripiprazol não responde bem à psicoterapia focada em autocontrole; ele responde à retirada/ajuste médico da dose. Não sobrecarregue o paciente com culpa.',
    )

    toc_items.append({"Número": '12', "Título": 'Lisdexanfetamina'})
    append_medication_page(
        story,
        idx=11,
        num='12',
        nome_titulo='Lisdexanfetamina',
        classe='Estimulante do sistema nervoso central (pró-fármaco). Na linguagem clínica: medicamento para déficit de atenção e hiperatividade.',
        nome='Lisdexanfetamina. Dimesilato de lisdexanfetamina. Nome comercial forte: Venvanse, Juneve, Lyberdia.',
        uso_comum='TDAH (aumentar foco, diminuir procrastinação) e Transtorno de Compulsão Alimentar Periódica.',
        relato='"Meu foco parece um laser o dia todo", "minha compulsão por doce desapareceu de dia", "fico super irritado lá pelas 18h", "ando obcecado com os detalhes do trabalho", "sem ele eu não existo".',
        observacao='Discurso mais rápido e concatenado, foco prolongado. Perda de apetite evidente de dia. Presença de "hiperfoco" alienante. Tensão na mandíbula (bruxismo). Efeito rebote dramático no fim da tarde/noite com exaustão pesada e intolerância frustração.',
        confusao='O paciente rende muito no trabalho e você comemora o fim da procrastinação, mas a família relata que ele ficou grosso, seco e explosivo à noite (o "crash" da medicação). A perda de peso pode ser celebrada, mas o paciente pode estar desnutrido.',
        perguntas='"O que acontece depois das 18h, quando o efeito começa a apagar?", "Você tem conseguido forçar o almoço mesmo sem fome?", "Está sentindo o maxilar mais tenso ou dolorido?", "Como fica o seu humor quando você não toma aos finais de semana?"',
        alinhar='Irritabilidade severa no "crash" da tarde, insônia rebelde à noite, tiques motores novos, comportamento dependente ("estou dobrando a dose para trabalhar até mais tarde"), perda brutal de peso.',
        urgencia='Sinais de psicose aguda, delírios persecutórios ou mania induzida, picos de hipertensão arterial ou taquicardia forte, ideação suicida pesada no período de queda da droga (fim da tarde).',
        frase='"Garante um dia útil de alta performance, mas rouba o jantar, a empatia noturna e tenciona o corpo."',
        cuidado='Práticas fora do prescrito (diluir, fracionar a dose, abrir a cápsula) envolvem riscos sérios. Se o paciente mencionar, encaminhe ao psiquiatra.',
    )

    toc_items.append({"Número": '13', "Título": 'Lítio'})
    append_medication_page(
        story,
        idx=12,
        num='13',
        nome_titulo='Lítio',
        classe='Estabilizador de humor (o padrão-ouro).',
        nome='Lítio. Carbonato de lítio. Nomes comerciais comuns: Carbolitium.',
        uso_comum='Transtorno Bipolar (mania aguda e manutenção preventiva), potencialização de depressões muito resistentes, redução de risco de suicídio.',
        relato='"Tenho uma sede que não passa", "faço muito xixi", "minhas mãos estão tremendo", "sinto um gosto metálico na boca", "fiquei com a mente meio enevoada (brain fog)", "minha acne piorou".',
        observacao='Excelente proteção contra oscilações de humor. Aumento expressivo do consumo de água durante a sessão. Tremor fino e rápido nas mãos. Um afeto que parece mais "plano", como se a vida tivesse perdido um pouco da emoção intensa.',
        confusao='A queixa de "estou sem energia criativa" ou "a vida perdeu a graça" é frequente em bipolares estabilizados pelo lítio. O paciente sente falta da euforia da hipomania e culpa o remédio de causar "depressão" ou "apatia".',
        perguntas='"O tremor nas mãos atrapalha para escrever ou usar o celular?", "Você está fazendo exame de sangue regular (litemia)?", "Sentiu muita náusea ou diarreia ultimamente?", "Você acha que a vida perdeu a graça ou apenas perdeu a aceleração?"',
        alinhar='Tremor nas mãos limitante, náuseas e vômitos constantes, queixa forte de letargia cognitiva, paciente relatando que parou o remédio de vez porque sentia saudade da energia de antes.',
        urgencia='Tremores muito fortes no corpo todo, fala arrastada, confusão mental severa, andar cambaleante, diarreia profusa (todos são sinais clássicos de Intoxicação por Lítio, emergência médica!).',
        frase='"Estabiliza o humor maravilhosamente, mas o paciente pede água o tempo todo e reclama que a vida perdeu a emoção."',
        cuidado='O Lítio exige nível muito exato no sangue (janela terapêutica estreita). Se o paciente tiver sudorese extrema (maratona/sauna) ou diarreia severa, o lítio concentra no sangue e intoxica. Alerte para falar com o médico.',
    )

    toc_items.append({"Número": '14', "Título": 'Lamotrigina'})
    append_medication_page(
        story,
        idx=13,
        num='14',
        nome_titulo='Lamotrigina',
        classe='Estabilizador de humor e anticonvulsivante. Na linguagem clínica: protetor contra fases depressivas.',
        nome='Lamotrigina. Nomes comerciais comuns: Lamictal, Neural.',
        uso_comum='Transtorno Bipolar (especialmente para prevenir depressão bipolar), convulsões.',
        relato='"Sinto que os altos e baixos pararam", "parece que demora mais pra fazer efeito que os outros", "notei umas manchas vermelhas no corpo", "sinto tontura de leve".',
        observacao='Estabilização mais lenta, sem a sedação pesada do lítio ou olanzapina. Paciente mais funcional, acordado e com peso estável. Porém, queixas de erupções na pele são o grande alerta de atenção.',
        confusao='Como o aumento da dose precisa ser hiper-lento (para evitar alergia grave), o paciente pode achar que a medicação "não está funcionando" nas primeiras semanas e desistir.',
        perguntas='"Apareceu alguma irritação, coceira ou mancha vermelha na pele, nas mucosas ou ao redor dos olhos?", "Como está a paciência para o aumento lento da dose?"',
        alinhar='Qualquer, repito, qualquer surgimento de mancha vermelha na pele no início do tratamento. Insônia resistente, relato de que a depressão piorou na fase de introdução.',
        urgencia='Manchas vermelhas que descamam, associadas a febre, feridas na boca ou olhos (Risco de Síndrome de Stevens-Johnson, emergência cutânea grave e letal).',
        frase='"Protege muito contra o polo depressivo sem dopar, mas exige paciência e fiscalização diária da pele."',
        cuidado='A atenção à pele é mandatória. Não menospreze se o paciente disser "deu uma alergia aqui no pescoço". Mande fotografar e enviar ao médico imediatamente.',
    )

    toc_items.append({"Número": '15', "Título": 'Valproato (Ácido Valproico)'})
    append_medication_page(
        story,
        idx=14,
        num='15',
        nome_titulo='Valproato (Ácido Valproico)',
        classe='Estabilizador de humor e anticonvulsivante. Na linguagem clínica: freio potente para mania e irritabilidade grave.',
        nome='Ácido valproico ou Valproato de Sódio ou Divalproato de Sódio. Nomes: Depakote, Depakene, Torval.',
        uso_comum='Transtorno Bipolar (mania), epilepsia, prevenção de enxaqueca, impulsividade crônica severa.',
        relato='"Meu pavio ficou muito mais longo", "engordei rápido", "meu cabelo está caindo", "meu estômago dói quando tomo", "minhas mãos tremem".',
        observacao='Excelente redução de explosões de raiva. Porém, comumente se observa queixa de aumento de peso, tremor leve e, em mulheres, queixa de queda de cabelo e possível aumento de pelos ou desregulação do ciclo menstrual.',
        confusao='As alterações físicas e capilares em mulheres podem gerar uma angústia severa de autoimagem, que vai dominar as sessões e desviar do problema inicial psiquiátrico.',
        perguntas='"O seu humor estabilizou à custa de muito ganho de peso?", "Você sentiu muito enjoo?", "Se for mulher: houve alguma mudança no seu ciclo menstrual ou cabelo?"',
        alinhar='Ganho de peso que gere risco de abandono do tratamento, queda de cabelo acentuada, tremores intensos nas mãos, sintomas ováricos (SOP).',
        urgencia='Icterícia (olhos e pele amarelos), dor abdominal intensa e vômito severo (risco de hepatite ou pancreatite induzida), sonolência profunda anormal, risco fetal altíssimo se houver gravidez surpresa.',
        frase='"Aumenta a paciência de forma brutal, mas agride o estômago, o peso e os fios de cabelo."',
        cuidado='Se a paciente engravidar enquanto toma Valproato, é urgência psiquiátrica e obstétrica devido ao altíssimo risco de malformação do feto.',
    )

    toc_items.append({"Número": '16', "Título": 'Bupropiona'})
    append_medication_page(
        story,
        idx=15,
        num='16',
        nome_titulo='Bupropiona',
        classe='Antidepressivo (inibidor da recaptação de noradrenalina e dopamina - IRND). Na linguagem clínica: antidepressivo estimulante sem danos sexuais.',
        nome='Bupropiona. Nomes comerciais comuns: Wellbutrin, Bup, Zetron.',
        uso_comum='Depressão com fadiga e letargia, cessação de tabagismo, potencializador de libido perdida por ISRS, TDAH (off-label).',
        relato='"Tô com muito mais foco", "parei de fumar fácil", "minha vontade de fazer sexo voltou", mas também "tô ansioso pra caramba", "minha boca tá muito seca", "ando irritado, pareço elétrico".',
        observacao='Aumento vibrante de energia e iniciativa. É o antidepressivo "fácil de gostar" por não dar sono, não engordar e melhorar o sexo. Mas observe aumento óbvio de ansiedade, tensão e possivelmente suor excessivo.',
        confusao='Se o paciente já era ansioso de base, a bupropiona pode jogar gasolina no pânico. Ele melhora da tristeza, mas vira uma pilha de nervos. Pode piorar insônia se tomado muito tarde.',
        perguntas='"Aumentou muito sua ansiedade corporal?", "Como está seu sono?", "Você sentiu que sua irritabilidade aumentou à toa?", "Sente zumbido no ouvido?"',
        alinhar='Piora pesada de ansiedade, ataque de pânico induzido, irritabilidade hostil, insônia resistente severa.',
        urgencia='Convulsões agudas (a bupropiona baixa o limiar convulsivo), descontrole maníaco agressivo.',
        frase='"Devolve energia e libido rápido, mas frequentemente transforma o triste e cansado no ansioso e irritado."',
        cuidado='Preste muita atenção ao uso abusivo. Em pacientes com histórico de transtorno alimentar crônico (anorexia/bulimia forte), o risco de convulsão pela bupropiona é alto.',
    )

    toc_items.append({"Número": '17', "Título": 'Mirtazapina'})
    append_medication_page(
        story,
        idx=16,
        num='17',
        nome_titulo='Mirtazapina',
        classe='Antidepressivo tetracíclico. Na linguagem clínica: antidepressivo altamente sedativo e estimulador de apetite (não causa dano sexual).',
        nome='Mirtazapina. Nomes comerciais comuns: Remeron, Menelat.',
        uso_comum='Depressão severa acompanhada de insônia profunda e perda de peso acentuada.',
        relato='"Durmo muito bem, um sono pesado", "nunca comi tanto carboidrato na vida", "engordei muito rápido", "minha depressão melhorou".',
        observacao='Resolução mágica da insônia logo nas primeiras semanas e um humor mais responsivo. Mas é notório o peso crescente. O paciente costuma apresentar letargia e aumento de massa nas consultas.',
        confusao='Curiosamente, na Mirtazapina, as doses mais baixas (15mg) dão MAIS SONO e mais fome do que as doses altas (30mg, 45mg). O paciente pode achar que diminuir a dose vai ajudar na "morgueza", mas vai piorar o sono.',
        perguntas='"A fome por doces ou massa à noite ficou descontrolada?", "Você está demorando muito para engrenar de manhã por causa do sono residual?", "O ganho de peso afeta sua adesão ao remédio?"',
        alinhar='Sobrepeso que gera muito sofrimento ou dano metabólico real, sedação diurna brutal ("ressaca" pesada).',
        urgencia='Reações alérgicas ou infecções não explicáveis graves associadas à queda de leucócitos (efeito super raro, mas existe).',
        frase='"O remédio que apaga a insônia mais teimosa, mas cobra o preço abrindo a porta da geladeira à noite."',
        cuidado='Não desvalide o "eu não consigo parar de comer". O estímulo nos receptores de histamina é fisiológico. A mirtazapina é espetacular para pacientes idosos deprimidos que não comem e não dormem.',
    )

    toc_items.append({"Número": '18', "Título": 'Trazodona'})
    append_medication_page(
        story,
        idx=17,
        num='18',
        nome_titulo='Trazodona',
        classe='Antidepressivo SARI. Na linguagem clínica: o "antidepressivo que o psiquiatra usa em dose baixa para fazer você dormir".',
        nome='Trazodona. Cloridrato de trazodona. Nomes comerciais: Donaren.',
        uso_comum='Insônia com depressão/ansiedade (dose baixa 50-150mg). Antidepressivo real só em doses altas (acima de 150-300mg).',
        relato='"Durmo a noite toda sem viciar", "sinto uma tontura quando acordo de madrugada pra ir ao banheiro", "meu nariz parece que entope quando tomo", "engrossei a voz ou acordei estufado".',
        observacao='Excelente transição suave para um sono de qualidade sem a dependência do Rivotril ou Zolpidem. O paciente não engorda. Costuma relatar leve tontura postural ou nariz entupido leve de noite.',
        confusao='O paciente pode estar "deprimido", tomando Trazodona 50mg, e dizendo que o "antidepressivo não faz efeito na tristeza". Essa dose só faz efeito no sono.',
        perguntas='"O sono induzido é reparador ou deixa muita ressaca?", "Sente tontura forte ao levantar da cama de noite?", "Homens: sentiram ereção anormal ou dolorida de noite/manhã?"',
        alinhar='Tonturas frequentes e risco de queda ao levantar de madrugada (especialmente perigoso em idosos).',
        urgencia='Ereção dolorosa persistente e longa em homens que não baixa (Priapismo, efeito raríssimo, mas emergência urológica imediata, pode necrosar o pênis).',
        frase='"O sonífero psiquiátrico de eleição para sair dos tarja preta, quase sem efeitos colaterais fortes, a não ser a tontura na madrugada."',
        cuidado='O cuidado é investigar se a ansiedade está piorando no meio do dia, pois a ação calmante de doses baixas de trazodona não cobre as 24h.',
    )

    toc_items.append({"Número": '19', "Título": 'Venlafaxina (e Duloxetina)'})
    append_medication_page(
        story,
        idx=18,
        num='19',
        nome_titulo='Venlafaxina (e Duloxetina)',
        classe='Duais. Inibidores da recaptação de Serotonina e Noradrenalina (IRSN).',
        nome='Venlafaxina (Efexor, Venlift) / Duloxetina (Cymbalta, Velija).',
        uso_comum='Depressões pesadas, ansiedade generalizada persistente e tratamento de dores crônicas (Duloxetina é mestre da dor).',
        relato='"Deu um empurrão que a Sertralina não dava", "minhas dores no corpo melhoraram muito", "transpiro demais de noite, suor nas costas", "se atraso a dose 2 horas, sinto minha cabeça dar choque", "estou muito enjoado".',
        observacao='Muita energia devolvida. Menos lentidão. Se o paciente for portador de Fibromialgia, a melhora com a Duloxetina é notável. Porém, transpiram excessivamente ("suores noturnos") e sofrem abusivamente com abstinência.',
        confusao='Os "choques na cabeça" (brain zaps) ou tontura extrema que o paciente relata não são volta do pânico, e sim abstinência violenta gerada por atrasar uma simples dose em poucas horas (síndrome de descontinuação rápida).',
        perguntas='"Você costuma esquecer de tomar a cápsula no horário certo?", "Sentiu que começou a transpirar demais?", "Mediu a pressão arterial nos primeiros dias?"',
        alinhar='Suor noturno extremo que afeta qualidade de vida, aumento de pressão arterial que não estabiliza, paciente assustado com efeitos de esquecer a dose.',
        urgencia='Sinais cardiovasculares descontrolados, síndrome serotoninérgica, ideação suicida forte.',
        frase='"Ação de tanque de guerra na dor e tristeza, mas cobra fidelidade horária implacável senão os choques de abstinência punem."',
        cuidado='Na tentativa de parar venlafaxina ou duloxetina, o desmame exige semanas ou meses e o paciente sofre muito. Seja a rocha de validação da dor física que ele sentirá ("brain zaps", enjoo, tonteira, choro fácil).',
    )

    toc_items.append({"Número": '20', "Título": 'Buspirona'})
    append_medication_page(
        story,
        idx=19,
        num='20',
        nome_titulo='Buspirona',
        classe='Ansiolítico (Azapirona). Na linguagem clínica: ansiolítico que não causa vício, sedação e não altera a memória (o "antípoda" dos benzodiazepínicos).',
        nome='Buspirona. Cloridrato de Buspirona. Nomes comerciais: Ansitec, Buspanil.',
        uso_comum='Ansiedade generalizada crônica, quadros ansiogênicos leves e contínuos.',
        relato='"Sinto que não está fazendo efeito nenhum", "dá uma dor de cabeça esquisita logo que tomo", "sinto uma tontura boba", "meu sono não mudou".',
        observacao='Redução gradual, lenta e sutil da ansiedade corporal. Não há sedação visível, não há relaxamento muscular imediato. O paciente segue absolutamente funcional.',
        confusao='O paciente frequentemente acusa "o remédio de ser água" ou "estar fraco demais", especialmente se ele foi usuário prévio de Rivotril/Alprazolam e espera a "pancada sedativa" para achar que a ansiedade melhorou.',
        perguntas='"Você está sentindo tontura rotatória nos primeiros dias?", "Qual a sua expectativa de velocidade com esse remédio em comparação ao antigo?", "Como está a ansiedade de fundo ao longo das semanas?"',
        alinhar='Tonturas incapacitantes, irritabilidade paradoxal extrema, queixa crônica de que o remédio não surtiu efeito após 4 semanas (pede reavaliação médica).',
        urgencia='Relatos de episódios confusos súbitos, febre inexplicável ou dores musculares (se misturado inadvertidamente com inibidores da MAO ou grandes quantidades de suco de toranja).',
        frase='"O ansiolítico mais leve e paciente, que trabalha nos bastidores frustrando quem buscava alívio fulminante."',
        cuidado='Cuidado ao endossar a reclamação do paciente de que "o remédio não funciona". É responsabilidade nossa explicar (e reforçar a psicoeducação do médico) que a ausência de pancada sedativa é justamente a vantagem orgânica da Buspirona.',
    )

    toc_items.append({"Número": '21', "Título": 'Pregabalina'})
    append_medication_page(
        story,
        idx=20,
        num='21',
        nome_titulo='Pregabalina',
        classe='Anticonvulsivante (neuromodulador). Na linguagem clínica: protetor da dor neuropática severa e regulador de grandes ansiedades.',
        nome='Pregabalina. Nomes comerciais comuns: Lyrica, Prebictal.',
        uso_comum='Dores crônicas neuropáticas, fibromialgia fortíssima, Transtorno de Ansiedade Generalizada resistente a outras abordagens.',
        relato='"Minhas dores sumiram ou acalmaram como num milagre", "sinto minha visão meio embaçada ou tonta no início", "minhas pernas estão inchando", "ando esquecido e aéreo".',
        observacao='Alívio da tensão muscular gerada pela ansiedade e pela dor crônica. Maior fluidez de discurso (se a dor inibia o pensar). Mas observe ganho de peso progressivo por inchaço (edema) e letargia perceptível.',
        confusao='A pregabalina gera dependência cruzada e forte apego emocional em alguns pacientes, levando a relatos exagerados de piora apenas para conseguir aumento da dose. O letargia mental pode parecer embotamento depressivo.',
        perguntas='"O seu sapato está mais apertado no final do dia (inchaço)?", "O que você sente quando atrasa a dose?", "Percebeu ganho de peso não associado à comida?", "Sua coordenação motora ou equilíbrio mudaram?"',
        alinhar='Paciente ganhando muito peso através de inchaço aparente severo (edema), desequilíbrio perigoso (ataxia), risco de abuso em pacientes com histórico de drogadição, depressão respiratória se associada a álcool pesadamente.',
        urgencia='Dificuldade respiratória importante, confusão mental intensa ou delirium. Ideação suicida acentuada, inchaço subitamente excessivo de todo o corpo ou do rosto (alergia severa).',
        frase='"Apaga o incêndio da dor no nervo, mas incha os pés e deixa a mente navegando por um nevoeiro."',
        cuidado='É perigoso sugerir retirada abrupta da Pregabalina por causa dos inchaços ou tonturas sem anuência médica rigorosa. A síndrome de abstinência é muito pesada (insônia grave, ansiedade intensa, até convulsão).',
    )

    toc_items.append({"Número": '22', "Título": 'Carbamazepina'})
    append_medication_page(
        story,
        idx=21,
        num='22',
        nome_titulo='Carbamazepina',
        classe='Anticonvulsivante / Estabilizador de humor.',
        nome='Carbamazepina. Nome comercial principal: Tegretol.',
        uso_comum='Epilepsia, dores nevrálgicas (nervo trigêmeo), manutenção/estabilização no Transtorno Bipolar, dependência alcoólica agudizada.',
        relato='"Sinto visão dupla de vez em quando", "estou muito enjoado", "apareceram umas manchas estranhas no corpo e não sei por quê", "meu outro remédio parou de fazer efeito do nada" (interação enzimática grave).',
        observacao='Redução de agressividade orgânica e regulação boa de humor em bipolares. Mas é a medicação "rainha" das interações no fígado (ela destrói o efeito de outros remédios). Muito cuidado com sedação repentina, náusea aparente e vermelhidões.',
        confusao='"Eu tomo anticoncepcional e fiquei grávida" (a carbamazepina anula várias pílulas hormonais). Pode parecer displicência do paciente, mas é roubo farmacológico metabólico. A tontura/vertigem pode ser lida como somatização.',
        perguntas='"Seus médicos todos sabem que você usa Tegretol? Isso é crítico.", "Sentiu manchas no corpo, dor na garganta não explicável, ou sangramentos fáceis na gengiva?", "Notou visão embaçada, visão dupla ou tontura forte?"',
        alinhar='Sintomas estranhos em uso combinado com outros remédios de ansiedade (a carbamazepina acelera a quebra de outros remédios, deixando-os ineficazes), queixa de falha de proteção hormonal. Aparecimento de infecções constantes na boca.',
        urgencia='Lesões vermelhas descamativas severas pelo corpo, inchaço em linfonodos (ínguas), confusão mental por hiponatremia aguda (baixa de sódio grave, especialmente em idosos com confusão), febres sem causa.',
        frase='"Estabiliza o caos cerebral agressivamente, mas devora no fígado a eficácia das outras drogas que chegam."',
        cuidado='O cuidado aqui é atuar como "agente de rede". Toda e qualquer nova pílula prescrita ou tomada por este paciente precisa passar pelo conhecimento do psiquiatra principal.',
    )

    toc_items.append({"Número": '23', "Título": 'Haloperidol'})
    append_medication_page(
        story,
        idx=22,
        num='23',
        nome_titulo='Haloperidol',
        classe='Antipsicótico típico de Primeira Geração ("Clássico"). O mais famoso antipsicótico antigo.',
        nome='Haloperidol. Nomes comerciais comuns: Haldol.',
        uso_comum='Surtos psicóticos agudos, esquizofrenia violenta grave, episódios maníacos agressivos com perda total de juízo, agitação em delírium, tiques crônicos (como Síndrome de Tourette).',
        relato='"Não tenho mais pensamentos", "estou engessado, duro como tábua", "minha mandíbula entortou sozinha ontem" (distonia), "eu babo sem querer", "não consigo ficar parado na cadeira" (acatisia severa).',
        observacao='Desligamento frontal forte de vozes e delírios, mas um custo motor violento ("impregnação"). O paciente treme (parkinsonismo), tem marcha robótica de passos curtos, rosto hiper-rígido sem expressão, agitação nas pernas.',
        confusao='A total inexpressão facial gerada pelo haloperidol é frequentemente confundida com o "embotamento natural da esquizofrenia" (sintomas negativos). O desespero motriz das pernas (acatisia) é confundido com exacerbação de mania ou pânico violento (gera sofrimento insuportável).',
        perguntas='"A inquietude está nos seus músculos, puxando as pernas?", "Sente cãibras musculares no pescoço ou nos olhos virando para cima?", "O tremor nas mãos te impede de segurar copo ou garfo?"',
        alinhar='Rigidez motora de marcha, tremores das mãos evidentes (pedir para ele usar medicações como Biperideno [Akineton] em conjunto é praxe), acatisia, aumento de peito/leite (galactorreia fortíssima pelo aumento intenso de prolactina).',
        urgencia='Distonia aguda (pescoço torce, mandíbula trava, olhos rolam pra trás e não voltam - emergência na UPA que assusta, mas é revertida com medicação na hora), febre com rigidez letal e sudorese (Síndrome Neuroléptica Maligna), espasmo da laringe (risco de sufocar).',
        frase='"Freio violento e de emergência para a perda completa de contato com a realidade, ao custo do engessamento robótico do corpo."',
        cuidado='Não trate espasmos ou movimentos torcidos como "conversão histérica" ou "resistência" se o paciente tomar Haloperidol. É distonia medicamentosa perigosíssima. O paciente não "quer chamar atenção"; os nervos o traíram.',
    )

    toc_items.append({"Número": '24', "Título": 'Zolpidem'})
    append_medication_page(
        story,
        idx=23,
        num='24',
        nome_titulo='Zolpidem',
        classe='Hipnótico "Z-Drug". Na linguagem clínica: pílula sedativa pontual de ação exclusivamente indutora e curta (não garante o meio e fim do sono).',
        nome='Zolpidem. Hemitartarato de zolpidem. Nomes comerciais: Stilnox, Patz, Lioram, Nuit.',
        uso_comum='Dificuldade esmagadora de indução (pegar) no sono em curto prazo. Uso crônico é controverso e perigoso.',
        relato='"Foi mágico na primeira semana e agora não bate mais", "preciso de três pílulas pra capotar", "minha mulher disse que eu comi uma panela de macarrão de madrugada e não lembro", "acordei com a casa inteira desarrumada e sem memória", "mandei mensagem pro meu chefe dopado e acordei arrependido".',
        observacao='Reatividade noturna imprevisível. Amnésia anterógrada total severa após ingerir o medicamento (apaga a memória logo após). Tolerância subindo velozmente e paciente confessando dependência grave para conseguir encostar na cama.',
        confusao='O paciente pode fazer desabafos passionais na sessão via WhatsApp ou e-mail de madrugada e no dia seguinte dizer que "foi sem querer", por estar de fato embriagado de zolpidem (efeito sonambúlico / amnésico extremo). Confusão matinal leve se misturado com outros remédios.',
        perguntas='"O que acontece logo depois que você engole a pílula? Você deita ou fica rodando no celular e pela casa?", "Quantos comprimidos está usando por noite?", "Você mistura com taça de vinho?", "Alguém já te contou coisas que você fez e não lembra de noite?"',
        alinhar='Desespero se não tem medicação, aumento progressivo de doses escondido, uso antes de viagens de carro.',
        urgencia='Relatos de condução de carro sob efeito sonambúlico, tentativa de suicídio por ingestão maciça em momento dissociado, alucinações nítidas e confusão delirante minutos após tomar se o paciente se recusa a deitar de imediato.',
        frase='"A pílula do esquecimento curto que induz o sono rápido, mas pode despertar um zumbi funcional capaz de varrer a casa inteira e não lembrar de nada."',
        cuidado='Relatos de "sonambulismo do Patz" merecem atenção clínica séria: o efeito amnésico do Zolpidem pode produzir comportamentos automáticos sem registro de memória. A orientação clínica consolidada é que o medicamento seja tomado já na cama, imediatamente antes de dormir.',
    )

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
    doc.build(story)
    return OUT


if __name__ == "__main__": print(build())
