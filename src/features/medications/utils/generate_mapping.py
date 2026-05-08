import re

def shorten(label):
    label = label.upper()
    label = label.replace("ANTIDIABÉTICOS", "Antidiabético")
    label = label.replace("ANTIRREUMÁTICOS", "Antirreumático")
    label = label.replace("ANTIDEPRESSIVOS", "Antidepressivo")
    label = label.replace("CORTICOSTERÓIDES", "Corticoide")
    label = label.replace("INIBIDORES DA BOMBA DE PRÓTONS", "Protetor Gástrico")
    label = label.replace("ANALGÉSICOS NÃO NARCÓTICOS E ANTIPIRÉTICOS", "Analgésico")
    label = label.replace("HIPNÓTICOS E SEDATIVOS", "Hipnótico/Sedativo")
    label = label.replace("ANTIEPILÉPTICOS", "Antiepiléptico")
    label = label.replace("ANTIPSICÓTICOS", "Antipsicótico")
    label = label.replace("ASSOCIAÇÕES DE", "Assoc.")
    label = label.replace("ASSOCIAÇÃO DE", "Assoc.")
    label = label.replace("ASSOCIAÇÕES", "Assoc.")
    label = label.replace("COMBINAÇÕES", "Assoc.")
    label = label.replace("INSULINAS HUMANAS E ANÁLOGOS", "Insulina")
    label = label.replace("ANTIEPILEPTICOS", "Antiepiléptico")
    label = label.replace("ANTICONVULSIVANTES", "Anticonvulsivo")
    label = label.replace("ANTI-HISTAMÍNICOS", "Anti-histamínico")
    label = label.replace("ANTIPARKINSONIANOS", "Antiparkinsoniano")
    label = label.replace("ANTINEOPLÁSICOS", "Antineoplásico")
    label = label.replace("ANTIESPASMÓDICOS", "Antiespasmódico")
    label = label.replace("ANTIEMÉTICOS", "Antiemético")
    label = label.replace("ANTIASMÁTICOS", "Antiasmático")
    label = label.replace("ANTIENXAQUECOSOS", "Antienxaquecoso")
    label = label.replace("TRANQUILIZANTES", "Ansiolítico")
    label = label.replace("PSICOESTIMULANTES", "Psicoestimulante")
    label = label.replace("BETABLOQUEADORES", "Beta-bloqueador")
    label = label.replace("ANTI-HIPERTENSIVOS", "Anti-hipertensivo")
    label = label.replace("INIBIDORES DA ECA", "Inibidor da ECA")
    label = label.replace("ANTAGONISTAS DA ANGIOTENSINA II", "Antag. Angiotensina II")
    label = label.replace("ANTAGONISTAS DO CÁLCIO", "Bloq. de Cálcio")
    label = label.replace("ESTATINAS", "Estatina")
    label = label.replace("VITAMINA", "Vit.")
    label = label.replace("PUROS", "")
    label = label.replace("PURA", "")
    label = label.replace("SISTÊMICOS", "")
    label = label.replace("SISTÊMICO", "")
    label = label.replace("INJETÁVEIS", "")
    label = label.replace("ORAIS", "")
    label = label.replace("INALANTE", "")
    label = label.replace("TÓPICO", "")
    label = label.replace("PURO", "")
    
    # Capitalize first letter of words and clean up
    label = label.strip()
    words = label.split()
    if words:
        label = words[0][0].upper() + words[0][1:].lower()
        if len(words) > 1:
            label += " " + " ".join(w.lower() for w in words[1:])
            
    # Max length check
    if len(label) > 25:
        label = label[:22] + "..."
        
    return label

def get_color(code):
    prefix = code[0]
    mapping = {
        'N': 'violet',
        'C': 'rose',
        'A': 'emerald',
        'H': 'purple',
        'G': 'fuchsia',
        'M': 'orange',
        'R': 'cyan'
    }
    return mapping.get(prefix, 'slate')

print("export const ATC_HUMAN_MAPPING: Record<string, { label: string; color: string }> = {")
with open("filtered_classes.txt", "r") as f:
    for line in f:
        line = line.strip()
        if not line: continue
        parts = line.split(" - ", 1)
        if len(parts) == 2:
            code = parts[0].strip()
            desc = parts[1].strip()
            label = shorten(desc)
            color = get_color(code)
            print(f'  "{code}": {{ label: "{label}", color: "{color}" }},')
print("};")
