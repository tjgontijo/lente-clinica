"use client";

import {
  ArrowLeft,
  Check,
  Copy,
  MessageSquareText,
  Send,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/auth-client";
import { COMMUNICATION_TEMPLATES } from "../data/templates";

export interface PatientContext {
  initials: string;
  age: string;
  medication: string;
  psychiatrist: string;
  psychiatristPhone: string;
}

export function CommunicationsScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { data: session } = useSession();
  const therapistName = session?.user?.name ?? "";
  const therapistPhone = (session?.user as { phone?: string })?.phone ?? "";

  // Wizard Steps:
  // 1 (Cenário), 2 (Modelo), 3 (Dados), 4 (Revisão - Editor), 5 (Pronto/Envio)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [selectedModelId, setSelectedModelId] = useState<
    "short" | "medium" | "formal" | null
  >(null);

  // Estados dos inputs globais
  const [initials, setInitials] = useState(searchParams.get("initials") ?? "");
  const [age, setAge] = useState(searchParams.get("age") ?? "");
  const [medication, setMedication] = useState(
    searchParams.get("medication") ?? "",
  );
  const [psychiatrist, setPsychiatrist] = useState(
    searchParams.get("psychiatrist") ?? "",
  );
  const [psychiatristPhone, setPsychiatristPhone] = useState(
    searchParams.get("psychiatristPhone") ?? "",
  );
  const [patientGender, setPatientGender] = useState<"M" | "F">(
    (searchParams.get("patientGender") as "M" | "F") ?? "F",
  );
  const [doctorGender, setDoctorGender] = useState<"M" | "F">(
    (searchParams.get("doctorGender") as "M" | "F") ?? "M",
  );

  // Estados dos placeholders locais
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  // Texto editado no Passo 4
  const [editedText, setEditedText] = useState("");
  const [copied, setCopied] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateUrlParams = (updates: Record<string, string>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      startTransition(() => {
        router.replace(`?${params.toString()}`, { scroll: false });
      });
    }, 300);
  };

  const handleInitialsChange = (val: string) => {
    setInitials(val);
    updateUrlParams({
      initials: val,
      age,
      medication,
      psychiatrist,
      psychiatristPhone,
      patientGender,
      doctorGender,
    });
  };

  const handleAgeChange = (val: string) => {
    setAge(val);
    updateUrlParams({
      initials,
      age: val,
      medication,
      psychiatrist,
      psychiatristPhone,
      patientGender,
      doctorGender,
    });
  };

  const handleMedicationChange = (val: string) => {
    setMedication(val);
    updateUrlParams({
      initials,
      age,
      medication: val,
      psychiatrist,
      psychiatristPhone,
      patientGender,
      doctorGender,
    });
  };

  const handlePsychiatristChange = (val: string) => {
    setPsychiatrist(val);
    let inferredGender = doctorGender;
    if (/^dra/i.test(val.trim())) {
      inferredGender = "F";
      setDoctorGender("F");
    } else if (/^dr/i.test(val.trim())) {
      inferredGender = "M";
      setDoctorGender("M");
    }
    updateUrlParams({
      initials,
      age,
      medication,
      psychiatrist: val,
      psychiatristPhone,
      patientGender,
      doctorGender: inferredGender,
    });
  };

  const handlePsychiatristPhoneChange = (val: string) => {
    setPsychiatristPhone(val);
    updateUrlParams({
      initials,
      age,
      medication,
      psychiatrist,
      psychiatristPhone: val,
      patientGender,
      doctorGender,
    });
  };

  const handlePatientGenderChange = (gender: "M" | "F") => {
    setPatientGender(gender);
    updateUrlParams({
      initials,
      age,
      medication,
      psychiatrist,
      psychiatristPhone,
      patientGender: gender,
      doctorGender,
    });
  };

  const handleDoctorGenderChange = (gender: "M" | "F") => {
    setDoctorGender(gender);
    updateUrlParams({
      initials,
      age,
      medication,
      psychiatrist,
      psychiatristPhone,
      patientGender,
      doctorGender: gender,
    });
  };

  // Sincroniza estado com a URL
  useEffect(() => {
    setInitials(searchParams.get("initials") ?? "");
    setAge(searchParams.get("age") ?? "");
    setMedication(searchParams.get("medication") ?? "");
    setPsychiatrist(searchParams.get("psychiatrist") ?? "");
    setPsychiatristPhone(searchParams.get("psychiatristPhone") ?? "");
    setPatientGender((searchParams.get("patientGender") as "M" | "F") ?? "F");
    setDoctorGender((searchParams.get("doctorGender") as "M" | "F") ?? "M");
  }, [searchParams]);

  const selectedTemplate = COMMUNICATION_TEMPLATES.find(
    (t) => t.id === selectedTemplateId,
  );

  const hasInitials = useMemo(() => {
    if (!selectedTemplate || !selectedModelId) return false;
    let text = "";
    if (selectedModelId === "short") text = selectedTemplate.short ?? "";
    else if (selectedModelId === "medium") text = selectedTemplate.medium ?? "";
    else if (selectedModelId === "formal") text = selectedTemplate.formal ?? "";
    return /\[iniciais\]/i.test(text);
  }, [selectedTemplate, selectedModelId]);

  const hasAge = useMemo(() => {
    if (!selectedTemplate || !selectedModelId) return false;
    let text = "";
    if (selectedModelId === "short") text = selectedTemplate.short ?? "";
    else if (selectedModelId === "medium") text = selectedTemplate.medium ?? "";
    else if (selectedModelId === "formal") text = selectedTemplate.formal ?? "";
    return /\[idade\]/i.test(text);
  }, [selectedTemplate, selectedModelId]);

  const hasMedication = useMemo(() => {
    if (!selectedTemplate || !selectedModelId) return false;
    let text = "";
    if (selectedModelId === "short") text = selectedTemplate.short ?? "";
    else if (selectedModelId === "medium") text = selectedTemplate.medium ?? "";
    else if (selectedModelId === "formal") text = selectedTemplate.formal ?? "";
    return /\[medicação\]|\[medicação_benzo\]/i.test(text);
  }, [selectedTemplate, selectedModelId]);

  const hasPsychiatrist = useMemo(() => {
    if (!selectedTemplate || !selectedModelId) return false;
    let text = "";
    if (selectedModelId === "short") text = selectedTemplate.short ?? "";
    else if (selectedModelId === "medium") text = selectedTemplate.medium ?? "";
    else if (selectedModelId === "formal") text = selectedTemplate.formal ?? "";
    return /\[nome_psiquiatra\]/i.test(text);
  }, [selectedTemplate, selectedModelId]);

  // Extrai placeholders locais para a combinação cenário/modelo atual
  const getLocalPlaceholders = useCallback(() => {
    if (!selectedTemplate || !selectedModelId) return [];
    let text = "";
    if (selectedModelId === "short") text = selectedTemplate.short ?? "";
    else if (selectedModelId === "medium") text = selectedTemplate.medium ?? "";
    else if (selectedModelId === "formal") text = selectedTemplate.formal ?? "";

    const matches = text.match(/\[.*?\]/g) || [];
    const uniqueMatches = Array.from(new Set(matches));

    const globals = [
      "[iniciais]",
      "[idade]",
      "[medicação]",
      "[medicação_benzo]",
      "[nome_psiquiatra]",
      "[meu_nome]",
      "[meu_telefone]",
      "[meu_telefone_contato]",
      "[saudação]",
      "[saudacao]",
      "[o_a_paciente]",
      "[do_da_paciente]",
      "[ao_a_paciente]",
      "[ele_ela]",
      "[sufixo_o_a]",
      "[ótimo_ótima]",
      "[parado_parada]",
      "[assintomático_assintomática]",
      "[motivado_motivada]",
      "[dr_dra]",
      "[prezado_prezada]",
      "[doutor_doutora]",
    ];
    return uniqueMatches.filter((p) => !globals.includes(p.toLowerCase()));
  }, [selectedTemplate, selectedModelId]);

  const PLACEHOLDER_FRIENDLY_INFOS: Record<
    string,
    { label: string; example: string }
  > = {
    x: {
      label: "Tempo / Dosagem / Valor (x)",
      example: "15, 2 semanas, 20mg",
    },
    sintoma_principal: {
      label: "Sintoma Principal",
      example: "insônia inicial, desânimo matinal",
    },
    sintomas: {
      label: "Sintomas Observados",
      example: "tristeza, apatia e letargia",
    },
    diagnóstico: {
      label: "Diagnóstico ou Hipótese Clínica",
      example: "depressão maior, ansiedade generalizada",
    },
    "descrever comportamentos impulsivos": {
      label: "Comportamentos Impulsivos",
      example: "gastos excessivos no cartão e direção perigosa",
    },
    comportamento_impulsivo_concreto: {
      label: "Comportamento Impulsivo Concreto",
      example: "compras compulsivas de aparelhos eletrônicos",
    },
    data: {
      label: "Data da Ocorrência",
      example: "ontem, 25/06",
    },
    ativa_ou_passiva: {
      label: "Tipo de Ideação Suicida",
      example: "ativa com plano, passiva sem intenção",
    },
    descrever_funcionamento: {
      label: "Funcionamento Geral do Paciente",
      example: "prejuízo acadêmico e isolamento social",
    },
    rede_de_apoio: {
      label: "Rede de Apoio",
      example: "cônjuge orientado e ciente",
    },
    confirmar_adesao: {
      label: "Confirmação de Adesão",
      example: "paciente tomando diariamente",
    },
    frase_literal_do_paciente: {
      label: "Frase Literal do Paciente",
      example: '"sinto vontade de sumir e não acordar"',
    },
    "permanece no consultório / foi acompanhado por familiar / foi encaminhado ao ps":
      {
        label: "Conduta ou Destino do Paciente",
        example: "foi acompanhado por familiar ao PS",
      },
    descrever_horas_ou_dias: {
      label: "Intervalo de Oscilação",
      example: "poucas horas, 2 dias",
    },
    descrever_pensamento_intrusivo: {
      label: "Pensamento Intrusivo Obsessivo",
      example: "medo obsessivo de contaminação",
    },
    descrever_comportamento_repetitivo: {
      label: "Comportamento Repetitivo (Ritual)",
      example: "lavagem excessiva das mãos",
    },
    descrever_evento_traumático_sem_detalhes_desnecessários: {
      label: "Resumo do Evento Traumático",
      example: "assalto com ameaça há 2 anos",
    },
    descrever_sintomas: {
      label: "Descrição dos Sintomas",
      example: "tremores e sensação de formigamento",
    },
    "verbalização de plano suicida / descompensação psicótica / descrever": {
      label: "Quadro Clínico na Crise",
      example: "verbalização ativa de plano suicida",
    },
    descrever_crise: {
      label: "Descrição da Crise",
      example: "choro inconsolável e pânico",
    },
    "familiar acionado / aguardando orientação / encaminhando ao ps": {
      label: "Conduta Imediata",
      example: "familiar acionado para buscar",
    },
    descrever_o_que_aconteceu_crise_verbalizacao_comportamento: {
      label: "Detalhamento da Crise",
      example: "agitação psicomotora intensa",
    },
    descrever_o_que_foi_feito_familiar_acionado_samu_etc: {
      label: "Detalhamento da Conduta",
      example: "esposa chamada ao consultório",
    },
    descrever: {
      label: "Descrição dos Fatos",
      example: "ideias de referência persecutórias",
    },
    cannabis_ou_substancia: {
      label: "Substância Utilizada",
      example: "cannabis, álcool",
    },
    substância_e_padrão: {
      label: "Substância e Padrão de Uso",
      example: "álcool de forma abusiva",
    },
    substâncias_frequência_quantidade: {
      label: "Frequência e Quantidade de Uso",
      example: "4 latas de cerveja aos finais de semana",
    },
    listar_medicações: {
      label: "Lista de Medicações",
      example: "Fluoxetina 20mg, Rivotril 0.5mg",
    },
    listar_medicações_e_doses: {
      label: "Medicações e Doses Completas",
      example: "Sertralina 100mg/dia, Zolpidem 10mg/noite",
    },
    motivação: {
      label: "Motivação do Paciente",
      example: "melhora rápida dos sintomas",
    },
    descrever_queixas: {
      label: "Queixas Clínicas / Cognitivas",
      example: "falhas frequentes de memória",
    },
    "redução de libido / dificuldade erétil / anorgasmia": {
      label: "Efeito Colateral Sexual",
      example: "redução drástica de libido",
    },
    "troca / ajuste": {
      label: "Tipo de Ajuste",
      example: "ajuste de dose, troca de fármaco",
    },
    dose: {
      label: "Nova Dosagem",
      example: "150mg",
    },
    descrever_agitação_sono_humor_etc: {
      label: "Alterações Observadas",
      example: "agitação leve e insônia inicial",
    },
    descrever_quadro_clinico_em_linguagem_simples: {
      label: "Quadro Clínico Geral",
      example: "desânimo profundo e isolamento social",
    },
    descrever_o_que_justifica_avaliacao: {
      label: "Fatores que Justificam Avaliação",
      example: "ideação obsessiva persistente",
    },
    descrever_sinais_físicos: {
      label: "Sintomas e Sinais Físicos",
      example: "fadiga severa, ganho de peso e pele seca",
    },
  };

  const getPlaceholderLabel = (placeholder: string) => {
    const clean = placeholder.replace(/[[\]]/g, "").trim().toLowerCase();
    if (PLACEHOLDER_FRIENDLY_INFOS[clean]) {
      return PLACEHOLDER_FRIENDLY_INFOS[clean].label;
    }
    const cleanOrig = placeholder.replace(/[[\]]/g, "");
    if (cleanOrig === "x") return "Tempo / Dosagem / Valor (x)";
    return cleanOrig.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  };

  const getPlaceholderExample = (placeholder: string) => {
    const clean = placeholder.replace(/[[\]]/g, "").trim().toLowerCase();
    if (PLACEHOLDER_FRIENDLY_INFOS[clean]) {
      return `Ex: ${PLACEHOLDER_FRIENDLY_INFOS[clean].example}`;
    }
    const label = getPlaceholderLabel(placeholder);
    return `Ex: ${label}`;
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return "Bom dia";
    if (hours >= 12 && hours < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Compila a mensagem final substituindo todos os marcadores
  const compileFinalText = () => {
    if (!selectedTemplate || !selectedModelId) return "";
    let text = "";
    if (selectedModelId === "short") text = selectedTemplate.short ?? "";
    else if (selectedModelId === "medium") text = selectedTemplate.medium ?? "";
    else if (selectedModelId === "formal") text = selectedTemplate.formal ?? "";

    // Saudação dinâmica baseada no horário
    const greeting = getGreeting();
    text = text.replace(/\[saudação\]/gi, greeting);
    text = text.replace(/\[saudacao\]/gi, greeting);

    // Substituições de Gênero do Médico
    const doctorReplacements: Record<string, string> =
      doctorGender === "F"
        ? {
            "[dr_dra]": "Dra.",
            "[Dr_Dra]": "Dra.",
            "[prezado_prezada]": "Prezada",
            "[Prezado_Prezada]": "Prezada",
            "[doutor_doutora]": "Doutora",
            "[Doutor_Doutora]": "Doutora",
          }
        : {
            "[dr_dra]": "Dr.",
            "[Dr_Dra]": "Dr.",
            "[prezado_prezada]": "Prezado",
            "[Prezado_Prezada]": "Prezado",
            "[doutor_doutora]": "Doutor",
            "[Doutor_Doutora]": "Doutor",
          };

    // Substituições de Gênero do Paciente
    const patientReplacements: Record<string, string> =
      patientGender === "F"
        ? {
            "[o_a_paciente]": "a paciente",
            "[O_A_paciente]": "A paciente",
            "[do_da_paciente]": "da paciente",
            "[Do_Da_paciente]": "Da paciente",
            "[ao_a_paciente]": "à paciente",
            "[Ao_A_paciente]": "À paciente",
            "[ele_ela]": "ela",
            "[Ele_Ela]": "Ela",
            "[sufixo_o_a]": "a",
            "[ótimo_ótima]": "ótima",
            "[Ótimo_Ótima]": "Ótima",
            "[parado_parada]": "parada",
            "[Parado_Parada]": "Parada",
            "[assintomático_assintomática]": "assintomática",
            "[Assintomático_Assintomática]": "Assintomática",
            "[motivado_motivada]": "motivada",
            "[Motivado_Motivada]": "Motivada",
          }
        : {
            "[o_a_paciente]": "o paciente",
            "[O_A_paciente]": "O paciente",
            "[do_da_paciente]": "do paciente",
            "[Do_Da_paciente]": "Do paciente",
            "[ao_a_paciente]": "ao paciente",
            "[Ao_A_paciente]": "Ao paciente",
            "[ele_ela]": "ele",
            "[Ele_Ela]": "Ele",
            "[sufixo_o_a]": "o",
            "[ótimo_ótima]": "ótimo",
            "[Ótimo_Ótima]": "Ótimo",
            "[parado_parada]": "parado",
            "[Parado_Parada]": "Parado",
            "[assintomático_assintomática]": "assintomático",
            "[Assintomático_Assintomática]": "Assintomático",
            "[motivado_motivada]": "motivado",
            "[Motivado_Motivada]": "Motivado",
          };

    // Aplica substituições do médico
    for (const [key, val] of Object.entries(doctorReplacements)) {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      text = text.replace(new RegExp(escapedKey, "g"), val);
    }

    // Aplica substituições do paciente
    for (const [key, val] of Object.entries(patientReplacements)) {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      text = text.replace(new RegExp(escapedKey, "g"), val);
    }

    // Substitui nome do psiquiatra se preenchido
    if (psychiatrist) {
      text = text.replace(/\[nome_psiquiatra\]/gi, psychiatrist);
      // Remove tratamentos duplicados do tipo "Dra. Dra. Cláudia"
      if (doctorGender === "F") {
        text = text.replace(/Dra\.\s+Dra\./gi, "Dra.");
        text = text.replace(/Dra\.\s+Dr\./gi, "Dra.");
      } else {
        text = text.replace(/Dr\.\s+Dr\./gi, "Dr.");
        text = text.replace(/Dr\.\s+Dra\./gi, "Dr.");
      }
    } else {
      // Se não preenchido, remove [nome_psiquiatra] e usa o tratamento de fallback
      text = text.replace(/\[nome_psiquiatra\]/gi, "");
      // Limpa espaços duplos ou pontuação órfã gerada pela remoção
      text = text.replace(/\s+,\s*/g, ", ");
      // Se sobrar "Prezada Dra. ," vira "Prezada Doutora,"
      if (doctorGender === "F") {
        text = text.replace(/Prezada Dra\.\s*,/gi, "Prezada Doutora,");
        text = text.replace(/Dra\.\s*,/gi, "Doutora,");
      } else {
        text = text.replace(/Prezado Dr\.\s*,/gi, "Prezado Doutor,");
        text = text.replace(/Dr\.\s*,/gi, "Doutor,");
      }
    }

    // Globals
    if (initials) text = text.replace(/\[iniciais\]/gi, initials);
    if (age) text = text.replace(/\[idade\]/gi, age);
    if (medication) {
      text = text.replace(/\[medicação\]/gi, medication);
      text = text.replace(/\[medicação_benzo\]/gi, medication);
    }
    if (therapistName) text = text.replace(/\[meu_nome\]/gi, therapistName);
    if (therapistPhone) {
      text = text.replace(/\[meu_telefone\]/gi, therapistPhone);
      text = text.replace(/\[meu_telefone_contato\]/gi, therapistPhone);
    }

    // Locals
    for (const [key, val] of Object.entries(localValues)) {
      if (val.trim()) {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        text = text.replace(new RegExp(escapedKey, "gi"), val);
      }
    }

    // Limpa aspas externas
    if (text.startsWith('"') && text.endsWith('"')) {
      text = text.substring(1, text.length - 1);
    }

    return text;
  };

  const handleGenerateMessage = () => {
    const text = compileFinalText();
    setEditedText(text);
    setCurrentStep(4);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText).then(() => {
      setCopied(true);
      toast.success("Mensagem copiada com sucesso!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const cleanPhoneForWhatsapp = (phone: string) => {
    let cleaned = phone.replace(/\D/g, "");
    if (!cleaned) return "";
    if (cleaned.length === 10 || cleaned.length === 11) {
      cleaned = `55${cleaned}`;
    }
    return cleaned;
  };

  const whatsappPhone = psychiatristPhone
    ? cleanPhoneForWhatsapp(psychiatristPhone)
    : "";
  const whatsappUrl = whatsappPhone
    ? `https://api.whatsapp.com/send?phone=${encodeURIComponent(whatsappPhone)}&text=${encodeURIComponent(editedText)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(editedText)}`;

  const resetWizard = () => {
    setSelectedTemplateId(null);
    setSelectedModelId(null);
    setLocalValues({});
    setEditedText("");
    setCurrentStep(1);
  };

  // Configuração visual dos Passos do Wizard (Mapeado 1-a-1 com 5 passos do usuário)
  const wizardSteps = [
    { number: 1, label: "Cenário" },
    { number: 2, label: "Modelo" },
    { number: 3, label: "Dados" },
    { number: 4, label: "Revisão" },
    { number: 5, label: "Pronto" },
  ];

  const renderExampleText = (text: string) => {
    let cleanText = text;

    // Substituições de Gênero do Médico no Exemplo
    const doctorReplacements: Record<string, string> =
      doctorGender === "F"
        ? {
            "[dr_dra]": "Dra.",
            "[Dr_Dra]": "Dra.",
            "[prezado_prezada]": "Prezada",
            "[Prezado_Prezada]": "Prezada",
            "[doutor_doutora]": "Doutora",
            "[Doutor_Doutora]": "Doutora",
          }
        : {
            "[dr_dra]": "Dr.",
            "[Dr_Dra]": "Dr.",
            "[prezado_prezada]": "Prezado",
            "[Prezado_Prezada]": "Prezado",
            "[doutor_doutora]": "Doutor",
            "[Doutor_Doutora]": "Doutor",
          };

    // Substituições de Gênero do Paciente no Exemplo
    const patientReplacements: Record<string, string> =
      patientGender === "F"
        ? {
            "[o_a_paciente]": "a paciente",
            "[O_A_paciente]": "A paciente",
            "[do_da_paciente]": "da paciente",
            "[Do_Da_paciente]": "Da paciente",
            "[ao_a_paciente]": "à paciente",
            "[Ao_A_paciente]": "À paciente",
            "[ele_ela]": "ela",
            "[Ele_Ela]": "Ela",
            "[sufixo_o_a]": "a",
            "[ótimo_ótima]": "ótima",
            "[Ótimo_Ótima]": "Ótima",
            "[parado_parada]": "parada",
            "[Parado_Parada]": "Parada",
            "[assintomático_assintomática]": "assintomática",
            "[Assintomático_Assintomática]": "Assintomática",
            "[motivado_motivada]": "motivada",
            "[Motivado_Motivada]": "Motivada",
          }
        : {
            "[o_a_paciente]": "o paciente",
            "[O_A_paciente]": "O paciente",
            "[do_da_paciente]": "do paciente",
            "[Do_Da_paciente]": "Do paciente",
            "[ao_a_paciente]": "ao paciente",
            "[Ao_A_paciente]": "Ao paciente",
            "[ele_ela]": "ele",
            "[Ele_Ela]": "Ele",
            "[sufixo_o_a]": "o",
            "[ótimo_ótima]": "ótimo",
            "[Ótimo_Ótima]": "Ótimo",
            "[parado_parada]": "parado",
            "[Parado_Parada]": "Parado",
            "[assintomático_assintomática]": "assintomático",
            "[Assintomático_Assintomática]": "Assintomático",
            "[motivado_motivada]": "motivado",
            "[Motivado_Motivada]": "Motivado",
          };

    for (const [key, val] of Object.entries(doctorReplacements)) {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      cleanText = cleanText.replace(new RegExp(escapedKey, "g"), val);
    }

    for (const [key, val] of Object.entries(patientReplacements)) {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      cleanText = cleanText.replace(new RegExp(escapedKey, "g"), val);
    }

    if (cleanText.startsWith('"') && cleanText.endsWith('"')) {
      cleanText = cleanText.substring(1, cleanText.length - 1);
    }

    const parts = cleanText.split(/(\[.*?\])/g);

    return parts.map((part, index) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        const key = part.toLowerCase();
        const globals = [
          "[iniciais]",
          "[idade]",
          "[medicação]",
          "[medicação_benzo]",
          "[nome_psiquiatra]",
          "[meu_nome]",
          "[meu_telefone]",
          "[meu_telefone_contato]",
          "[saudação]",
          "[saudacao]",
          "[o_a_paciente]",
          "[do_da_paciente]",
          "[ao_a_paciente]",
          "[ele_ela]",
          "[sufixo_o_a]",
          "[dr_dra]",
          "[prezado_prezada]",
          "[doutor_doutora]",
        ];

        const isGlobal = globals.includes(key);
        const isGreeting = key === "[saudação]" || key === "[saudacao]";

        return (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: parts do split são estáveis por render
            key={index}
            className={`font-mono text-xs font-semibold px-1 py-0.5 rounded border ${
              isGreeting
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : isGlobal
                  ? "bg-[var(--lc-teal-50)] text-[var(--lc-teal-800)] border-[var(--lc-teal-200)]"
                  : "bg-[var(--lc-amber-50)] text-[var(--lc-amber-800)] border-[var(--lc-amber-300)]"
            }`}
          >
            {isGreeting ? `${getGreeting()} (automático)` : part}
          </span>
        );
      }
      return part;
    });
  };

  // Configura os modelos de comunicação específicos baseados no template selecionado
  const getAvailableModels = useCallback(() => {
    if (!selectedTemplate) return [];
    const models = [];

    if (selectedTemplate.short) {
      models.push({
        id: "short" as const,
        label: "Texto Curto e Direto",
        description: "Mensagem compacta ideal para leitura rápida no celular.",
        text: selectedTemplate.short,
      });
    }
    if (selectedTemplate.medium) {
      models.push({
        id: "medium" as const,
        label: "Texto Detalhado (Rico)",
        description: "Relato contendo descrição da queixa e psicoeducação.",
        text: selectedTemplate.medium,
      });
    }
    if (selectedTemplate.formal) {
      models.push({
        id: "formal" as const,
        label: "Texto Formal (Encaminhamento)",
        description: "Estrutura tradicional com identificação formal.",
        text: selectedTemplate.formal,
      });
    }

    return models;
  }, [selectedTemplate]);

  // Auto-seleciona o modelo caso haja apenas 1 opção disponível no Passo 2
  useEffect(() => {
    if (currentStep === 2) {
      const models = getAvailableModels();
      if (models.length === 1) {
        setSelectedModelId(models[0].id);
      }
    }
  }, [currentStep, getAvailableModels]);

  return (
    <div className="flex flex-col gap-6 pb-16 relative w-full max-w-[700px] mx-auto animate-in fade-in duration-300 px-4 sm:px-0">
      {/* Header */}
      <div className="text-center space-y-2 mb-2">
        <h1 className="text-3xl font-bold text-[var(--lc-neutral-900)] flex items-center justify-center gap-3">
          <MessageSquareText className="text-[var(--lc-teal-600)]" size={32} />
          Assistente de Comunicação
        </h1>
        <p className="text-[var(--lc-neutral-600)] text-sm max-w-md mx-auto leading-relaxed">
          Elabore comunicados assertivos e éticos para médicos psiquiatras
          através de um fluxo guiado.
        </p>
      </div>

      {/* Progress Tracker */}
      <div className="flex items-center justify-between w-full max-w-xl mx-auto mb-8 border-b border-[var(--lc-neutral-200)] pb-4 px-2 sm:px-4">
        {wizardSteps.map((s, idx) => {
          const isCompleted = currentStep > s.number;
          const isActive = currentStep === s.number;

          return (
            <div key={s.number} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isActive
                        ? "bg-[var(--lc-teal-600)] text-white ring-4 ring-[var(--lc-teal-100)]"
                        : "bg-[var(--lc-neutral-200)] text-[var(--lc-neutral-500)]"
                  }`}
                >
                  {isCompleted ? "✓" : s.number}
                </div>
                <span
                  className={`text-xs font-bold hidden sm:inline ${
                    isActive
                      ? "text-[var(--lc-teal-700)]"
                      : "text-[var(--lc-neutral-500)]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < wizardSteps.length - 1 && (
                <div
                  className={`w-4 sm:w-10 h-[2px] mx-1 sm:mx-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-600"
                      : "bg-[var(--lc-neutral-200)]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* --- PASSO 1: SELEÇÃO DE CENÁRIO (ESTILO INLEAD) --- */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-1.5 mb-2">
            <h2 className="text-xl font-bold text-[var(--lc-neutral-800)]">
              Qual é a situação clínica observada?
            </h2>
            <p className="text-xs text-[var(--lc-neutral-500)]">
              Selecione o cenário clínico correspondente ao quadro que deseja
              relatar.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {COMMUNICATION_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  setSelectedTemplateId(template.id);
                  setCurrentStep(2);
                }}
                className="w-full p-4 sm:p-5 text-left bg-white hover:bg-[var(--lc-neutral-50)] border border-[var(--lc-neutral-200)] hover:border-[var(--lc-teal-300)] rounded-[var(--lc-radius-md)] shadow-sm hover:shadow-md transition-all flex items-start justify-between gap-4 group focus:outline-none focus:ring-2 focus:ring-[var(--lc-teal-500)] animate-in fade-in"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="bg-[var(--lc-neutral-100)] text-[var(--lc-neutral-600)] w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 mt-0.5">
                    {template.id}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-[var(--lc-neutral-800)] group-hover:text-[var(--lc-teal-700)] transition-colors leading-snug">
                        {template.title}
                      </h3>
                      {template.isAttention && (
                        <span className="px-2 py-0.5 bg-[var(--lc-amber-50)] text-[var(--lc-amber-800)] border border-[var(--lc-amber-300)] rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <TriangleAlert size={10} /> Atenção
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--lc-neutral-500)] mt-1.5 leading-relaxed">
                      {template.context}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[var(--lc-teal-600)] font-bold group-hover:translate-x-1 transition-transform flex-shrink-0 self-center">
                  &rarr;
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- PASSO 2: ESCOLHA DO MODELO COM EXEMPLO --- */}
      {currentStep === 2 && selectedTemplate && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="text-center space-y-1.5 mb-2">
            <h2 className="text-xl font-bold text-[var(--lc-neutral-800)]">
              Selecione o modelo de comunicação
            </h2>
            <p className="text-xs text-[var(--lc-neutral-500)]">
              Examine o exemplo do formato de texto e escolha o modelo desejado.
            </p>
          </div>

          <div className="space-y-4">
            {getAvailableModels().map((m) => {
              const isSelected = selectedModelId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedModelId(m.id);
                    setCurrentStep(3);
                  }}
                  className={`w-full p-4 sm:p-5 bg-white border rounded-[var(--lc-radius-md)] text-left transition-all flex flex-col gap-3.5 shadow-sm hover:shadow group focus:outline-none focus:ring-2 focus:ring-[var(--lc-teal-500)] ${
                    isSelected
                      ? "border-[var(--lc-teal-500)] ring-1 ring-[var(--lc-teal-500)] bg-[var(--lc-teal-50)]/5"
                      : "border-[var(--lc-neutral-200)] hover:border-[var(--lc-teal-300)]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <h3
                        className={`font-bold text-sm transition-colors ${
                          isSelected
                            ? "text-[var(--lc-teal-700)]"
                            : "text-[var(--lc-neutral-800)]"
                        }`}
                      >
                        {m.label}
                      </h3>
                      <p className="text-[11px] text-[var(--lc-neutral-500)] mt-0.5 leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[var(--lc-neutral-50)] rounded-md p-3.5 border border-[var(--lc-neutral-200)] text-left w-full">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--lc-neutral-400)] mb-1.5 font-sans">
                      Estrutura de Exemplo:
                    </p>
                    <div className="text-xs sm:text-sm text-[var(--lc-neutral-600)] whitespace-pre-wrap leading-[1.85] font-sans">
                      {renderExampleText(m.text)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[var(--lc-neutral-200)] flex justify-start">
            <button
              type="button"
              onClick={() => {
                setSelectedModelId(null);
                setCurrentStep(1);
              }}
              className="text-xs sm:text-sm text-[var(--lc-neutral-500)] hover:text-[var(--lc-teal-700)] font-semibold flex items-center gap-1 focus:outline-none"
            >
              <ArrowLeft size={14} /> Voltar ao cenário
            </button>
          </div>
        </div>
      )}

      {/* --- PASSO 3: PREENCHIMENTO DE DADOS (APENAS INPUTS UM POR LINHA) --- */}
      {currentStep === 3 && selectedTemplate && selectedModelId && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="text-center space-y-1.5 mb-2">
            <h2 className="text-xl font-bold text-[var(--lc-neutral-800)]">
              Informações do caso
            </h2>
            <p className="text-xs text-[var(--lc-neutral-500)]">
              Os dados abaixo ajudam a estruturar a mensagem. Campos opcionais
              não preenchidos serão omitidos ou adaptados no texto.
            </p>
          </div>

          <div className="bg-white border border-[var(--lc-neutral-200)] shadow-sm rounded-[var(--lc-radius-md)] p-5 sm:p-6 space-y-6">
            {/* Seção 1: Dados Globais */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--lc-neutral-400)] border-b border-[var(--lc-neutral-100)] pb-1.5">
                {hasInitials || hasAge || hasMedication || hasPsychiatrist
                  ? "Informações Gerais (Paciente / Médico)"
                  : "Canal de Envio"}
              </h3>

              <div className="flex flex-col gap-4">
                {/* Gênero do Paciente */}
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-[var(--lc-neutral-700)] block">
                    Gênero do Paciente
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handlePatientGenderChange("M")}
                      className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-md border transition-all ${
                        patientGender === "M"
                          ? "bg-[var(--lc-teal-600)] text-white border-[var(--lc-teal-600)] shadow-sm"
                          : "bg-[var(--lc-neutral-50)] text-[var(--lc-neutral-600)] border-[var(--lc-neutral-200)] hover:bg-[var(--lc-neutral-100)]"
                      }`}
                    >
                      Masculino (Ele)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePatientGenderChange("F")}
                      className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-md border transition-all ${
                        patientGender === "F"
                          ? "bg-[var(--lc-teal-600)] text-white border-[var(--lc-teal-600)] shadow-sm"
                          : "bg-[var(--lc-neutral-50)] text-[var(--lc-neutral-600)] border-[var(--lc-neutral-200)] hover:bg-[var(--lc-neutral-100)]"
                      }`}
                    >
                      Feminino (Ela)
                    </button>
                  </div>
                </div>

                {/* Tratamento do Médico */}
                {hasPsychiatrist && (
                  <div className="space-y-1">
                    <span className="text-sm font-semibold text-[var(--lc-neutral-700)] block">
                      Tratamento do Psiquiatra
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleDoctorGenderChange("M")}
                        className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-md border transition-all ${
                          doctorGender === "M"
                            ? "bg-[var(--lc-teal-600)] text-white border-[var(--lc-teal-600)] shadow-sm"
                            : "bg-[var(--lc-neutral-50)] text-[var(--lc-neutral-600)] border-[var(--lc-neutral-200)] hover:bg-[var(--lc-neutral-100)]"
                        }`}
                      >
                        Dr. (Masculino)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDoctorGenderChange("F")}
                        className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-md border transition-all ${
                          doctorGender === "F"
                            ? "bg-[var(--lc-teal-600)] text-white border-[var(--lc-teal-600)] shadow-sm"
                            : "bg-[var(--lc-neutral-50)] text-[var(--lc-neutral-600)] border-[var(--lc-neutral-200)] hover:bg-[var(--lc-neutral-100)]"
                        }`}
                      >
                        Dra. (Feminino)
                      </button>
                    </div>
                  </div>
                )}
                {hasInitials && (
                  <div className="space-y-1">
                    <label
                      htmlFor="w-initials"
                      className="text-sm font-semibold text-[var(--lc-neutral-700)]"
                    >
                      Iniciais do Paciente
                    </label>
                    <input
                      id="w-initials"
                      type="text"
                      placeholder="Ex: J.S."
                      className="w-full px-4 py-2.5 bg-[var(--lc-neutral-50)] border border-[var(--lc-neutral-200)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--lc-teal-500)] text-sm sm:text-base transition-all"
                      value={initials}
                      onChange={(e) => handleInitialsChange(e.target.value)}
                    />
                  </div>
                )}

                {hasAge && (
                  <div className="space-y-1">
                    <label
                      htmlFor="w-age"
                      className="text-sm font-semibold text-[var(--lc-neutral-700)]"
                    >
                      Idade
                    </label>
                    <input
                      id="w-age"
                      type="text"
                      placeholder="Ex: 34"
                      className="w-full px-4 py-2.5 bg-[var(--lc-neutral-50)] border border-[var(--lc-neutral-200)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--lc-teal-500)] text-sm sm:text-base transition-all"
                      value={age}
                      onChange={(e) => handleAgeChange(e.target.value)}
                    />
                  </div>
                )}

                {hasMedication && (
                  <div className="space-y-1">
                    <label
                      htmlFor="w-medication"
                      className="text-sm font-semibold text-[var(--lc-neutral-700)]"
                    >
                      Medicação Atual
                    </label>
                    <input
                      id="w-medication"
                      type="text"
                      placeholder="Ex: Escitalopram 10mg"
                      className="w-full px-4 py-2.5 bg-[var(--lc-neutral-50)] border border-[var(--lc-neutral-200)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--lc-teal-500)] text-sm sm:text-base transition-all"
                      value={medication}
                      onChange={(e) => handleMedicationChange(e.target.value)}
                    />
                  </div>
                )}

                {hasPsychiatrist && (
                  <div className="space-y-1">
                    <label
                      htmlFor="w-psychiatrist"
                      className="text-sm font-semibold text-[var(--lc-neutral-700)]"
                    >
                      Nome do Psiquiatra
                    </label>
                    <input
                      id="w-psychiatrist"
                      type="text"
                      placeholder="Ex: Dr. Silva"
                      className="w-full px-4 py-2.5 bg-[var(--lc-neutral-50)] border border-[var(--lc-neutral-200)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--lc-teal-500)] text-sm sm:text-base transition-all"
                      value={psychiatrist}
                      onChange={(e) => handlePsychiatristChange(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label
                    htmlFor="w-psychiatristPhone"
                    className="text-sm font-semibold text-[var(--lc-neutral-700)]"
                  >
                    WhatsApp do Psiquiatra (Opcional)
                  </label>
                  <input
                    id="w-psychiatristPhone"
                    type="text"
                    placeholder="Ex: (11) 98888-8888"
                    className="w-full px-4 py-2.5 bg-[var(--lc-neutral-50)] border border-[var(--lc-neutral-200)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--lc-teal-500)] text-sm sm:text-base transition-all"
                    value={psychiatristPhone}
                    onChange={(e) =>
                      handlePsychiatristPhoneChange(e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Seção 2: Dados Específicos Local/Inline do Cenário */}
            {(() => {
              const localPlaceholders = getLocalPlaceholders();
              if (localPlaceholders.length === 0) return null;
              return (
                <div className="space-y-4 pt-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--lc-neutral-400)] border-b border-[var(--lc-neutral-100)] pb-1.5">
                    Variáveis do Cenário
                  </h3>
                  <div className="flex flex-col gap-4 animate-in fade-in">
                    {localPlaceholders.map((ph, idx) => {
                      const val = localValues[ph] ?? "";
                      const uniqueInputId = `local-ph-${idx}`;
                      return (
                        <div key={ph} className="space-y-1">
                          <label
                            htmlFor={uniqueInputId}
                            className="text-sm font-semibold text-[var(--lc-neutral-700)]"
                          >
                            {getPlaceholderLabel(ph)}
                          </label>
                          <input
                            id={uniqueInputId}
                            type="text"
                            placeholder={getPlaceholderExample(ph)}
                            className="w-full px-4 py-2.5 bg-[var(--lc-amber-50)]/20 border border-[var(--lc-amber-300)] focus:border-[var(--lc-teal-500)] focus:ring-1 focus:ring-[var(--lc-teal-500)] rounded-md focus:outline-none text-sm sm:text-base transition-all"
                            value={val}
                            onChange={(e) => {
                              setLocalValues((prev) => ({
                                ...prev,
                                [ph]: e.target.value,
                              }));
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="pt-6 border-t border-[var(--lc-neutral-200)] flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs sm:text-sm text-[var(--lc-neutral-500)] hover:text-[var(--lc-teal-700)] font-semibold flex items-center gap-1 focus:outline-none"
            >
              <ArrowLeft size={14} /> Voltar ao modelo
            </button>

            <button
              type="button"
              onClick={handleGenerateMessage}
              className="px-6 py-2.5 bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white rounded-[var(--lc-radius-full)] text-xs font-bold shadow-md transition-all hover:scale-102 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--lc-teal-500)]"
            >
              <Sparkles size={14} /> Gerar mensagem &rarr;
            </button>
          </div>
        </div>
      )}

      {/* --- PASSO 4: VALIDAÇÃO & REVISÃO (EDITOR) --- */}
      {currentStep === 4 && selectedTemplate && selectedModelId && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="text-center space-y-1.5 mb-2">
            <h2 className="text-xl font-bold text-[var(--lc-neutral-800)]">
              Revisão do texto
            </h2>
            <p className="text-xs text-[var(--lc-neutral-500)]">
              Faça ajustes manuais ou correções livres no editor a seguir.
            </p>
          </div>

          <textarea
            className="w-full h-64 sm:h-80 p-4 sm:p-5 bg-white border border-[var(--lc-neutral-200)] focus:border-[var(--lc-teal-500)] rounded-md focus:outline-none font-sans text-sm sm:text-base leading-relaxed text-[var(--lc-neutral-800)] transition-all resize-none shadow-sm focus:ring-1 focus:ring-[var(--lc-teal-500)]"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            placeholder="Ajuste o comunicado final..."
          />

          <div className="pt-6 border-t border-[var(--lc-neutral-200)] flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="text-xs sm:text-sm text-[var(--lc-neutral-500)] hover:text-[var(--lc-teal-700)] font-semibold flex items-center gap-1 focus:outline-none"
            >
              <ArrowLeft size={14} /> Voltar aos dados
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-6 py-2.5 bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white rounded-[var(--lc-radius-full)] text-xs font-bold shadow-md transition-all hover:scale-102 focus:outline-none focus:ring-2 focus:ring-[var(--lc-teal-500)]"
            >
              Finalizar mensagem &rarr;
            </button>
          </div>
        </div>
      )}

      {/* --- PASSO 5: PRONTO PARA COPIAR OU ENVIAR --- */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-bold text-[var(--lc-neutral-800)]">
              Comunicado pronto
            </h2>
            <p className="text-xs text-[var(--lc-neutral-500)]">
              {whatsappPhone
                ? "Envie diretamente via WhatsApp ou copie o texto finalizado."
                : "Copie o texto finalizado para enviar por outro meio."}
            </p>
          </div>

          <div className="bg-white border border-[var(--lc-neutral-200)] rounded-md p-5 sm:p-6 min-h-[200px] shadow-sm flex flex-col justify-between gap-6">
            <p className="text-sm sm:text-base text-[var(--lc-neutral-800)] whitespace-pre-wrap leading-relaxed font-sans">
              {editedText}
            </p>

            <div className="pt-6 border-t border-[var(--lc-neutral-100)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-4 items-center justify-center sm:justify-start order-2 sm:order-1">
                <button
                  type="button"
                  onClick={resetWizard}
                  className="text-xs sm:text-sm text-[var(--lc-neutral-500)] hover:text-[var(--lc-teal-700)] font-bold transition-colors focus:outline-none"
                >
                  Criar Novo
                </button>
                <span className="text-[var(--lc-neutral-300)] text-xs">|</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-xs sm:text-sm text-[var(--lc-neutral-500)] hover:text-[var(--lc-teal-700)] font-bold transition-colors focus:outline-none"
                >
                  Editar Texto
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full sm:w-auto order-1 sm:order-2">
                {whatsappPhone && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[var(--lc-radius-full)] transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-sm hover:scale-102 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
                  >
                    <Send size={16} /> Enviar no WhatsApp
                  </a>
                )}
                <button
                  onClick={handleCopy}
                  type="button"
                  className="w-full sm:w-auto px-5 py-3 bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white rounded-[var(--lc-radius-full)] transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-sm hover:scale-102 focus:outline-none focus:ring-2 focus:ring-[var(--lc-teal-500)]"
                >
                  {copied ? (
                    <>
                      <Check size={16} /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Copiar Texto
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPending && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-[var(--lc-teal-500)] z-50 animate-pulse" />
      )}
    </div>
  );
}
