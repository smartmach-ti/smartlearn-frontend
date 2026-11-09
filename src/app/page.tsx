"use client";

import { useState } from "react";
import {
  ArrowLeft, ArrowRight, Award, Check, CheckCircle2, ClipboardList, Cpu,
  Lock, LogOut, Mail, MonitorCog, PlayCircle, RotateCcw, ShieldCheck, X, XCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Mock data                                                          */
/* ------------------------------------------------------------------ */

type Screen = "login" | "courses" | "player" | "quiz";
type CourseId = "sisvend" | "siscontrol";

type Lesson = { id: number; title: string; description: string; duration: string; youtubeId: string };
type Course = { id: CourseId; name: string; tagline: string; description: string; icon: typeof Cpu; lessons: Lesson[] };
type Question = { question: string; options: string[]; correct: number };

const COURSES: Course[] = [
  {
    id: "sisvend",
    name: "Sisvend",
    tagline: "Operação de vendas",
    description: "Aprenda a operar o sistema de vendas das máquinas: cadastro de produtos, preços, abastecimento e leitura de relatórios.",
    icon: Cpu,
    lessons: [
      { id: 1, title: "Aula 1 - Introdução", description: "Visão geral do Sisvend, navegação na interface e principais conceitos de operação.", duration: "08:12", youtubeId: "dQw4w9WgXcQ" },
      { id: 2, title: "Aula 2 - Cadastro de Produtos", description: "Como cadastrar, editar e organizar os produtos por canaleta.", duration: "11:40", youtubeId: "dQw4w9WgXcQ" },
      { id: 3, title: "Aula 3 - Abastecimento", description: "Rotina de abastecimento, conferência de estoque e fechamento de caixa.", duration: "09:55", youtubeId: "dQw4w9WgXcQ" },
    ],
  },
  {
    id: "siscontrol",
    name: "Siscontrol",
    tagline: "Telemetria e controle",
    description: "Monitore máquinas remotamente, acompanhe alertas, falhas e indicadores de desempenho da sua rota.",
    icon: MonitorCog,
    lessons: [
      { id: 1, title: "Aula 1 - Introdução", description: "Conhecendo o painel do Siscontrol e o conceito de telemetria.", duration: "07:30", youtubeId: "dQw4w9WgXcQ" },
      { id: 2, title: "Aula 2 - Alertas e Falhas", description: "Interpretação de alertas, códigos de erro e priorização de atendimento.", duration: "10:05", youtubeId: "dQw4w9WgXcQ" },
      { id: 3, title: "Aula 3 - Relatórios", description: "Indicadores de desempenho e exportação de relatórios da rota.", duration: "12:18", youtubeId: "dQw4w9WgXcQ" },
    ],
  },
];

const QUIZ: Question[] = [
  { question: "Qual é a primeira etapa antes de iniciar o abastecimento de uma máquina?", options: ["Desligar a máquina da tomada", "Conferir o estoque no sistema", "Limpar o vidro frontal", "Trocar o moedeiro"], correct: 1 },
  { question: "O que deve ser feito ao identificar um alerta de falha no noteiro?", options: ["Ignorar até a próxima visita", "Reiniciar a máquina várias vezes", "Registrar o chamado e verificar o código de erro", "Remover o noteiro"], correct: 2 },
  { question: "Onde os preços dos produtos são configurados?", options: ["No cadastro de produtos do sistema", "Diretamente no moedeiro", "Na etiqueta física apenas", "No relatório de vendas"], correct: 0 },
  { question: "Com que frequência o fechamento de caixa deve ser realizado?", options: ["Uma vez por ano", "Somente quando houver falha", "A cada visita de abastecimento", "Nunca, é automático"], correct: 2 },
  { question: "Qual o principal benefício da telemetria?", options: ["Deixar a máquina mais bonita", "Monitorar a máquina remotamente em tempo real", "Aumentar o preço dos produtos", "Substituir o abastecimento"], correct: 1 },
];

const PASS_THRESHOLD = 60;

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [screen, setScreen] = useState<Screen>("login");
  const [courseId, setCourseId] = useState<CourseId | null>(null);
  const course = COURSES.find((c) => c.id === courseId) ?? null;

  return (
    <main className="min-h-screen">
      {screen === "login" && <LoginScreen onLogin={() => setScreen("courses")} />}
      {screen === "courses" && (
        <CoursesScreen
          onLogout={() => setScreen("login")}
          onSelect={(id) => { setCourseId(id); setScreen("player"); }}
        />
      )}
      {screen === "player" && course && (
        <PlayerScreen key={course.id} course={course} onBack={() => setScreen("courses")} onQuiz={() => setScreen("quiz")} />
      )}
      {screen === "quiz" && course && (
        <QuizScreen course={course} onExit={() => setScreen("courses")} />
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Shared                                                             */
/* ------------------------------------------------------------------ */

function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/logo.png"
        alt="Logo SmartMach"
        className={`w-auto object-contain ${size === "lg" ? "h-14" : "h-9"}`}
      />
      <span className={`font-semibold tracking-tight ${size === "lg" ? "text-2xl" : "text-base"}`}>
        SmartLearn <span className="font-normal text-neutral-400">certificações</span>
      </span>
    </div>
  );
}

function Header({ onLogout, onBack }: { onLogout: () => void; onBack?: () => void }) {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button id="back-button" onClick={onBack} className="grid h-9 w-9 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900" aria-label="Voltar">
              <ArrowLeft size={18} />
            </button>
          )}
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500">Olá, <span className="font-medium text-neutral-900">Operador</span></span>
          <button id="logout-button" onClick={onLogout} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900">
            <LogOut size={15} /> Sair
          </button>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Login                                                           */
/* ------------------------------------------------------------------ */

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-10 flex flex-col items-center text-center">
          <Logo size="lg" />
          <h1 className="mt-6 text-sm text-neutral-500">Treinamento de operadores de Vending Machines</h1>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); onLogin(); }}
          className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <Field id="email" label="E-mail" type="email" value={email} onChange={setEmail} placeholder="voce@empresa.com" icon={<Mail size={16} />} />
          <Field id="password" label="Senha" type="password" value={password} onChange={setPassword} placeholder="••••••••" icon={<Lock size={16} />} />
          <button id="login-button" type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.99]">
            Acessar Plataforma <ArrowRight size={16} />
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-neutral-400">© {new Date().getFullYear()} SmartMach · Ambiente de demonstração</p>
      </div>
    </div>
  );
}

function Field(props: { id: string; label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string; icon: React.ReactNode }) {
  return (
    <label htmlFor={props.id} className="block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-600">{props.label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">{props.icon}</span>
        <input
          id={props.id}
          type={props.type}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
        />
      </div>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Courses                                                         */
/* ------------------------------------------------------------------ */

function CoursesScreen({ onLogout, onSelect }: { onLogout: () => void; onSelect: (id: CourseId) => void }) {
  return (
    <>
      <Header onLogout={onLogout} />
      <section className="mx-auto max-w-5xl px-6 py-16 animate-fade-up">
        <p className="text-xs font-medium uppercase tracking-widest text-brand-600">Seu aprendizado</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Trilhas de Conhecimento</h1>
        <p className="mt-2 max-w-lg text-neutral-500">Escolha uma trilha para começar. Conclua as aulas em sequência e faça o quiz final para obter seu certificado.</p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {COURSES.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                id={`course-${c.id}`}
                onClick={() => onSelect(c.id)}
                className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 text-left transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)]"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon size={26} strokeWidth={1.6} />
                </div>
                <span className="mt-8 text-xs text-neutral-400">{c.tagline}</span>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">{c.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500">{c.description}</p>
                <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-5 text-sm">
                  <span className="text-neutral-500">{c.lessons.length} aulas · Quiz final</span>
                  <span className="flex items-center gap-1 font-medium text-neutral-900">
                    Começar <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Player                                                          */
/* ------------------------------------------------------------------ */

function PlayerScreen({ course, onBack, onQuiz }: { course: Course; onBack: () => void; onQuiz: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const lesson = course.lessons[activeIndex];
  const isLast = activeIndex === course.lessons.length - 1;
  const allDone = completed.length === course.lessons.length;

  const isUnlocked = (i: number) => i === 0 || completed.includes(i - 1);

  const handleComplete = () => {
    const next = completed.includes(activeIndex) ? completed : [...completed, activeIndex];
    setCompleted(next);
    if (isLast) onQuiz();
    else setActiveIndex(activeIndex + 1);
  };

  return (
    <>
      <Header onLogout={onBack} onBack={onBack} />
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[7fr_3fr]">
        {/* Main column */}
        <section key={lesson.id} className="animate-fade-up">
          <div className="aspect-video overflow-hidden rounded-2xl bg-neutral-900 shadow-sm">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${lesson.youtubeId}?rel=0`}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-brand-600">{course.name}</span>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">{lesson.title}</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500">{lesson.description}</p>
            </div>
            <button
              id="complete-lesson-button"
              onClick={handleComplete}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-700 active:scale-[0.99]"
            >
              <Check size={16} />
              {isLast ? "Marcar como concluída e ir para o Quiz" : "Marcar como concluída e ir para a próxima"}
            </button>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-5 lg:sticky lg:top-24">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Conteúdo do Curso</h2>
            <span className="text-xs text-neutral-400">{completed.length}/{course.lessons.length}</span>
          </div>
          <div className="mb-5 h-1 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${(completed.length / course.lessons.length) * 100}%` }} />
          </div>

          <ul className="space-y-3">
            {course.lessons.map((l, i) => (
              <li key={l.id}>
                <LessonThumb
                  id={`lesson-${l.id}`}
                  title={l.title}
                  meta={l.duration}
                  active={i === activeIndex}
                  done={completed.includes(i)}
                  locked={!isUnlocked(i)}
                  onClick={() => setActiveIndex(i)}
                  icon={<PlayCircle size={22} strokeWidth={1.5} />}
                />
              </li>
            ))}
            <li>
              <LessonThumb
                id="lesson-quiz"
                title="Quiz Final"
                meta={`${QUIZ.length} perguntas`}
                active={false}
                done={false}
                locked={!allDone}
                onClick={onQuiz}
                icon={<ClipboardList size={22} strokeWidth={1.5} />}
              />
            </li>
          </ul>
        </aside>
      </div>
    </>
  );
}

function LessonThumb(props: { id: string; title: string; meta: string; active: boolean; done: boolean; locked: boolean; onClick: () => void; icon: React.ReactNode }) {
  const { locked, active, done } = props;
  return (
    <button
      id={props.id}
      disabled={locked}
      onClick={props.onClick}
      className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition ${active ? "border-brand-500 bg-brand-50/60" : "border-transparent hover:bg-neutral-50"
        } ${locked ? "cursor-not-allowed" : ""}`}
    >
      <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg">
        <div className={`grid h-full w-full place-items-center bg-gradient-to-br from-neutral-200 to-neutral-300 text-neutral-600 transition ${locked ? "scale-110 opacity-50 blur-[3px]" : ""}`}>
          {props.icon}
        </div>
        {locked && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-neutral-700 shadow-sm">
              <Lock size={14} />
            </div>
          </div>
        )}
        {done && !locked && (
          <div className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white">
            <Check size={12} strokeWidth={3} />
          </div>
        )}
      </div>
      <div className={`min-w-0 ${locked ? "opacity-50" : ""}`}>
        <p className={`truncate text-sm ${active ? "font-semibold text-neutral-900" : "font-medium text-neutral-700"}`}>{props.title}</p>
        <p className="mt-0.5 text-xs text-neutral-400">{locked ? "Bloqueado" : props.meta}</p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Quiz                                                            */
/* ------------------------------------------------------------------ */

function QuizScreen({ course, onExit }: { course: Course; onExit: () => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ.length).fill(null));
  const [finished, setFinished] = useState(false);

  const q = QUIZ[current];
  const selected = answers[current];
  const answered = selected !== null;
  const score = answers.filter((a, i) => a === QUIZ[i].correct).length;
  const percent = Math.round((score / QUIZ.length) * 100);
  const passed = percent >= PASS_THRESHOLD;

  const choose = (i: number) => {
    if (answered) return;
    setAnswers((prev) => prev.map((a, idx) => (idx === current ? i : a)));
  };

  const next = () => {
    if (current < QUIZ.length - 1) setCurrent(current + 1);
    else setFinished(true);
  };

  const restart = () => {
    setAnswers(Array(QUIZ.length).fill(null));
    setCurrent(0);
    setFinished(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-6">
        <Logo />
        <button id="quiz-exit-button" onClick={onExit} className="grid h-9 w-9 place-items-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900" aria-label="Sair do quiz">
          <X size={18} />
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-20 pt-10">
        {!finished ? (
          <div key={current} className="animate-fade-up">
            <div className="mb-10">
              <div className="mb-3 flex items-center justify-between text-xs text-neutral-400">
                <span>Quiz Final · {course.name}</span>
                <span>Pergunta {current + 1} de {QUIZ.length}</span>
              </div>
              <div className="flex gap-1.5">
                {QUIZ.map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition ${answers[i] === null ? (i === current ? "bg-neutral-300" : "bg-neutral-100")
                    : answers[i] === QUIZ[i].correct ? "bg-emerald-500" : "bg-red-500"
                    }`} />
                ))}
              </div>
            </div>

            <h1 className="text-2xl font-semibold leading-snug tracking-tight">{q.question}</h1>

            <div className="mt-8 space-y-3">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correct;
                const isSelected = i === selected;
                let style = "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50";
                let badge: React.ReactNode = <span className="text-xs font-medium">{String.fromCharCode(65 + i)}</span>;
                if (answered) {
                  if (isCorrect) {
                    style = "border-emerald-500 bg-emerald-50 text-emerald-900";
                    badge = <Check size={14} strokeWidth={3} />;
                  } else if (isSelected) {
                    style = "border-red-500 bg-red-50 text-red-900";
                    badge = <X size={14} strokeWidth={3} />;
                  } else {
                    style = "border-neutral-100 text-neutral-400";
                  }
                }
                return (
                  <button
                    key={i}
                    id={`quiz-option-${i}`}
                    onClick={() => choose(i)}
                    disabled={answered}
                    className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left text-sm transition ${style}`}
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${answered && isCorrect ? "border-emerald-500 bg-emerald-500 text-white"
                      : answered && isSelected ? "border-red-500 bg-red-500 text-white"
                        : "border-neutral-300 text-neutral-500"
                      }`}>{badge}</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex h-12 items-center justify-between">
              {answered && (
                <>
                  <p className={`flex items-center gap-2 text-sm font-medium ${selected === q.correct ? "text-emerald-600" : "text-red-600"}`}>
                    {selected === q.correct ? <><CheckCircle2 size={18} /> Resposta correta!</> : <><XCircle size={18} /> Resposta incorreta</>}
                  </p>
                  <button id="quiz-next-button" onClick={next} className="flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800">
                    {current < QUIZ.length - 1 ? "Próxima" : "Ver resultado"} <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-fade-up rounded-2xl border border-neutral-200 p-10 text-center">
            <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${passed ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
              {passed ? <ShieldCheck size={30} strokeWidth={1.6} /> : <XCircle size={30} strokeWidth={1.6} />}
            </div>
            <h1 className={`mt-6 text-3xl font-semibold tracking-tight ${passed ? "text-emerald-600" : "text-red-600"}`}>
              {passed ? "Aprovado" : "Reprovado"}
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              {passed ? "Parabéns! Você concluiu a trilha com sucesso." : `É necessário atingir pelo menos ${PASS_THRESHOLD}% para ser aprovado.`}
            </p>

            <div className="my-10 flex items-end justify-center gap-1">
              <span className="text-6xl font-semibold tracking-tighter">{percent}</span>
              <span className="mb-2 text-xl text-neutral-400">%</span>
            </div>
            <p className="-mt-6 mb-10 text-sm text-neutral-400">{score} de {QUIZ.length} respostas corretas</p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              {passed ? (
                <button id="certificate-button" className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-700">
                  <Award size={16} /> Gerar Certificado
                </button>
              ) : (
                <button id="retry-quiz-button" onClick={restart} className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700">
                  <RotateCcw size={16} /> Refazer Quiz
                </button>
              )}
              <button id="back-to-courses-button" onClick={onExit} className="rounded-xl border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900">
                Voltar às trilhas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
