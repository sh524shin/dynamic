import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const FormulaCard = ({ title, formula, description, badge }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -5 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    className="relative flex flex-col h-full group overflow-visible"
  >
    {/* Top Accent Bar */}
    <div className="h-2 w-full bg-primary rounded-t-full relative z-30 shadow-[0_0_30px_rgba(99,102,241,0.8)] transition-all" />

    <div
      style={{ border: '2px solid #64748b', backgroundColor: '#131424', padding: '3rem' }}
      className="flex flex-col gap-6 relative z-20 border-2 border-slate-500/50 bg-slate-900 shadow-[0_40px_100px_rgba(0,0,0,0.8)] group-hover:border-white/60 transition-all rounded-b-[32px] h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[80px] opacity-40 group-hover:opacity-70 transition-all" />

      <div className="flex justify-between items-start relative z-10">
        <h3 className="text-2xl font-black text-white leading-tight tracking-tight drop-shadow-lg">{title}</h3>
        {badge && (
          <span className="bg-slate-800 text-primary-glow text-[10px] px-3 py-1 rounded-md font-black uppercase tracking-widest border border-slate-500 shadow-xl">
            {badge}
          </span>
        )}
      </div>

      <div className="relative z-10 bg-slate-900/60 p-8 rounded-2xl border border-white/10 shadow-inner my-2 flex items-center justify-center min-h-[140px] group-hover:bg-slate-900/80 transition-colors">
        <div className="text-white scale-110 md:scale-125 origin-center text-center w-full drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
          <BlockMath math={formula} />
        </div>
      </div>

      <p className="text-slate-400 leading-relaxed text-base relative z-10 group-hover:text-white transition-colors pr-2">
        {description}
      </p>
    </div>
  </motion.div>
);

const FormulaSection = () => {
  const formulas = [
    {
      title: "부채꼴의 호와 넓이",
      formula: "l = r\\theta, \\quad S = \\frac{1}{2}r^2\\theta = \\frac{1}{2}rl",
      description: "반지름 r, 중심각 θ(라디안)인 부채꼴에서 호의 길이 l과 넓이 S를 구하는 공식입니다.",
      badge: "기하"
    },
    {
      title: "삼각함수의 정의 (단위원)",
      formula: "\\sin \\theta = y, \\quad \\cos \\theta = x, \\quad \\tan \\theta = \\frac{y}{x}",
      description: "단위원 위를 도는 '각도를 나타내는 선(동경)'이 멈춘 점 P(x, y)의 좌표를 통해 정의합니다.",
      badge: "기초"
    },
    {
      title: "사인 법칙 (Law of Sines)",
      formula: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R",
      description: "삼각형의 변의 길이와 그 대각의 사인값, 외접원의 반지름 R 사이의 관계입니다.",
      badge: "중요"
    },
    {
      title: "코사인 법칙 (Law of Cosines)",
      formula: "a^2 = b^2 + c^2 - 2bc \\cos A",
      description: "두 변의 길이와 그 끼인각을 알 때 제3의 변을 구하는 피타고라스 정리의 확장판입니다.",
      badge: "중요"
    },
    {
      title: "삼각형의 넓이",
      formula: "S = \\frac{1}{2}bc \\sin A",
      description: "두 변과 끼인각을 활용하여 삼각형의 넓이를 가장 효율적으로 구합니다.",
      badge: "기하"
    },
    {
      title: "삼각함수의 성질",
      formula: "\\sin^2 \\theta + \\cos^2 \\theta = 1, \\quad \\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta}",
      description: "삼각함수 사이의 가장 기본적인 대수적 관계식들입니다.",
      badge: "기초"
    },
    {
      title: "주기와 대칭성",
      formula: "\\sin(-\\theta) = -\\sin\\theta, \\quad \\cos(-\\theta) = \\cos\\theta",
      description: "함수의 주기성과 기함수/우함수 성질을 이용해 복잡한 각을 단순화합니다.",
      badge: "함수"
    },
    {
      title: "삼각함수의 각 변환",
      formula: "\\sin(\\frac{\pi}{2} \\pm \\theta) = \\cos \\theta, \\quad \\cos(\\frac{\pi}{2} \\pm \\theta) = \\mp \\sin \\theta",
      description: "nπ/2 ± θ 꼴의 각을 변환하는 원리입니다. n이 홀수면 함수가 바뀌고(sin↔cos), 부호는 원래 함수가 속한 사분면을 따릅니다.",
      badge: "중요"
    },
    {
      title: "삼각함수의 덧셈정리",
      formula: "\\sin(\\alpha \\pm \\beta) = \\sin\\alpha\\cos\\beta \\pm \\cos\\alpha\\sin\\beta",
      description: "두 각의 합이나 차에 대한 삼각함수 값을 구하는 미적분의 핵심 공식입니다.",
      badge: "미적분"
    },
    {
      title: "배각 공식 (Double Angle)",
      formula: "\\sin 2\\alpha = 2\\sin\\alpha\\cos\\alpha, \\quad \\cos 2\\alpha = \\cos^2\\alpha - \\sin^2\\alpha",
      description: "덧셈정리에서 파생된 공식으로, 각을 두 배로 키우거나 절반으로 줄일 때 사용합니다.",
      badge: "미적분"
    },
    {
      title: "삼각함수의 미분",
      formula: "(\\sin x)' = \\cos x, \\quad (\\cos x)' = -\\sin x, \\quad (\\tan x)' = \\sec^2 x",
      description: "각 함수들의 변화율을 정의합니다. 'co'로 시작하는 함수군을 미분하면 음수(-)가 붙습니다.",
      badge: "미적분"
    },
    {
      title: "삼각함수의 적분",
      formula: "\\int \\sin x dx = -\\cos x + C, \\quad \\int \\cos x dx = \\sin x + C",
      description: "삼각함수의 부정적분 공식입니다. 미분의 역과정임을 기억하세요.",
      badge: "미적분"
    },
  ];

  return (
    <div className="space-y-20">
      <div
        style={{ marginBottom: '50px' }}
        className="text-center"
      >
        <h2 className="text-4xl mb-6 font-black tracking-tighter text-white">핵심 공식 요약</h2>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">고등학교 수학 I 과정의 핵심 삼각함수 공식을 정리했습니다.</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '50px'
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-16"
      >
        {formulas.map((f, i) => (
          <FormulaCard key={i} {...f} />
        ))}
      </div>

      <div className="glass p-10 border-l-8 border-l-primary bg-primary/5 mt-16 flex flex-col md:flex-row gap-6 relative overflow-hidden">
        <AlertTriangle className="text-primary flex-shrink-0" size={32} />
        <div className="relative z-10">
          <h4 className="text-xl font-black text-white mb-4 tracking-tight">수학 I & 미적분 정복 전략</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-text-muted leading-relaxed">
            <div>
              <p className="font-bold text-neon-cyan mb-1">수학 I (공통)</p>
              **각도를 나타내는 선(동경)**의 위치와 그래프의 주기성을 이해하는 것이 핵심입니다. **각 변환** 시에는 '얼싸안코' 부호 결정과 n의 홀짝에 따른 함수 변화 법칙만 알면 모든 공식을 유도할 수 있습니다.
            </div>
            <div>
              <p className="font-bold text-neon-purple mb-1">미적분 (선택)</p>
              덧셈정리는 모든 미분/적분 공식의 시작입니다. 공식을 유도해 보며 각 함수 사이의 관계를 파악하면 고난도 배각/반각 공식을 더 쉽게 기억할 수 있습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaSection;
