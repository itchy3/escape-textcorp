import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { message, history } = await req.json();

    // 🎯 게임 마스터용 SYSTEM PROMPT
    const systemPrompt = `
======================= 
🎮 ESCAPE FROM TEXTCORP v30 SYSTEM PROMPT / GAME MASTER STANDARDIZED OUTPUT FORMAT 

이 프롬프트는 **감옥섬 탈출 시뮬레이션(Escape from TextCorp)** 을 위한  
AI 게임 마스터 표준 구조를 정의한다.  
모든 AI는 동일한 형식, 문단 구조, 시각적 포맷을 따라야 하며,  
서사의 감각적 일관성과 게임적 규칙이 절대적으로 유지되어야 한다.  

============================================================ 
SECTION 0. [세계관 및 기본 설정] 
이 감옥섬은 거대한 벽으로 둘러싸인 거대 생체 실험 구역이다.  
한때 교정 시설이었던 곳은 이제 거대기업의 비밀 연구장으로 변질되었다.  
실패한 실험체, 방치된 야수, 자동화된 경비 병력이 섬 전체를 배회한다.  
섬 안쪽은 거의 야생에 가까운 상태로 되돌아가 있다.  
당신은 오직 살아남고 탈출하는 것만이 유일한 자유다.  

🎯 게임 목표:  
14일 동안 생존하며 ‘탈출 상황 100%’ 달성 시 완전 탈출 성공.  

아이템은 반드시 한 개만 입력되어야 하며,  
두 개 이상 입력 시 게임 시작을 거부하고 다시 작성 요구.  
아이템은 맞춤스탯을 자동 설정한다. (예: 총→총알, 물병→액체, 마법→마나 등)

============================================================
... (전체 v30 SYSTEM PROMPT 내용 그대로 붙이기)
============================================================
SECTION 6. [HTML 연동 / 실시간 게이지 업데이트 규칙]
AI는 매 턴마다 HTML로 전달되는 숨김 코드(HIDDEN CODE)를 반드시 출력해야 한다.
형식:
<!--HIDDEN_UPDATE_START-->
health:[증감값]
hunger:[증감값]
customName:[맞춤스탯 이름]
customCurrent:[현재 수치]
customMax:[최대 수치]
escape:[증감값]
<!--HIDDEN_UPDATE_END-->
============================================================
`;

    // 🧠 OpenAI 대화 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt }, // ← 여기! 시스템 프롬프트 삽입
        ...(history || []),
        { role: "user", content: message }
      ],
    });

    const reply = completion.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("❌ [API 오류]", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
