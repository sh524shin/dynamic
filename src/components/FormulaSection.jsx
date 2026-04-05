import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const FormulaCard = ({ title, formula, description, badge }) => (
  <div className="glass p-8 flex flex-col gap-4 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <CheckCircle2 size={120} className="text-secondary" />
    </div>
    <div className="flex justify-between items-start">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      {badge && <span className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded-full font-bold uppercase">{badge}</span>}
    </div>
    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-inner">
      <BlockMath math={formula} />
    </div>
    <p className="text-text-muted leading-relaxed">{description}</p>
  </div>
);

const FormulaSection = () => {
  const formulas = [
    {
      title: "사인 법칙 (Law of Sines)",
      formula: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R",
      description: "삼각형 ABC의 세 변의 길이 a, b, c와 그 대각 A, B, C 및 외접원의 반지름 R 사이의 관계입니다. 삼각형의 외접원 반지름을 구할 때 유용합니다.",
      badge: "중요"
    },
    {
      title: "코사인 법칙 (Law of Cosines)",
      formula: "a^2 = b^2 + c^2 - 2bc \\cos A",
      description: "삼각형의 두 변의 길이와 그 끼인각을 알 때, 제3의 변의 길이를 구하는 공식입니다. 피타고라스 정리의 일반화 버전으로 이해할 수 있습니다.",
      badge: "중요"
    },
    {
      title: "삼각형의 넓이",
      formula: "S = \\frac{1}{2}bc \\sin A",
      description: "두 변의 길이와 그 끼인각을 알 때 삼각형의 넓이를 구하는 가장 직관적인 방법입니다.",
    },
    {
      title: "삼각함수의 성질",
      formula: "\\sin^2 \\theta + \\cos^2 \\theta = 1",
      description: "어떤 각도 θ에 대해서도 사인 제곱과 코사인 제곱의 합은 항상 1입니다. 삼각함수 문제 풀이의 가장 기본이 되는 항등식입니다.",
      badge: "기초"
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

      <div className="glass p-8 border-l-4 border-l-yellow-500 bg-yellow-500/5 mt-12 flex gap-4">
        <AlertTriangle className="text-yellow-500 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-yellow-500 mb-2">암기 팁</h4>
          <p className="text-sm text-text-muted">공식을 그냥 외우는 것보다 삼각형을 그려보며 변과 각의 관계를 시각화하는 것이 훨씬 효과적입니다. 위 시뮬레이터 탭에서 주기에 따른 변화를 먼저 익혀보세요.</p>
        </div>
      </div>
    </div>
  );
};

export default FormulaSection;
