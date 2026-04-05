import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { CheckCircle2, AlertTriangle, Book } from 'lucide-react';

const FormulaCard = ({ title, formula, description, badge }) => (
  <div className="glass p-8 flex flex-col gap-6 relative overflow-hidden group formula-card">
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
    <div className="flex justify-between items-start relative z-10">
      <h3 className="text-2xl font-black text-white leading-tight">{title}</h3>
      {badge && (
        <span className="bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary-glow text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter border border-primary/20">
          {badge}
        </span>
      )}
    </div>
    <div className="bg-white/5 p-10 rounded-[32px] border border-white/10 shadow-2xl backdrop-blur-md relative z-10">
      <BlockMath math={formula} />
    </div>
    <p className="text-text-muted leading-relaxed text-sm relative z-10 group-hover:text-text-main transition-colors">{description}</p>
  </div>
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
      description: "반지름이 1인 단위원 위를 움직이는 점 P(x, y)의 좌표를 통해 삼각함수를 정의합니다.",
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
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl mb-4">핵심 공식 요약</h2>
        <p className="text-text-muted">고등학교 수학 I 과정의 핵심 삼각함수 공식을 정리했습니다.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {formulas.map((f, i) => (
          <FormulaCard key={i} {...f} />
        ))}
      </div>

      <div className="glass p-10 border-l-8 border-l-primary bg-primary/5 mt-16 flex flex-col md:flex-row gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Book className="text-primary" size={180} />
        </div>
        <AlertTriangle className="text-primary flex-shrink-0" size={32} />
        <div className="relative z-10">
          <h4 className="text-xl font-black text-white mb-4 tracking-tight">수학 I & 미적분 정복 전략</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-text-muted leading-relaxed">
            <div>
              <p className="font-bold text-neon-cyan mb-1">수학 I (공통)</p>
              동경의 정의와 그래프의 주기성을 이해하는 것이 핵심입니다. 그래프 탭에서 주기에 따른 파동의 변화를 직접 눈으로 확인하며 계수의 역할을 익히세요.
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
