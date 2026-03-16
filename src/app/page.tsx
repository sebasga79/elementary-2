'use client'

import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const icons = {
  bookOpen: 'lucide:book-open',
  target: 'lucide:target',
  clock: 'lucide:clock',
  checkCircle: 'lucide:check-circle-2',
  closeCircle: 'lucide:x-circle',
  play: 'lucide:play-circle',
  pause: 'lucide:pause-circle',
  stop: 'lucide:stop-circle',
  eye: 'lucide:eye',
  lightbulb: 'lucide:lightbulb',
  rocket: 'lucide:rocket',
  brain: 'lucide:brain',
  message: 'lucide:message-square',
  pen: 'lucide:pen-tool',
  star: 'lucide:star',
  heart: 'lucide:heart',
  heartOutline: 'lucide:heart',
  sparkles: 'lucide:sparkles',
  trophy: 'lucide:trophy',
  zap: 'lucide:zap',
  chevronRight: 'lucide:chevron-right',
  chevronLeft: 'lucide:chevron-left',
  chevronDown: 'lucide:chevron-down',
  rotate: 'lucide:rotate-ccw',
  printer: 'lucide:printer',
  teacher: 'lucide:graduation-cap',
  task: 'lucide:clipboard-list',
  accordion: 'lucide:list-ordered',
  checklist: 'lucide:list-checks',
  gamepad: 'lucide:gamepad-2',
  puzzle: 'lucide:puzzle',
  microphone: 'lucide:mic',
  headphones: 'lucide:headphones',
  timeline: 'lucide:git-branch',
  users: 'lucide:users',
  map: 'lucide:map',
  home: 'lucide:home',
  globe: 'lucide:globe',
  music: 'lucide:music',
  camera: 'lucide:camera',
  shoppingCart: 'lucide:shopping-cart',
  building: 'lucide:building-2',
  award: 'lucide:award',
  coffee: 'lucide:coffee',
  palette: 'lucide:palette',
}

type WarmUp = {
  title: string
  instructions: string
  time: string
  materials: string
  teacherNote: string
  audioSrc?: string
}

type Activity = {
  title: string
  studentTask: string
  time: string
  materials?: string
  example?: string
  teacherNote: string
  icon?: string
}

type ExpandedActivity = {
  section: string
  unitKey: string
  activityId: string
  activity: WarmUp | Activity
}

type ActivityInstructionPack = {
  steps: string[]
  materials: string[]
  tips: string[]
}

function isRegularActivity(activity: WarmUp | Activity): activity is Activity {
  return 'studentTask' in activity
}

const BACKGROUND_MUSIC_SRC = '/audio/cooked-the-grey-room-golden-palms.mp3'

const activityStageMeta = [
  { key: 'warmUps' as const, label: 'Warm-Up', shortLabel: 'Warm-Up', icon: icons.sparkles, color: 'bg-rose-500' },
  { key: 'concreteExperience' as const, label: 'Concrete Experience', shortLabel: 'Experience', icon: icons.play, color: 'bg-emerald-500' },
  { key: 'reflection' as const, label: 'Reflective Observation', shortLabel: 'Reflect', icon: icons.eye, color: 'bg-amber-500' },
  { key: 'abstract' as const, label: 'Abstract Conceptualization', shortLabel: 'Understand', icon: icons.lightbulb, color: 'bg-blue-500' },
  { key: 'practice' as const, label: 'Active Experimentation', shortLabel: 'Apply', icon: icons.rocket, color: 'bg-violet-500' },
]

const units = [
  {
    id: 1,
    title: 'Everyday Wins vs. Major Life Events',
    subtitle: 'Comparative & Superlative Forms',
    level: 'Unit 1 • Elementary 2',
    duration: '~6 classes',
    icon: icons.trophy,
    color: 'from-rose-500 to-pink-600',
    lightColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    objectives: [
      'Compare everyday achievements and major life events using comparative and superlative forms.',
      'Use adjective rules (short adjectives, long adjectives, irregular forms) accurately in context.',
      'Describe and rank personal celebrations and milestones using target language.',
      'Reflect on cultural differences in how people celebrate achievements.',
    ],
    keyLanguage: [
      { expression: 'bigger than / smaller than', example: 'A wedding is bigger than a birthday party.', use: 'comparing two things' },
      { expression: 'the most important', example: 'Graduating is the most important event in my life.', use: 'superlative for long adjectives' },
      { expression: 'better / worse', example: 'This year was better than last year.', use: 'irregular comparatives' },
      { expression: 'the best / the worst', example: 'That was the best day of my life!', use: 'irregular superlatives' },
      { expression: 'more exciting than', example: 'Traveling is more exciting than staying home.', use: 'comparative for long adjectives' },
      { expression: 'as ... as', example: "My birthday is as fun as New Year's Eve.", use: 'equal comparisons' },
    ],
    vocabulary: {
      core: ['achievement', 'milestone', 'celebration', 'graduation', 'promotion', 'wedding', 'anniversary', 'accomplishment', 'challenge', 'success'],
      expressions: ['a big deal', 'once in a lifetime', 'a turning point', 'a small win', 'proud of', 'look forward to'],
      connectors: ['however', 'on the other hand', 'in contrast', 'similarly', 'for example', 'such as'],
    },
  },
  {
    id: 2,
    title: 'Finding Your Place',
    subtitle: 'How Much/Many & Countable vs. Uncountable Nouns',
    level: 'Unit 2 • Elementary 2',
    duration: '~6 classes',
    icon: icons.home,
    color: 'from-sky-500 to-blue-600',
    lightColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    objectives: [
      'Describe housing and neighborhood features using quantity expressions.',
      'Distinguish between countable and uncountable nouns in real-life contexts.',
      'Use "how much" and "how many" to ask about quantities correctly.',
      'Compare different places to live using quantifiers (some, any, a lot of, a few, a little).',
    ],
    keyLanguage: [
      { expression: 'How many rooms...?', example: 'How many rooms does your apartment have?', use: 'countable questions' },
      { expression: 'How much space...?', example: 'How much space do you need?', use: 'uncountable questions' },
      { expression: 'a lot of / lots of', example: 'There are a lot of parks nearby.', use: 'large quantities' },
      { expression: 'a few / a little', example: 'There are a few shops on my street.', use: 'small quantities' },
      { expression: 'some / any', example: "There aren't any restaurants in this area.", use: 'general quantities' },
      { expression: 'not much / not many', example: "There isn't much traffic at night.", use: 'small negative quantities' },
    ],
    vocabulary: {
      core: ['apartment', 'neighborhood', 'landlord', 'rent', 'furniture', 'utilities', 'roommate', 'location', 'commute', 'suburb'],
      expressions: ['close to', 'far from', 'next to', 'around the corner', 'within walking distance', 'move in/out'],
      connectors: ['because', 'so', 'although', 'that is why', 'in addition', 'on top of that'],
    },
  },
  {
    id: 3,
    title: 'Experiencing & Improving Cultural Services',
    subtitle: 'Determiners & Quantifiers',
    level: 'Unit 3 • Elementary 2',
    duration: '~6 classes',
    icon: icons.globe,
    color: 'from-emerald-500 to-teal-600',
    lightColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    objectives: [
      'Use determiners (a/an, some, any) and quantifiers (much, many, a lot of, a few, a little) accurately.',
      'Describe and evaluate services in your community and on campus.',
      'Write a service review using appropriate vocabulary and grammar.',
      'Create and present an unboxing video or service catalog using target language.',
    ],
    keyLanguage: [
      { expression: 'a / an', example: 'I visited a new café near campus.', use: 'singular countable nouns' },
      { expression: 'some / any', example: 'There are some good reviews online.', use: 'affirmative vs negative/questions' },
      { expression: 'much / many', example: 'How much does it cost? How many options are there?', use: 'uncountable vs countable questions' },
      { expression: 'a lot of', example: 'There are a lot of services on campus.', use: 'large quantities (both types)' },
      { expression: 'this / that / these / those', example: 'This service is excellent. Those reviews are helpful.', use: 'demonstrative determiners' },
      { expression: 'a few / a little', example: 'There are a few complaints. There is a little room for improvement.', use: 'small positive quantities' },
    ],
    vocabulary: {
      core: ['service', 'review', 'quality', 'recommendation', 'customer', 'rating', 'feedback', 'product', 'experience', 'improvement'],
      expressions: ['I would recommend...', 'In my opinion...', 'It is worth...', 'The best thing about...', 'It needs improvement', 'value for money'],
      connectors: ['first of all', 'moreover', 'as a result', 'to sum up', 'nevertheless', 'for instance'],
    },
  },
]


const activitiesData: {
  [key: string]: {
    warmUps: WarmUp[]
    concreteExperience: Activity[]
    reflection: Activity[]
    abstract: Activity[]
    practice: Activity[]
  }
} = {
  unit1: {
    warmUps: [
      {
        title: 'Small Wins Bingo',
        instructions: 'Walk around the class with your bingo card. Each square has a "small win" like "cooked a meal," "learned a new word," or "helped someone." Find classmates who have done these things, write their names, and try to complete a line. Use comparative forms when you talk: "That\'s easier than my small win!"',
        time: '10 min',
        materials: 'Bingo cards with small wins',
        teacherNote: 'Pre-teach comparison phrases before starting. Encourage movement and real conversations.',
      },
      {
        title: 'Guess the Celebration',
        instructions: 'Look at the photos your teacher shows on the screen. Each photo shows a different celebration or milestone around the world. With your partner, guess what the celebration is, describe what you see using adjectives, and compare: "This looks more exciting than a birthday party!" Share your guesses with the class.',
        time: '10 min',
        materials: 'Photos of celebrations from different cultures',
        teacherNote: 'Use diverse images: weddings, quinceañeras, Diwali, harvest festivals, etc. Build cultural awareness.',
      },
      {
        title: 'Music & Milestones',
        instructions: 'Listen to the background music. While the music plays, walk around the classroom. When the music stops, pair up with the person nearest to you and share one personal milestone. Then compare using: "My milestone is bigger/smaller/more important than yours." After 3 rounds, share the most interesting milestone you heard.',
        time: '10 min',
        materials: 'Background music, timer',
        teacherNote: 'Keep rounds short for energy. Model the comparative sentence structure first.',
        audioSrc: BACKGROUND_MUSIC_SRC,
      },
    ],
    concreteExperience: [
      {
        title: 'My Achievement Timeline',
        studentTask: 'Create a visual timeline of 6-8 personal achievements, from small everyday wins (like learning to ride a bike) to major life events (like winning a competition). Draw or write each one on a card, place them in order from smallest to biggest, and then present your timeline to a partner. Compare your achievements: "Getting my first job was more challenging than passing my driving test." Your partner asks at least 2 follow-up questions.',
        time: '30 min',
        materials: 'Cards/sticky notes, markers, timeline template',
        example: 'Getting my driver\'s license was more difficult than I expected, but graduating was the proudest moment.',
        teacherNote: 'Provide sentence frames for weaker students. Encourage genuine personal stories.',
        icon: icons.award,
      },
      {
        title: 'Celebration Photo Gallery Walk',
        studentTask: 'Walk around the classroom and look at the gallery of celebration photos posted on the walls. For each photo, write in your observation sheet: What celebration is it? What adjectives describe it? Then compare at least 3 celebrations with a classmate: "A graduation ceremony is more formal than a birthday party." Finally, choose the celebration you find most interesting and explain why to your group.',
        time: '25 min',
        materials: 'Printed celebration photos, observation worksheets',
        example: "A wedding is the most emotional celebration I've seen here.",
        teacherNote: 'Include celebrations from Colombia and other cultures. Post photos around the room gallery-style.',
        icon: icons.camera,
      },
      {
        title: 'Achievement Speed Dating',
        studentTask: 'Sit in two rows facing each other. You have 2 minutes with each partner. Share one achievement you are proud of and listen to theirs. After each round, compare achievements: "Your achievement sounds harder than mine" or "My achievement is as exciting as yours." When the teacher says "switch," one row moves to the next person. After 4-5 rounds, tell the class about the most impressive achievement you heard.',
        time: '20 min',
        materials: 'Timer, conversation prompt cards',
        example: "Learning to cook for my family was harder than I thought, but it's the best thing I've done.",
        teacherNote: 'Model the activity with a volunteer first. Keep strict time for energy.',
        icon: icons.users,
      },
    ],
    reflection: [
      {
        title: 'Comparison Journal Entry',
        studentTask: 'In your journal, write a short paragraph (60-80 words) comparing two achievements: one everyday win and one major life event. Use at least 4 comparatives or superlatives. Then read your partner\'s entry and underline all the comparison forms you find. Discuss: Did you use similar structures? Which forms were the hardest to use correctly?',
        time: '20 min',
        materials: 'Journals/notebooks, highlighters',
        example: 'I wrote about passing my exam vs. moving to a new city. Moving was more stressful but more rewarding.',
        teacherNote: 'Encourage peer correction discussions, not just identification of forms.',
      },
      {
        title: 'What Made It Special? Discussion',
        studentTask: 'In groups of 3-4, discuss the celebrations and achievements from the gallery walk. Each person shares which celebration impacted them most and explains why using comparatives: "The quinceañera was more colorful than the graduation." As a group, rank the top 3 most interesting celebrations and present your ranking to the class with reasons.',
        time: '15 min',
        materials: 'Notes from gallery walk activity',
        example: 'We think Diwali is the most colorful celebration because...',
        teacherNote: 'Push for justification: the ranking should include comparative reasoning.',
      },
      {
        title: 'Reflection Circle',
        studentTask: 'Sit in a circle. The teacher will pass around a "talking object." When you hold it, complete one of these sentences: "The biggest challenge I faced was..." / "My proudest moment was..." / "...is more important to me than..." After everyone shares, discuss as a class: What patterns did you notice? What do your classmates value most?',
        time: '15 min',
        materials: 'A small ball or object to pass',
        example: 'The biggest challenge I faced was learning English, but it was the best decision I ever made.',
        teacherNote: 'Create a supportive atmosphere. Keep responses focused on comparatives/superlatives.',
      },
    ],
    abstract: [
      {
        title: 'Adjective Sorting Challenge',
        studentTask: 'Work in small groups. You will receive 20 adjective cards (big, beautiful, good, interesting, bad, tall, expensive, etc.). Sort them into three categories: (1) Short adjectives (+er/+est), (2) Long adjectives (more/most), (3) Irregular (good→better→best). After sorting, write the comparative and superlative forms for each. Check your answers with the answer key. Then create 2 original sentences for each category.',
        time: '25 min',
        materials: 'Adjective cards, sorting mat, answer key',
        example: 'Short: tall → taller → the tallest | Long: beautiful → more beautiful → the most beautiful',
        teacherNote: 'Let students discover rules before confirming. Use discovery-based learning.',
      },
      {
        title: 'Grammar Detective: Find the Pattern',
        studentTask: 'Read the 10 example sentences your teacher gives you. Each sentence contains a comparative or superlative form. With your partner, highlight all comparison forms and answer these detective questions: (1) When do we add -er/-est? (2) When do we use more/most? (3) Which adjectives are irregular? Write your "grammar rules" in your own words. Compare your rules with another pair.',
        time: '20 min',
        materials: 'Detective worksheet with 10 sentences, highlighters',
        example: '"New York is bigger than Medellín" → short adjective + -er + than',
        teacherNote: 'Provide sentences with clear patterns. Guide discovery but avoid giving rules directly.',
      },
      {
        title: 'Comparative & Superlative Rule Builders',
        studentTask: 'Using the patterns you discovered, complete the rule builder chart with your group. Fill in: (1) The rule for 1-syllable adjectives, (2) The rule for 2+ syllable adjectives, (3) Spelling rules (doubling consonants, dropping -e, changing -y to -i), (4) Irregular forms. Then test your rules by creating 5 new sentences and asking another group to check them.',
        time: '25 min',
        materials: 'Rule builder chart templates, markers',
        example: 'Rule: For adjectives ending in -y, change -y to -ier (happy → happier → the happiest)',
        teacherNote: 'Have students present rules to the class. Correct any misconceptions together.',
      },
      {
        title: 'Error Hospital',
        studentTask: 'You are a "grammar doctor." Read 8 sentences with comparison errors. For each one: (1) Find the error, (2) Explain what is wrong, (3) Write the correct version. Examples of errors: "She is more taller than me," "This is the most good restaurant," "He is importanter than his brother." After fixing all errors, exchange with a partner and verify each other\'s corrections.',
        time: '20 min',
        materials: 'Error correction worksheet',
        example: 'Error: "more taller" → Fix: "taller" (short adjective, no need for "more")',
        teacherNote: 'Include common errors your students actually make. Great diagnostic activity.',
      },
    ],
    practice: [
      {
        title: 'My Life Awards Ceremony',
        studentTask: 'Create your own "Life Awards" for personal achievements. Make award categories (e.g., "The Most Challenging Achievement," "The Best Small Win," "The Most Unexpected Success"). For each category, write a short acceptance speech (30-40 words) using comparatives and superlatives. Present your awards to a small group. Each group member votes for the most interesting award. Use expressions like: "This was harder than..." and "...is the most rewarding thing I\'ve ever done."',
        time: '40 min',
        materials: 'Award certificate templates, presentation space',
        example: 'I give myself the award for Most Challenging Achievement: learning to swim. It was scarier than any exam!',
        teacherNote: 'Print fun award certificates. Make it celebratory and supportive.',
        icon: icons.trophy,
      },
      {
        title: 'Celebration Comparison Poster',
        studentTask: 'In pairs, choose two celebrations (from your culture or others). Create a comparison poster with: (1) A Venn diagram showing similarities and differences, (2) At least 8 comparative/superlative sentences, (3) Your personal opinion: "We think ___ is better because..." Present your poster to the class. Classmates can ask follow-up questions using comparison forms.',
        time: '45 min',
        materials: 'Poster paper, markers, printed images (optional)',
        example: "Christmas is more traditional than Valentine's Day, but Valentine's Day is more romantic.",
        teacherNote: 'Encourage cultural comparisons (Colombian vs. other celebrations). Display finished posters.',
        icon: icons.palette,
      },
      {
        title: 'Everyday Wins Blog Post',
        studentTask: 'Write a short blog post (100-120 words) titled "My Everyday Wins This Week." Describe at least 3 small achievements from your week and compare them. Use comparatives and superlatives naturally. Include: (1) What you did, (2) Why it matters, (3) How it compares to other achievements. Share with a partner for peer feedback. Revise based on their suggestions.',
        time: '35 min',
        materials: 'Notebooks or digital devices for writing',
        example: 'This week, cooking dinner for my family was more satisfying than finishing my homework...',
        teacherNote: 'If possible, use a class blog or Padlet. Peer feedback should focus on comparison forms.',
        icon: icons.pen,
      },
    ],
  },
  unit2: {
    warmUps: [
      {
        title: 'Dream Home Pictionary',
        instructions: 'In teams, one person draws features of their dream home on the board while teammates guess. Use quantity words when guessing: "Does it have many bedrooms?" "Is there a lot of space?" The fastest team to guess correctly gets a point. Play 3-4 rounds with different drawers.',
        time: '10 min',
        materials: 'Whiteboard, markers',
        teacherNote: 'Model quantity questions before starting. Keep rounds fast-paced.',
      },
      {
        title: 'Neighborhood Word Cloud',
        instructions: 'Think about your neighborhood. In 2 minutes, write down as many things you can find in a neighborhood as possible: buildings, services, features. Then compare your list with a partner. Together, sort your words into COUNTABLE and UNCOUNTABLE categories. Share your longest list with the class.',
        time: '10 min',
        materials: 'Paper, pens',
        teacherNote: 'This activates vocabulary and previews the countable/uncountable distinction naturally.',
      },
      {
        title: 'Four Corners: Housing Preferences',
        instructions: 'The teacher labels four corners of the room: "Apartment," "House," "Student dorm," "Shared flat." Go to the corner that matches where you would most like to live. In your corner group, discuss WHY using quantity expressions: "I chose apartment because there is not much maintenance." Then each group presents their reasons to the class.',
        time: '10 min',
        materials: 'Corner labels',
        teacherNote: 'Encourage using target language: how much/many, a lot of, not much/many.',
      },
    ],
    concreteExperience: [
      {
        title: 'Apartment Hunting Role-Play',
        studentTask: 'Work in pairs. One person is a real estate agent, the other is looking for an apartment. The agent describes available apartments using quantity expressions: "This apartment has a lot of natural light and a few closets." The client asks questions: "How many bathrooms does it have?" "How much is the rent?" After 5 minutes, switch roles. Choose the best apartment and explain your decision to the class.',
        time: '25 min',
        materials: 'Apartment description cards, role-play prompts',
        example: '"This apartment has a lot of space but there aren\'t many windows."',
        teacherNote: 'Provide apartment cards with visual details. Pre-teach real estate vocabulary.',
        icon: icons.home,
      },
      {
        title: 'My Neighborhood Map',
        studentTask: 'Draw a simple map of your neighborhood or an ideal neighborhood. Label at least 10 places (shops, parks, schools, etc.). Then describe your neighborhood to a partner using countable and uncountable nouns: "There are a few supermarkets but there isn\'t much green space." Compare neighborhoods: "Your neighborhood has more parks than mine." Present the most interesting difference to the class.',
        time: '30 min',
        materials: 'Paper, colored pencils, map template',
        example: '"There are a lot of restaurants near my home but there isn\'t much parking."',
        teacherNote: 'Provide a simple map template for students who need structure.',
        icon: icons.map,
      },
      {
        title: 'Furniture Shopping Challenge',
        studentTask: 'You just moved into an empty apartment! With a partner, look at the furniture catalog your teacher provides. You have a budget of $2,000. Decide together what to buy using quantity expressions: "We need some chairs. How many do we need?" "We don\'t have much money left for decorations." Create a shopping list and present it to the class. Which pair furnished their apartment the best?',
        time: '25 min',
        materials: 'Furniture catalog (printed or digital), budget worksheet',
        example: '"We bought a lot of kitchen items because there weren\'t any in the apartment."',
        teacherNote: 'Make catalogs with prices. This activates countable/uncountable naturally.',
        icon: icons.shoppingCart,
      },
    ],
    reflection: [
      {
        title: 'Housing Survey Reflection',
        studentTask: 'Complete a survey about your current living situation: How many rooms do you have? How much space? How many people live with you? How much noise is there? Then compare your answers with two classmates. Write 5 sentences about the differences you found: "Maria has more rooms than me, but I have a lot more peace and quiet."',
        time: '20 min',
        materials: 'Housing survey worksheet',
        example: 'I have fewer rooms than Carlos but more natural light than Ana.',
        teacherNote: 'Use the survey to naturally practice how much/many in question forms.',
      },
      {
        title: 'What Makes a Good Neighborhood?',
        studentTask: 'In groups of 3, create a ranked list of the 5 most important features of a good neighborhood. Discuss and justify your ranking using quantifiers: "A good neighborhood needs a lot of green spaces and a few good schools." Compare your group\'s list with another group. Do you agree? Write a group statement: "We believe the most important thing is..."',
        time: '20 min',
        materials: 'Ranking worksheets, markers',
        example: 'We ranked safety first because there isn\'t much crime in a good neighborhood.',
        teacherNote: 'Focus on negotiation language and quantity expressions in justification.',
      },
      {
        title: 'Before & After Reflection',
        studentTask: 'Think about a time you moved or changed your living situation. Write a short comparison (60-80 words) of before and after: "Before, I lived in a place with a lot of noise. Now, there isn\'t much traffic." Share with a partner and identify all the quantity expressions used. Discuss which living situation was better.',
        time: '15 min',
        materials: 'Notebooks',
        example: 'Before, there were many neighbors. Now, there are only a few, and it is much quieter.',
        teacherNote: 'Students who haven\'t moved can imagine or compare two places they know well.',
      },
    ],
    abstract: [
      {
        title: 'Countable vs. Uncountable Sorting',
        studentTask: 'Work in pairs. You will receive 30 word cards. Sort them into two categories: COUNTABLE and UNCOUNTABLE. For tricky words (like "room" which can be both), discuss and decide. Then answer: Which quantifiers go with countable nouns? (many, a few, several) Which go with uncountable nouns? (much, a little) Which work with both? (some, any, a lot of). Create a grammar poster with your rules.',
        time: '25 min',
        materials: 'Word cards, sorting mat, grammar poster template',
        example: 'Countable: chair, bedroom, neighbor | Uncountable: furniture, space, traffic',
        teacherNote: 'Include "tricky" words that seem uncountable but aren\'t (suggestion, complaint). Discovery approach.',
      },
      {
        title: 'How Much vs. How Many Quiz Show',
        studentTask: 'Play a quiz show game! The teacher shows a word on the board (e.g., "sugar," "books," "homework"). You must hold up the correct sign: "HOW MUCH" or "HOW MANY." Then create a complete question with the word: "How much sugar do you put in your coffee?" The fastest correct answer gets a point. After 10 rounds, the champion creates 3 original questions for the class.',
        time: '20 min',
        materials: '"How much" and "How many" signs, word list',
        example: '"Water → How much water do you drink every day?"',
        teacherNote: 'Start easy, then add tricky words. Let students make signs from paper.',
      },
      {
        title: 'Grammar Pattern Discovery',
        studentTask: 'Read the 12 sentences about housing on your worksheet. Highlight all quantifiers (some, any, much, many, a lot of, a few, a little). Then answer these questions: (1) Which quantifiers appear in affirmative sentences? (2) Which appear in negative sentences? (3) Which appear in questions? Write your discovery rules and compare with a partner.',
        time: '20 min',
        materials: 'Discovery worksheet with 12 housing sentences',
        example: 'Rule: "Any" usually appears in negative sentences and questions.',
        teacherNote: 'Sentences should clearly show patterns. Don\'t give rules — let students find them.',
      },
      {
        title: 'Quantifier Board Game',
        studentTask: 'Play the quantifier board game in groups of 3-4. Roll the dice, move your token, and complete the sentence on the square using the correct quantifier. If your group agrees your answer is correct, you stay. If not, go back 2 spaces. Example squares: "There is ___ (much/many) furniture in my room" → "There is a lot of furniture in my room." First to finish wins!',
        time: '20 min',
        materials: 'Board game, dice, tokens',
        example: 'Square: "How ___ books do you have?" → "How many books do you have?"',
        teacherNote: 'Print one board per group. Include answer key for self-checking.',
      },
    ],
    practice: [
      {
        title: '"Find Your Perfect Home" Presentation',
        studentTask: 'You are a real estate agent! Create a short presentation (1-2 minutes) advertising a home or apartment. Include: (1) Description with at least 6 quantifier expressions, (2) Comparison with other homes, (3) Why this is the best choice. Use visuals (drawings, photos from magazines). Present to the class. Classmates ask "How much...?" and "How many...?" questions. Vote for the best agent.',
        time: '40 min',
        materials: 'Paper for visuals, presentation space',
        example: '"This beautiful apartment has a lot of natural light, a few balconies, and not much noise..."',
        teacherNote: 'Encourage creativity. Students can use magazines for visuals.',
        icon: icons.home,
      },
      {
        title: 'Neighborhood Improvement Plan',
        studentTask: 'In pairs, choose a real neighborhood in your city. Research or discuss its current features, then create an improvement plan. Use quantity expressions throughout: "Currently, there aren\'t many parks. We propose adding a few green spaces." Present your plan as a poster or slide, including: What the neighborhood has now, what it needs, and your top 3 improvement ideas with justification.',
        time: '45 min',
        materials: 'Poster paper or digital tools, neighborhood information',
        example: '"There is a lot of traffic but not much public transport. We suggest adding a few bus routes."',
        teacherNote: 'Use neighborhoods near EAFIT for relevance. This integrates community awareness.',
        icon: icons.building,
      },
      {
        title: 'Roommate Compatibility Interview',
        studentTask: 'You are looking for a roommate! Write 8 interview questions using "how much" and "how many": "How much noise do you make?" "How many hours do you study?" Then interview 2-3 classmates. Based on the answers, decide who would be your ideal roommate and write a short explanation (60-80 words) using quantifiers: "I chose Ana because she doesn\'t make much noise and she has a few hobbies we share."',
        time: '30 min',
        materials: 'Interview question template, recording sheet',
        example: '"How many guests do you usually have?" "Not many, maybe a few friends on weekends."',
        teacherNote: 'This is authentic and fun. Encourage follow-up questions.',
        icon: icons.users,
      },
    ],
  },
  unit3: {
    warmUps: [
      {
        title: 'EAFIT Campus Quest',
        instructions: 'In teams, explore photos of different services available on the EAFIT campus (library, sports center, cafeteria, health services, etc.). For each service shown, write a sentence using a determiner or quantifier: "There are some computers in the library" or "There isn\'t much space in the gym at noon." The team with the most correct sentences in 5 minutes wins!',
        time: '10 min',
        materials: 'Photos of campus services, answer sheets',
        teacherNote: 'Use real EAFIT campus photos. Builds immediate relevance and vocabulary.',
      },
      {
        title: 'Tourist Information Center',
        instructions: 'Imagine you work at a tourist information center. A tourist asks you about services in your city. In pairs, take turns being the tourist and the information officer. The tourist asks: "Are there any good restaurants near here?" "Is there much nightlife?" The officer answers using quantifiers: "Yes, there are a lot of restaurants. There are a few traditional ones on this street." Practice for 3 rounds each.',
        time: '10 min',
        materials: 'City service prompt cards',
        teacherNote: 'This previews the unit vocabulary and grammar naturally. Provide a word bank.',
      },
      {
        title: 'Service Pictionary Race',
        instructions: 'In teams, one person draws a community service (bakery, pharmacy, gym, hospital, post office) while teammates guess. When they guess correctly, everyone must say a sentence about it using determiners: "That\'s a pharmacy! There is a pharmacy near my house." or "There are some pharmacies in my neighborhood." Fastest team wins each round!',
        time: '10 min',
        materials: 'Whiteboard, service word cards',
        teacherNote: 'Keep rounds fast and energetic. Focus on a/an, some, any usage.',
      },
    ],
    concreteExperience: [
      {
        title: 'Street Food Stall Comparison',
        studentTask: 'Look at the photos of two street food stalls your teacher shows you (e.g., a Chinese food stall and a pizza stall in London). With your group, discuss which stall you would prefer to eat at and why. Use determiners and quantifiers: "The pizza stall has some vegetarian options" or "There isn\'t any variety at the Chinese stall." Then listen to a conversation between two friends discussing the same stalls. Compare their opinions with yours: Did they agree with your group?',
        time: '30 min',
        materials: 'Photos of food stalls, conversation audio, transcript',
        example: '"There are some interesting dishes at the Chinese stall, but there isn\'t much seating."',
        teacherNote: 'Based on Navigate Elementary (Oxford). Use the conversation to introduce a/an, some, any naturally.',
        icon: icons.coffee,
      },
      {
        title: 'Shopping List Pair Activity',
        studentTask: 'Work in pairs. Each person has a different version (A or B) of a shopping list for a party. Check items together to see what you still need to buy. Use the target language: "Do we need any napkins?" "Yes, we need some napkins." "No, we don\'t need any." Take turns asking and responding. At the end, create a complete shopping list together. Present your final list to the class: "We need some fruit, but we don\'t need any drinks."',
        time: '30 min',
        materials: 'Shopping list worksheets (A and B versions)',
        example: '"Do we need any cups?" "Yes, we need some cups, but we don\'t need any plates."',
        teacherNote: 'From English File Elementary (Oxford). Cut worksheets into A/B halves.',
        icon: icons.shoppingCart,
      },
      {
        title: 'Campus Service Exploration',
        studentTask: 'Visit (virtually or in person) three EAFIT campus services: the library, sports area, and student wellbeing center. For each service, observe and note: What services are available? How many students are there? How much equipment is there? How much space is available? Write 5 sentences per service using quantifiers and determiners. Compare your observations with a partner using: "There are a lot of/few/many..."',
        time: '30 min',
        materials: 'Observation worksheet, mobile phones or cameras',
        example: '"There are a lot of students in the library but there isn\'t much available seating."',
        teacherNote: 'If in-person visit is not possible, use photos. This is a living learning environment activity.',
        icon: icons.building,
      },
    ],
    reflection: [
      {
        title: 'Grammar Discovery: A/An, Some, Any',
        studentTask: 'Look at the conversation transcript from the street food stall activity. In small groups, find all examples of "a," "an," "some," and "any." Organize them into categories: (1) Which words appear in affirmative sentences? (2) Which appear in negative sentences? (3) Which appear in questions? Complete the grammar checklist: "We found examples of \'some\' in affirmative sentences ✓ / We found \'any\' in negative and question forms ✓ / We identified \'a/an\' before singular countable nouns ✓." Write your group\'s grammar rules.',
        time: '30 min',
        materials: 'Conversation transcript, grammar checklist, grammar reference sheet',
        example: 'Rule: Use "some" in affirmative. Use "any" in negatives and questions. Use "a/an" for singular countable nouns.',
        teacherNote: 'Guide students to discover rules, do not give them directly. Provide controlled practice link.',
      },
      {
        title: 'Shopping Habits Quiz Reflection',
        studentTask: 'Complete the Shopping Habits Quiz. Read each statement about shopping and decide how often you do each thing. Notice the highlighted quantifiers in each sentence (some, any, much, many, a lot of, a few, a little). After the quiz, sort the quantifiers into categories: which ones go with countable nouns? Which go with uncountable nouns? Which work with both? Create a reference chart for your notebook.',
        time: '30 min',
        materials: 'Shopping habits quiz, highlighted quantifiers handout',
        example: 'Countable: many, a few, several | Uncountable: much, a little | Both: some, any, a lot of',
        teacherNote: 'This connects grammar with personal experience. Include controlled practice links.',
      },
      {
        title: 'Service Observation Debrief',
        studentTask: 'Share your campus service observations from the exploration activity with your group. Together, answer these reflection questions: (1) Which service surprised you the most? (2) What phrases with quantifiers did you use most often? (3) Complete the sentence starters: "One thing I noticed was..." / "The service with the most ___ was..." / "I was surprised that there wasn\'t much/many..." Write a short group reflection paragraph.',
        time: '15 min',
        materials: 'Notes from campus exploration, reflection question sheet',
        example: 'One phrase I used a lot was "there aren\'t many..." because several services had limited resources.',
        teacherNote: 'This bridges concrete experience to abstract rules. Keep discussion focused on language use.',
      },
    ],
    abstract: [
      {
        title: 'Quantifiers Board Game',
        studentTask: 'Play a board game in pairs or small groups to practice quantifiers (some, many, much, a lot of, a few, a little, not much, not many) in real-life contexts about services, shopping, and everyday habits. Each square includes a "How much/many...?" question that you must answer in a complete sentence. Example: "How many streaming services do you use?" → "I use a few streaming services, like Netflix and Spotify." Roll the dice, move, answer, and keep going!',
        time: '20 min',
        materials: 'One board game per pair/group, dice, tokens',
        example: '"How much time do you spend shopping online?" → "I spend a lot of time shopping online!"',
        teacherNote: 'Print one board per group. Students can use coins or erasers as tokens.',
      },
      {
        title: 'Demonstratives in Context',
        studentTask: 'Look at the classroom objects your teacher has placed at different distances. Practice using demonstratives: "This pen is mine" (near) vs. "That notebook is yours" (far) / "These books are new" (near, plural) vs. "Those posters are old" (far, plural). Then write 6 sentences describing services or products using demonstratives correctly. Compare with a partner: "These reviews are positive. Those ratings are low."',
        time: '20 min',
        materials: 'Classroom objects at various distances, demonstrative reference card',
        example: '"This café has great coffee, but that restaurant across the street is cheaper."',
        teacherNote: 'Use physical demonstration with objects. Practice links available for homework.',
      },
      {
        title: 'Grammar Pattern Wall',
        studentTask: 'Create a "grammar pattern wall" on a large poster. Organize examples from all previous activities into clear categories: (1) a/an + singular countable, (2) some + plural countable/uncountable (affirmative), (3) any + plural countable/uncountable (neg/questions), (4) much + uncountable, (5) many + countable, (6) a lot of + both. For each category, write the rule AND 2 original examples about services in your community.',
        time: '25 min',
        materials: 'Large poster paper, markers, sticky notes',
        example: 'Rule: "any" = negative & questions. Example: "Are there any gyms near here?" / "There aren\'t any parks."',
        teacherNote: 'Display the wall for reference throughout the rest of the unit. Student-generated rules stick better.',
      },
      {
        title: 'Error Correction Workshop',
        studentTask: 'Find and fix errors in 10 sentences about community services. Each sentence has one determiner or quantifier error. Example: "There are much restaurants in my area" → "There are many restaurants in my area." For each correction, explain WHY it was wrong. After fixing all 10, write 3 of your own "tricky" error sentences and challenge a partner to fix them.',
        time: '20 min',
        materials: 'Error correction worksheet',
        example: 'Error: "I don\'t have some money" → Fix: "I don\'t have any money" (use "any" in negatives)',
        teacherNote: 'Include errors students commonly make. Peer-generated errors are powerful diagnostic tools.',
      },
    ],
    practice: [
      {
        title: 'A Service Review',
        studentTask: 'Write a review (100-120 words) of a real service you have used (a restaurant, gym, store, app, or campus service), similar to a Google Maps or TripAdvisor review. Include: (1) What service you used (a/an), (2) What was available (some, many, a lot of), (3) What was missing (any, not much, not many), (4) Your recommendation. Share with peers for feedback, then revise. Present your final review to the class. Vote for the "Most Helpful Review" and "Best Use of Quantifiers."',
        time: '60 min',
        materials: 'Service review template, peer feedback checklist',
        example: '"I visited a new coffee shop near EAFIT. There are some comfortable seats but there isn\'t much Wi-Fi..."',
        teacherNote: 'Show real Google Maps reviews as models. Include peer feedback and self-assessment.',
        icon: icons.star,
      },
      {
        title: 'Product Unboxing Video',
        studentTask: 'Create and present a 2-minute unboxing video (recorded or live). Choose a product or service subscription. In your video: (1) Introduce the product using a/an, (2) Describe the contents using some, a few, a lot of, (3) Give your opinion on quality and value for money, (4) Make a recommendation. Watch example unboxing videos for inspiration first. Use the description worksheet to plan your content. Present to the class and receive creative awards!',
        time: '90 min',
        materials: 'Mobile phone for recording, product to unbox, description worksheet',
        example: '"Today I\'m unboxing a subscription box! There are some snacks, a few stickers, and a lot of candy..."',
        teacherNote: 'Show a trending unboxing video first. This is a multi-class project. Formative + summative.',
        icon: icons.camera,
      },
      {
        title: 'Community Service Catalog',
        studentTask: 'Research and catalog services available in your neighborhood or community. Work individually or in small groups. Essential question: "What services are available in our neighborhoods, and how do community members perceive their effectiveness?" Steps: (1) Discuss local services and create a survey using open and closed questions, (2) Interview neighbors or classmates, (3) Organize findings in a catalog with descriptions using determiners and quantifiers, (4) Present your catalog to the class. Include photos if possible!',
        time: '120 min',
        materials: 'Survey templates, catalog design materials, mobile phones for photos',
        example: '"In my neighborhood, there are a lot of small shops but there aren\'t any bookstores."',
        teacherNote: 'This is a multi-session project. Great for real-world application and community engagement.',
        icon: icons.globe,
      },
    ],
  },
}


const quizQuestions: { [key: string]: { question: string; options: string[]; correct: number; explanation: string }[] } = {
  unit1: [
    {
      question: 'Which is correct? "My brother is ___ than me."',
      options: ['more tall', 'taller', 'tallest', 'the taller'],
      correct: 1,
      explanation: '"Tall" is a short adjective (one syllable), so we add -er for comparatives: taller.',
    },
    {
      question: 'Choose the correct superlative: "This is ___ movie I have ever seen."',
      options: ['the more exciting', 'the most exciting', 'the excitingest', 'more exciting'],
      correct: 1,
      explanation: '"Exciting" has 3 syllables, so we use "the most" + adjective for the superlative.',
    },
    {
      question: 'Which sentence is correct?',
      options: ['"She is more beautiful than her sister."', '"She is beautifuller than her sister."', '"She is the more beautiful than her sister."', '"She is most beautiful than her sister."'],
      correct: 0,
      explanation: '"Beautiful" is a long adjective, so the comparative is "more beautiful than."',
    },
    {
      question: 'What is the superlative of "bad"?',
      options: ['the baddest', 'the most bad', 'the worst', 'the worse'],
      correct: 2,
      explanation: '"Bad" is an irregular adjective: bad → worse → the worst.',
    },
    {
      question: 'Complete: "A cat is ___ a goldfish, but a dog is ___."',
      options: ['bigger than / the biggest', 'bigger / the most big', 'more big than / biggest', 'the bigger / the most biggest'],
      correct: 0,
      explanation: '"Big" (short adjective): bigger than (comparative) and the biggest (superlative).',
    },
  ],
  unit2: [
    {
      question: 'Which is correct? "How ___ bedrooms does your apartment have?"',
      options: ['much', 'many', 'lot of', 'a few'],
      correct: 1,
      explanation: '"Bedrooms" is a countable noun, so we use "How many."',
    },
    {
      question: 'Choose the correct sentence:',
      options: ['"There isn\'t many water."', '"There isn\'t much water."', '"There aren\'t much water."', '"There isn\'t a lot water."'],
      correct: 1,
      explanation: '"Water" is uncountable, so we use "much" in negative sentences with "isn\'t."',
    },
    {
      question: '"There are ___ parks in my neighborhood, but not ___."',
      options: ['a little / much', 'a few / many', 'much / many', 'any / some'],
      correct: 1,
      explanation: '"Parks" is countable: use "a few" (positive small quantity) and "many" (negative large quantity).',
    },
    {
      question: 'Which question is correct?',
      options: ['"How much chairs do we need?"', '"How many furnitures do we have?"', '"How much furniture do we have?"', '"How many traffic is there?"'],
      correct: 2,
      explanation: '"Furniture" is uncountable, so we use "How much." Note: "furniture" never takes -s.',
    },
    {
      question: '"I don\'t have ___ money, but I have ___ coins in my pocket."',
      options: ['many / a little', 'much / a few', 'a lot / much', 'some / many'],
      correct: 1,
      explanation: '"Money" is uncountable → "much." "Coins" is countable → "a few."',
    },
  ],
  unit3: [
    {
      question: 'Which is correct? "There are ___ good restaurants in this area."',
      options: ['a', 'an', 'some', 'much'],
      correct: 2,
      explanation: '"Restaurants" is plural countable. We use "some" in affirmative sentences for plural countable nouns.',
    },
    {
      question: '"I don\'t have ___ information about that service."',
      options: ['some', 'any', 'many', 'a'],
      correct: 1,
      explanation: 'In negative sentences, we use "any" instead of "some."',
    },
    {
      question: 'Choose the correct sentence:',
      options: ['"This services are excellent."', '"These services are excellent."', '"That services are excellent."', '"A services are excellent."'],
      correct: 1,
      explanation: '"These" is the correct demonstrative for plural nouns that are near: "these services."',
    },
    {
      question: '"There ___ much variety in this store."',
      options: ['aren\'t', 'isn\'t', 'don\'t', 'doesn\'t'],
      correct: 1,
      explanation: '"Variety" is uncountable, so we use "isn\'t" (singular) with "much."',
    },
    {
      question: 'Which is the best review sentence?',
      options: ['"I recommend this place. There are a lot of options."', '"I recommend this place. There are much options."', '"I recommend this place. There are a few of options."', '"I recommend this place. There are any options."'],
      correct: 0,
      explanation: '"A lot of" works with both countable and uncountable nouns in affirmative sentences.',
    },
  ],
}

const quickPracticeExercises: { [key: string]: { sentence: string; options: string[]; answer: string; clue: string }[] } = {
  unit1: [
    { sentence: 'Mount Everest is ___ mountain in the world.', options: ['the highest', 'higher', 'the most high', 'more high'], answer: 'the highest', clue: 'Short adjective + superlative = the + adj + -est' },
    { sentence: 'A Ferrari is ___ a Toyota.', options: ['expensiver than', 'more expensive than', 'the most expensive', 'expensive than'], answer: 'more expensive than', clue: 'Long adjective → more + adjective + than' },
    { sentence: 'My cooking is ___ my mom\'s.', options: ['worse than', 'the worst', 'badder than', 'more bad than'], answer: 'worse than', clue: 'Bad → worse (than) → the worst (irregular)' },
    { sentence: 'She is ___ student in the class.', options: ['the most intelligent', 'more intelligent', 'intelligent', 'the intelligentest'], answer: 'the most intelligent', clue: 'Long adjective + superlative = the most + adjective' },
  ],
  unit2: [
    { sentence: 'How ___ milk do you want in your coffee?', options: ['many', 'much', 'a few', 'several'], answer: 'much', clue: 'Milk is uncountable → How much' },
    { sentence: 'There aren\'t ___ students in class today.', options: ['much', 'many', 'a little', 'some'], answer: 'many', clue: 'Students = countable + negative → many' },
    { sentence: 'I have ___ free time on weekends.', options: ['a few', 'a little', 'many', 'several'], answer: 'a little', clue: 'Time is uncountable → a little (small quantity)' },
    { sentence: '___ of my friends live in apartments.', options: ['Much', 'A lot', 'A little', 'Several'], answer: 'A lot', clue: 'A lot of = works with countable plural, informal' },
  ],
  unit3: [
    { sentence: 'I need ___ information about the gym schedule.', options: ['a', 'an', 'some', 'many'], answer: 'some', clue: 'Information is uncountable → use "some" in affirmative' },
    { sentence: 'Are there ___ parking spaces available?', options: ['some', 'any', 'a', 'much'], answer: 'any', clue: 'Questions usually use "any" with countable plural' },
    { sentence: '___ book is very interesting. You should read it!', options: ['These', 'Those', 'This', 'A few'], answer: 'This', clue: 'Singular + near = this' },
    { sentence: 'There is ___ sugar in my coffee; I can barely taste it.', options: ['a few', 'a little', 'many', 'any'], answer: 'a little', clue: 'Sugar = uncountable, small quantity = a little' },
  ],
}

const sentenceBuilderGames: {
  [key: string]: {
    title: string
    prompts: { situation: string; answer: string }[]
    sentenceBuilder: { prompt: string; options: string[]; correct: number; explanation: string }[]
    grammarDetective: { sentence: string; question: string; options: string[]; correct: number; explanation: string }[]
  }
} = {
  unit1: {
    title: 'Comparatives & Superlatives Challenge',
    prompts: [
      { situation: 'Your friend asks which city is better: Medellín or Bogotá.', answer: 'Medellín is warmer than Bogotá, but Bogotá has more museums.' },
      { situation: 'Compare two classmates\' achievements.', answer: 'Getting a scholarship is more impressive than passing a test.' },
      { situation: 'Describe the best moment of your life.', answer: 'The happiest day of my life was my graduation day.' },
      { situation: 'A tourist wants to know the best restaurant nearby.', answer: 'The Italian place is the most popular restaurant on this street.' },
      { situation: 'Your friend says learning English is easy.', answer: "I think English is easier than French, but harder than Spanish." },
    ],
    sentenceBuilder: [
      { prompt: 'A cheetah is ___ land animal in the world.', options: ['faster than any', 'the fastest', 'the most fast', 'more fast than'], correct: 1, explanation: '"Fast" is a short adjective. The superlative is "the fastest."' },
      { prompt: 'My new phone is ___ my old one.', options: ['more better than', 'gooder than', 'better than', 'the best'], correct: 2, explanation: '"Good" is irregular: good → better → the best. The comparative is "better than."' },
      { prompt: 'This exercise is ___ I expected.', options: ['difficulter than', 'more difficult than', 'the most difficult', 'most difficult'], correct: 1, explanation: '"Difficult" has 3 syllables → use "more" + adjective + "than" for comparison.' },
    ],
    grammarDetective: [
      { sentence: 'She is more prettier than her sister.', question: 'What is the error?', options: ['Use "more pretty"', 'Remove "more" — it should be "prettier"', 'Change to "the prettiest"', 'No error'], correct: 1, explanation: '"Pretty" changes -y to -ier: prettier. We don\'t use "more" with short adjectives that take -er/-est.' },
      { sentence: 'This is the most good coffee I have ever had.', question: 'What is the correct form?', options: ['"the most good"', '"the goodest"', '"the best"', '"the more good"'], correct: 2, explanation: '"Good" is irregular: good → better → the best.' },
    ],
  },
  unit2: {
    title: 'Quantity Expressions Challenge',
    prompts: [
      { situation: 'Your roommate asks what food you have at home.', answer: 'We have some rice and a few eggs, but we don\'t have any milk.' },
      { situation: 'Describe your neighborhood to a new student.', answer: 'There are a lot of shops but there isn\'t much green space.' },
      { situation: 'You\'re checking furniture for a new apartment.', answer: 'There aren\'t many stores and there isn\'t much furniture available.' },
      { situation: 'A friend asks about parking near your building.', answer: 'There isn\'t much parking. There are only a few spaces.' },
      { situation: 'Tell your friend about the EAFIT cafeteria.', answer: 'There are many food options and a lot of seating, but there isn\'t much variety in healthy food.' },
    ],
    sentenceBuilder: [
      { prompt: 'How ___ sugar do you take in your tea?', options: ['many', 'much', 'a few', 'several'], correct: 1, explanation: '"Sugar" is uncountable, so we use "How much."' },
      { prompt: 'There are ___ good restaurants near campus.', options: ['much', 'a little', 'a few', 'any'], correct: 2, explanation: '"Restaurants" is countable. "A few" = a small positive number.' },
      { prompt: 'I don\'t have ___ experience with cooking.', options: ['many', 'much', 'a few', 'several'], correct: 1, explanation: '"Experience" (in general) is uncountable → "much" in negative sentences.' },
    ],
    grammarDetective: [
      { sentence: 'There are much people in the classroom.', question: 'What is the error?', options: ['"much" should be "many"', '"much" should be "a little"', 'Change "are" to "is"', 'No error'], correct: 0, explanation: '"People" is countable plural. Use "many" (not "much") with countable nouns.' },
      { sentence: 'How many furnitures do we need?', question: 'What is the error?', options: ['Change "many" to "much"', '"furnitures" is wrong — say "furniture"', 'Both A and B', 'No error'], correct: 2, explanation: '"Furniture" is uncountable: no plural -s and use "How much furniture."' },
    ],
  },
  unit3: {
    title: 'Determiners & Quantifiers Challenge',
    prompts: [
      { situation: 'You\'re writing a review of a new café.', answer: 'There are some comfortable seats but there isn\'t any Wi-Fi.' },
      { situation: 'Tell a friend about your neighborhood services.', answer: 'There are a lot of pharmacies but there aren\'t any bookstores.' },
      { situation: 'Describe what\'s in a subscription box you opened.', answer: 'There are a few snacks, some stickers, and a lot of candy inside.' },
      { situation: 'A classmate asks about EAFIT\'s student services.', answer: 'There is a health center, some sports facilities, and a lot of study rooms.' },
      { situation: 'Compare two stores in your area.', answer: 'This store has a lot of variety. That one doesn\'t have much selection.' },
    ],
    sentenceBuilder: [
      { prompt: 'There aren\'t ___ parking spaces near the building.', options: ['some', 'any', 'much', 'a'], correct: 1, explanation: 'In negative sentences with countable plural nouns, use "any."' },
      { prompt: '___ reviews about this restaurant are very positive.', options: ['This', 'A', 'These', 'Much'], correct: 2, explanation: '"Reviews" is plural. Use "These" (near, plural demonstrative).' },
      { prompt: 'I need ___ advice about choosing a gym.', options: ['a', 'an', 'some', 'many'], correct: 2, explanation: '"Advice" is uncountable. Use "some" in affirmative sentences.' },
    ],
    grammarDetective: [
      { sentence: 'I don\'t have some time for that.', question: 'What is the error?', options: ['"some" should be "any"', '"some" should be "much"', 'Add "a" before "time"', 'No error'], correct: 0, explanation: 'In negative sentences, use "any" instead of "some": "I don\'t have any time."' },
      { sentence: 'Those service is really good.', question: 'What is the error?', options: ['"Those" should be "That"', '"Those" should be "This"', 'Add "a" before it', 'No error'], correct: 0, explanation: '"Service" is singular. "Those" is for plural nouns. Use "That service is really good."' },
    ],
  },
}

const activityInstructionPacks: { [unitKey: string]: { [activityTitle: string]: ActivityInstructionPack } } = {
  unit1: {
    'Small Wins Bingo': {
      steps: ['Each student receives a bingo card with "small wins" in each square.', 'Walk around the classroom and find a classmate who has achieved each small win.', 'Write the classmate\'s name in the square and compare achievements using comparatives.', 'First to complete a full line calls "Bingo!" and shares their comparisons with the class.'],
      materials: ['Bingo cards with small wins printed', 'Pens for each student'],
      tips: ['Pre-teach comparative phrases on the board.', 'Model one exchange first to set expectations.'],
    },
    'Guess the Celebration': {
      steps: ['Teacher displays photos of celebrations from around the world.', 'In pairs, students guess which celebration each photo shows.', 'Students describe photos using adjectives and make comparisons.', 'Share guesses with the class and discuss cultural differences.'],
      materials: ['Projected photos of diverse celebrations', 'Optional: printed photo cards'],
      tips: ['Include Colombian celebrations alongside international ones.', 'Use this to build cultural awareness and vocabulary.'],
    },
    'Music & Milestones': {
      steps: ['Play background music while students walk around the room.', 'Stop the music — students pair up with the nearest person.', 'Each person shares one milestone and compares it with their partner\'s.', 'After 3 rounds, volunteers share the most interesting milestone they heard.'],
      materials: ['Background music and speakers', 'Timer'],
      tips: ['Keep rounds under 2 minutes for energy.', 'Model the comparative sentence structure before starting.'],
    },
    'My Achievement Timeline': {
      steps: ['Students brainstorm 6-8 personal achievements (small wins and big events).', 'Write or draw each achievement on a card and arrange from smallest to biggest.', 'Present timeline to a partner, using comparatives and superlatives to rank.', 'Partner asks at least 2 follow-up questions about the achievements.'],
      materials: ['Index cards or sticky notes', 'Markers', 'Timeline template (optional)'],
      tips: ['Provide sentence frames for students who need support.', 'Encourage authentic, personal stories for engagement.'],
    },
    'Celebration Photo Gallery Walk': {
      steps: ['Post celebration photos around the classroom walls.', 'Students walk around and write observations on their worksheet.', 'Compare at least 3 celebrations with a classmate using comparative forms.', 'Choose the most interesting celebration and explain why to the group.'],
      materials: ['Printed celebration photos posted on walls', 'Observation worksheets', 'Pens'],
      tips: ['Include cultural celebrations from Colombia and various countries.', 'Encourage students to ask each other comparative questions.'],
    },
    'Achievement Speed Dating': {
      steps: ['Arrange seats in two facing rows.', 'Students share achievements and compare with their partner for 2 minutes.', 'When the teacher signals "switch," one row moves to the next seat.', 'After 4-5 rounds, share the most impressive achievement heard with the class.'],
      materials: ['Timer', 'Optional conversation prompt cards'],
      tips: ['Model the activity with a volunteer first.', 'Strict time-keeping maintains energy and pace.'],
    },
    'Comparison Journal Entry': {
      steps: ['Write a 60-80 word paragraph comparing one everyday win and one major life event.', 'Use at least 4 comparative or superlative forms.', 'Exchange journals with a partner and underline comparison forms found.', 'Discuss: Did you use similar structures? Which were hardest?'],
      materials: ['Journals or notebooks', 'Highlighters'],
      tips: ['Encourage peer discussion, not just identification.', 'Display strong examples for the class.'],
    },
    'What Made It Special? Discussion': {
      steps: ['In groups of 3-4, share which celebration from the gallery walk impacted you most.', 'Explain using comparatives: "The quinceañera was more colorful than the graduation."', 'Rank the top 3 most interesting celebrations as a group.', 'Present rankings with comparative reasoning to the class.'],
      materials: ['Notes from gallery walk activity'],
      tips: ['Push for justification with comparative reasoning.', 'Encourage respectful discussion of different cultural celebrations.'],
    },
    'Reflection Circle': {
      steps: ['Sit in a circle and pass a talking object.', 'Complete sentence starters using comparatives and superlatives.', 'Listen to all classmates share their reflections.', 'Discuss patterns: What do your classmates value most?'],
      materials: ['Small ball or talking object', 'Sentence starter cards (optional)'],
      tips: ['Create a safe, supportive atmosphere.', 'Keep focus on comparative/superlative language use.'],
    },
    'Adjective Sorting Challenge': {
      steps: ['Receive 20 adjective cards and sort into: Short (+er/+est), Long (more/most), Irregular.', 'Write the comparative and superlative of each adjective.', 'Check answers with the answer key provided.', 'Create 2 original sentences per category.'],
      materials: ['20 adjective cards per group', 'Sorting mat with 3 columns', 'Answer key'],
      tips: ['Let students discover rules before confirming.', 'Include tricky adjectives like "clever" and "narrow."'],
    },
    'Grammar Detective: Find the Pattern': {
      steps: ['Read 10 sentences containing comparatives and superlatives.', 'Highlight all comparison forms with your partner.', 'Answer detective questions about when to use -er/-est vs. more/most.', 'Write grammar rules in your own words and compare with another pair.'],
      materials: ['Detective worksheet', 'Highlighters'],
      tips: ['Sentences should have clear, discoverable patterns.', 'Guide discovery without giving rules directly.'],
    },
    'Comparative & Superlative Rule Builders': {
      steps: ['Complete the rule builder chart with spelling and formation rules.', 'Include rules for 1-syllable, 2+ syllable, and irregular adjectives.', 'Test rules by creating 5 new sentences.', 'Have another group check your sentences.'],
      materials: ['Rule builder chart templates', 'Markers'],
      tips: ['Have students present their rules to the class.', 'Correct misconceptions collaboratively.'],
    },
    'Error Hospital': {
      steps: ['Read 8 sentences with comparison errors.', 'Find the error, explain what is wrong, and write the correct version.', 'Exchange with a partner and verify corrections.', 'Discuss the most common errors.'],
      materials: ['Error correction worksheet'],
      tips: ['Include errors your students commonly make.', 'This is a great diagnostic activity.'],
    },
    'My Life Awards Ceremony': {
      steps: ['Create award categories for personal achievements (e.g., "Most Challenging").', 'Write a 30-40 word acceptance speech per category using comparatives/superlatives.', 'Present awards to a small group.', 'Group votes for the most interesting award.'],
      materials: ['Award certificate templates', 'Presentation space'],
      tips: ['Print fun award certificates.', 'Make it celebratory and supportive.'],
    },
    'Celebration Comparison Poster': {
      steps: ['Choose two celebrations to compare with your partner.', 'Create a Venn diagram showing similarities and differences.', 'Write at least 8 comparative/superlative sentences.', 'Present your poster and handle classmate questions.'],
      materials: ['Poster paper', 'Markers', 'Optional: printed images'],
      tips: ['Encourage cultural comparisons.', 'Display finished posters in the classroom.'],
    },
    'Everyday Wins Blog Post': {
      steps: ['Write a 100-120 word blog post about everyday wins this week.', 'Include at least 3 achievements and compare them.', 'Share with a partner for peer feedback.', 'Revise based on feedback suggestions.'],
      materials: ['Notebooks or digital devices'],
      tips: ['Consider using a class blog or Padlet.', 'Peer feedback should focus on comparison forms.'],
    },
  },
  unit2: {
    'Dream Home Pictionary': {
      steps: ['Teams take turns having one member draw home features on the board.', 'Teammates guess using quantity questions: "Does it have many rooms?"', 'Fastest team to guess correctly scores a point.', 'Play 3-4 rounds.'],
      materials: ['Whiteboard and markers'],
      tips: ['Model quantity questions before starting.', 'Keep rounds fast-paced.'],
    },
    'Neighborhood Word Cloud': {
      steps: ['Write as many neighborhood features as possible in 2 minutes.', 'Compare your list with a partner.', 'Sort words into COUNTABLE and UNCOUNTABLE categories.', 'Share your longest list with the class.'],
      materials: ['Paper and pens'],
      tips: ['This previews the countable/uncountable distinction naturally.'],
    },
    'Four Corners: Housing Preferences': {
      steps: ['Go to the corner matching your housing preference.', 'Discuss in your group using quantity expressions.', 'Each group presents reasons to the class.'],
      materials: ['Corner labels: Apartment, House, Student dorm, Shared flat'],
      tips: ['Encourage target language: how much/many, a lot of, not much/many.'],
    },
    'Apartment Hunting Role-Play': {
      steps: ['Pair up: one is a real estate agent, the other seeks an apartment.', 'Agent describes apartments using quantifiers.', 'Client asks how much/many questions.', 'Switch roles after 5 minutes; choose the best apartment.'],
      materials: ['Apartment description cards', 'Role-play prompts'],
      tips: ['Provide visual apartment cards.', 'Pre-teach real estate vocabulary.'],
    },
    'My Neighborhood Map': {
      steps: ['Draw a map of your (real or ideal) neighborhood.', 'Label 10+ places.', 'Describe to a partner using countable/uncountable nouns and quantifiers.', 'Compare neighborhoods and present the most interesting difference.'],
      materials: ['Paper', 'Colored pencils', 'Map template'],
      tips: ['Provide a simple template for structure.'],
    },
    'Furniture Shopping Challenge': {
      steps: ['With a partner, browse the furniture catalog.', 'Use a $2,000 budget to furnish an empty apartment.', 'Discuss using quantity expressions: "We need some chairs. How many?"', 'Present your shopping list to the class.'],
      materials: ['Furniture catalog (with prices)', 'Budget worksheet'],
      tips: ['Print catalogs with clear prices.', 'This activates countable/uncountable naturally.'],
    },
    'Housing Survey Reflection': {
      steps: ['Complete a housing survey about your situation.', 'Compare answers with 2 classmates.', 'Write 5 comparative sentences about differences found.'],
      materials: ['Housing survey worksheet'],
      tips: ['Use the survey to naturally practice how much/many.'],
    },
    'What Makes a Good Neighborhood?': {
      steps: ['In groups of 3, rank the 5 most important neighborhood features.', 'Justify using quantifiers.', 'Compare your ranking with another group.', 'Write a group opinion statement.'],
      materials: ['Ranking worksheets', 'Markers'],
      tips: ['Focus on negotiation language and quantity expressions.'],
    },
    'Before & After Reflection': {
      steps: ['Write a 60-80 word comparison of before/after a living change.', 'Share with a partner and identify quantity expressions.', 'Discuss which situation was better.'],
      materials: ['Notebooks'],
      tips: ['Students who haven\'t moved can compare two known places.'],
    },
    'Countable vs. Uncountable Sorting': {
      steps: ['Sort 30 word cards into COUNTABLE and UNCOUNTABLE.', 'Discuss tricky words.', 'Map which quantifiers go with each category.', 'Create a grammar poster with rules.'],
      materials: ['30 word cards', 'Sorting mat', 'Poster template'],
      tips: ['Include tricky words. Use discovery approach.'],
    },
    'How Much vs. How Many Quiz Show': {
      steps: ['Teacher shows a word; hold up the correct sign.', 'Create a complete question with the word.', 'Score points for speed and accuracy.', 'Champion creates 3 original questions.'],
      materials: ['"How much" and "How many" signs', 'Word list'],
      tips: ['Start easy, add tricky words.', 'Let students make signs.'],
    },
    'Grammar Pattern Discovery': {
      steps: ['Read 12 housing sentences and highlight all quantifiers.', 'Categorize which quantifiers appear in affirmative, negative, and questions.', 'Write discovery rules.', 'Compare with a partner.'],
      materials: ['Discovery worksheet with 12 sentences'],
      tips: ['Let students find patterns; don\'t give rules directly.'],
    },
    'Quantifier Board Game': {
      steps: ['Roll dice and move your token.', 'Complete the sentence on the square with the correct quantifier.', 'If the group agrees you\'re correct, stay; if wrong, go back 2.', 'First to finish wins!'],
      materials: ['Board game', 'Dice', 'Tokens'],
      tips: ['Print one board per group.', 'Include answer key for self-checking.'],
    },
    '"Find Your Perfect Home" Presentation': {
      steps: ['Create a presentation advertising a home.', 'Include 6+ quantifier expressions and comparisons.', 'Present to the class.', 'Classmates ask how much/many questions; vote for best agent.'],
      materials: ['Paper for visuals', 'Presentation space'],
      tips: ['Encourage creativity with visuals.'],
    },
    'Neighborhood Improvement Plan': {
      steps: ['Choose a real neighborhood in your city.', 'Document current features and identify what\'s missing.', 'Create an improvement plan with 3+ ideas.', 'Present as a poster or slide.'],
      materials: ['Poster paper or digital tools', 'Neighborhood info'],
      tips: ['Use neighborhoods near EAFIT for local relevance.'],
    },
    'Roommate Compatibility Interview': {
      steps: ['Write 8 interview questions using how much/many.', 'Interview 2-3 classmates.', 'Choose ideal roommate based on answers.', 'Write 60-80 word explanation using quantifiers.'],
      materials: ['Interview template', 'Recording sheet'],
      tips: ['Encourage follow-up questions.'],
    },
  },
  unit3: {
    'EAFIT Campus Quest': {
      steps: ['In teams, study photos of EAFIT campus services.', 'Write sentences using determiners/quantifiers for each service.', 'Team with most correct sentences in 5 minutes wins!'],
      materials: ['Photos of campus services', 'Answer sheets'],
      tips: ['Use real EAFIT photos for relevance.'],
    },
    'Tourist Information Center': {
      steps: ['Take turns as tourist and info officer.', 'Tourist asks about services using "any," "much," etc.', 'Officer answers using quantifiers.', 'Practice 3 rounds each.'],
      materials: ['City service prompt cards'],
      tips: ['Provide a word bank.', 'This previews unit grammar naturally.'],
    },
    'Service Pictionary Race': {
      steps: ['One person draws a community service.', 'Team guesses; when correct, everyone says a sentence with determiners.', 'Fastest team wins each round!'],
      materials: ['Whiteboard', 'Service word cards'],
      tips: ['Keep rounds fast and energetic.'],
    },
    'Street Food Stall Comparison': {
      steps: ['Look at photos of two food stalls and discuss preferences in groups.', 'Use determiners: "some options," "any variety."', 'Listen to the conversation and compare opinions.', 'Report: Did the speakers agree with your group?'],
      materials: ['Food stall photos', 'Conversation audio', 'Transcript'],
      tips: ['Based on Navigate Elementary (Oxford).', 'Introduce a/an, some, any naturally.'],
    },
    'Shopping List Pair Activity': {
      steps: ['Each partner has a different shopping list version (A/B).', 'Ask: "Do we need any...?" Answer: "Yes, we need some..." / "No, we don\'t need any..."', 'Create a complete combined shopping list.', 'Present final list to the class.'],
      materials: ['Shopping list worksheets (A and B versions)'],
      tips: ['From English File Elementary (Oxford).', 'Cut worksheets into A/B.'],
    },
    'Campus Service Exploration': {
      steps: ['Visit/observe 3 EAFIT campus services.', 'Note: services available, number of students, equipment, space.', 'Write 5 sentences per service using quantifiers.', 'Compare observations with a partner.'],
      materials: ['Observation worksheet', 'Mobile phones or cameras'],
      tips: ['Use photos if in-person visit is not possible.'],
    },
    'Grammar Discovery: A/An, Some, Any': {
      steps: ['Find all a/an/some/any in the conversation transcript.', 'Categorize by sentence type: affirmative, negative, question.', 'Complete the grammar discovery checklist.', 'Write group rules.'],
      materials: ['Conversation transcript', 'Grammar checklist', 'Reference sheet'],
      tips: ['Guide discovery; don\'t give rules directly.', 'Provide controlled practice links.'],
    },
    'Shopping Habits Quiz Reflection': {
      steps: ['Complete the shopping habits quiz.', 'Notice highlighted quantifiers in each statement.', 'Sort quantifiers by: countable, uncountable, both.', 'Create a reference chart.'],
      materials: ['Shopping habits quiz', 'Quantifier handout'],
      tips: ['Connects grammar with personal experience.'],
    },
    'Service Observation Debrief': {
      steps: ['Share campus observations with your group.', 'Answer reflection questions about language used.', 'Complete sentence starters about what you noticed.', 'Write a short group reflection paragraph.'],
      materials: ['Notes from exploration', 'Reflection questions'],
      tips: ['Bridges concrete experience to abstract rules.'],
    },
    'Quantifiers Board Game': {
      steps: ['Roll dice, move to a square with a "How much/many" question.', 'Answer in a complete sentence using the correct quantifier.', 'If correct, stay; if wrong, go back.', 'First to finish wins!'],
      materials: ['Board game per group', 'Dice', 'Tokens'],
      tips: ['Students can use coins or erasers as tokens.'],
    },
    'Demonstratives in Context': {
      steps: ['Practice with classroom objects at different distances.', 'Use this/that (singular) and these/those (plural).', 'Write 6 sentences using demonstratives about services.', 'Compare with a partner.'],
      materials: ['Classroom objects', 'Demonstrative reference card'],
      tips: ['Use physical demonstration with objects.'],
    },
    'Grammar Pattern Wall': {
      steps: ['Create a poster organizing examples into grammar categories.', 'Include a/an, some, any, much, many, a lot of rules.', 'For each category, write the rule AND 2 original examples.', 'Display on the wall for reference.'],
      materials: ['Large poster paper', 'Markers', 'Sticky notes'],
      tips: ['Display for reference throughout the unit.'],
    },
    'Error Correction Workshop': {
      steps: ['Find and fix errors in 10 sentences about community services.', 'Explain why each was wrong.', 'Write 3 tricky error sentences of your own.', 'Challenge a partner to fix them.'],
      materials: ['Error correction worksheet'],
      tips: ['Peer-generated errors are powerful diagnostic tools.'],
    },
    'A Service Review': {
      steps: ['Choose a real service you have used.', 'Write a 100-120 word review using determiners and quantifiers.', 'Share for peer feedback and revise.', 'Present to class; vote for best review.'],
      materials: ['Review template', 'Peer feedback checklist'],
      tips: ['Show real Google Maps reviews as models.'],
    },
    'Product Unboxing Video': {
      steps: ['Choose a product; watch example unboxing videos for inspiration.', 'Plan content using the description worksheet.', 'Record or perform a live 2-minute unboxing using target language.', 'Present to class and receive creative awards.'],
      materials: ['Phone for recording', 'Product', 'Description worksheet'],
      tips: ['Show a trending unboxing video first.', 'Multi-class project.'],
    },
    'Community Service Catalog': {
      steps: ['Discuss and list local services; create a survey.', 'Interview neighbors or classmates about services.', 'Organize findings in a catalog with descriptions using determiners/quantifiers.', 'Present catalog to class with photos.'],
      materials: ['Survey templates', 'Catalog design materials', 'Mobile phones'],
      tips: ['Multi-session project.', 'Great for real-world application.'],
    },
  },
}

export default function EnglishCoursePresentation() {
  const [currentUnit, setCurrentUnit] = useState(0)
  const [showTeacherNotes, setShowTeacherNotes] = useState(true)
  const [isChecklistMode, setIsChecklistMode] = useState(false)
  const [expandedInlinePanels, setExpandedInlinePanels] = useState<Record<string, boolean>>({})
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({})
  const [quizState, setQuizState] = useState<{ [key: string]: { answered: number[], score: number } }>({
    unit1: { answered: [], score: 0 },
    unit2: { answered: [], score: 0 },
    unit3: { answered: [], score: 0 }
  })
  const [activeSection, setActiveSection] = useState<'overview' | 'activities' | 'quiz' | 'games' | 'final-assessment'>('overview')
  const [promptGameState, setPromptGameState] = useState<{ [key: string]: { currentPrompt: number, revealed: boolean, score: number } }>({
    unit1: { currentPrompt: 0, revealed: false, score: 0 },
    unit2: { currentPrompt: 0, revealed: false, score: 0 },
    unit3: { currentPrompt: 0, revealed: false, score: 0 }
  })
  const [quickPracticeAnswers, setQuickPracticeAnswers] = useState<{ [key: string]: Record<number, string> }>({
    unit1: {},
    unit2: {},
    unit3: {}
  })
  const [sentenceBuilderState, setSentenceBuilderState] = useState<{ [key: string]: { answered: number[], score: number } }>({
    unit1: { answered: [], score: 0 },
    unit2: { answered: [], score: 0 },
    unit3: { answered: [], score: 0 }
  })
  const [grammarDetectiveState, setGrammarDetectiveState] = useState<{ [key: string]: { answered: number[], score: number } }>({
    unit1: { answered: [], score: 0 },
    unit2: { answered: [], score: 0 },
    unit3: { answered: [], score: 0 }
  })
  const [favorites, setFavorites] = useState<string[]>([])
  const [expandedActivity, setExpandedActivity] = useState<ExpandedActivity | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [audioSpeed, setAudioSpeed] = useState(1)

  const handlePlayAudio = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      await audio.play()
      setIsAudioPlaying(true)
    } catch {
      setIsAudioPlaying(false)
    }
  }

  const handlePauseAudio = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    setIsAudioPlaying(false)
  }

  const handleStopAudio = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsAudioPlaying(false)
  }

  const handleSetAudioSpeed = (speed: number) => {
    const audio = audioRef.current
    setAudioSpeed(speed)
    if (audio) {
      audio.playbackRate = speed
    }
  }

  const resetAudioPlayer = () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      audio.playbackRate = 1
    }
    setIsAudioPlaying(false)
    setAudioSpeed(1)
  }

  const closeExpandedActivity = () => {
    resetAudioPlayer()
    setExpandedActivity(null)
  }

  const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const getActivityId = (targetUnitKey: string, sectionKey: string, title: string, index: number) =>
    `${targetUnitKey}-${sectionKey}-${index}-${slugify(title)}`

  const toggleActivityCompletion = (activityId: string) => {
    setCompletedActivities(prev => ({ ...prev, [activityId]: !prev[activityId] }))
  }

  const toggleInlinePanel = (activityId: string) => {
    setExpandedInlinePanels(prev => ({ ...prev, [activityId]: !prev[activityId] }))
  }

  const getActivityInstructionPack = (targetUnitKey: string, activity: WarmUp | Activity): ActivityInstructionPack => {
    const pack = activityInstructionPacks[targetUnitKey]?.[activity.title]
    if (pack) return pack

    const primaryText = isRegularActivity(activity) ? activity.studentTask : activity.instructions
    return {
      steps: primaryText
        .split(/(?<=[.!?])\s+/)
        .map(step => step.trim())
        .filter(Boolean)
        .slice(0, 3),
      materials: [activity.materials ?? 'No special materials required.'],
      tips: [activity.teacherNote],
    }
  }

  const openExpandedActivity = (section: string, targetUnitKey: string, activityId: string, activity: WarmUp | Activity) => {
    resetAudioPlayer()
    setExpandedActivity({ section, unitKey: targetUnitKey, activityId, activity })
  }

  const handleAnswer = (unitKey: string, questionIndex: number, answerIndex: number, correct: number) => {
    const unitState = quizState[unitKey]
    if (unitState.answered.includes(questionIndex)) return

    setQuizState(prev => ({
      ...prev,
      [unitKey]: {
        answered: [...prev[unitKey].answered, questionIndex],
        score: prev[unitKey].score + (answerIndex === correct ? 1 : 0)
      }
    }))
  }

  const resetQuiz = (unitKey: string) => {
    setQuizState(prev => ({
      ...prev,
      [unitKey]: { answered: [], score: 0 }
    }))
  }

  const toggleFavorite = (activityTitle: string) => {
    setFavorites(prev =>
      prev.includes(activityTitle)
        ? prev.filter(t => t !== activityTitle)
        : [...prev, activityTitle]
    )
  }

  const nextGamePrompt = (targetUnitKey: string) => {
    const prompts = sentenceBuilderGames[targetUnitKey as keyof typeof sentenceBuilderGames].prompts
    setPromptGameState(prev => ({
      ...prev,
      [targetUnitKey]: {
        ...prev[targetUnitKey],
        currentPrompt: (prev[targetUnitKey].currentPrompt + 1) % prompts.length,
        revealed: false
      }
    }))
  }

  const revealAnswer = (targetUnitKey: string) => {
    if (promptGameState[targetUnitKey].revealed) return
    setPromptGameState(prev => ({
      ...prev,
      [targetUnitKey]: {
        ...prev[targetUnitKey],
        revealed: true,
        score: prev[targetUnitKey].score + 1
      }
    }))
  }

  const handleQuickPracticeAnswer = (targetUnitKey: string, questionIdx: number, value: string) => {
    setQuickPracticeAnswers(prev => ({
      ...prev,
      [targetUnitKey]: {
        ...prev[targetUnitKey],
        [questionIdx]: value
      }
    }))
  }

  const handleSentenceBuilderAnswer = (targetUnitKey: string, questionIdx: number, selectedIdx: number, correctIdx: number) => {
    if (sentenceBuilderState[targetUnitKey].answered.includes(questionIdx)) return
    setSentenceBuilderState(prev => ({
      ...prev,
      [targetUnitKey]: {
        answered: [...prev[targetUnitKey].answered, questionIdx],
        score: prev[targetUnitKey].score + (selectedIdx === correctIdx ? 1 : 0)
      }
    }))
  }

  const resetSentenceBuilder = (targetUnitKey: string) => {
    setSentenceBuilderState(prev => ({
      ...prev,
      [targetUnitKey]: { answered: [], score: 0 }
    }))
  }

  const handleGrammarDetectiveAnswer = (targetUnitKey: string, questionIdx: number, selectedIdx: number, correctIdx: number) => {
    if (grammarDetectiveState[targetUnitKey].answered.includes(questionIdx)) return
    setGrammarDetectiveState(prev => ({
      ...prev,
      [targetUnitKey]: {
        answered: [...prev[targetUnitKey].answered, questionIdx],
        score: prev[targetUnitKey].score + (selectedIdx === correctIdx ? 1 : 0)
      }
    }))
  }

  const resetGrammarDetective = (targetUnitKey: string) => {
    setGrammarDetectiveState(prev => ({
      ...prev,
      [targetUnitKey]: { answered: [], score: 0 }
    }))
  }

  const resetPromptGame = (targetUnitKey: string) => {
    setPromptGameState(prev => ({
      ...prev,
      [targetUnitKey]: { currentPrompt: 0, revealed: false, score: 0 }
    }))
  }

  const unit = units[currentUnit]
  const unitKey = `unit${currentUnit + 1}`
  const activities = activitiesData[unitKey]
  const quizzes = quizQuestions[unitKey as keyof typeof quizQuestions]
  const quizResult = quizState[unitKey]
  const gamePrompts = sentenceBuilderGames[unitKey as keyof typeof sentenceBuilderGames]
  const promptResult = promptGameState[unitKey]
  const sentenceBuilderResult = sentenceBuilderState[unitKey]
  const grammarDetectiveResult = grammarDetectiveState[unitKey]
  const quickPractice = quickPracticeExercises[unitKey as keyof typeof quickPracticeExercises]

  const activityProgress = useMemo(() => {
    const sections = activityStageMeta.map((stage) => {
      const stageActivities = activities[stage.key]
      const completed = stageActivities.reduce((count, activity, idx) => {
        const activityId = getActivityId(unitKey, stage.key, activity.title, idx)
        return count + (completedActivities[activityId] ? 1 : 0)
      }, 0)

      return {
        ...stage,
        total: stageActivities.length,
        completed,
      }
    })

    const total = sections.reduce((sum, stage) => sum + stage.total, 0)
    const completed = sections.reduce((sum, stage) => sum + stage.completed, 0)
    return { sections, total, completed, percent: total === 0 ? 0 : Math.round((completed / total) * 100) }
  }, [activities, completedActivities, unitKey])

  const renderInstructionPanel = (targetUnitKey: string, activity: WarmUp | Activity, activityId: string) => {
    if (!expandedInlinePanels[activityId]) return null

    const pack = getActivityInstructionPack(targetUnitKey, activity)

    return (
      <div className="mt-3 rounded-lg border border-slate-200 bg-white/90 p-3">
        <details open className="group border-b border-slate-100 pb-2 mb-2">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 inline-flex items-center gap-1">
            <Icon icon={icons.accordion} className="w-4 h-4 text-slate-500" />
            Steps
            <Icon icon={icons.chevronDown} className="w-4 h-4 text-slate-500 transition-transform group-open:rotate-180" />
          </summary>
          <ol className="mt-2 space-y-1 pl-4 text-xs text-slate-700 list-decimal">
            {pack.steps.map((step, idx) => (
              <li key={`${activityId}-step-${idx}`}>{step}</li>
            ))}
          </ol>
        </details>
        <details className="group border-b border-slate-100 pb-2 mb-2">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 inline-flex items-center gap-1">
            <Icon icon={icons.task} className="w-4 h-4 text-slate-500" />
            Materials
            <Icon icon={icons.chevronDown} className="w-4 h-4 text-slate-500 transition-transform group-open:rotate-180" />
          </summary>
          <ul className="mt-2 space-y-1 pl-4 text-xs text-slate-700 list-disc">
            {pack.materials.map((material, idx) => (
              <li key={`${activityId}-material-${idx}`}>{material}</li>
            ))}
          </ul>
        </details>
        <details className="group">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 inline-flex items-center gap-1">
            <Icon icon={icons.teacher} className="w-4 h-4 text-slate-500" />
            Tips
            <Icon icon={icons.chevronDown} className="w-4 h-4 text-slate-500 transition-transform group-open:rotate-180" />
          </summary>
          <ul className="mt-2 space-y-1 pl-4 text-xs text-slate-700 list-disc">
            {pack.tips.map((tip, idx) => (
              <li key={`${activityId}-tip-${idx}`}>{tip}</li>
            ))}
          </ul>
        </details>
      </div>
    )
  }

  const expandedActivityPack = expandedActivity
    ? getActivityInstructionPack(expandedActivity.unitKey, expandedActivity.activity)
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      {/* Header */}
      <header className="print-hidden sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <div className="relative h-8 w-[128px] sm:h-9 sm:w-[144px]">
                  <Image
                    src="/logos/idiomas-eafit-black.svg"
                    alt="Logo Idiomas EAFIT"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
                <span className="h-6 w-px bg-slate-300" aria-hidden="true" />
                <div className="relative h-8 w-[112px] sm:h-9 sm:w-[128px]">
                  <Image
                    src="/logos/universidad-eafit-black.svg"
                    alt="Logo Universidad EAFIT"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">English Course • Elementary 2 • Level A2</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {favorites.length > 0 && (
                <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                  <Icon icon={icons.heart} className="w-3 h-3 mr-1 text-pink-500" /> {favorites.length} favorites
                </Badge>
              )}
              <Button
                variant={isChecklistMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsChecklistMode(!isChecklistMode)}
                className={`gap-2 ${isChecklistMode ? `bg-gradient-to-r ${unit.color}` : ''}`}
              >
                <Icon icon={icons.checklist} className="w-4 h-4" />
                {isChecklistMode ? 'Checklist On' : 'Checklist Mode'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-2"
              >
                <Icon icon={icons.printer} className="w-4 h-4" />
                Print View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTeacherNotes(!showTeacherNotes)}
                className="gap-2"
              >
                <Icon icon={icons.eye} className="w-4 h-4" />
                {showTeacherNotes ? 'Hide' : 'Show'} Notes
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Unit Navigation */}
      <nav className="print-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {units.map((u, idx) => {
              const unitIcon = u.icon
              return (
                <motion.button
                  key={u.id}
                  onClick={() => {
                    setCurrentUnit(idx)
                    setActiveSection('overview')
                    resetPromptGame(`unit${idx + 1}`)
                    closeExpandedActivity()
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${currentUnit === idx
                    ? `bg-gradient-to-r ${u.color} text-white shadow-lg`
                    : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <Icon icon={unitIcon} className="w-5 h-5" />
                  <span className="hidden sm:inline">Unit {u.id}</span>
                  <span className="sm:hidden">U{u.id}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUnit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Unit Hero */}
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${unit.color} p-6 md:p-8 mb-6 text-white`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <Badge className="bg-white/20 text-white border-white/30 mb-3">
                  {unit.level}
                </Badge>
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{unit.title}</h2>
                <p className="text-lg text-white/90 mb-4">{unit.subtitle}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <Icon icon={icons.clock} className="w-4 h-4" /> {unit.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon={icons.bookOpen} className="w-4 h-4" /> Kolb's Learning Cycle
                  </span>
                </div>
              </div>
            </div>

            <Card className="mb-6 border-2 border-slate-200 print-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Icon icon={icons.timeline} className="h-5 w-5 text-slate-700" />
                  Unit Progress Timeline
                </CardTitle>
                <CardDescription>
                  {activityProgress.completed} of {activityProgress.total} activities completed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Completion</span>
                  <span className="font-semibold text-slate-800">{activityProgress.percent}%</span>
                </div>
                <Progress value={activityProgress.percent} className="h-3" />
                <div className="grid gap-3 md:grid-cols-5">
                  {activityProgress.sections.map((stage, idx) => (
                    <motion.div
                      key={stage.key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className={`rounded-xl border p-3 ${stage.completed === stage.total ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'
                        }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                        <Icon icon={stage.icon} className="h-4 w-4 text-slate-600" />
                        <span className="text-xs font-semibold text-slate-700">{stage.shortLabel}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800">
                        {stage.completed}/{stage.total}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Section Tabs */}
            <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as typeof activeSection)} className="mb-6">
              <TabsList className="print-hidden flex flex-wrap justify-center w-full h-auto p-1 mb-4 gap-1">
                <TabsTrigger value="overview" className={`flex-1 relative flex items-center justify-center gap-2 px-3 py-2 text-sm transition-all hover:bg-slate-100 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-md`}>
                  <Icon icon={icons.bookOpen} className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">Overview</span>
                  {activeSection === 'overview' && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />}
                </TabsTrigger>
                <TabsTrigger value="activities" className={`flex-1 relative flex items-center justify-center gap-2 px-3 py-2 text-sm transition-all hover:bg-slate-100 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-md`}>
                  <Icon icon={icons.play} className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">Activities</span>
                  {activeSection === 'activities' && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-400 animate-pulse" />}
                </TabsTrigger>
                <TabsTrigger value="games" className={`flex-1 relative flex items-center justify-center gap-2 px-3 py-2 text-sm transition-all hover:bg-slate-100 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-md`}>
                  <Icon icon={icons.zap} className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">Games</span>
                  {activeSection === 'games' && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />}
                </TabsTrigger>
                <TabsTrigger value="quiz" className={`flex-1 relative flex items-center justify-center gap-2 px-3 py-2 text-sm transition-all hover:bg-slate-100 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-md`}>
                  <Icon icon={icons.target} className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">Quiz</span>
                  {activeSection === 'quiz' && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-400 animate-pulse" />}
                </TabsTrigger>
                <TabsTrigger value="final-assessment" className={`flex-1 relative flex items-center justify-center gap-2 px-3 py-2 text-sm transition-all hover:bg-slate-100 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-md`}>
                  <Icon icon={icons.microphone} className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">Assessment</span>
                  {activeSection === 'final-assessment' && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sky-400 animate-pulse" />}
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Learning Objectives */}
                <Card className="border-2 border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon icon={icons.target} className="w-5 h-5 text-emerald-500" />
                      Learning Objectives
                    </CardTitle>
                    <CardDescription>By the end of this unit, you will be able to...</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {unit.objectives.map((obj, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <Icon icon={icons.checkCircle} className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{obj}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Key Language - Interactive Flip Cards */}
                <Card className="border-2 border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon icon={icons.message} className="w-5 h-5 text-violet-500" />
                      Key Language Structures
                    </CardTitle>
                    <CardDescription>Tap cards to see examples and usage!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {unit.keyLanguage.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.08 }}
                          className="group cursor-pointer"
                        >
                          <div className={`relative h-40 perspective-1000`}>
                            <div className={`absolute inset-0 transition-transform duration-500 preserve-3d ${'group-hover:rotate-y-180'}`}>
                              {/* Front */}
                              <div className={`absolute inset-0 backface-hidden p-4 rounded-xl ${unit.lightColor} border ${unit.borderColor} flex flex-col justify-center`}>
                                <code className="text-sm font-bold text-slate-800 text-center">{item.expression}</code>
                                <p className="text-xs text-slate-500 text-center mt-2">Tap to see example</p>
                              </div>
                              {/* Back */}
                              <div className={`absolute inset-0 backface-hidden rotate-y-180 p-4 rounded-xl bg-gradient-to-br ${unit.color} text-white flex flex-col justify-center`}>
                                <p className="text-sm font-medium italic text-center">"{item.example}"</p>
                                <p className="text-xs text-white/80 text-center mt-2">{item.use}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Vocabulary Section */}
                <Card className="border-2 border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon icon={icons.pen} className="w-5 h-5 text-amber-500" />
                      Vocabulary Builder
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <h4 className="font-semibold text-slate-700 mb-2">Core Words</h4>
                        <div className="flex flex-wrap gap-2">
                          {unit.vocabulary.core.map((word, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-white">{word}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <h4 className="font-semibold text-slate-700 mb-2">Key Expressions</h4>
                        <div className="flex flex-wrap gap-2">
                          {unit.vocabulary.expressions.map((expr, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-white">{expr}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <h4 className="font-semibold text-slate-700 mb-2">Connectors</h4>
                        <div className="flex flex-wrap gap-2">
                          {unit.vocabulary.connectors.map((conn, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-white">{conn}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Kolb's Learning Cycle */}
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Icon icon={icons.brain} className="w-5 h-5" />
                      Kolb's Experiential Learning Cycle
                    </CardTitle>
                    <CardDescription className="text-blue-700">
                      This course follows a research-backed learning approach
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { title: "Do", desc: "Experience it!", icon: icons.play, color: "text-rose-500 bg-rose-50 border-rose-200" },
                        { title: "Reflect", desc: "Think about it", icon: icons.eye, color: "text-amber-500 bg-amber-50 border-amber-200" },
                        { title: "Understand", desc: "Find patterns", icon: icons.lightbulb, color: "text-blue-500 bg-blue-50 border-blue-200" },
                        { title: "Apply", desc: "Use it!", icon: icons.rocket, color: "text-emerald-500 bg-emerald-50 border-emerald-200" }
                      ].map((stage, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`flex flex-col items-center text-center p-4 bg-white rounded-xl border-2 ${stage.color}`}
                        >
                          <Icon icon={stage.icon} className="w-8 h-8 mb-2" />
                          <h4 className="font-bold text-slate-800">{stage.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{stage.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activities Tab */}
              <TabsContent value="activities" className="space-y-6">
                {/* Progress Overview */}
                <Card className="border-2 border-slate-200">
                  <CardContent className="py-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-slate-700">
                        Activity completion: <strong>{activityProgress.completed}/{activityProgress.total}</strong>
                      </p>
                      <div className="w-full md:w-64">
                        <Progress value={activityProgress.percent} className="h-2.5" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {activityProgress.sections.map((stage) => (
                        <div key={stage.key} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                          <span className="text-sm text-slate-600">
                            {stage.shortLabel}: <strong>{stage.completed}/{stage.total}</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                    {isChecklistMode && (
                      <p className="mt-3 text-xs text-slate-500">
                        Checklist mode is enabled: use checkboxes to track completion and print a clean planning view.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Warm-ups */}
                <Card className="border-2 border-rose-200">
                  <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-rose-700">
                      <Icon icon={icons.sparkles} className="w-5 h-5" />
                      Warm-Up Activities
                    </CardTitle>
                    <CardDescription>Get ready and energize the class!</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activities.warmUps.map((activity, idx) => {
                        const activityId = getActivityId(unitKey, 'warmUps', activity.title, idx)
                        const isCompleted = !!completedActivities[activityId]
                        return (
                          <motion.div
                            key={activityId}
                            role="button"
                            tabIndex={0}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            whileHover={{ y: -4, scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => openExpandedActivity('Warm-Up Activities', unitKey, activityId, activity)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                openExpandedActivity('Warm-Up Activities', unitKey, activityId, activity)
                              }
                            }}
                            className={`cursor-pointer p-4 rounded-xl border hover:shadow-lg transition-all ${isCompleted
                              ? 'bg-emerald-50 border-emerald-200'
                              : 'bg-rose-50 border-rose-100 hover:border-rose-200'
                              }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-rose-300 bg-rose-200 px-1 text-xs font-bold text-rose-800">
                                  {idx + 1}
                                </span>
                                <h4 className="font-semibold text-rose-800">{activity.title}</h4>
                              </div>
                              <Badge variant="secondary" className="bg-rose-100 text-rose-700 text-xs">
                                <Icon icon={icons.clock} className="w-3 h-3 mr-1" /> {activity.time}
                              </Badge>
                            </div>
                            <div className="mb-2 flex flex-wrap gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant={isCompleted ? 'default' : 'outline'}
                                className={`h-7 px-2 text-xs ${isCompleted ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleActivityCompletion(activityId)
                                }}
                              >
                                <Icon icon={isCompleted ? icons.checkCircle : icons.task} className="mr-1 h-3.5 w-3.5" />
                                {isCompleted ? 'Completed' : 'Mark Done'}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleInlinePanel(activityId)
                                }}
                              >
                                <Icon icon={icons.accordion} className="mr-1 h-3.5 w-3.5" />
                                {expandedInlinePanels[activityId] ? 'Hide Steps' : 'Show Steps'}
                              </Button>
                            </div>
                            <p className="text-sm text-slate-700 mb-2">
                              {isChecklistMode ? 'Use checklist mode to focus on execution order and completion.' : activity.instructions}
                            </p>
                            <p className="text-xs text-slate-500 mb-3"><strong>Materials:</strong> {activity.materials}</p>
                            {showTeacherNotes && (
                              <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                                <p className="text-xs text-amber-800">
                                  <strong className="inline-flex items-center gap-1">
                                    <Icon icon={icons.teacher} className="w-4 h-4" />
                                    Teacher:
                                  </strong>{' '}
                                  {activity.teacherNote}
                                </p>
                              </div>
                            )}
                            {renderInstructionPanel(unitKey, activity, activityId)}
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Concrete Experience */}
                <Card className="border-2 border-emerald-200">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-emerald-700">
                      <Icon icon={icons.play} className="w-5 h-5" />
                      Concrete Experience
                    </CardTitle>
                    <CardDescription>Experience the language in authentic situations!</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid lg:grid-cols-2 gap-4">
                      {activities.concreteExperience.map((activity, idx) => {
                        const activityIcon = activity.icon || icons.play
                        const isFavorite = favorites.includes(activity.title)
                        const activityId = getActivityId(unitKey, 'concreteExperience', activity.title, idx)
                        const isCompleted = !!completedActivities[activityId]
                        return (
                          <motion.div
                            key={activityId}
                            role="button"
                            tabIndex={0}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            whileHover={{ y: -4, scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => openExpandedActivity('Concrete Experience', unitKey, activityId, activity)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                openExpandedActivity('Concrete Experience', unitKey, activityId, activity)
                              }
                            }}
                            className={`cursor-pointer p-4 rounded-xl border hover:border-emerald-200 hover:shadow-lg transition-all ${isCompleted ? 'bg-emerald-50 border-emerald-300' : 'bg-emerald-50 border-emerald-100'
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <Icon icon={activityIcon} className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-emerald-300 bg-emerald-200 px-1 text-xs font-bold text-emerald-800">
                                    {idx + 1}
                                  </span>
                                  <h4 className="font-semibold text-emerald-800">{activity.title}</h4>
                                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs ml-auto">
                                    {activity.time}
                                  </Badge>
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleFavorite(activity.title)
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        toggleFavorite(activity.title)
                                      }
                                    }}
                                    className="p-1 cursor-pointer"
                                  >
                                    <Icon icon={isFavorite ? icons.heart : icons.heartOutline} className={`w-4 h-4 ${isFavorite ? 'text-pink-500' : 'text-slate-300'}`} />
                                  </div>
                                </div>
                                <div className="mb-2 flex flex-wrap gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant={isCompleted ? 'default' : 'outline'}
                                    className={`h-7 px-2 text-xs ${isCompleted ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleActivityCompletion(activityId)
                                    }}
                                  >
                                    <Icon icon={isCompleted ? icons.checkCircle : icons.task} className="mr-1 h-3.5 w-3.5" />
                                    {isCompleted ? 'Completed' : 'Mark Done'}
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleInlinePanel(activityId)
                                    }}
                                  >
                                    <Icon icon={icons.accordion} className="mr-1 h-3.5 w-3.5" />
                                    {expandedInlinePanels[activityId] ? 'Hide Steps' : 'Show Steps'}
                                  </Button>
                                </div>
                                <p className="text-sm text-slate-700 mb-2">{isChecklistMode ? 'Checklist focus: complete this activity and mark it done.' : activity.studentTask}</p>
                                {activity.example && (
                                  <p className="text-xs text-slate-600 italic bg-white p-2 rounded border border-emerald-100">
                                    "{activity.example}"
                                  </p>
                                )}
                                {renderInstructionPanel(unitKey, activity, activityId)}
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Reflection */}
                <Card className="border-2 border-amber-200">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-amber-700">
                      <Icon icon={icons.eye} className="w-5 h-5" />
                      Reflective Observation
                    </CardTitle>
                    <CardDescription>Think about what happened and why!</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-4">
                      {activities.reflection.map((activity, idx) => {
                        const isFavorite = favorites.includes(activity.title)
                        const activityId = getActivityId(unitKey, 'reflection', activity.title, idx)
                        const isCompleted = !!completedActivities[activityId]
                        return (
                          <motion.div
                            key={activityId}
                            role="button"
                            tabIndex={0}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -3, scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => openExpandedActivity('Reflective Observation', unitKey, activityId, activity)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                openExpandedActivity('Reflective Observation', unitKey, activityId, activity)
                              }
                            }}
                            className={`cursor-pointer p-4 rounded-xl border hover:border-amber-200 hover:shadow-lg transition-all ${isCompleted ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-100'
                              }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-amber-300 bg-amber-200 px-1 text-xs font-bold text-amber-800">
                                    {idx + 1}
                                  </span>
                                  <h4 className="font-semibold text-amber-800">{activity.title}</h4>
                                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
                                    {activity.time}
                                  </Badge>
                                </div>
                                <div className="mb-2 flex flex-wrap gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant={isCompleted ? 'default' : 'outline'}
                                    className={`h-7 px-2 text-xs ${isCompleted ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleActivityCompletion(activityId)
                                    }}
                                  >
                                    <Icon icon={isCompleted ? icons.checkCircle : icons.task} className="mr-1 h-3.5 w-3.5" />
                                    {isCompleted ? 'Completed' : 'Mark Done'}
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleInlinePanel(activityId)
                                    }}
                                  >
                                    <Icon icon={icons.accordion} className="mr-1 h-3.5 w-3.5" />
                                    {expandedInlinePanels[activityId] ? 'Hide Steps' : 'Show Steps'}
                                  </Button>
                                </div>
                                <p className="text-slate-700 mb-2">{isChecklistMode ? 'Reflection checkpoint: review outputs and document insights.' : activity.studentTask}</p>
                                {activity.example && (
                                  <p className="text-sm text-slate-600 italic bg-white p-2 rounded">Example: {activity.example}</p>
                                )}
                                {showTeacherNotes && (
                                  <div className="mt-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                                    <p className="text-xs text-orange-800">
                                      <strong className="inline-flex items-center gap-1">
                                        <Icon icon={icons.teacher} className="w-4 h-4" />
                                        Teacher:
                                      </strong>{' '}
                                      {activity.teacherNote}
                                    </p>
                                  </div>
                                )}
                                {renderInstructionPanel(unitKey, activity, activityId)}
                              </div>
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(activity.title)
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    toggleFavorite(activity.title)
                                  }
                                }}
                                className="cursor-pointer"
                              >
                                <Icon icon={isFavorite ? icons.heart : icons.heartOutline} className={`w-5 h-5 ${isFavorite ? 'text-pink-500' : 'text-slate-300'}`} />
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Abstract Conceptualization */}
                <Card className="border-2 border-blue-200">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Icon icon={icons.lightbulb} className="w-5 h-5" />
                      Abstract Conceptualization
                    </CardTitle>
                    <CardDescription>Discover patterns and rules!</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {activities.abstract.map((activity, idx) => {
                        const isFavorite = favorites.includes(activity.title)
                        const activityId = getActivityId(unitKey, 'abstract', activity.title, idx)
                        const isCompleted = !!completedActivities[activityId]
                        return (
                          <motion.div
                            key={activityId}
                            role="button"
                            tabIndex={0}
                            onClick={() => openExpandedActivity('Abstract Conceptualization', unitKey, activityId, activity)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                openExpandedActivity('Abstract Conceptualization', unitKey, activityId, activity)
                              }
                            }}
                            whileHover={{ y: -3, scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`cursor-pointer p-4 rounded-xl border relative hover:border-blue-200 hover:shadow-lg transition-all ${isCompleted ? 'bg-emerald-50 border-emerald-300' : 'bg-blue-50 border-blue-100'
                              }`}
                          >
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(activity.title)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  toggleFavorite(activity.title)
                                }
                              }}
                              className="absolute top-3 right-3 cursor-pointer"
                            >
                              <Icon icon={isFavorite ? icons.heart : icons.heartOutline} className={`w-4 h-4 ${isFavorite ? 'text-pink-500' : 'text-slate-300'}`} />
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 mb-2">{activity.time}</Badge>
                            <div className="mb-2 flex items-center gap-2 pr-6">
                              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-blue-300 bg-blue-200 px-1 text-xs font-bold text-blue-800">
                                {idx + 1}
                              </span>
                              <h4 className="font-semibold text-blue-800">{activity.title}</h4>
                            </div>
                            <div className="mb-2 flex flex-wrap gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant={isCompleted ? 'default' : 'outline'}
                                className={`h-7 px-2 text-xs ${isCompleted ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleActivityCompletion(activityId)
                                }}
                              >
                                <Icon icon={isCompleted ? icons.checkCircle : icons.task} className="mr-1 h-3.5 w-3.5" />
                                {isCompleted ? 'Completed' : 'Mark Done'}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleInlinePanel(activityId)
                                }}
                              >
                                <Icon icon={icons.accordion} className="mr-1 h-3.5 w-3.5" />
                                {expandedInlinePanels[activityId] ? 'Hide Steps' : 'Show Steps'}
                              </Button>
                            </div>
                            <p className="text-sm text-slate-700 mb-2">{isChecklistMode ? 'Concept check: classify patterns and verify rules.' : activity.studentTask}</p>
                            {activity.example && (
                              <p className="text-xs text-slate-600 italic bg-white p-2 rounded">{activity.example}</p>
                            )}
                            {showTeacherNotes && (
                              <div className="mt-2 p-2 bg-indigo-50 rounded-lg border border-indigo-200">
                                <p className="text-xs text-indigo-800">
                                  <strong className="inline-flex items-center gap-1">
                                    <Icon icon={icons.teacher} className="w-4 h-4" />
                                    Teacher:
                                  </strong>{' '}
                                  {activity.teacherNote}
                                </p>
                              </div>
                            )}
                            {renderInstructionPanel(unitKey, activity, activityId)}
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Active Experimentation */}
                <Card className="border-2 border-violet-200">
                  <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-violet-700">
                      <Icon icon={icons.rocket} className="w-5 h-5" />
                      Active Experimentation
                    </CardTitle>
                    <CardDescription>Apply what you've learned!</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activities.practice.map((activity, idx) => {
                        const activityIcon = activity.icon || icons.rocket
                        const isFavorite = favorites.includes(activity.title)
                        const activityId = getActivityId(unitKey, 'practice', activity.title, idx)
                        const isCompleted = !!completedActivities[activityId]
                        return (
                          <motion.div
                            key={activityId}
                            role="button"
                            tabIndex={0}
                            whileHover={{ y: -3, scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => openExpandedActivity('Active Experimentation', unitKey, activityId, activity)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                openExpandedActivity('Active Experimentation', unitKey, activityId, activity)
                              }
                            }}
                            className={`cursor-pointer p-5 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border relative hover:border-violet-200 hover:shadow-lg transition-all ${isCompleted ? 'border-emerald-300' : 'border-violet-100'
                              }`}
                          >
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(activity.title)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  toggleFavorite(activity.title)
                                }
                              }}
                              className="absolute top-3 right-3 cursor-pointer"
                            >
                              <Icon icon={isFavorite ? icons.heart : icons.heartOutline} className={`w-4 h-4 ${isFavorite ? 'text-pink-500' : 'text-slate-300'}`} />
                            </div>
                            <Icon icon={activityIcon} className="w-8 h-8 text-violet-500 mb-3" />
                            <Badge className="bg-violet-100 text-violet-700 mb-2">{activity.time}</Badge>
                            <div className="mb-2 flex items-center gap-2 pr-6">
                              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-violet-300 bg-violet-200 px-1 text-xs font-bold text-violet-800">
                                {idx + 1}
                              </span>
                              <h4 className="font-semibold text-violet-800">{activity.title}</h4>
                            </div>
                            <div className="mb-2 flex flex-wrap gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant={isCompleted ? 'default' : 'outline'}
                                className={`h-7 px-2 text-xs ${isCompleted ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleActivityCompletion(activityId)
                                }}
                              >
                                <Icon icon={isCompleted ? icons.checkCircle : icons.task} className="mr-1 h-3.5 w-3.5" />
                                {isCompleted ? 'Completed' : 'Mark Done'}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleInlinePanel(activityId)
                                }}
                              >
                                <Icon icon={icons.accordion} className="mr-1 h-3.5 w-3.5" />
                                {expandedInlinePanels[activityId] ? 'Hide Steps' : 'Show Steps'}
                              </Button>
                            </div>
                            <p className="text-sm text-slate-700 mb-2">{isChecklistMode ? 'Application checkpoint: use target forms in extended communication.' : activity.studentTask}</p>
                            {activity.example && (
                              <p className="text-xs text-violet-700 italic bg-white p-2 rounded">{activity.example}</p>
                            )}
                            {showTeacherNotes && (
                              <div className="mt-2 p-2 bg-fuchsia-50 rounded-lg border border-fuchsia-200">
                                <p className="text-xs text-fuchsia-800">
                                  <strong className="inline-flex items-center gap-1">
                                    <Icon icon={icons.teacher} className="w-4 h-4" />
                                    Teacher:
                                  </strong>{' '}
                                  {activity.teacherNote}
                                </p>
                              </div>
                            )}
                            {renderInstructionPanel(unitKey, activity, activityId)}
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-indigo-200">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-indigo-700">
                      <Icon icon={icons.task} className="w-5 h-5" />
                      Assessment Instructions - Unit {unit.id}
                    </CardTitle>
                    <CardDescription>
                      Complete application assessment instructions for Unit {unit.id}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-slate-200 bg-slate-50">
                      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 shadow-inner">
                        <Icon icon={icons.task} className="w-8 h-8 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Ready for the assessment?</h3>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        The complete instructions, rubrics, and materials for this unit's final assessment are available on a separate page.
                      </p>
                      <a href={`/assessments/assessment_instructions_unit_${unit.id}.html`} target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:shadow-lg">
                          Open Assessment Page <Icon icon={icons.chevronRight} className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Games Tab */}
              <TabsContent value="games" className="space-y-6">
                <Card className="border-2 border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon icon={icons.gamepad} className="w-5 h-5 text-amber-500" />
                      {gamePrompts.title} • Situation Challenge
                    </CardTitle>
                    <CardDescription>Identify the best language form for each communicative scenario.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <motion.div
                        key={promptResult.currentPrompt}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-8 rounded-2xl bg-gradient-to-br ${unit.color} text-white mb-6`}
                      >
                        <p className="text-lg font-medium mb-2">Situation:</p>
                        <p className="text-2xl font-bold">{gamePrompts.prompts[promptResult.currentPrompt].situation}</p>
                      </motion.div>

                      <AnimatePresence mode="wait">
                        {promptResult.revealed ? (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-emerald-50 rounded-xl border-2 border-emerald-200 mb-6"
                          >
                            <p className="text-lg font-semibold text-emerald-800">Answer:</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-2">
                              {gamePrompts.prompts[promptResult.currentPrompt].answer}
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <Button
                              onClick={() => revealAnswer(unitKey)}
                              size="lg"
                              className={`bg-gradient-to-r ${unit.color} hover:opacity-90`}
                            >
                              <Icon icon={icons.eye} className="w-5 h-5 mr-2" /> Reveal Answer
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex items-center justify-center gap-4">
                        <Button onClick={() => nextGamePrompt(unitKey)} variant="outline" className="gap-2">
                          <Icon icon={icons.chevronRight} className="w-4 h-4" /> Next Question
                        </Button>
                        <Button onClick={() => resetPromptGame(unitKey)} variant="outline" className="gap-2">
                          <Icon icon={icons.rotate} className="w-4 h-4" /> Reset
                        </Button>
                      </div>

                      <div className="mt-6 flex items-center justify-center gap-4 text-slate-600">
                        <span>Question {promptResult.currentPrompt + 1} of {gamePrompts.prompts.length}</span>
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="flex items-center gap-1">
                          <Icon icon={icons.trophy} className="w-4 h-4 text-amber-500" /> Score: {promptResult.score}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Practice */}
                <Card className="border-2 border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon icon={icons.star} className="w-5 h-5 text-amber-500" />
                      Quick Practice • Fill In The Blank
                    </CardTitle>
                    <CardDescription>Choose the best option for each sentence and check instant feedback.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {quickPractice.map((exercise, idx) => {
                        const selected = quickPracticeAnswers[unitKey][idx]
                        const isAnswered = Boolean(selected)
                        const isCorrect = selected === exercise.answer
                        return (
                          <div key={`${unitKey}-quick-practice-${idx}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="font-medium text-slate-800">
                              {idx + 1}. {exercise.sentence}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <select
                                value={selected ?? ''}
                                onChange={(e) => handleQuickPracticeAnswer(unitKey, idx, e.target.value)}
                                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                              >
                                <option value="">Choose an option</option>
                                {exercise.options.map((option) => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                              {isAnswered && (
                                <Badge className={isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}>
                                  {isCorrect ? 'Correct' : `Try again: ${exercise.clue}`}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )
                      })}
                      <p className="text-sm text-slate-600">
                        Score: <strong>{quickPractice.filter((exercise, idx) => quickPracticeAnswers[unitKey][idx] === exercise.answer).length}</strong> / {quickPractice.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-slate-200">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Icon icon={icons.puzzle} className="w-5 h-5 text-blue-500" />
                          Sentence Builder
                        </CardTitle>
                        <CardDescription>Choose the strongest completion for each sentence frame.</CardDescription>
                      </div>
                      <Button onClick={() => resetSentenceBuilder(unitKey)} variant="outline" size="sm" className="gap-2">
                        <Icon icon={icons.rotate} className="w-4 h-4" /> Reset
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {gamePrompts.sentenceBuilder.map((item, idx) => {
                      const isAnswered = sentenceBuilderResult.answered.includes(idx)
                      return (
                        <div key={`${unitKey}-builder-${idx}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <p className="font-medium text-slate-800 mb-3">{idx + 1}. {item.prompt}</p>
                          <div className="grid gap-2">
                            {item.options.map((option, optionIdx) => {
                              const isCorrect = optionIdx === item.correct
                              return (
                                <button
                                  key={`${unitKey}-builder-${idx}-option-${optionIdx}`}
                                  disabled={isAnswered}
                                  onClick={() => handleSentenceBuilderAnswer(unitKey, idx, optionIdx, item.correct)}
                                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${isAnswered
                                    ? isCorrect
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                      : 'bg-white border-slate-200 text-slate-500'
                                    : 'bg-white border-slate-300 hover:border-slate-500'
                                    }`}
                                >
                                  {option}
                                </button>
                              )
                            })}
                          </div>
                          {isAnswered && (
                            <p className="mt-2 text-xs text-slate-600">{item.explanation}</p>
                          )}
                        </div>
                      )
                    })}
                    <p className="text-sm text-slate-600">
                      Sentence Builder Score: <strong>{sentenceBuilderResult.score}</strong> / {gamePrompts.sentenceBuilder.length}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-slate-200">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Icon icon={icons.lightbulb} className="w-5 h-5 text-amber-500" />
                          Grammar Detective
                        </CardTitle>
                        <CardDescription>Spot the issue and choose the best correction.</CardDescription>
                      </div>
                      <Button onClick={() => resetGrammarDetective(unitKey)} variant="outline" size="sm" className="gap-2">
                        <Icon icon={icons.rotate} className="w-4 h-4" /> Reset
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {gamePrompts.grammarDetective.map((item, idx) => {
                      const isAnswered = grammarDetectiveResult.answered.includes(idx)
                      return (
                        <div key={`${unitKey}-detective-${idx}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm text-slate-500 mb-1">Case sentence: <span className="font-medium text-slate-700">{item.sentence}</span></p>
                          <p className="font-medium text-slate-800 mb-3">{item.question}</p>
                          <div className="grid gap-2">
                            {item.options.map((option, optionIdx) => {
                              const isCorrect = optionIdx === item.correct
                              return (
                                <button
                                  key={`${unitKey}-detective-${idx}-option-${optionIdx}`}
                                  disabled={isAnswered}
                                  onClick={() => handleGrammarDetectiveAnswer(unitKey, idx, optionIdx, item.correct)}
                                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${isAnswered
                                    ? isCorrect
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                      : 'bg-white border-slate-200 text-slate-500'
                                    : 'bg-white border-slate-300 hover:border-slate-500'
                                    }`}
                                >
                                  {option}
                                </button>
                              )
                            })}
                          </div>
                          {isAnswered && (
                            <p className="mt-2 text-xs text-slate-600">{item.explanation}</p>
                          )}
                        </div>
                      )
                    })}
                    <p className="text-sm text-slate-600">
                      Detective Score: <strong>{grammarDetectiveResult.score}</strong> / {gamePrompts.grammarDetective.length}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quiz Tab */}
              <TabsContent value="quiz" className="space-y-6">
                <Card className="border-2 border-slate-200">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Icon icon={icons.target} className="w-5 h-5 text-violet-500" />
                          Test Your Knowledge!
                        </CardTitle>
                        <CardDescription>Check your understanding of Unit {unit.id}</CardDescription>
                      </div>
                      {quizResult.answered.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resetQuiz(unitKey)}
                          className="gap-2"
                        >
                          <Icon icon={icons.rotate} className="w-4 h-4" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Progress</span>
                        <span className="text-sm font-medium">{quizResult.answered.length} / {quizzes.length}</span>
                      </div>
                      <Progress value={(quizResult.answered.length / quizzes.length) * 100} className="h-2" />
                    </div>

                    <div className="space-y-6">
                      {quizzes.map((q, qIdx) => {
                        const isAnswered = quizResult.answered.includes(qIdx)

                        return (
                          <motion.div
                            key={qIdx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: qIdx * 0.1 }}
                            className="p-5 rounded-xl bg-slate-50 border border-slate-200"
                          >
                            <h4 className="font-semibold text-slate-800 mb-4 flex items-start gap-3">
                              <span className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-sm flex-shrink-0">
                                {qIdx + 1}
                              </span>
                              <span>{q.question}</span>
                            </h4>
                            <div className="grid gap-2 pl-10">
                              {q.options.map((option, oIdx) => {
                                const isCorrect = oIdx === q.correct
                                const wasAnswered = isAnswered

                                return (
                                  <motion.button
                                    key={oIdx}
                                    whileHover={!isAnswered ? { scale: 1.01 } : {}}
                                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                                    onClick={() => handleAnswer(unitKey, qIdx, oIdx, q.correct)}
                                    disabled={isAnswered}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${wasAnswered
                                      ? isCorrect
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                                        : 'bg-slate-100 border-slate-200 text-slate-500'
                                      : 'hover:bg-slate-100 border-slate-200 hover:border-slate-300 cursor-pointer'
                                      }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {wasAnswered && isCorrect && (
                                        <Icon icon={icons.checkCircle} className="w-5 h-5 text-emerald-500" />
                                      )}
                                      {wasAnswered && !isCorrect && (
                                        <Icon icon={icons.closeCircle} className="w-5 h-5 text-slate-400" />
                                      )}
                                      <span>{option}</span>
                                    </div>
                                  </motion.button>
                                )
                              })}
                            </div>
                            {isAnswered && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 ml-10 p-3 bg-blue-50 rounded-lg border border-blue-200"
                              >
                                <p className="text-sm text-blue-800">
                                  <strong className="inline-flex items-center gap-1">
                                    <Icon icon={icons.teacher} className="w-4 h-4" />
                                    Explanation:
                                  </strong>{' '}
                                  {q.explanation}
                                </p>
                              </motion.div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>

                    {quizResult.answered.length === quizzes.length && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-200 text-center"
                      >
                        <div className="flex items-center justify-center mb-4">
                          <Icon icon={icons.trophy} className="w-16 h-16 text-amber-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-800 mb-2">
                          {quizResult.score === quizzes.length
                            ? 'Perfect Score!'
                            : quizResult.score >= quizzes.length / 2
                              ? 'Great Job!'
                              : 'Keep Practicing!'}
                        </h3>
                        <p className="text-lg text-emerald-700 mb-4">
                          You got <strong>{quizResult.score}</strong> out of <strong>{quizzes.length}</strong> correct!
                        </p>
                        <Progress value={(quizResult.score / quizzes.length) * 100} className="h-3 mb-4" />
                        <Button onClick={() => resetQuiz(unitKey)} variant="outline" className="gap-2">
                          <Icon icon={icons.rotate} className="w-4 h-4" /> Try Again
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

              </TabsContent>

              <TabsContent value="final-assessment" className="space-y-6">
                <Card className="border-2 border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Icon icon={icons.microphone} className="w-5 h-5 text-violet-500" />
                      Final Assessment • Unit {unit.id}
                    </CardTitle>
                    <CardDescription>
                      Integrated performance assessment instructions for Unit {unit.id}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-slate-200 bg-slate-50">
                      <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4 shadow-inner">
                        <Icon icon={icons.microphone} className="w-8 h-8 text-violet-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Final Assessment</h3>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        Click below to open the complete assessment instructions, rubrics, and materials in a new secure window.
                      </p>
                      <a href={`/assessments/assessment_instructions_unit_${unit.id}.html`} target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="gap-2 bg-violet-600 hover:bg-violet-700 text-white shadow-md transition-all hover:shadow-lg">
                          Open Assessment Page <Icon icon={icons.target} className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>

              </TabsContent>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentUnit > 0) {
                    setCurrentUnit(currentUnit - 1)
                    setActiveSection('overview')
                    closeExpandedActivity()
                  }
                }}
                disabled={currentUnit === 0}
                className="gap-2"
              >
                <Icon icon={icons.chevronLeft} className="w-4 h-4" />
                <span className="hidden sm:inline">Previous Unit</span>
                <span className="sm:hidden">Previous</span>
              </Button>
              <Button
                onClick={() => {
                  if (currentUnit < units.length - 1) {
                    setCurrentUnit(currentUnit + 1)
                    setActiveSection('overview')
                    closeExpandedActivity()
                  }
                }}
                disabled={currentUnit === units.length - 1}
                className={`gap-2 bg-gradient-to-r ${unit.color} hover:opacity-90`}
              >
                <span className="hidden sm:inline">Next Unit</span>
                <span className="sm:hidden">Next</span>
                <Icon icon={icons.chevronRight} className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <Dialog
        open={expandedActivity !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeExpandedActivity()
          }
        }}
      >
        {expandedActivity && (
          <DialogContent className="w-[min(960px,95vw)] max-h-[88vh] overflow-y-auto p-0 sm:max-w-4xl">
            <DialogHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-slate-200 text-slate-700">
                  {expandedActivity.section}
                </Badge>
                <Badge variant="secondary" className="bg-slate-200 text-slate-700">
                  <Icon icon={icons.clock} className="w-3 h-3 mr-1" />
                  {expandedActivity.activity.time}
                </Badge>
              </div>
              <DialogTitle className="text-2xl text-slate-900">{expandedActivity.activity.title}</DialogTitle>
              <DialogDescription className="text-slate-600">
                Expanded activity view.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 p-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={completedActivities[expandedActivity.activityId] ? 'default' : 'outline'}
                  className={completedActivities[expandedActivity.activityId] ? 'bg-emerald-600 hover:bg-emerald-600' : ''}
                  onClick={() => toggleActivityCompletion(expandedActivity.activityId)}
                >
                  <Icon icon={completedActivities[expandedActivity.activityId] ? icons.checkCircle : icons.task} className="mr-1 h-4 w-4" />
                  {completedActivities[expandedActivity.activityId] ? 'Completed' : 'Mark as Completed'}
                </Button>
              </div>

              {isRegularActivity(expandedActivity.activity) ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h5 className="mb-2 font-semibold text-slate-800">Your Task</h5>
                  <p className="text-slate-700">{expandedActivity.activity.studentTask}</p>
                </div>
              ) : null}

              {!isRegularActivity(expandedActivity.activity) && expandedActivity.activity.audioSrc && (
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <h5 className="mb-2 font-semibold text-slate-800">Music Player</h5>
                  <audio
                    ref={audioRef}
                    preload="none"
                    src={expandedActivity.activity.audioSrc}
                    onEnded={() => setIsAudioPlaying(false)}
                  >
                    Your browser does not support the audio element.
                  </audio>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button type="button" size="sm" className="gap-1" onClick={handlePlayAudio}>
                      <Icon icon={icons.play} className="h-4 w-4" />
                      Play
                    </Button>
                    <Button type="button" size="sm" variant="secondary" className="gap-1" onClick={handlePauseAudio}>
                      <Icon icon={icons.pause} className="h-4 w-4" />
                      Pause
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="gap-1" onClick={handleStopAudio}>
                      <Icon icon={icons.stop} className="h-4 w-4" />
                      Stop
                    </Button>
                    <div className="ml-auto flex flex-wrap items-center gap-1">
                      <span className="text-xs font-medium text-slate-600">Speed</span>
                      {[0.75, 1, 1.25, 1.5].map((speed) => (
                        <Button
                          key={speed}
                          type="button"
                          size="sm"
                          variant={audioSpeed === speed ? 'default' : 'outline'}
                          className="h-8 px-2 text-xs"
                          onClick={() => handleSetAudioSpeed(speed)}
                        >
                          {speed}x
                        </Button>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {isAudioPlaying ? 'Audio is playing.' : 'Audio paused.'} Control playback and speed here.
                  </p>
                </div>
              )}

              {expandedActivityPack && (
                <div className="space-y-3">
                  <details open className="rounded-lg border border-slate-200 bg-white p-4">
                    <summary className="cursor-pointer list-none font-semibold text-slate-800 inline-flex items-center gap-2">
                      <Icon icon={icons.accordion} className="h-4 w-4 text-slate-500" />
                      Step-by-Step Instructions
                    </summary>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
                      {expandedActivityPack.steps.map((step, idx) => (
                        <li key={`${expandedActivity.activityId}-dialog-step-${idx}`}>{step}</li>
                      ))}
                    </ol>
                  </details>

                  <details className="rounded-lg border border-slate-200 bg-white p-4">
                    <summary className="cursor-pointer list-none font-semibold text-slate-800 inline-flex items-center gap-2">
                      <Icon icon={icons.task} className="h-4 w-4 text-slate-500" />
                      Materials Checklist
                    </summary>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
                      {expandedActivityPack.materials.map((material, idx) => (
                        <li key={`${expandedActivity.activityId}-dialog-material-${idx}`}>{material}</li>
                      ))}
                    </ul>
                  </details>

                  <details className="rounded-lg border border-slate-200 bg-white p-4">
                    <summary className="cursor-pointer list-none font-semibold text-slate-800 inline-flex items-center gap-2">
                      <Icon icon={icons.teacher} className="h-4 w-4 text-slate-500" />
                      Teaching Tips
                    </summary>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
                      {expandedActivityPack.tips.map((tip, idx) => (
                        <li key={`${expandedActivity.activityId}-dialog-tip-${idx}`}>{tip}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}

              {isRegularActivity(expandedActivity.activity) && expandedActivity.activity.example && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h5 className="mb-2 font-semibold text-blue-800">Example</h5>
                  <p className="italic text-slate-700">"{expandedActivity.activity.example}"</p>
                </div>
              )}

              {showTeacherNotes && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <h5 className="mb-2 font-semibold text-amber-800">Teacher Note</h5>
                  <p className="text-amber-900">{expandedActivity.activity.teacherNote}</p>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Footer */}
      <footer className="print-hidden mt-auto bg-slate-900 text-slate-300 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            Idiomas EAFIT | Universidad EAFIT
          </p>
          <p className="text-xs text-slate-500 mt-1">
            English Course • Elementary 2 • Level A2 • Based on Kolb's Experiential Learning Cycle
          </p>
        </div>
      </footer>

      {/* Custom CSS for card flip effect */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .group:hover .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @media print {
          body {
            background: white !important;
          }
          .print-hidden {
            display: none !important;
          }
          main {
            max-width: 100% !important;
            padding: 0 !important;
          }
          .shadow-lg,
          .shadow-sm {
            box-shadow: none !important;
          }
          .bg-gradient-to-r,
          .bg-gradient-to-br {
            background-image: none !important;
          }
          .border-2 {
            border-width: 1px !important;
          }
        }
      `}</style>
    </div>
  )
}
