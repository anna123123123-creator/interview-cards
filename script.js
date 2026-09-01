(function () {
  'use strict';

  var BANK = {
    product: {
      label: '产品经理',
      questions: [
        { q: '介绍一个你主导过的产品，遇到的最大挑战是什么？', hint: 'S-情景：产品背景和目标\nT-任务：你负责的具体范围\nA-行动：你做了什么关键决策\nR-结果：量化的业务结果，以及你从中学到什么' },
        { q: '如何判断一个需求要不要做？', hint: '从用户价值、商业价值、实现成本三个维度展开，举一个你实际拒绝或推迟某个需求的真实例子。' },
        { q: '你的产品上线后数据不达预期，你会怎么做？', hint: '先界定问题（数据下钻定位在哪个环节），再假设验证（列出可能原因），最后给出行动方案和复盘机制。' },
        { q: '如何和研发/设计团队处理分歧？', hint: '描述一次具体分歧、你如何倾听对方立场、用数据或用户反馈推动共识，而不是用职级压人。' },
        { q: '怎么给一个新功能定优先级？', hint: '提出一个量化框架（比如 RICE：影响范围/影响程度/信心/投入），结合具体案例说明取舍逻辑。' },
        { q: '你怎么理解海盗指标 AARRR？', hint: '获客-激活-留存-变现-推荐，结合一个具体产品说明你在哪个环节做了什么优化。' },
      ],
    },
    tech: {
      label: '技术研发',
      questions: [
        { q: '讲一个你解决过的最难的技术问题。', hint: 'STAR 结构：问题背景、你的排查思路、关键技术决策、最终结果和量化收益。' },
        { q: '如何保证代码质量？', hint: '从代码规范、Code Review 机制、单元测试覆盖率、CI/CD 流程几个层面展开，结合具体经历。' },
        { q: '线上出现严重故障，你会怎么处理？', hint: '先止损（回滚/降级），再定位根因，最后复盘和补充监控告警，体现优先级判断能力。' },
        { q: '你如何做技术选型？', hint: '列出评估维度（性能、社区活跃度、团队熟悉度、长期维护成本），结合一次真实选型决策。' },
        { q: '怎么看待技术债？', hint: '承认技术债不可避免，说明你如何量化和排期偿还，平衡业务交付节奏和长期系统健康度。' },
        { q: '描述一次你 Code Review 中发现的严重问题。', hint: '具体的 bug/隐患是什么、你怎么沟通反馈、如何推动避免同类问题再次发生。' },
      ],
    },
    marketing: {
      label: '市场营销',
      questions: [
        { q: '介绍一次你负责的营销活动，效果如何？', hint: '目标设定、渠道选择、执行过程中的调整、最终 ROI 或转化数据，尽量量化。' },
        { q: '如何评估一个渠道值不值得投放？', hint: 'CAC（获客成本）vs LTV（用户生命周期价值），结合具体渠道数据对比说明。' },
        { q: '预算有限的情况下你会怎么分配？', hint: '按渠道历史 ROI 排优先级，同时保留一部分预算做新渠道测试，说明你的决策逻辑。' },
        { q: '怎么理解品牌营销和效果营销的区别？', hint: '品牌是长期心智积累，效果是短期转化，结合具体案例说明你如何平衡两者的投入。' },
        { q: '一次营销活动效果不好，你怎么复盘？', hint: '拆解转化漏斗（曝光-点击-转化），定位具体流失环节，提出下次改进假设。' },
      ],
    },
    behavior: {
      label: '通用行为面试',
      questions: [
        { q: '说一次你和同事有分歧，最后怎么解决的？', hint: 'STAR：具体分歧情景、你的沟通方式、最终达成的共识、你从中学到的协作方式。' },
        { q: '你遇到过的最大失败是什么，怎么面对的？', hint: '诚实描述失败本身，重点放在你的反思和后续改进行动，而不是找客观理由。' },
        { q: '为什么想离开现在的公司？', hint: '聚焦个人成长和未来规划，避免负面评价前公司，保持职业化和正向表达。' },
        { q: '你怎么平衡工作和生活？', hint: '举具体的时间管理方法或优先级判断案例，展示你对高强度工作节奏的适应力。' },
        { q: '五年后你希望自己在什么位置？', hint: '结合岗位发展路径给出合理、具体的职业规划，体现你对这个领域的长期投入意愿。' },
      ],
    },
  };

  var categorySelect = document.getElementById('categorySelect');
  var btnNext = document.getElementById('btnNext');
  var card = document.getElementById('card');
  var cardCat = document.getElementById('cardCat');
  var questionText = document.getElementById('questionText');
  var hintText = document.getElementById('hintText');
  var btnFlip = document.getElementById('btnFlip');
  var btnFlipBack = document.getElementById('btnFlipBack');
  var timerDisplay = document.getElementById('timerDisplay');
  var btnTimer = document.getElementById('btnTimer');

  var lastIndex = -1;
  var timerInterval = null;
  var secondsLeft = 90;

  function pickQuestion() {
    var cat = BANK[categorySelect.value];
    cardCat.textContent = cat.label;
    var idx;
    do { idx = Math.floor(Math.random() * cat.questions.length); }
    while (cat.questions.length > 1 && idx === lastIndex);
    lastIndex = idx;
    var item = cat.questions[idx];
    questionText.textContent = item.q;
    hintText.textContent = item.hint;
    card.classList.remove('flipped');
  }

  function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    secondsLeft = 90;
    timerDisplay.textContent = formatTime(secondsLeft);
    timerDisplay.classList.remove('warn');
    btnTimer.textContent = '开始计时';
  }

  function toggleTimer() {
    if (timerInterval) {
      resetTimer();
      return;
    }
    btnTimer.textContent = '重置';
    timerInterval = setInterval(function () {
      secondsLeft--;
      if (secondsLeft <= 0) {
        secondsLeft = 0;
        clearInterval(timerInterval);
        timerInterval = null;
        btnTimer.textContent = '开始计时';
      }
      timerDisplay.textContent = formatTime(secondsLeft);
      timerDisplay.classList.toggle('warn', secondsLeft <= 15);
    }, 1000);
  }

  btnNext.addEventListener('click', function () {
    pickQuestion();
    resetTimer();
  });
  categorySelect.addEventListener('change', function () {
    lastIndex = -1;
    pickQuestion();
    resetTimer();
  });
  btnFlip.addEventListener('click', function () { card.classList.add('flipped'); });
  btnFlipBack.addEventListener('click', function () { card.classList.remove('flipped'); });
  btnTimer.addEventListener('click', toggleTimer);

  resetTimer();
  pickQuestion();
})();
