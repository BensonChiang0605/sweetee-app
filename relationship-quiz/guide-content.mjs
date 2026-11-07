// Reviewed advice library for the partner guide. Written to the person reading
// the guide, about their partner ("they"). Every item has a tag naming the
// underlying action; the guide never shows two items with the same tag.

export const content = {
  inclusion: {
    matters: 'Being let into the ordinary parts of your day, not only the highlights.',
    habit: { tag: 'share-day', text: 'Send small, unremarkable glimpses of your day as they happen: what you’re eating, something odd you walked past, how a meeting went. Don’t save them for when you have a proper story. For them, the ordinary detail is the point.' },
    short: { tag: 'share-day', text: 'Let them into your day as it happens: a photo or a line about something ordinary.' },
    notice: 'You might hold back updates because they seem too boring to send. For them, those boring details may be what makes them feel part of your life.',
    experiment: { text: 'For one day, send three small, unpolished glimpses of what you’re doing. That evening, ask whether that amount felt right.', apart: 'Pick a day and send a photo from the start, middle and end of it, with a line each about what was happening.' },
    more: [
      { tag: 'retell-day', text: 'When you catch up, tell them the small stories from your day that never made it into messages.' },
      { tag: 'ask-ordinary', text: 'Ask about their ordinary details too. Inclusion often runs both ways.' },
    ],
  },
  known: {
    matters: 'Seeing that you remember their particular tastes and the things they mention in passing.',
    habit: { tag: 'act-on-detail', text: 'When they mention a craving, a worry or something they’d love to try, remember it and act on it later: bring the snack, ask how the thing went, book the place. The weeks between the mention and your action are what make it feel personal.' },
    short: { tag: 'act-on-detail', text: 'Act on small things they mentioned weeks ago, like a craving, a worry or a place they wanted to try.' },
    notice: 'A generous gesture that could have been for anyone may land less than a small one that could only be for them.',
    experiment: { text: 'Think of something they mentioned in passing in the last month and act on it this week, without asking first.', apart: 'Order or send the thing they mentioned, or bring it up on your next call and ask how it went.' },
    more: [
      { tag: 'keep-notes', text: 'Keep a private note of their passing preferences so you can return to them later.' },
      { tag: 'shared-history', text: 'Bring up a detail from a moment you shared that they might assume you forgot.' },
    ],
  },
  understanding: {
    matters: 'Being understood about how things feel, beyond what happened.',
    habit: { tag: 'listen-first', text: 'When they share something, keep asking questions until you understand what it was like for them, before you suggest anything. A good test is whether you could explain their feeling back in your own words.' },
    short: { tag: 'listen-first', text: 'Understand what something felt like for them before you offer solutions.' },
    notice: 'If you show care by fixing problems, you may jump to solutions before they feel understood. The solution can wait.',
    experiment: { text: 'Next time they bring up something that’s on their mind, ask at least two questions before you give an opinion. Afterward, notice whether the conversation went differently.', apart: 'On your next call, ask about one feeling from their week and stay with it a few minutes longer than usual.' },
    more: [
      { tag: 'unfinished-feelings', text: 'Make room for feelings they haven’t worked out yet. They don’t need a conclusion to be worth sharing.' },
      { tag: 'ask-mode', text: 'When it isn’t obvious, ask whether they want you to listen, ask questions or help solve it.' },
    ],
  },
  chosen: {
    matters: 'Seeing you actively make room for them without them having to organize it.',
    habit: { tag: 'initiate-time', text: 'Sometimes turn “we should do something” into an actual plan yourself: pick the time, suggest the thing, handle the details. If you have to cancel, propose a new time in the same breath. The initiative is part of the gift.' },
    short: { tag: 'initiate-time', text: 'Be the one who suggests and arranges time together, at least some of the time.' },
    notice: 'You may feel that saying yes to their plans shows you want to be with them. Agreeing and initiating can feel quite different to them. Notice who usually turns intentions into plans.',
    experiment: { text: 'Arrange your next time together yourself, from choosing the time to the last detail, and protect it from your phone.', apart: 'Schedule a call or a shared activity yourself, put it in the calendar, and if it falls through, rebook it before they have to ask.' },
    more: [
      { tag: 'protect-time', text: 'Treat time you’ve set aside for them as fixed, rather than something that moves when something else comes up.' },
      { tag: 'reach-first', text: 'Be the first to reach out on an ordinary day, without a practical reason.' },
    ],
  },
  support: {
    matters: 'Concrete help that makes their load lighter.',
    habit: { tag: 'take-task', text: 'When they’re stretched, offer to take one specific task off their plate. Name the task, check it’s welcome, then do it all the way through so they don’t have to manage you doing it.' },
    short: { tag: 'take-task', text: 'When they’re stretched, take one specific task off their plate and finish it.' },
    notice: 'Asking “let me know if you need anything” leaves the work of asking with them. A specific offer is easier to accept.',
    experiment: { text: 'Ask which one task would make their week easier, agree on it, and do it fully without reminders.', apart: 'Find something you can handle remotely: a booking, a form, a bit of research, a delivery. Then do it.' },
    more: [
      { tag: 'notice-load', text: 'Notice recurring chores they dislike and quietly take one over.' },
      { tag: 'logistics', text: 'Handle the logistics of plans you make together so they can just turn up.' },
    ],
  },
  reassurance: {
    matters: 'Hearing your affection said out loud, including on ordinary days when nothing is wrong.',
    habit: { tag: 'express-affection', text: 'Say what you feel and appreciate about them in ordinary moments, not only on occasions or after a rough patch. Familiar words keep their meaning for them, so repetition is fine. After a disagreement, say clearly that you’re okay.' },
    short: { tag: 'express-affection', text: 'Say your affection out loud on ordinary days, not only on occasions.' },
    notice: 'You may feel your effort already shows how you feel. They may still value hearing it, and doing something for them doesn’t replace saying it.',
    experiment: { text: 'This week, tell them one specific thing you appreciated about them, on a day when nothing special is happening.', apart: 'Before a busy stretch, tell them when you’ll be less available and that it doesn’t change anything. Reconnect warmly when it ends.' },
    more: [
      { tag: 'after-conflict', text: 'After a disagreement is resolved, say explicitly that you’re okay. Don’t assume it’s obvious.' },
      { tag: 'explain-distance', text: 'When you’re stressed or quiet, give a little context so they don’t have to guess what your distance means.' },
    ],
  },
  ease: {
    matters: 'Easy, unhurried company without needing an activity or constant conversation.',
    habit: { tag: 'quiet-company', text: 'Offer time together with nothing to accomplish: doing your own things in the same room, or a call left open while you both potter. Let the pauses happen without filling them.' },
    short: { tag: 'quiet-company', text: 'Offer low-key time together with nothing to accomplish.' },
    notice: 'You may feel time only counts if you plan something or keep talking. For them, quietly sharing space can count fully.',
    experiment: { text: 'Spend an evening together, or an hour on a call, each doing your own thing, and don’t plan anything.', apart: 'Keep a call open while you each cook, tidy or work, with no pressure to talk.' },
    more: [
      { tag: 'ordinary-together', text: 'Do everyday tasks side by side rather than separately.' },
      { tag: 'low-pressure', text: 'Let some time together have no agenda, even when you haven’t seen each other for a while.' },
    ],
  },
  play: {
    matters: 'Shared silliness, affectionate teasing and the jokes only the two of you get.',
    habit: { tag: 'shared-joke', text: 'Keep your running jokes alive and bring playfulness into dull moments: errands, chores, the commute. Silliness isn’t a distraction from closeness for them. It’s one of the ways they feel it.' },
    short: { tag: 'shared-joke', text: 'Keep your running jokes going and make dull moments silly.' },
    notice: 'When life gets serious, play is often the first thing to go. For them, losing it may feel like losing some closeness.',
    experiment: { text: 'Turn one boring errand into a game or a bit you both play along with.', apart: 'Send them something that continues one of your oldest running jokes.' },
    more: [
      { tag: 'tease-kindly', text: 'Tease affectionately, and check which kinds of teasing feel fun to them.' },
      { tag: 'invent-ritual', text: 'Invent a small silly ritual that belongs to the two of you.' },
    ],
  },
  discovery: {
    matters: 'Experiencing something new with you, and finding out what you both make of it.',
    habit: { tag: 'new-together', text: 'When you’re choosing what to do, regularly put one unfamiliar option on the table: a dish neither of you has cooked, a new route, a place you’ve both been curious about. It doesn’t need to be big or to go well. What counts is finding out together.' },
    short: { tag: 'new-together', text: 'Regularly suggest something unfamiliar you can try together.' },
    notice: 'Comfortable routines can feel close to you and still leave them wanting something new to share. Affection and familiarity don’t cover discovery.',
    experiment: { text: 'Pick one small thing neither of you has tried, like a recipe, a walk or a genre, and do it together. Afterward, compare what surprised you.', apart: 'Try the same unfamiliar thing at the same time, like a recipe, an album or a short course, then compare notes.' },
    more: [
      { tag: 'tweak-routine', text: 'Change one small part of something you already do together instead of planning a big outing.' },
      { tag: 'take-turns', text: 'Take turns introducing each other to something the other hasn’t experienced.' },
    ],
  },
  touch: {
    matters: 'Physical affection for its own sake: long hugs, sitting close, casual touches.',
    habit: { tag: 'physical-closeness', text: 'Build touch into ordinary moments: an unhurried greeting, sitting close on the couch, a hand on their back as you pass. For them, physical closeness adds something that time and words don’t replace. Follow their cues about what feels welcome.' },
    short: { tag: 'physical-closeness', text: 'Build welcome touch into ordinary moments, beyond special occasions.' },
    notice: 'You may show love through time or words and assume that covers it. For them, the physical part can matter on its own.',
    experiment: { text: 'Next time you see each other, make the hello hug last until you both settle into it, and keep some casual contact through the evening.', apart: 'Plan an unhurried, affectionate reunion. Until then, ask what helps them feel close while you can’t touch.' },
    more: [
      { tag: 'casual-touch', text: 'Keep casual touches going even after a long cuddle. For them, one doesn’t replace the other.' },
      { tag: 'make-room', text: 'Leave unscheduled time around plans so there’s room to just be close.' },
    ],
  },
};

// Authored experiments for pairs of leading preferences. Key: ids sorted, joined by '+'.
export const combos = {
  'chosen+reassurance': {
    text: 'Arrange one simple period of time together yourself and handle the details. Afterward, tell them something specific you enjoyed about being with them. The plan shows you want to be with them, and saying it afterward makes it explicit.',
    apart: 'Set up a call or a shared meal over video yourself. End it by saying one thing you appreciated about the time together.',
  },
  'discovery+touch': {
    text: 'Suggest one small unfamiliar thing to do together, and leave unhurried time afterward to stay close.',
    apart: 'Try the same new thing remotely and compare notes. Then plan how your reunion will look, with time to be close.',
  },
  'chosen+known': {
    text: 'Arrange your next time together yourself, built around something they mentioned wanting to do.',
    apart: 'Book a call yourself and bring something that shows you remembered: a song, a question about their week, a place they mentioned.',
  },
  'reassurance+understanding': {
    text: 'Next time they open up, ask questions until you understand it. Then tell them plainly that you’re with them, whatever it is.',
    apart: 'On your next call, ask about something that has been on their mind. End by telling them where you stand with them.',
  },
  'inclusion+reassurance': {
    text: 'Add one affectionate line to the ordinary updates you send during the day.',
    apart: 'Send a few unremarkable glimpses of your day, and close the day with a message saying you missed them.',
  },
  'chosen+inclusion': {
    text: 'Invite them into something ordinary you’re already doing, like an errand, a walk or cooking, rather than waiting for a special occasion.',
    apart: 'Call them while you do something ordinary and invite them along for it.',
  },
  'ease+touch': {
    text: 'Spend an unplanned evening together, sitting close, without filling the time.',
    apart: 'Keep a quiet call open while you both wind down. Plan a slow, close first evening for when you’re together again.',
  },
  'discovery+play': {
    text: 'Try something neither of you is good at and let it get ridiculous.',
    apart: 'Pick an online game or challenge that’s new to you both and play it on a call.',
  },
};

// Shown when a preference leads for the partner and is also near the top for
// the reader. Each note names the overlap and adds a step the habit for that
// preference doesn't already cover, since the habit appears in the same guide.
// `given`: one partner offers it and the other feels it. `together`: done together.
export const shared = {
  inclusion: { kind: 'given', text: 'You both like being let into each other’s ordinary day. If you each decide your day is too dull to report, you can both end up hearing very little. Go first, and don’t filter: the unremarkable stuff is what they want too. When they send you something small, reply to it, even briefly. A reply tells them the ordinary detail was welcome, which makes the next one easier to send.' },
  known: { kind: 'given', text: 'You both feel cared for when the other remembers the small things, so passing comments matter on both sides. It can feel exposed to mention something and hope it gets remembered. Make it easier for each other: say what you like out loud rather than dropping hints. When they act on something you said, tell them you noticed they remembered. Knowing their attention landed encourages them to keep paying it.' },
  understanding: { kind: 'given', text: 'You both feel close when the other takes time to understand how something felt. When you both want that, two people with something on their minds can each end up waiting to be asked. Take turns on purpose: when you can tell they have something going on, ask first and give them the whole conversation before you bring up your own. When their questions help you work something out, tell them so.' },
  chosen: { kind: 'given', text: 'You both feel especially wanted when the other suggests time together. That’s a lovely thing to share, but it means you may each be quietly waiting for the other to make the first move. Don’t wait to see whether they’ll suggest something first. And when they do make a plan for you, tell them it made you feel wanted. Hearing that their initiative landed makes it easier for them to keep doing it.' },
  support: { kind: 'given', text: 'You both feel cared for when the other takes something off your plate. In a busy week, that can mean you’re both stretched and both hoping for help. Rather than pushing through quietly, say which one task would help you most, and ask them the same. Trading specific tasks works better than guessing. When they help, tell them what it freed you up to do.' },
  reassurance: { kind: 'given', text: 'You both value hearing affection said out loud, even on ordinary days. If you each assume the other already knows how you feel, those words can go unsaid on both sides. Don’t wait to hear it before you say it. When they say it to you, take it in and respond to it specifically rather than brushing it off. That shows the words reached you, and it makes them easier to keep saying.' },
  ease: { kind: 'together', text: 'You both feel close in quiet, unhurried company, so you don’t need to fill your time together to make it count. Neither of you has to wonder whether a slow evening will disappoint the other. Treat that as permission: when you’re both tired, suggest doing your own things side by side without feeling you owe them a plan. Time together that looks like nothing much from outside can still count fully for both of you.' },
  play: { kind: 'together', text: 'You both feel close through being silly together, so you don’t need to wonder whether a joke will land or whether they’ll play along. Be the one who starts the bit. Running jokes belong to the two of you: bring back an old one, or start a new one when something absurd happens. If either of you is having a serious day, read the mood first, and pick it back up when they’re ready.' },
  discovery: { kind: 'together', text: 'You both feel closer when you try something new together, so you don’t need to wonder whether they’ll be up for it. Be the one who brings the next unfamiliar thing. Keep a shared list of things you both want to try, so when a free evening comes up, the hardest part, deciding what to do, is already done. Afterward, compare what surprised each of you.' },
  touch: { kind: 'together', text: 'Physical closeness matters to both of you, so you can reach for them without second-guessing whether it’s welcome in general. Moods still vary from day to day, so a quick check-in when one of you seems off keeps it easy for both of you. When you’re apart, tell them which moments of closeness you miss most, and ask which ones they miss.' },
};
