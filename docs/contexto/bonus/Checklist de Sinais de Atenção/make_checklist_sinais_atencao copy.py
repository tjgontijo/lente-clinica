#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Checklist de Sinais de Atenção
Dra. Tatiana Gontijo  |  PDF Generator  |  v2
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.units import cm, mm
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, NextPageTemplate,
    Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable,
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

OUT = os.path.join(os.path.dirname(__file__), "checklist_sinais_atencao.pdf")
KIT_URL = "https://dratatianagontijo.com.br/checklist-sinais-atencao"

# ── Dimensões ─────────────────────────────────────────────────
W, H  = A4
ML = MR = 2.0 * cm
MT    = 2.6 * cm
MB    = 1.6 * cm
CW    = W - ML - MR

# ── Paleta ────────────────────────────────────────────────────
S50   = HexColor('#F2F8F7')
S100  = HexColor('#E0ECEB')
S200  = HexColor('#C5D9D4')
S300  = HexColor('#A3C4BC')
S500  = HexColor('#6A9088')
S600  = HexColor('#537A72')
S700  = HexColor('#3F6058')
S800  = HexColor('#2F4A44')
S900  = HexColor('#1F3530')
T400  = HexColor('#D49068')
T500  = HexColor('#C47850')
T600  = HexColor('#B06040')
INK   = HexColor('#1A2E2A')
INKL  = HexColor('#4A6660')
WHT   = HexColor('#FFFFFF')
G_BAR = HexColor('#16A34A')
G_BG  = HexColor('#F0FDF4')
Y_BAR = HexColor('#D97706')
Y_BG  = HexColor('#FFFBEB')
R_BAR = HexColor('#DC2626')
R_BG  = HexColor('#FEF2F2')
M_BAR = HexColor('#F59E0B')
PHRB  = HexColor('#FFF7F0')

# ── Estilos ───────────────────────────────────────────────────
def ps(n, font='Helvetica', sz=9.5, lead=None, c=None,
       b4=0, a4=0, al=TA_LEFT, li=0, ri=0):
    return ParagraphStyle(n, fontName=font, fontSize=sz,
        leading=lead or round(sz * 1.5), textColor=c or INK,
        spaceBefore=b4, spaceAfter=a4, alignment=al,
        leftIndent=li, rightIndent=ri)

def B(n,  **kw): return ps(n, font='Helvetica-Bold',    **kw)
def It(n, **kw): return ps(n, font='Helvetica-Oblique', **kw)

ST = {
    # Capa
    'cov_title':  B ('cov_title',  sz=25, lead=31, c=WHT,  a4=8),
    'cov_sub':    ps('cov_sub',    sz=13, lead=19, c=S200, a4=6),
    'cov_author': ps('cov_author', sz=11, lead=17, c=S300, a4=4),
    'cov_tag':    It('cov_tag',    sz=8.5, lead=13, c=S500),
    # Expediente
    'exp_h1':     B ('exp_h1',     sz=15, lead=21, c=S700, a4=8),
    'exp_h2':     B ('exp_h2',     sz=11, lead=16, c=INK, b4=6, a4=3),
    'exp_body':   ps('exp_body',   sz=10, lead=15, c=INK, a4=3),
    'exp_small':  ps('exp_small',  sz=9, lead=13, c=INKL, a4=2),
    # Abertura editorial
    'open_h1':    B ('open_h1',    sz=16, lead=22, c=S700, a4=8),
    'open_body':  ps('open_body',  sz=10.5, lead=16, c=INK, a4=6),
    'sum_item':   ps('sum_item',   sz=10.5, lead=16, c=INK, a4=2),
    'toc_head':   ps('toc_head',   'Helvetica-Bold', 8.5, 12, INKL),
    'toc_sec':    ps('toc_sec',    'Helvetica-Bold', 10, 14, INK),
    'toc_sub':    ps('toc_sub',    'Helvetica', 9.5, 13, INK),
    'toc_page':   ps('toc_page',   'Helvetica-Bold', 10, 14, INK, al=TA_RIGHT),
    # Intro
    'pg_h1':      B ('pg_h1',   sz=14, lead=20, c=S700, a4=8),
    'pg_note':    It('pg_note', sz=9.5, lead=14, c=INKL, li=12, a4=8),
    'intro':      ps('intro',   sz=10, lead=15.5, c=INK, a4=6),
    'intro_dest': B ('intro_dest', sz=10, lead=15.5, c=S700, a4=6),
    # Cabeçalho de bloco
    'blk_hdr':    B ('blk_hdr', sz=11.5, lead=16, c=WHT),
    # Card de sinal
    'sig_h':      B ('sig_h',   sz=10.5, lead=15, c=INK, a4=4),
    'sig_lbl':    B ('sig_lbl', sz=8,    lead=11, c=INKL, b4=5, a4=2),
    'sig_body':   ps('sig_body', sz=9.5, lead=14, c=INK),
    'sig_q':      It('sig_q',   sz=9.5, lead=14, c=INK, li=8),
    'sig_act':    B ('sig_act', sz=9,    lead=13, c=INK, b4=5),
    # Card de frase
    'phr_lbl':    B ('phr_lbl', sz=8.5, lead=12, c=INKL, a4=3),
    'phr_txt':    It('phr_txt', sz=10,  lead=15, c=S700, li=8),
    # Comunicação
    'comm_h':     B ('comm_h',  sz=12,  lead=18, c=S700, b4=4, a4=6),
    'comm_body':  ps('comm_body', sz=9.5, lead=14, c=INK, a4=4),
    'comm_step':  ps('comm_step', sz=9.5, lead=14, c=INK, li=20, a4=3),
    'comm_ex':    It('comm_ex', sz=9, lead=14, c=S700, li=20, ri=20, b4=6, a4=6),
    # Resumo
    'sum_h':      B ('sum_h',   sz=13, lead=18, c=S700, a4=10),
    'sum_th':     B ('sum_th',  sz=8.5, lead=12, c=WHT),
    'sum_td':     ps('sum_td',  sz=8.5, lead=12, c=INK),
    'sum_note':   It('sum_note', sz=8, lead=12, c=INKL, b4=8, al=TA_CENTER),
    # CTA final
    'cta_h':      B ('cta_h',   sz=16, lead=22, c=S700, al=TA_CENTER, a4=8),
    'cta_body':   ps('cta_body', sz=10.5, lead=16, c=INK, al=TA_CENTER, a4=6),
    'cta_btn':    B ('cta_btn', sz=10.5, lead=14, c=WHT, al=TA_CENTER),
    'cta_qr':     ps('cta_qr',  sz=9, lead=13, c=INKL, al=TA_CENTER, a4=4),
    # Legenda
    'leg_g':      B ('leg_g',   sz=9, c=G_BAR),
    'leg_y':      B ('leg_y',   sz=9, c=Y_BAR),
    'leg_r':      B ('leg_r',   sz=9, c=R_BAR),
    'leg_td':     ps('leg_td',  sz=9, lead=13, c=INK),
}

# ── Canvas callbacks ──────────────────────────────────────────
def draw_cover(c, doc):
    c.saveState()
    c.setFillColor(S900)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(S800)
    c.circle(W * 0.87, H * 0.80, 88, fill=1, stroke=0)
    c.setFillColor(HexColor('#253D36'))
    c.circle(W * 0.82, H * 0.72, 50, fill=1, stroke=0)
    c.setFillColor(S800)
    c.circle(W * 0.13, H * 0.20, 40, fill=1, stroke=0)
    c.setFillColor(T600)
    c.rect(0, H - 5*mm, W, 5*mm, fill=1, stroke=0)
    c.setFillColor(S800)
    c.rect(0, 0, W, 2.8*cm, fill=1, stroke=0)
    c.setFillColor(T500)
    c.circle(ML + 7*mm, 1.4*cm, 3.5, fill=1, stroke=0)
    c.setFont('Helvetica', 7.5)
    c.setFillColor(S300)
    c.drawString(ML + 16*mm, 1.15*cm, 'Uso exclusivo para fins educativos')
    c.setFont('Helvetica-Bold', 7.5)
    c.setFillColor(T400)
    c.drawRightString(W - MR, 1.15*cm, 'Dra. Tatiana Gontijo')
    c.restoreState()

def draw_page(c, doc):
    c.saveState()
    c.setFillColor(S700)
    c.rect(ML, H - MT + 5, CW, 2, fill=1, stroke=0)
    c.setFont('Helvetica-Bold', 7.5)
    c.setFillColor(S700)
    c.drawString(ML, H - MT + 10, 'CHECKLIST DE SINAIS DE ATEN\xc7\xc3O')
    c.setFont('Helvetica', 7.5)
    c.setFillColor(S500)
    c.drawRightString(ML + CW, H - MT + 10, 'Dra. Tatiana Gontijo')
    c.setFillColor(S200)
    c.rect(ML, MB - 5, CW, 1, fill=1, stroke=0)
    c.setFont('Helvetica', 7.5)
    c.setFillColor(S500)
    c.drawCentredString(W / 2, MB - 17, 'Checklist de Sinais de Atenção')
    c.setFont('Helvetica-Bold', 7.5)
    c.setFillColor(S600)
    c.drawRightString(ML + CW, MB - 17, str(doc.page))
    c.restoreState()

# ── Setup do documento ────────────────────────────────────────
def make_doc(path):
    doc = BaseDocTemplate(path, pagesize=A4,
        leftMargin=ML, rightMargin=MR,
        topMargin=MT, bottomMargin=MB)
    f = Frame(ML, MB, CW, H - MT - MB, id='f')
    doc.addPageTemplates([
        PageTemplate(id='Cover',   frames=[f], onPage=draw_cover),
        PageTemplate(id='Content', frames=[f], onPage=draw_page),
    ])
    return doc

# ── Helpers de layout ─────────────────────────────────────────
def block_header(num, title):
    t = Table([[Paragraph(f'SEÇÃO {num}: {title}', ST['blk_hdr'])]], colWidths=[CW])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), S700),
        ('LEFTPADDING',   (0,0), (-1,-1), 14),
        ('RIGHTPADDING',  (0,0), (-1,-1), 14),
        ('TOPPADDING',    (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    return [Spacer(1, 5*mm), t, Spacer(1, 4*mm)]

LEVELS = {
    'yellow': (Y_BAR, Y_BG),
    'red':    (R_BAR, R_BG),
    'green':  (G_BAR, G_BG),
    'mixed':  (M_BAR, Y_BG),
}

def signal_card(level, title, body, question, action):
    bar_c, bg_c = LEVELS.get(level, (Y_BAR, Y_BG))
    bw = 5 * mm
    cw = CW - bw

    inner = Table([
        [Paragraph(title, ST['sig_h'])],
        [Paragraph('<b>O que parece na sess\xe3o:</b> ' + body, ST['sig_body'])],
        [Paragraph('Pergunta-chave:', ST['sig_lbl'])],
        [Paragraph('“' + question + '”', ST['sig_q'])],
        [Paragraph(action, ST['sig_act'])],
    ], colWidths=[cw - 24])
    inner.setStyle(TableStyle([
        ('LEFTPADDING',   (0,0), (-1,-1), 0),
        ('RIGHTPADDING',  (0,0), (-1,-1), 0),
        ('TOPPADDING',    (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))

    card = Table([[' ', inner]], colWidths=[bw, cw])
    card.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (0,0), bar_c),
        ('BACKGROUND',    (1,0), (1,0), bg_c),
        ('VALIGN',        (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING',   (0,0), (0,0), 0),
        ('RIGHTPADDING',  (0,0), (0,0), 0),
        ('TOPPADDING',    (0,0), (0,0), 0),
        ('BOTTOMPADDING', (0,0), (0,0), 0),
        ('LEFTPADDING',   (1,0), (1,0), 12),
        ('RIGHTPADDING',  (1,0), (1,0), 12),
        ('TOPPADDING',    (1,0), (1,0), 10),
        ('BOTTOMPADDING', (1,0), (1,0), 10),
    ]))
    return KeepTogether([card, Spacer(1, 3*mm)])


def level_cell(text, color):
    return Paragraph(f'<b>{text}</b>',
        ParagraphStyle('lc', fontName='Helvetica-Bold', fontSize=8,
                       leading=11, textColor=color))

def summary_table():
    rows_data = [
        ('Idea\xe7\xe3o passiva (sem plano)',              'Amarelo',  Y_BAR, Y_BG, 'Rastrear toda sess\xe3o; comunicar se persistir'),
        ('Idea\xe7\xe3o com plano ou inten\xe7\xe3o',     'Vermelho', R_BAR, R_BG, 'N\xe3o deixar sair sozinho. Acionar agora'),
        ('Piora r\xe1pida sem causa clara',                'Amarelo',  Y_BAR, Y_BG, 'Investigar, comunicar ao psiquiatra'),
        ('Redu\xe7\xe3o de sono sem cansa\xe7o',          'A / V',    M_BAR, Y_BG, 'Investigar ativa\xe7\xe3o man\xedaca'),
        ('Agita\xe7\xe3o + impulsividade intensa',        'A / V',    M_BAR, Y_BG, 'Comunicar ao psiquiatra'),
        ('Desorganiza\xe7\xe3o do pensamento',            'Vermelho', R_BAR, R_BG, 'Comunicar. N\xe3o esperar'),
        ('Del\xedrio / estranhamento da realidade',       'Vermelho', R_BAR, R_BG, 'Acionar. N\xe3o confrontar conte\xfado'),
        ('Autoles\xe3o crescente',                        'A / V',    M_BAR, Y_BG, 'Comunicar ao psiquiatra'),
        ('Dissocia\xe7\xe3o frequente',                   'Amarelo',  Y_BAR, Y_BG, 'Investigar trauma. Comunicar se intenso'),
        ('Acatisia',                                      'Amarelo',  Y_BAR, Y_BG, 'Comunicar com urg\xeancia: risco de idea\xe7\xe3o'),
        ('Seda\xe7\xe3o excessiva',                       'Amarelo',  Y_BAR, Y_BG, 'Comunicar ao psiquiatra'),
        ('Embotamento emocional',                         'Amarelo',  Y_BAR, Y_BG, 'Comunicar: pode pedir reavaliação'),
        ('S\xedndrome de descontinua\xe7\xe3o',           'A / V',    M_BAR, Y_BG, 'Retorno ao psiquiatra urgente'),
        ('Depend\xeancia de benzodiazep\xednicos',        'Amarelo',  Y_BAR, Y_BG, 'N\xe3o orientar parada abrupta. Comunicar'),
        ('Disfun\xe7\xe3o sexual',                        'Amarelo',  Y_BAR, Y_BG, 'Comunicar: principal causa de abandono silencioso'),
        ('Virada man\xedaca por antidepressivo',          'Vermelho', R_BAR, R_BG, 'Comunicar com urg\xeancia'),
        ('Baixa ades\xe3o suspeita',                      'Amarelo',  Y_BAR, Y_BG, 'Abrir sem julgamento, registrar, comunicar se persistir'),
        ('Subst\xe2ncias interferindo no tratamento',     'Amarelo',  Y_BAR, Y_BG, 'Abrir sem julgamento, comunicar com autoriza\xe7\xe3o'),
        ('S\xedndrome serotoninerg\xedca',                'Vermelho', R_BAR, R_BG, 'Emerg\xeancia: acionar PS imediatamente'),
        ('Fadiga + cabelo + intestino lento',             'Amarelo',  Y_BAR, Y_BG, 'Orientar avaliação médica para investigar tireoide'),
        ('Esquecimento + formigamento + apatia',          'Amarelo',  Y_BAR, Y_BG, 'Orientar avaliação médica para investigar B12/outras causas'),
        ('Perda de peso + restri\xe7\xe3o alimentar',     'A / V',    M_BAR, Y_BG, 'Avalia\xe7\xe3o cl\xednica urgente se sinais f\xedsicos'),
        ('Corpo acelerado sem conte\xfado ansioso',       'Amarelo',  Y_BAR, Y_BG, 'Orientar avaliação médica para investigar tireoide'),
        ('Quadro que n\xe3o responde ao tratamento',      'Amarelo',  Y_BAR, Y_BG, 'Investigar causa org\xe2nica'),
    ]

    cw1, cw2, cw3 = CW * 0.40, CW * 0.13, CW * 0.47
    header = [
        Paragraph('Sinal', ST['sum_th']),
        Paragraph('N\xedvel', ST['sum_th']),
        Paragraph('A\xe7\xe3o imediata', ST['sum_th']),
    ]
    data = [header]
    row_styles = [
        ('BACKGROUND',    (0,0), (-1,0), S700),
        ('LEFTPADDING',   (0,0), (-1,-1), 8),
        ('RIGHTPADDING',  (0,0), (-1,-1), 8),
        ('TOPPADDING',    (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('VALIGN',        (0,0), (-1,-1), 'MIDDLE'),
        ('GRID',          (0,0), (-1,-1), 0.4, S200),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHT, S50]),
    ]

    for i, (sig, lvl_txt, lvl_c, lvl_bg, act) in enumerate(rows_data):
        r = i + 1
        data.append([
            Paragraph(sig, ST['sum_td']),
            level_cell(lvl_txt, lvl_c),
            Paragraph(act, ST['sum_td']),
        ])
        row_styles.append(('BACKGROUND', (1, r), (1, r), lvl_bg))

    t = Table(data, colWidths=[cw1, cw2, cw3])
    t.setStyle(TableStyle(row_styles))
    return t


def make_toc_table():
    rows = []
    rows.append([
        Paragraph('ABERTURA', ST['toc_head']),
        Paragraph('', ST['toc_head']),
        Paragraph('', ST['toc_head']),
    ])
    rows.extend([
        [Paragraph('Introdução', ST['toc_sec']), Paragraph('', ST['toc_sub']), Paragraph('4', ST['toc_page'])],
        [Paragraph('Como usar este checklist', ST['toc_sec']), Paragraph('', ST['toc_sub']), Paragraph('5', ST['toc_page'])],
    ])
    rows.append([Paragraph('CONTEÚDO CLÍNICO', ST['toc_head']), Paragraph('', ST['toc_head']), Paragraph('', ST['toc_head'])])
    rows.extend([
        [Paragraph('Seção 1', ST['toc_sec']), Paragraph('Sinais Psiquiátricos', ST['toc_sub']), Paragraph('6', ST['toc_page'])],
        [Paragraph('Seção 2', ST['toc_sec']), Paragraph('Sinais Medicamentosos', ST['toc_sub']), Paragraph('8', ST['toc_page'])],
        [Paragraph('Seção 3', ST['toc_sec']), Paragraph('Sinais Clínicos / Orgânicos', ST['toc_sub']), Paragraph('11', ST['toc_page'])],
        [Paragraph('Seção 4', ST['toc_sec']), Paragraph('Frases de Apoio para Momentos Críticos', ST['toc_sub']), Paragraph('13', ST['toc_page'])],
        [Paragraph('Comunicação com o psiquiatra', ST['toc_sec']), Paragraph('', ST['toc_sub']), Paragraph('14', ST['toc_page'])],
        [Paragraph('Versão Resumida', ST['toc_sec']), Paragraph('Referência Rápida', ST['toc_sub']), Paragraph('15', ST['toc_page'])],
    ])
    table = Table(rows, colWidths=[35 * mm, CW - 55 * mm, 20 * mm])
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LINEBELOW', (0, 0), (-1, 0), 0.3, S200),
        ('LINEBELOW', (0, 3), (-1, 3), 0.3, S200),
        ('LINEBELOW', (0, -1), (-1, -1), 0.3, S200),
    ]))
    return table


def qr_draw(url, size=34 * mm):
    qrw = qr.QrCodeWidget(url)
    b = qrw.getBounds()
    w = b[2] - b[0]
    h = b[3] - b[1]
    d = Drawing(size, size, transform=[size / w, 0, 0, size / h, 0, 0])
    d.add(qrw)
    return d


def phrase_card(label, text):
    bw = 4 * mm
    cw = CW - bw
    inner = Table([
        [Paragraph(label, ST['phr_lbl'])],
        [Paragraph('“' + text + '”', ST['phr_txt'])],
    ], colWidths=[cw - 24])
    inner.setStyle(TableStyle([
        ('LEFTPADDING',   (0,0), (-1,-1), 0),
        ('RIGHTPADDING',  (0,0), (-1,-1), 0),
        ('TOPPADDING',    (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    card = Table([[' ', inner]], colWidths=[bw, cw])
    card.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (0,0), T500),
        ('BACKGROUND',    (1,0), (1,0), PHRB),
        ('VALIGN',        (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING',   (0,0), (0,0), 0),
        ('RIGHTPADDING',  (0,0), (0,0), 0),
        ('TOPPADDING',    (0,0), (0,0), 0),
        ('BOTTOMPADDING', (0,0), (0,0), 0),
        ('LEFTPADDING',   (1,0), (1,0), 12),
        ('RIGHTPADDING',  (1,0), (1,0), 12),
        ('TOPPADDING',    (1,0), (1,0), 8),
        ('BOTTOMPADDING', (1,0), (1,0), 8),
    ]))
    return KeepTogether([card, Spacer(1, 2.5*mm)])


def compact_cta(url):
    txt = [
        Paragraph('Aprofunde a comunicação com o médico assistente com o Kit de Comunicação Clínica.',
                  ps('cta_inline_b', sz=8.8, lead=12, c=INK, a4=3)),
        Paragraph(f'<link href="{url}" color="#2F4A44"><u><b>Clique aqui e conheça</b></u></link>',
                  ps('cta_link', sz=9, lead=12.5, c=S700, a4=0)),
    ]
    left = Table([[x] for x in txt], colWidths=[CW - 26 * mm])
    left.setStyle(TableStyle([
        ('LEFTPADDING',   (0,0), (-1,-1), 0),
        ('RIGHTPADDING',  (0,0), (-1,-1), 8),
        ('TOPPADDING',    (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))

    qr_block = Table([
        [qr_draw(url, size=14 * mm)],
    ], colWidths=[22 * mm])
    qr_block.setStyle(TableStyle([
        ('LEFTPADDING',   (0,0), (-1,-1), 4),
        ('RIGHTPADDING',  (0,0), (-1,-1), 4),
        ('TOPPADDING',    (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('ALIGN',         (0,0), (-1,-1), 'CENTER'),
    ]))

    wrap = Table([[left, qr_block]], colWidths=[CW - 22 * mm, 22 * mm])
    wrap.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), S50),
        ('BOX',           (0,0), (-1,-1), 0.4, S200),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
        ('TOPPADDING',    (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('VALIGN',        (0,0), (0,0), 'MIDDLE'),
        ('VALIGN',        (1,0), (1,0), 'MIDDLE'),
    ]))
    return wrap


# ── Construção da história ────────────────────────────────────
def build_story():
    s = []

    # ── CAPA ─────────────────────────────────────────────────
    s.append(Spacer(1, 7.5 * cm))
    s.append(Paragraph('Checklist de<br/>Sinais de Aten\xe7\xe3o', ST['cov_title']))
    s.append(HRFlowable(width=5.5*cm, color=T600, thickness=2.5,
                        spaceAfter=10, spaceBefore=4))
    s.append(Paragraph('Ferramenta de apoio \xe0 decis\xe3o cl\xednica', ST['cov_sub']))
    s.append(Spacer(1, 3*mm))
    s.append(Paragraph('Dra. Tatiana Gontijo', ST['cov_author']))
    s.append(Spacer(1, 5.5 * cm))
    s.append(Paragraph(
        'Este material n\xe3o substitui julgamento cl\xednico individualizado.',
        ST['cov_tag']))

    s.append(NextPageTemplate('Content'))
    s.append(PageBreak())

    # ── EXPEDIENTE / ISBN ───────────────────────────────────
    s.append(Paragraph('Expediente', ST['exp_h1']))
    s.append(Paragraph('Checklist de Sinais de  Aten\xe7\xe3o', ST['exp_body']))
    s.append(Paragraph('Dra. Tatiana Gontijo', ST['exp_body']))
    s.append(Spacer(1, 4*mm))
    s.append(Paragraph('Todos os direitos reservados.', ST['exp_body']))
    s.append(Paragraph(
        'É permitida a reprodução parcial deste material apenas com citação da fonte.',
        ST['exp_body']))
    s.append(Spacer(1, 4*mm))
    s.append(Paragraph('ISBN digital: [a definir]', ST['exp_body']))
    s.append(Paragraph('Edição: 1ª edição', ST['exp_body']))
    s.append(Paragraph('Ano: 2026', ST['exp_body']))
    s.append(Paragraph('Publicado no Brasil', ST['exp_body']))
    s.append(Spacer(1, 4*mm))
    s.append(Paragraph('Edição e distribuição', ST['exp_h2']))
    s.append(Paragraph('[Nome editorial / selo]', ST['exp_body']))
    s.append(Paragraph('Contato: https://dratatianagontijo.com.br', ST['exp_body']))
    s.append(Spacer(1, 4*mm))
    s.append(Paragraph('Equipe técnica', ST['exp_h2']))
    s.append(Paragraph('Autoria: Tatiana Paranhos de Campos Gontijo', ST['exp_body']))    
    s.append(Paragraph('Diagramação: Thiago José Gontijo Cardoso', ST['exp_body']))
    s.append(PageBreak())

    # ── SUMÁRIO ──────────────────────────────────────────────
    s.append(Paragraph('Sumário', ST['open_h1']))
    s.append(Spacer(1, 2*mm))
    s.append(make_toc_table())
    s.append(PageBreak())

    # ── INTRODUÇÃO ───────────────────────────────────────────
    s.append(Paragraph('Introdução', ST['open_h1']))
    s.append(Paragraph(
        'Você percebe algo diferente no paciente. A sessão andou, o vínculo está ali, '
        'mas tem algo que não fecha. Pode ser a forma como ele chegou hoje: mais apagado, '
        'mais acelerado, mais distante. Pode ser uma fala que ficou na memória: "estou '
        'estranho", "não sei o que mudou", "estou tomando o remédio, mas não está '
        'funcionando". Você não ignora. Mas também não sabe exatamente o que nomear.',
        ST['open_body']))
    s.append(Paragraph(
        'Este checklist foi criado para esse momento. Não para transformar o terapeuta '
        'em psiquiatra, e sim para dar forma ao que ele já percebe. Cada sinal descrito '
        'aqui representa uma situação clínica que pode aparecer na sessão e que merece '
        'atenção objetiva: uma pergunta mais precisa, um registro mais cuidadoso, ou uma '
        'comunicação com o médico responsável.',
        ST['open_body']))
    s.append(Paragraph(
        'Na minha prática clínica, no pronto-socorro, na clínica psiquiátrica e no '
        'consultório, aprendi que o terapeuta frequentemente percebe sinais antes de '
        'qualquer outro profissional da equipe. Ele tem o que ninguém mais tem: '
        'continuidade. Vê o paciente toda semana, conhece sua linha de base, nota quando '
        'algo mudou. O problema raramente é falta de sensibilidade clínica. É falta de '
        'um roteiro que ajude a organizar o que já se percebe.',
        ST['open_body']))
    s.append(Paragraph(
        'O material está organizado em quatro blocos: sinais psiquiátricos, '
        'medicamentosos, clínicos e orgânicos, seguidos de frases de apoio para momentos '
        'críticos e um roteiro de comunicação com o psiquiatra. Cada sinal é apresentado '
        'com o que ele pode parecer na sessão, uma pergunta-chave para investigação e uma '
        'orientação de conduta. A versão resumida ao final pode ser mantida no consultório '
        'como referência de acesso rápido.',
        ST['open_body']))
    s.append(Paragraph(
        'O que este checklist faz — e o que foi pensado para fazer — é organizar a observação, '
        'para que o próximo passo seja tomado com mais clareza e menos hesitação.',
        ST['open_body']))
    s.append(Spacer(1, 4*mm))
    s.append(Paragraph(
        '<i>Dra. Tatiana Gontijo</i>',
        ps('intro_assinatura', sz=10, lead=14, c=S600, al=TA_RIGHT, a4=0)))
    s.append(PageBreak())

    # ── COMO USAR ────────────────────────────────────────────
    s.append(Paragraph('Como usar este checklist', ST['pg_h1']))
    s.append(Paragraph(
        'Este material n\xe3o substitui o julgamento cl\xednico. Ele organiza o que '
        'voc\xea j\xe1 percebe na sess\xe3o e te ajuda a decidir o pr\xf3ximo passo '
        'com mais clareza.', ST['intro']))
    s.append(Paragraph(
        'Este checklist reúne sinais que já merecem atenção clínica. Por isso, ele '
        'não usa uma categoria neutra de acompanhamento: se o sinal entrou aqui, '
        'a pergunta é qual é o grau de urgência.', ST['intro']))
    s.append(Paragraph(
        '<b>Regra pr\xe1tica:</b> na d\xfavida entre duas cores, use a mais intensa. '
        'Errar para o lado da cautela protege o paciente.', ST['intro']))
    s.append(Paragraph(
        '<b>Sistema de atenção por cores:</b> Amarelo = alinhar com o psiquiatra em '
        'breve (em dias, não semanas). Vermelho = agir hoje (acionar psiquiatra, rede '
        'de apoio e emergência quando necessário).', ST['intro']))
    s.append(Paragraph(
        '<b>Fique mais atento nos seguintes contextos:</b> in\xedcio de medica\xe7\xe3o, '
        'troca ou ajuste de dose, e suspens\xe3o recente de qualquer medicamento.',
        ST['intro']))
    s.append(Paragraph(
        '<b>Nota ética:</b> quando houver necessidade de compartilhar informações '
        'com psiquiatra, familiar ou serviço de urgência, compartilhe apenas o necessário '
        'para proteger o paciente e sustentar a conduta.', ST['intro']))
    s.append(Spacer(1, 6*mm))
    s.append(PageBreak())

    # ── BLOCO 1 ───────────────────────────────────────────────
    for el in block_header(1, 'Sinais Psiqui\xe1tricos'):
        s.append(el)

    s.append(signal_card('yellow',
        'Idea\xe7\xe3o suicida passiva',
        'Paciente diz “seria melhor se eu n\xe3o acordasse”, “\xe0s vezes penso que '
        'seria mais f\xe1cil n\xe3o estar aqui”, “n\xe3o sei se vale a pena continuar”. '
        'N\xe3o h\xe1 plano, mas h\xe1 desejo de desaparecimento.',
        'Quando voc\xea diz isso, voc\xea est\xe1 pensando em fazer alguma coisa ou \xe9 '
        'mais uma sensa\xe7\xe3o de querer sumir?',
        'A\xe7\xe3o Amarelo: Registrar. Rastrear em toda sess\xe3o. Comunicar ao '
        'psiquiatra se persistir ou intensificar.'))

    s.append(signal_card('red',
        'Idea\xe7\xe3o suicida com plano',
        'Paciente menciona m\xe9todo (“eu sei que tenho rem\xe9dio em casa”), data, '
        'inten\xe7\xe3o clara. Ou diz que j\xe1 decidiu.',
        'Voc\xea pensou em como faria? Tem acesso a algum meio agora?',
        'A\xe7\xe3o Vermelho: N\xe3o deixar o paciente sair sozinho. Acionar psiquiatra '
        'imediatamente. Se n\xe3o houver contato direto: familiar + SAMU se necess\xe1rio.'))

    s.append(signal_card('yellow',
        'Piora r\xe1pida e inexplica\xedvel',
        'Paciente que estava est\xe1vel chega visivelmente diferente: mais '
        'retra\xeddo, mais vazio, mais agitado: sem evento precipitante claro.',
        'Algo mudou na medica\xe7\xe3o recentemente? Teve algum acontecimento que te abalou?',
        'A\xe7\xe3o Amarelo: Investigar causa. Checar ades\xe3o medicamentosa. Comunicar '
        'ao psiquiatra se sem explica\xe7\xe3o clara.'))

    s.append(signal_card('mixed',
        'Redu\xe7\xe3o de sono sem cansa\xe7o',
        'Paciente relata dormir 3 a 4 horas e acordar com energia. N\xe3o sofre '
        'pela falta de sono: sente que n\xe3o precisa dormir.',
        'Voc\xea est\xe1 dormindo menos porque n\xe3o consegue ou porque n\xe3o sente '
        'necessidade? No dia seguinte, como est\xe1 sua energia?',
        'A\xe7\xe3o Amarelo: se epis\xf3dio recente sem outros sinais. '
        'A\xe7\xe3o Vermelho: se acompanhado de agita\xe7\xe3o, gastos impulsivos ou '
        'desorganiza\xe7\xe3o: pode indicar virada man\xedaca.'))

    s.append(signal_card('mixed',
        'Agita\xe7\xe3o intensa e impulsividade',
        'Paciente mais acelerado que o habitual, interrompe, muda de assunto, '
        'relata decis\xf5es impulsivas (gastos, conflitos, relacionamentos), '
        'sente que est\xe1 “em outro n\xedvel”.',
        'Isso \xe9 seu jeito normal ou voc\xea est\xe1 diferente do que costuma ser?',
        'A\xe7\xe3o Amarelo: se isolado e leve. '
        'A\xe7\xe3o Vermelho: se associado a redu\xe7\xe3o de sono, euforia ou consequ\xeancias '
        'concretas: comunicar ao psiquiatra com urg\xeancia.'))

    s.append(signal_card('red',
        'Desorganiza\xe7\xe3o do pensamento',
        'Discurso vago, perde o fio no meio da frase, responde tangencialmente, '
        'n\xe3o termina ideias. Mudan\xe7a percept\xedvel em rela\xe7\xe3o a sess\xf5es anteriores.',
        'Voc\xea est\xe1 conseguindo organizar seus pensamentos normalmente?',
        'A\xe7\xe3o Vermelho: Comunicar ao psiquiatra. Psicose em in\xedcio tem janela '
        'de interven\xe7\xe3o: n\xe3o esperar.'))

    s.append(signal_card('red',
        'Del\xedrios, paranoia, estranhamento da realidade',
        'Paciente relata que “as coisas est\xe3o diferentes”, sensa\xe7\xe3o de que '
        'algo acontece “por tr\xe1s” das situa\xe7\xf5es, que pessoas falam sobre ele, '
        'que eventos t\xeam significado especial. Ou verbaliza cren\xe7as '
        'desconectadas da realidade.',
        'Quando voc\xea diz que as coisas est\xe3o estranhas, voc\xea consegue explicar '
        'melhor? \xc9 uma sensa\xe7\xe3o interna ou o ambiente parece diferente?',
        'A\xe7\xe3o Vermelho: N\xe3o confrontar o conte\xfado. Acionar psiquiatra. '
        'Monitorar seguran\xe7a.'))

    s.append(signal_card('mixed',
        'Autoles\xe3o',
        'Paciente menciona ou voc\xea percebe marcas em bra\xe7os, pernas. Relata '
        'que se machuca para “sentir algo” ou “aliviar” uma ang\xfastia.',
        'Voc\xea tem se machucado? Com que frequ\xeancia? Est\xe1 aumentando?',
        'A\xe7\xe3o Amarelo: se hist\xf3rico pr\xe9vio sem agravamento atual. '
        'A\xe7\xe3o Vermelho: se novo, crescente ou com intensidade importante '
        ': comunicar ao psiquiatra.'))

    s.append(signal_card('yellow',
        'Dissocia\xe7\xe3o intensa',
        'Paciente relata momentos de “sair do corpo”, n\xe3o se reconhecer no '
        'espelho, sentir que est\xe1 num sonho, lacunas de mem\xf3ria. Pode surgir '
        'ao abordar temas de trauma.',
        'Quando isso acontece, voc\xea sabe onde est\xe1? Consegue me dizer quanto '
        'tempo dura?',
        'A\xe7\xe3o Amarelo: Investigar trauma. N\xe3o aprofundar conte\xfado traum\xe1tico '
        'sem manejo adequado. Comunicar ao psiquiatra se frequente ou intenso.'))

    # ── BLOCO 2 ───────────────────────────────────────────────
    s.append(PageBreak())
    for el in block_header(2, 'Sinais Medicamentosos'):
        s.append(el)

    s.append(signal_card('yellow',
        'Acatisia',
        'Paciente diz que “n\xe3o consegue ficar parado”, anda pela sala, levanta '
        'e senta, descreve inquieta\xe7\xe3o corporal interna. Come\xe7ou ap\xf3s in\xedcio '
        'ou ajuste de medica\xe7\xe3o.',
        'Essa sensa\xe7\xe3o \xe9 mais de preocupa\xe7\xe3o ou de inquieta\xe7\xe3o no corpo? '
        'Come\xe7ou antes ou depois da medica\xe7\xe3o?',
        'A\xe7\xe3o Amarelo: Nomear a hip\xf3tese para o paciente. Comunicar ao '
        'psiquiatra com urg\xeancia: acatisia pode aumentar risco de idea\xe7\xe3o '
        'suicida.'))

    s.append(signal_card('yellow',
        'Seda\xe7\xe3o intensa',
        'Paciente relata dormir demais, dificuldade de acordar, “cabe\xe7a pesada” '
        'durante o dia, preju\xedzo no trabalho ou nas rela\xe7\xf5es. Iniciou ou '
        'piorou com mudan\xe7a medicamentosa.',
        'Isso come\xe7ou quando? Tem rela\xe7\xe3o com alguma mudan\xe7a no rem\xe9dio ou '
        'na dose?',
        'A\xe7\xe3o Amarelo: Registrar e comunicar ao psiquiatra. Seda\xe7\xe3o excessiva '
        'compromete ades\xe3o.'))

    s.append(signal_card('yellow',
        'Embotamento emocional',
        'Paciente diz “n\xe3o estou triste, mas tamb\xe9m n\xe3o sinto nada”. Aus\xeancia '
        'de reatividade emocional. A terapia trava: concorda com tudo, mas '
        'nada avan\xe7a. Iniciou ap\xf3s medica\xe7\xe3o ou ajuste de dose.',
        'Voc\xea est\xe1 melhor ou est\xe1 diferente? A tristeza passou ou todas as '
        'emo\xe7\xf5es ficaram mais baixas?',
        'Ação Amarelo: Comunicar ao psiquiatra: pode indicar necessidade '
        'de reavaliação da conduta.'))

    s.append(signal_card('mixed',
        'S\xedndrome de descontinua\xe7\xe3o',
        'Paciente relata tontura, “choquinhos” no corpo (brain zaps), n\xe1usea, '
        'irritabilidade, instabilidade. Iniciou dias ap\xf3s parar ou reduzir '
        'medica\xe7\xe3o por conta pr\xf3pria.',
        'Voc\xea mudou ou parou algum rem\xe9dio recentemente? H\xe1 quanto tempo est\xe1 '
        'sentindo isso?',
        'A\xe7\xe3o Amarelo: se sintomas leves. '
        'A\xe7\xe3o Vermelho: se intensos ou com risco de descompensa\xe7\xe3o: '
        'orientar retorno ao psiquiatra o quanto antes.'))

    s.append(signal_card('yellow',
        'Sinais de depend\xeancia de benzodiazep\xednicos',
        'Paciente usa benzo diariamente h\xe1 mais de 4 semanas. Relata que sem '
        'o rem\xe9dio n\xe3o dorme ou fica muito ansioso. J\xe1 precisou aumentar a '
        'dose para ter o mesmo efeito.',
        'O que acontece quando voc\xea n\xe3o toma? Esses sintomas aparecem r\xe1pido '
        'e somem quando voc\xea toma?',
        'A\xe7\xe3o Amarelo: Abrir conversa sem julgamento. Comunicar ao psiquiatra '
        ': retirada precisa ser gradual e supervisionada.'))

    s.append(signal_card('yellow',
        'Efeitos extrapiramidais',
        'Paciente em uso de antipsicotico relata rigidez muscular, tremor, '
        'movimentos involunt\xe1rios, postura diferente, dificuldade de se mover '
        'normalmente.',
        'Voc\xea notou alguma mudan\xe7a no seu corpo desde que come\xe7ou esse rem\xe9dio? '
        'Rigidez, tremor, dificuldade de se mover?',
        'A\xe7\xe3o Amarelo: Comunicar ao psiquiatra para avalia\xe7\xe3o e poss\xedvel ajuste.'))

    s.append(signal_card('yellow',
        'Galactorreia / hiperprolactinemia',
        'Paciente (homem ou mulher) em uso de antipsicotico relata secre\xe7\xe3o '
        'mam\xe1ria, altera\xe7\xe3o de libido ou, em mulheres, irregularidade menstrual.',
        'Voc\xea notou algo diferente no seu corpo desde que come\xe7ou essa '
        'medica\xe7\xe3o? \xc0s vezes esses rem\xe9dios podem causar altera\xe7\xf5es hormonais.',
        'A\xe7\xe3o Amarelo: Comunicar ao psiquiatra. Paciente pode n\xe3o relatar '
        'espontaneamente por vergonha.'))

    s.append(signal_card('yellow',
        'Ganho de peso r\xe1pido e importante',
        'Paciente relata ganho significativo de peso sem mudan\xe7a de h\xe1bitos. '
        'Comum com alguns antipsicoticos e estabilizadores de humor.',
        'Voc\xea notou mudan\xe7a no peso desde que come\xe7ou ou ajustou a medica\xe7\xe3o?',
        'A\xe7\xe3o Amarelo: Registrar. Comunicar ao psiquiatra: impacta '
        'ades\xe3o e sa\xfade metab\xf3lica.'))

    s.append(signal_card('yellow',
        'Disfun\xe7\xe3o sexual com risco de abandono',
        'Paciente relata perda de desejo, dificuldade de excita\xe7\xe3o ou orgasmo '
        'desde o in\xedcio da medica\xe7\xe3o. Pode estar considerando parar o rem\xe9dio.',
        'Voc\xea notou alguma mudan\xe7a na sua vida sexual depois que come\xe7ou a '
        'medica\xe7\xe3o?',
        'A\xe7\xe3o Amarelo: Comunicar ao psiquiatra com urg\xeancia: \xe9 a '
        'principal causa de abandono silencioso de antidepressivos.'))

    s.append(signal_card('red',
        'Virada man\xedaca por antidepressivo',
        'Paciente em uso de antidepressivo apresenta mudan\xe7a abrupta: mais '
        'acelerado, euf\xf3rico, com redu\xe7\xe3o de sono sem cansa\xe7o, impulsividade '
        'e sensa\xe7\xe3o de estar “\xf3timo”. Mudan\xe7a inconsistente com linha de base.',
        'Essa energia que voc\xea est\xe1 sentindo \xe9 parecida com seu jeito normal '
        'ou est\xe1 al\xe9m do que costuma ser?',
        'A\xe7\xe3o Vermelho: N\xe3o refor\xe7ar como melhora. Comunicar ao psiquiatra '
        'com urg\xeancia: antidepressivo pode estar revelando bipolaridade '
        'subjacente.'))

    s.append(signal_card('yellow',
        'Baixa ades\xe3o suspeita',
        'Melhora inst\xe1vel sem padr\xe3o claro, paciente menciona “esqueci” com '
        'frequ\xeancia, resposta cl\xednica inconsistente com o tempo de uso. '
        'Paciente desvia quando perguntado sobre rotina com o rem\xe9dio.',
        'Me conta como foi sua rotina com o rem\xe9dio essa semana: teve algum '
        'dia que esqueceu ou variou o hor\xe1rio?',
        'A\xe7\xe3o Amarelo: Abrir sem julgamento. Registrar. Comunicar ao psiquiatra '
        'se persistente: baixa ades\xe3o mascara a efic\xe1cia real da medica\xe7\xe3o '
        'e pode levar a trocas desnecess\xe1rias.'))

    s.append(signal_card('yellow',
        'Uso de subst\xe2ncias interferindo no tratamento',
        'Tratamento sem evolu\xe7\xe3o apesar de ades\xe3o aparente, humor inst\xe1vel '
        'fora do padr\xe3o esperado, ins\xf4nia persistente sem causa clara, '
        'paciente evasivo sobre rotina social ou noturna.',
        'Muitas pessoas usam \xe1lcool, maconha ou outras subst\xe2ncias para lidar '
        'com a ansiedade. Se for o seu caso, \xe9 importante que eu saiba: '
        'n\xe3o para julgar, mas porque pode estar afetando o tratamento.',
        'A\xe7\xe3o Amarelo: Abrir sem julgamento. Se confirmado, comunicar ao '
        'psiquiatra com autoriza\xe7\xe3o do paciente: subst\xe2ncias podem anular '
        'completamente a a\xe7\xe3o de antidepressivos e ansiol\xedticos.'))

    s.append(signal_card('red',
        'S\xedndrome serotoninerg\xedca',
        'Combina\xe7\xe3o de tremor, diarreia, sudorese excessiva, agita\xe7\xe3o, '
        'confus\xe3o mental e febre. Pode surgir ap\xf3s in\xedcio ou aumento de '
        'antidepressivo, ou ap\xf3s combina\xe7\xe3o com outros serotonerg\xedcos '
        '(tramadol, alguns analg\xe9sicos, suplementos como 5-HTP).',
        'Quando exatamente esses sintomas come\xe7aram? Voc\xea tomou algum rem\xe9dio '
        'novo, suplemento ou analg\xe9sico recentemente?',
        'A\xe7\xe3o Vermelho: Emerg\xeancia m\xe9dica. Acionar psiquiatra ou PS '
        'imediatamente. N\xe3o minimizar: s\xedndrome serotoninerg\xedca grave '
        'pode ser fatal.'))

    # ── BLOCO 3 ───────────────────────────────────────────────
    s.append(PageBreak())
    for el in block_header(3, 'Sinais Cl\xednicos / Org\xe2nicos'):
        s.append(el)

    s.append(signal_card('yellow',
        'Fadiga + queda de cabelo + lentid\xe3o intestinal',
        'Paciente relata cansa\xe7o desproporcional, queda de cabelo acentuada, '
        'pele seca, ganho de peso sem mudan\xe7a de h\xe1bitos, intestino “travado”. '
        'Pode estar em tratamento para depress\xe3o sem melhora adequada.',
        'Al\xe9m do cansa\xe7o emocional, voc\xea notou alguma mudan\xe7a f\xedsica? '
        'Cabelo, pele, peso, intestino?',
        'Ação Amarelo: Orientar avaliação médica para investigar tireoide. '
        'Hipotireoidismo pode se apresentar como quadro depressivo.'))

    s.append(signal_card('yellow',
        'Esquecimento progressivo + formigamento + apatia',
        'Paciente (especialmente idoso ou com problemas g\xe1stricos) relata '
        'esquecimento crescente, formigamento nas m\xe3os ou p\xe9s, fraqueza, '
        'apatia. Pode ter hist\xf3rico de uso prolongado de omeprazol ou '
        'redu\xe7\xe3o de prote\xedna animal na dieta.',
        'Voc\xea sente formigamento em alguma parte do corpo? Tem algum problema '
        'g\xe1strico ou mudou sua alimenta\xe7\xe3o recentemente?',
        'Ação Amarelo: Orientar avaliação médica para investigar vitamina B12 '
        'e outras causas clínicas possíveis. Deficiências prolongadas podem causar '
        'dano neurológico.'))

    s.append(signal_card('mixed',
        'Perda de peso acentuada ou restri\xe7\xe3o alimentar',
        'Perda de peso vis\xedvel entre sess\xf5es. Pele seca, cabelo quebra\xedico. '
        'Paciente relata restri\xe7\xe3o alimentar, rituais com comida, culpa ap\xf3s '
        'comer ou comportamentos compensat\xf3rios.',
        'Me conta como foi sua alimenta\xe7\xe3o ontem, do come\xe7o ao fim do dia.',
        'A\xe7\xe3o Amarelo: se padr\xe3o restritivo sem sinais f\xedsicos graves. '
        'A\xe7\xe3o Vermelho: se sinais f\xedsicos presentes (tontura, fraqueza, '
        'incha\xe7o nas bochechas): encaminhar para avalia\xe7\xe3o cl\xednica urgente. '
        'Transtorno alimentar tem a maior mortalidade entre os transtornos '
        'psiqui\xe1tricos.'))

    s.append(signal_card('yellow',
        'Taquicardia + tremor + sudorese sem conte\xfado ansioso',
        'Paciente descreve “corpo ligado o tempo todo”, palpit\xe3\xe7\xf5es, tremor '
        'nas m\xe3os, sudorese excessiva. Mas quando se investiga: n\xe3o h\xe1 '
        'preocupa\xe7\xe3o espec\xedfica. “A ansiedade come\xe7a no corpo, n\xe3o na cabe\xe7a.”',
        'Essa sensa\xe7\xe3o come\xe7a como pensamento ou como algo f\xedsico? Voc\xea est\xe1 '
        'preocupado com algo ou \xe9 o seu corpo que n\xe3o para?',
        'Ação Amarelo: Orientar avaliação médica para investigar tireoide. '
        'Hipertireoidismo pode se apresentar como ansiedade corporal intensa.'))

    s.append(signal_card('yellow',
        'Sintomas f\xedsicos incompat\xedveis com o quadro mental',
        'O quadro psiqui\xe1trico n\xe3o responde ao tratamento apesar de ades\xe3o '
        'adequada. Ou sintomas f\xedsicos acompanham os emocionais de forma '
        'desproporcional ou inconsistente.',
        'Esse padr\xe3o faz sentido como o quadro que a gente est\xe1 tratando? '
        'Se n\xe3o faz, o que mais pode ser?',
        'Ação Amarelo: Orientar avaliação médica. Considerar causa orgânica '
        'antes de interpretar tudo como piora emocional ou falha medicamentosa.'))

    # ── BLOCO 4 ───────────────────────────────────────────────
    s.append(PageBreak())
    for el in block_header(4, 'Frases de Apoio para Momentos Cr\xedticos'):
        s.append(el)

    s.append(Paragraph(
        'Use estas frases diretamente com o paciente quando necess\xe1rio.',
        ST['intro']))
    s.append(Spacer(1, 3*mm))

    phrases = [
        ('Para nomear preocupa\xe7\xe3o sem alarmar',
         'Eu estou percebendo uma mudan\xe7a importante e quero entender melhor com voc\xea.'),
        ('Para orientar sem pressionar',
         'Isso merece ser avaliado com mais rapidez. N\xe3o estou querendo te assustar: estou querendo te proteger.'),
        ('Para acionar rede sem dramatizar',
         'Vamos entrar em contato com seu psiquiatra agora. Eu te ajudo com isso.'),
        ('Para manter v\xednculo em crise',
         'Eu n\xe3o vou te deixar sozinho com isso.'),
        ('Para criar urg\xeancia sem p\xe2nico',
         'Preciso que voc\xea fale com seu psiquiatra antes da nossa pr\xf3xima sess\xe3o. Isso n\xe3o pode esperar.'),
        ('Para sustentar ap\xf3s emerg\xeancia',
         'O que aconteceu aqui foi dif\xedcil. Voc\xea n\xe3o precisa carregar isso sozinho. Vamos seguir juntos.'),
    ]
    for lbl, txt in phrases:
        s.append(phrase_card(lbl, txt))

    # ── COMUNICAÇÃO ───────────────────────────────────────────
    s.append(PageBreak())
    s.append(Paragraph('Comunica\xe7\xe3o com o psiquiatra', ST['comm_h']))
    s.append(Paragraph(
        'Quando precisar acionar o psiquiatra, organize a mensagem assim:',
        ST['comm_body']))

    steps = [
        '1. Identifique o paciente (iniciais + contexto m\xednimo)',
        '2. Descreva o que observou (comportamento, fala, padr\xe3o: n\xe3o diagn\xf3stico)',
        '3. Aponte a mudan\xe7a (em rela\xe7\xe3o a sess\xf5es anteriores)',
        '4. Informe o nível de urgência (Amarelo: alinhar em breve / Vermelho: agir hoje)',
        '5. Fa\xe7a um pedido objetivo (reavalia\xe7\xe3o, orienta\xe7\xe3o de conduta, ajuste)',
    ]
    for step in steps:
        s.append(Paragraph(step, ST['comm_step']))

    s.append(Paragraph(
        '“Paciente em uso de sertralina h\xe1 tr\xeas semanas, evoluindo com redu\xe7\xe3o '
        'importante de sono sem cansa\xe7o, acelera\xe7\xe3o do pensamento e impulsividade '
        'com prejuízo financeiro. Mudança inconsistente com linha de base. '
        'Solicito reavaliação com urgência.”',
        ST['comm_ex']))
    s.append(Spacer(1, 2*mm))
    s.append(compact_cta(KIT_URL))

    # ── VERSÃO RESUMIDA ───────────────────────────────────────
    s.append(PageBreak())
    s.append(Paragraph('Vers\xe3o Resumida: Refer\xeancia R\xe1pida', ST['sum_h']))
    s.append(Paragraph(
        'Para imprimir e manter no consult\xf3rio. Abrange todos os sinais deste checklist.',
        ST['intro']))
    s.append(Spacer(1, 5*mm))
    s.append(summary_table())
    s.append(Paragraph(
        'Checklist de Sinais de Aten\xe7\xe3o: Dra. Tatiana Gontijo: '
        'uso exclusivo para fins educativos: '
        'Este material n\xe3o substitui avalia\xe7\xe3o cl\xednica individualizada',
        ST['sum_note']))

    return s


# ── Main ──────────────────────────────────────────────────────
if __name__ == '__main__':
    doc   = make_doc(OUT)
    story = build_story()
    doc.build(story)
    size = os.path.getsize(OUT)
    print(f'PDF gerado: {OUT}')
    print(f'P\xe1ginas e tamanho: verificar com pypdf')
    print(f'Tamanho: {size:,} bytes')
