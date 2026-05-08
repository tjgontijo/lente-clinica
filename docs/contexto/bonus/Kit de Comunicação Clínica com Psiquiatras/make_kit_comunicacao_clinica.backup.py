#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Kit de Comunicação Clínica com Psiquiatras
PDF generator with fully hardcoded content blocks.
"""

from __future__ import annotations

import os
import re
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.lib.styles import ParagraphStyle


HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "kit_comunicacao_clinica.pdf")


W, H = A4
ML = MR = 1.8 * cm
MT = 2.4 * cm
MB = 1.5 * cm
CW = W - ML - MR

S50 = HexColor("#F2F8F7")
S100 = HexColor("#E0ECEB")
S200 = HexColor("#C5D9D4")
S500 = HexColor("#6A9088")
S600 = HexColor("#537A72")
S700 = HexColor("#3F6058")
S800 = HexColor("#2F4A44")
S900 = HexColor("#1F3530")
T400 = HexColor("#D49068")
T500 = HexColor("#C47850")
T600 = HexColor("#B06040")
INK = HexColor("#1A2E2A")
INKL = HexColor("#4A6660")
WHT = HexColor("#FFFFFF")
QBG = HexColor("#FFF7F0")
QBAR = HexColor("#C47850")
MODEL_BG = HexColor("#F8FBFA")


def ps(name, font="Helvetica", sz=9.2, lead=None, color=None, before=0, after=0, align=TA_LEFT):
    return ParagraphStyle(
        name,
        fontName=font,
        fontSize=sz,
        leading=lead or round(sz * 1.45),
        textColor=color or INK,
        spaceBefore=before,
        spaceAfter=after,
        alignment=align,
    )
    style.keepWithNext = 0
    return style


ST = {
    "cover_title": ps("cover_title", "Helvetica-Bold", 24, 30, WHT, after=8),
    "cover_sub": ps("cover_sub", "Helvetica", 12, 18, S200, after=6),
    "cover_author": ps("cover_author", "Helvetica", 10.5, 16, S300 := HexColor("#A3C4BC")),
    "h1": ps("h1", "Helvetica-Bold", 16, 22, S700, after=8),
    "h2": ps("h2", "Helvetica-Bold", 12, 16, WHT),
    "h3": ps("h3", "Helvetica-Bold", 11.3, 15, S700, before=8, after=5),
    "body": ps("body", "Helvetica", 9.2, 13.6, INK, after=5),
    "small": ps("small", "Helvetica", 8.2, 12, INKL, after=3),
    "quote": ps("quote", "Helvetica-Oblique", 8.7, 12.8, INK, after=3),
    "quote_b": ps("quote_b", "Helvetica-BoldOblique", 8.7, 12.8, S700, after=3),
    "table_h": ps("table_h", "Helvetica-Bold", 8.0, 11, WHT),
    "table": ps("table", "Helvetica", 7.7, 10.5, INK),
    "list": ps("list", "Helvetica", 8.9, 12.8, INK),
    "footer": ps("footer", "Helvetica", 7.2, 9, S500, align=TA_CENTER),
}
ST["h1"].keepWithNext = 1
ST["h2"].keepWithNext = 1
ST["h3"].keepWithNext = 1


def draw_cover(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(S900)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFillColor(S800)
    canvas.circle(W * 0.86, H * 0.78, 88, fill=1, stroke=0)
    canvas.setFillColor(HexColor("#253D36"))
    canvas.circle(W * 0.80, H * 0.70, 52, fill=1, stroke=0)
    canvas.setFillColor(T600)
    canvas.rect(0, H - 5 * mm, W, 5 * mm, fill=1, stroke=0)
    canvas.setFillColor(S800)
    canvas.rect(0, 0, W, 2.8 * cm, fill=1, stroke=0)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(S300)
    canvas.drawString(ML, 1.15 * cm, "Uso exclusivo para fins educativos")
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.setFillColor(T400)
    canvas.drawRightString(W - MR, 1.15 * cm, "Dra. Tatiana Gontijo")
    canvas.restoreState()


def draw_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(S700)
    canvas.rect(ML, H - MT + 5, CW, 2, fill=1, stroke=0)
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.setFillColor(S700)
    canvas.drawString(ML, H - MT + 10, "KIT DE COMUNICAÇÃO CLÍNICA COM PSIQUIATRAS")
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(S500)
    canvas.drawRightString(ML + CW, H - MT + 10, "Dra. Tatiana Gontijo")
    canvas.setFillColor(S200)
    canvas.rect(ML, MB - 5, CW, 1, fill=1, stroke=0)
    canvas.setFont("Helvetica", 7.2)
    canvas.setFillColor(S500)
    canvas.drawCentredString(
        W / 2,
        MB - 17,
        "Kit de Comunicação Clínica com Psiquiatras",
    )
    canvas.setFont("Helvetica-Bold", 7.2)
    canvas.setFillColor(S600)
    canvas.drawRightString(ML + CW, MB - 17, str(doc.page))
    canvas.restoreState()


def make_doc(path):
    doc = BaseDocTemplate(
        path,
        pagesize=A4,
        leftMargin=ML,
        rightMargin=MR,
        topMargin=MT,
        bottomMargin=MB,
    )
    frame = Frame(ML, MB, CW, H - MT - MB, id="content")
    doc.addPageTemplates(
        [
            PageTemplate(id="Cover", frames=[frame], onPage=draw_cover),
            PageTemplate(id="Content", frames=[frame], onPage=draw_page),
        ]
    )
    return doc


def clean_text(text):
    replacements = {
        "⚠️": "Atenção",
        "⚠": "Atenção",
        "❌": "Evita",
        "✅": "Prefira",
        "🟡": "Amarelo",
        "🔴": "Vermelho",
        "🟢": "Acompanhar",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def inline(text):
    text = clean_text(text)
    text = escape(text)
    text = re.sub(r"`([^`]+)`", r"<font name=\"Courier\">\1</font>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", text)
    return text


def paragraph(text, style="body"):
    return Paragraph(inline(text), ST[style])


def h2_block(text):
    table = Table([[Paragraph(inline(text.upper()), ST["h2"])]], colWidths=[CW])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), S700),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    return [Spacer(1, 4 * mm), table, Spacer(1, 3 * mm)]


def quote_block(lines):
    rows = []
    for raw in lines:
        text = raw.strip()
        if not text:
            rows.append(["", Spacer(1, 3 * mm)])
            continue
        style = "quote_b" if text.startswith("**") and text.endswith("**") else "quote"
        rows.append(["", Paragraph(inline(text), ST[style])])
    table = Table(rows, colWidths=[4 * mm, CW - 4 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), QBAR),
                ("BACKGROUND", (1, 0), (1, -1), QBG),
                ("LEFTPADDING", (0, 0), (0, -1), 0),
                ("RIGHTPADDING", (0, 0), (0, -1), 0),
                ("TOPPADDING", (0, 0), (0, -1), 0),
                ("BOTTOMPADDING", (0, 0), (0, -1), 0),
                ("LEFTPADDING", (1, 0), (1, -1), 10),
                ("RIGHTPADDING", (1, 0), (1, -1), 10),
                ("TOPPADDING", (1, 0), (1, -1), 5),
                ("BOTTOMPADDING", (1, 0), (1, -1), 5),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return [table, Spacer(1, 2.5 * mm)]


def split_table_row(line):
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def table_block(lines):
    rows = [split_table_row(line) for line in lines if not re.match(r"^\s*\|?\s*:?-{3,}", line)]
    if not rows:
        return []
    max_cols = max(len(row) for row in rows)
    for row in rows:
        row.extend([""] * (max_cols - len(row)))
    data = []
    for r, row in enumerate(rows):
        style = ST["table_h"] if r == 0 else ST["table"]
        data.append([Paragraph(inline(cell), style) for cell in row])
    col_widths = [CW / max_cols] * max_cols
    table = Table(data, colWidths=col_widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), S700),
                ("BACKGROUND", (0, 1), (-1, -1), MODEL_BG),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHT, S50]),
                ("GRID", (0, 0), (-1, -1), 0.4, S200),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return [table, Spacer(1, 3 * mm)]


def list_block(items, ordered=False):
    flowables = []
    for index, item in enumerate(items, 1):
        bullet = f"{index}." if ordered else "-"
        flowables.append(Paragraph(inline(f"{bullet} {item}"), ST["list"]))
    flowables.append(Spacer(1, 2 * mm))
    return flowables


def form_cell(label, hint=""):
    text = f"<b>{escape(label)}</b>"
    if hint:
        text += f"<br/><font color='#4A6660'>{escape(hint)}</font>"
    return Paragraph(text, ST["body"])


def form_box(label, height, hint=""):
    table = Table([[form_cell(label, hint)]], colWidths=[CW], rowHeights=[height])
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.7, S200),
                ("BACKGROUND", (0, 0), (-1, -1), HexColor("#FBFDFD")),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return [table, Spacer(1, 2.4 * mm)]


def form_row(items, height):
    cells = [form_cell(label, hint) for label, hint, _width in items]
    widths = [width for _label, _hint, width in items]
    table = Table([cells], colWidths=widths, rowHeights=[height])
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.7, S200),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, S200),
                ("BACKGROUND", (0, 0), (-1, -1), HexColor("#FBFDFD")),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return [table, Spacer(1, 2.4 * mm)]


def summary_form():
    story = []
    story.extend(h2_block("PEÇA 4: Ficha de Resumo Clínico"))
    story.extend(
        quote_block(
            [
                "Use esta ficha para organizar o que será compartilhado com o psiquiatra. Inclua apenas informações relevantes para a continuidade do cuidado.",
            ]
        )
    )

    title = Table([[Paragraph("FICHA DE RESUMO CLÍNICO", ST["h3"])]], colWidths=[CW])
    title.setStyle(
        TableStyle(
            [
                ("LINEBELOW", (0, 0), (-1, -1), 0.7, S200),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(title)
    story.append(Spacer(1, 3 * mm))

    story.extend(
        form_row(
            [
                ("Paciente", "Iniciais", CW * 0.42),
                ("Idade", "", CW * 0.18),
                ("Data", "", CW * 0.40),
            ],
            1.25 * cm,
        )
    )
    story.extend(form_box("Motivo do contato", 1.45 * cm, "Por que estou escrevendo agora?"))
    story.extend(form_box("Medicação atual conhecida", 1.25 * cm, "Nome, dose e tempo de uso, se o paciente souber informar"))
    story.extend(form_box("O que observei em sessão", 2.15 * cm, "Comportamentos, falas, mudança de padrão e impacto funcional"))
    story.extend(form_box("Falas literais do paciente", 1.45 * cm, "Use aspas apenas para frases clinicamente relevantes"))
    story.extend(form_box("Tempo de evolução do padrão", 1.15 * cm, "Quando começou? Está piorando, melhorando ou oscilando?"))

    story.extend(
        form_row(
            [
                ("Sono", "", CW * 0.34),
                ("Trabalho/estudo", "", CW * 0.33),
                ("Vínculos", "", CW * 0.33),
            ],
            1.25 * cm,
        )
    )
    story.extend(
        form_box(
            "Urgência percebida",
            1.25 * cm,
            "[ ] Sem urgência imediata    [ ] Alinhar em breve    [ ] Urgente hoje",
        )
    )
    story.extend(form_box("Pedido objetivo ao psiquiatra", 1.45 * cm, "Reavaliação, orientação de conduta, antecipação de consulta ou alinhamento"))

    note = Table(
        [[Paragraph("Registre no prontuário o motivo do contato, para quem comunicou, quando comunicou e o conteúdo essencial.", ST["small"])]],
        colWidths=[CW],
    )
    note.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), S50),
                ("BOX", (0, 0), (-1, -1), 0.5, S200),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(note)
    return story


def build_story():
    story = []
    story.append(Spacer(1, 7.1 * cm))
    story.append(Paragraph("Kit de Comunicação<br/>Clínica com Psiquiatras", ST["cover_title"]))
    story.append(HRFlowable(width=6.0 * cm, color=T600, thickness=2.5, spaceAfter=10, spaceBefore=4))
    story.append(Paragraph("Modelos, roteiros e ficha de resumo clínico", ST["cover_sub"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("Programa Lente Clínica - Dra. Tatiana Gontijo", ST["cover_author"]))
    story.append(NextPageTemplate("Content"))
    story.append(PageBreak())

    story.extend(build_hardcoded_content())
    return story



def build_hardcoded_content():
    story = []
    # Conteudo hardcoded diretamente no Python (sem leitura/parsing de MD em runtime).
    story.extend(h2_block("PEÇA 1: Como se Comunicar com Clareza e Objetividade"))
    story.append(Paragraph(inline("O que vale comunicar"), ST["h3"]))
    story.append(paragraph("Você ocupa um lugar único: vê o paciente toda semana, acompanha mudanças em tempo real e constrói um vínculo clínico próximo. Isso tem grande valor para o cuidado quando é comunicado com clareza."))
    story.append(paragraph("Comunique:"))
    story.extend(list_block([
        "O que você observou diretamente (comportamento, fala, padrão)",
        "Mudanças em relação a sessões anteriores",
        "Falas literais do paciente que têm peso clínico",
        "Impacto funcional percebido (sono, trabalho, vínculos, risco)",
        "O que você está sentindo que precisa de atenção ou reavaliação",
    ]))
    story.append(paragraph("Não comunique:"))
    story.extend(list_block([
        "Diagnóstico fechado (\"ele é bipolar\")",
        "Sugestão de medicação específica (\"deveria trocar para bupropiona\")",
        "Certezas sobre causa (\"é efeito colateral do remédio\")",
        "Interpretações que ultrapassam sua observação clínica",
    ]))
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph(inline("Termos técnicos úteis na comunicação clínica"), ST["h3"]))
    story.extend(list_block([
        "<b>Adesão ao tratamento:</b> quanto o paciente consegue seguir o plano combinado (medicação, horários e acompanhamento).",
        "<b>Latência terapêutica:</b> tempo esperado até a medicação começar a produzir benefício clínico.",
        "<b>Resposta parcial:</b> melhora presente, mas ainda insuficiente para recuperação funcional.",
        "<b>Remissão:</b> redução importante dos sintomas, com retorno mais estável do funcionamento.",
        "<b>Efeito colateral:</b> efeito indesejado associado ao tratamento, que pode impactar rotina e adesão.",
        "<b>Impacto funcional:</b> repercussão prática dos sintomas na vida diária (sono, trabalho, vínculos e autocuidado).",
        "<b>Descompensação clínica:</b> piora relevante do quadro em relação ao padrão recente do paciente.",
        "<b>Conduta:</b> plano clínico definido pelo profissional responsável pela prescrição.",
    ]))

    story.append(PageBreak())
    story.extend(h2_block("PEÇA 2: Modelos de Mensagem por Cenário"))
    story.extend(quote_block(["Adapte sempre: substitua os campos em [colchetes] com os dados do seu paciente."]))

    # Pontos com quebra manual solicitada
    story.append(Paragraph(inline("10. Sinais de psicose inicial Atenção"), ST["h3"]))
    story.append(paragraph("Modelo médio:"))
    story.extend(quote_block([
        '"Paciente [iniciais], [idade] anos, em acompanhamento por ansiedade e isolamento. Nas últimas sessões, observo: discurso progressivamente mais vago, dificuldade de completar raciocínios, relato de sensação de estranhamento e possíveis ideias de referência. Solicito avaliação psiquiátrica urgente."'
    ]))

    story.append(PageBreak())
    story.append(Paragraph(inline("15. Paciente quer parar a medicação: momento adequado"), ST["h3"]))
    story.append(paragraph("Modelo curto:"))
    story.extend(quote_block([
        '"Paciente [iniciais] estável há [x] meses. Solicita avaliação para retirada gradual do antidepressivo. Bom suporte psicoterapêutico."'
    ]))
    story.append(paragraph("Modelo médio:"))
    story.extend(quote_block([
        '"Paciente [iniciais], em uso de [medicação] há [x] meses. Estável há [x] meses, funcional e sem recaídas. Solicito avaliação conjunta para possível desmame gradual."'
    ]))

    story.append(PageBreak())
    story.append(Paragraph(inline("20. Crise aguda em sessão"), ST["h3"]))
    story.append(paragraph("Modelo formal (documentação pós-crise):"))
    story.extend(quote_block([
        "Prezado(a) Dr(a). [nome],",
        "Registro do ocorrido em sessão de [data]:",
        "Paciente [iniciais] apresentou [descrever]. Conduta adotada: [descrever]. Estado ao fim da sessão: [descrever].",
        "Solicito alinhamento de conduta para os próximos passos.",
        "[seu nome]: [telefone]",
    ]))

    story.append(PageBreak())
    story.append(Paragraph(inline("21. Paciente resistente a buscar psiquiatra"), ST["h3"]))
    story.append(paragraph("Contexto: terapeuta percebe necessidade de avaliação psiquiátrica, mas paciente recusa ou ainda não tem psiquiatra."))
    story.extend(quote_block([
        "Observação: esta situação envolve primeiro uma conversa com o paciente.",
    ]))
    story.append(paragraph("Modelo de encaminhamento escrito para o paciente levar:"))
    story.extend(quote_block([
        "Encaminho [iniciais], [idade] anos, para avaliação psiquiátrica.",
        "Paciente em acompanhamento psicoterápico desde [data]. Apresenta [descrever quadro clínico].",
        "Agradeço contato para alinhamento de conduta.",
        "[seu nome]: [contato]",
    ]))

    story.append(PageBreak())
    story.extend(h2_block("PEÇA 3: Roteiros de Perguntas-Chave"))
    story.extend(quote_block([
        "Use estes roteiros antes de escrever ao psiquiatra. Eles ajudam a separar observação concreta, hipótese clínica e pedido objetivo."
    ]))
    story.append(Paragraph(inline("7. Possível componente clínico/orgânico"), ST["h3"]))
    story.extend(list_block([
        "Houve mudança de peso, pele, cabelo, intestino, ciclo menstrual ou libido?",
        "Há tremor, palpitação, sudorese, formigamento, fraqueza ou tontura?",
        "O cansaço parece emocional, corporal ou os dois?",
        "O quadro não responde apesar de adesão e acompanhamento adequado?",
        "O paciente tem acompanhamento médico clínico recente?",
        "Faz sentido sugerir avaliação médica sem afirmar causa?",
    ]))

    story.append(PageBreak())
    story.extend(summary_form())
    return story


if __name__ == "__main__":
    doc = make_doc(OUT)
    story = build_story()
    doc.build(story)
    print(f"PDF gerado: {OUT}")
    print(f"Tamanho: {os.path.getsize(OUT):,} bytes")
