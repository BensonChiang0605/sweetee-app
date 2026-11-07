export const labels = ['Not at all', 'A little', 'Somewhat', 'A lot', 'Very much'];

export const preferences = [
  { id: 'inclusion', name: 'Inclusion', description: 'Sharing ordinary details helps you feel part of each other’s everyday lives.', idea: 'Each share one ordinary photo from your day and the small story behind it.' },
  { id: 'known', name: 'Feeling known', description: 'Remembered tastes, interests, and details make gestures feel personal to you.', idea: 'Each mention one small thing you remember the other person enjoying, then choose a gesture around it.' },
  { id: 'understanding', name: 'Understanding', description: 'Feeling emotionally understood is a meaningful part of connection for you.', idea: 'Each describe one feeling from this week. Listen and ask a question before offering advice.' },
  { id: 'chosen', name: 'Feeling chosen', description: 'Your partner taking initiative and deliberately making time helps you feel wanted.', idea: 'Take turns choosing a small moment to spend together this week and initiating the plan.' },
  { id: 'support', name: 'Practical support', description: 'Concrete help with everyday responsibilities can feel like affection to you.', idea: 'Ask each other which small task would make this week easier, and agree on one way to help.' },
  { id: 'reassurance', name: 'Reassurance', description: 'Steady expressions of affection and availability help you feel connected.', idea: 'Each say one thing you appreciate about your relationship and one way you can be there for each other this week.' },
  { id: 'ease', name: 'Ease', description: 'Quiet, unhurried company can feel connecting without needing an activity or constant conversation.', idea: 'Spend twenty relaxed minutes together or on a call while doing your own things, with room for comfortable pauses.' },
  { id: 'play', name: 'Play', description: 'Shared humor, familiar jokes, and silliness are ways you enjoy connecting.', idea: 'Make up three silly questions about the two of you and compare your answers.' },
  { id: 'discovery', name: 'Discovery', description: 'Experiencing something unfamiliar together helps you feel close.', idea: 'Pick a new song, recipe, or place to explore together, then share what surprised you.' },
  { id: 'touch', name: 'Touch', description: 'The physical experience of affectionate contact is meaningful to you.', idea: 'If you’re together and both want to, make time for a long hug. If you’re apart, tell each other which affectionate moment you miss.' },
];

export const questions = [
  ['inclusion', 'A photo of something ordinary, like my partner’s lunch, can make me feel closer to them.'],
  ['play', 'Turning a boring errand into a ridiculous game together feels romantic to me.'],
  ['touch', 'When we’re together, I often want physical contact even while we’re each doing something else.'],
  ['known', 'When my partner remembers exactly how I like something, I feel especially cared for.'],
  ['ease', 'An evening spent quietly doing separate things in the same room can feel like quality time to me.'],
  ['discovery', 'Trying something unfamiliar together can make me feel closer to my partner, even if we end up disliking it.'],
  ['reassurance', 'I like hearing that my partner loves me, even when nothing has happened to make me doubt it.'],
  ['support', 'My partner taking care of a boring task for me can feel romantic.'],
  ['chosen', 'When my partner is the one to suggest spending time together, I feel especially wanted.'],
  ['understanding', 'I feel closer when my partner asks questions that help me explain a feeling I haven’t quite put into words.'],
  ['known', 'It means a lot when my partner brings up a passing comment I made weeks ago.'],
  ['discovery', 'Discovering a new place together feels connecting to me, even when the visit doesn’t go to plan.'],
  ['support', 'When I’m overwhelmed, help with one concrete task makes a noticeable difference to how connected I feel to my partner.'],
  ['inclusion', 'I enjoy hearing the small, uneventful details of my partner’s day, even when there’s no particular story to tell.'],
  ['understanding', 'Talking through a feeling with my partner matters to me even when there’s nothing to solve.'],
  ['touch', 'I like hugs that last long enough for us to settle into them.'],
  ['chosen', 'Knowing my partner deliberately set aside time for us makes that time feel special.'],
  ['play', 'Affectionate teasing is one of the ways I most enjoy connecting with my partner.'],
  ['reassurance', 'After we’ve resolved a disagreement, I still appreciate hearing explicitly that we’re okay.'],
  ['ease', 'I enjoy staying on a call while we each do our own thing, even when there are long pauses.'],
  ['support', 'When my partner helps with an everyday responsibility, I experience it as an expression of affection.'],
  ['ease', 'I can come away from time together feeling close even if we barely talked.'],
  ['known', 'I feel especially cared for when my partner chooses something because they remember I like it.'],
  ['reassurance', 'Familiar affectionate words still mean something to me, even when my partner says them regularly.'],
  ['play', 'Revisiting the same silly joke can make me feel close to my partner, even after we’ve told it dozens of times.'],
  ['understanding', 'Sharing feelings I’m still figuring out makes me feel closer to my partner.'],
  ['discovery', 'Learning something alongside my partner feels intimate, even when we’re both awkward beginners.'],
  ['chosen', 'I feel especially cared for when my partner takes the initiative to arrange something for us.'],
  ['touch', 'Casual touches throughout our time together matter to me, even when we’ve already had a long cuddle.'],
  ['inclusion', 'Getting little updates across the day helps me feel connected, even when we’ll catch up properly later.'],
].map(([preference, text]) => ({ preference, text }));

export function validAnswers(answers) {
  return Array.isArray(answers) && answers.length === questions.length &&
    answers.every(value => value === null || (Number.isInteger(value) && value >= 1 && value <= 5));
}

export function calculateScores(answers) {
  if (!validAnswers(answers) || answers.includes(null)) throw new Error('Answer all 30 questions first.');
  return preferences.map(preference => questions.reduce((sum, question, index) =>
    sum + (question.preference === preference.id ? answers[index] : 0), 0));
}

export function topPreferences(scores) {
  const maximum = Math.max(...scores);
  return preferences.filter((_, index) => scores[index] === maximum);
}

export function decodeSharedScores(hash) {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  if (params.get('v') !== '1' || !params.has('scores')) return null;
  const values = params.get('scores').split(',');
  if (values.length !== preferences.length || values.some(value => !/^(?:[3-9]|1[0-5])$/.test(value))) return null;
  return values.map(Number);
}

export const resultAnalysis = {
  "inclusion": [
    "Let me into the little things.",
    "A quick photo or an uneventful story can make you feel present in your partner’s life. When this preference scores highly, connection can come from small moments spread across the day, including moments that would otherwise disappear before your next proper catch-up.",
    "Your partner might save their updates for when they have something interesting to say. Discuss whether an ordinary glimpse of their day would feel welcome, and what frequency feels comfortable for both of you."
  ],
  "known": [
    "Remember the details that make me me.",
    "A gesture can feel personal because it reflects a specific taste, passing comment, or shared memory. A high score here suggests that the connection comes partly from recognizing your own particular world in something your partner chooses for you.",
    "A well-intended gesture may feel less personal when it could have been chosen for anyone. Give your partner examples of details that matter to you, including the ones they already remember."
  ],
  "understanding": [
    "Stay curious about what it feels like for me.",
    "Conversation can create closeness when it helps you put an experience into words and feel understood. If you rated these statements highly, sharing an unfinished feeling may be valuable even before there is a clear explanation or a next step.",
    "One person may offer solutions while the other is still trying to explain their experience. Before a deeper conversation, say whether you would enjoy listening, questions, or practical ideas."
  ],
  "chosen": [
    "Show me you want this time with me.",
    "A plan can carry extra meaning when your partner initiates it or deliberately reserves time for you. A high score suggests that the effort to make the moment happen is part of what makes the moment feel affectionate.",
    "An uneven planning routine can develop without either person discussing it. Talk about which kinds of initiative feel meaningful and how you could each take a turn."
  ],
  "support": [
    "Make my day a little easier.",
    "Help with an everyday responsibility can communicate care in a very concrete way. If these statements fit you, a shared chore or a task taken off your plate can create space to relax and feel supported by your partner.",
    "Partners can have different ideas about what counts as helpful. Agree on the task and how much help is welcome, so the gesture reduces work instead of creating another thing to coordinate."
  ],
  "reassurance": [
    "Say the affection you still feel.",
    "Familiar affectionate words can retain their meaning through repetition. A high score here suggests that hearing care expressed clearly can contribute to closeness, including during ordinary days or after a disagreement has been resolved.",
    "One person may assume that affection is already understood while the other enjoys hearing it again. Discuss which words feel natural and meaningful to each of you."
  ],
  "ease": [
    "Let being together feel easy.",
    "Quiet company can be a form of quality time. If these statements fit you, doing separate things nearby or sharing comfortable pauses on a call can help your relationship feel woven into everyday life.",
    "Quiet time may feel connecting to one person while the other is waiting for more engagement. Check whether you both want relaxed company or a conversation before settling in."
  ],
  "play": [
    "Keep our little world of jokes alive.",
    "Silliness can make ordinary moments feel like something the two of you share. A high score suggests that familiar jokes, affectionate teasing, and making each other laugh are meaningful ways you experience connection.",
    "The timing and tone of humor matter. Ask which kinds of teasing feel affectionate, and make space for a serious response when either of you needs one."
  ],
  "discovery": [
    "Let’s find something out together.",
    "An unfamiliar experience can give you a new moment to share and a new side of your partner to notice. If these statements fit you, the experience can feel connecting even when the food, place, or activity turns out differently than expected.",
    "New experiences can require different amounts of energy for each person. Choose a small experiment with room to stop or change direction if either of you is uncomfortable."
  ],
  "touch": [
    "Let closeness have a physical feeling.",
    "The sensation of affectionate contact can matter in its own right. A high score suggests that long hugs or casual touches may add something meaningful even when you already share time, conversation, and affection in other ways.",
    "Preferences for touch can vary by moment as well as by person. Talk about the kinds of contact you both welcome. While apart, sharing the affectionate moments you miss can help your partner understand what you look forward to."
  ]
};
