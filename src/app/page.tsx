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

type ResourceLink = {
  label: string
  url: string
  type: 'video' | 'worksheet' | 'reference' | 'audio' | 'images'
}

type WarmUp = {
  title: string
  instructions: string
  time: string
  materials: string
  teacherNote: string
  audioSrc?: string
  links?: ResourceLink[]
}

type Activity = {
  title: string
  studentTask: string
  time: string
  materials?: string
  example?: string
  teacherNote: string
  icon?: string
  links?: ResourceLink[]
}

type ExpandedActivity = {
  stage: keyof typeof stageImages
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

const stageImages: Record<string, string> = {
  warmUps: '1551731409-43eb3e517a1a',
  concreteExperience: '1598863505577-74750d3b4475',
  reflection: '1516321318423-f06f85e504b3',
  abstract: '1552664199-fd31f74ef1e8',
  practice: '1542744173-8e7e53415bb0',
  closing: '1543269865-c59e2e46caeb',
  livingLearning: '1523240795612-9a054b0db644',
}

const activityStageMeta = [
  { key: 'warmUps' as const, label: 'Warm-Up', shortLabel: 'Warm-Up', icon: icons.sparkles, color: 'bg-rose-500' },
  { key: 'concreteExperience' as const, label: 'Concrete Experience', shortLabel: 'Experience', icon: icons.play, color: 'bg-emerald-500' },
  { key: 'reflection' as const, label: 'Reflective Observation', shortLabel: 'Reflect', icon: icons.eye, color: 'bg-amber-500' },
  { key: 'abstract' as const, label: 'Abstract Conceptualization', shortLabel: 'Understand', icon: icons.lightbulb, color: 'bg-blue-500' },
  { key: 'practice' as const, label: 'Active Experimentation', shortLabel: 'Apply', icon: icons.rocket, color: 'bg-violet-500' },
  { key: 'closing' as const, label: 'Closing Activities', shortLabel: 'Closing', icon: icons.star, color: 'bg-pink-500' },
  { key: 'livingLearning' as const, label: 'Living Learning Environment', shortLabel: 'LLE', icon: icons.globe, color: 'bg-teal-500' },
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
    closing: Activity[]
    livingLearning: Activity[]
  }
} = {
  unit1: {
    warmUps: [
      {
        title: 'Celebrations Kickoff',
        instructions: 'Your teacher introduces the unit on celebrations through two lenses: big public celebrations (festivals, religious, national) and intimate family celebrations. On the board you will see "Celebrations" with a mini word bank (celebration, festival, tradition, custom) under two headers: "Everyday (family/intimate)" and "Big (festivals/religious/national)." Work in pairs, choose one question from each section of the question bank your teacher displays, discuss, and then share your answers with the class.',
        time: '10 min',
        materials: 'Question bank (printed or projected)',
        teacherNote: 'Introduce the two lenses clearly. Provide a printed or projected question bank for pairs to select from.',
      },
      {
        title: 'Image Spark: Festival Photos',
        instructions: 'Your teacher shows photos of a street parade (e.g., Chinese New Year). Describe what you see: "What can you see? What\'s happening? Where? Who\'s involved?" Learn vocabulary like "parade" and "costume." In pairs, discuss: (1) What do you celebrate each year? (2) What parties or festivals do you go to? (3) Tell about one you enjoyed — why? The class shares representative ideas and emergent vocabulary.',
        time: '15 min',
        materials: 'Festival photos, discussion prompts',
        teacherNote: 'Elicit descriptions before teaching vocabulary. Confirm/teach words like "parade" and "costume." Harvest representative ideas and emergent vocabulary from the whole class.',
        links: [
          { label: 'Festival Photos', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B3E1AED30-451E-4D46-9BAB-1885FCD84A08%7D&file=festival%20photos.docx&action=default&mobileredirect=true', type: 'images' },
        ],
      },
      {
        title: 'Think-Pair-Share: What is a Celebration?',
        instructions: 'Write a short personal definition of "celebration." In pairs, compare your definitions and share a personal experience of a family/intimate celebration and one public celebration. Then the class builds a mind map on the board distinguishing celebration, festival, tradition, and custom, clarifying overlaps and differences.',
        time: '15 min',
        materials: 'Board or whiteboard for mind map',
        teacherNote: 'Guide the mind map construction to clarify overlaps between celebration, festival, tradition, and custom. Encourage personal examples.',
      },
    ],
    concreteExperience: [
      {
        title: 'Celebration Snapshots',
        studentTask: 'Watch 3-5 short video clips of celebrations from around the world. Individually, take notes on: (a) Key elements of each celebration (music, dance, food, clothing, symbols, colors); (b) How each celebration reflects its culture and traditions; (c) Similarities/differences from your own culture. In pairs, discuss your notes, capture your partner\'s ideas, and record new insights. Each pair shares key takeaways plus one unique aspect with the whole class.',
        time: '40 min',
        materials: '3-5 celebration videos (e.g., Carnival of Barranquilla, Day of the Dead, Frevo/Carnival of Recife, Dancing Devils of Corpus Christi, Carnival of Binche, Notting Hill Carnival, Holi, Ethiopian Epiphany, Chinese New Year, Kwanzaa)',
        example: 'The Carnival of Barranquilla has more colorful costumes than Notting Hill Carnival, but both are very lively.',
        teacherNote: 'Curate 3-5 clips from the suggested list. Links are reference only — substitute with other global/multicultural resources as needed.',
        icon: icons.play,
        links: [
          { label: 'Carnival of Barranquilla (UNESCO)', url: 'https://ich.unesco.org/en/video/41501?utm', type: 'video' },
          { label: 'Frevo / Carnival of Recife (UNESCO)', url: 'https://ich.unesco.org/en/video/41645?utm', type: 'video' },
          { label: 'Dancing Devils of Corpus Christi (UNESCO)', url: 'https://ich.unesco.org/en/video/17448?utm_source=chatgpt.com', type: 'video' },
          { label: 'Carnival of Binche (UNESCO)', url: 'https://ich.unesco.org/en/video/11136?utm', type: 'video' },
          { label: 'Day of the Dead (UNESCO)', url: 'https://ich.unesco.org/en/video/41412?utm', type: 'video' },
          { label: 'Notting Hill Carnival', url: 'https://www.youtube.com/watch?v=2HVMT4j6_mo', type: 'video' },
          { label: 'Holi Festival', url: 'https://www.youtube.com/watch?v=wTfYhG2mOSA&list=PLgJlvqHX-3eIjI7to3n6KCWRopj8tAZ4j&index=2', type: 'video' },
          { label: 'Ethiopian Epiphany (UNESCO)', url: 'https://ich.unesco.org/en/video/48612?id=48612&utm', type: 'video' },
          { label: 'Chinese New Year (PBS)', url: 'https://www.pbslearningmedia.org/resource/68938b4e-1e68-4727-8f2d-cc341ed93b11/chinese-new-year-all-about-the-holidays/?student=true', type: 'video' },
          { label: 'Kwanzaa (PBS)', url: 'https://www.pbslearningmedia.org/resource/f4984514-f9c9-4b4b-81bb-e04a39d45899/kwanzaa-all-about-the-holidays/?student=true', type: 'video' },
        ],
      },
      {
        title: 'Celebration Gallery Walk: Exploring Global Festivities',
        studentTask: 'Walk around the room and look at 8-10 celebration photos (Colombia, LATAM, and global) posted on the walls. With markers, write short notes at each photo guided by these criteria: Place (where?), People (who?), Activities (what happens?), Meaning (symbols/values?), Energy (quiet/lively?), Access (private/public?). Rotate clockwise in pairs, adding notes at each photo. At the end, each pair presents one similarity, one difference, and one unique aspect they observed.',
        time: '35 min',
        materials: '8-10 celebration photos (printed or projected, including both public/community festivals and private/family celebrations); markers; guiding criteria visible near each photo. Alternative: Padlet, Jamboard, or Google Slides.',
        example: 'A wedding is more private than a street carnival, but both have the most joyful energy.',
        teacherNote: 'Include both public/community festivals and private/family celebrations (weddings, birthdays, gatherings). Post guiding criteria near each photo.',
        icon: icons.camera,
        links: [
          { label: 'Celebration Photos', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BB0BA6CF8-2D73-41D2-B6B0-8FA6532080BE%7D&file=celebration%20photos.docx&action=default&mobileredirect=true', type: 'images' },
        ],
      },
      {
        title: 'Family Celebration Portraits',
        studentTask: 'Pre-class homework: Bring a printed photo of a family celebration and answer the worksheet questions: Who is in this photo? What is the family celebrating? Why? When? What do they do to celebrate? What special traditions are involved? How do you feel looking at this photo? Why? In class, do a pair interview where you share your celebration details with a partner. Then do a mini gallery walk: display worksheets on walls/desks or scroll Padlet. Leave one brief comment or question per portrait.',
        time: '45 min',
        materials: 'Printed photo (or drawing) of a family celebration; Family Celebration Portrait Worksheet; sticky notes or Padlet for comments. Digital option: Padlet with one column per question.',
        example: 'My family\'s Christmas dinner is bigger than my birthday party, but my birthday feels more personal.',
        teacherNote: 'Assign the pre-class homework in advance. Provide a digital option (Padlet) for students who prefer it. Encourage genuine sharing.',
        icon: icons.heart,
        links: [
          { label: 'Family Celebration Worksheet', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%201%2FRecursos%2Ffamily%20celebration%20worksheet%2Epdf&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%201%2FRecursos', type: 'worksheet' },
        ],
      },
    ],
    reflection: [
      {
        title: 'Reflect on Celebration Snapshots (Video Activity)',
        studentTask: 'Your teacher replays 20-30 seconds from two contrasting video clips or displays two still images. In pairs, share observations using this frame: "I noticed ___ (music/dance/food/clothing/symbols/colors). This shows ___ (value/tradition) because ___." Then discuss as a class: (1) How does this celebration reflect values or community? (2) Identify one similarity and one difference compared to another celebration.',
        time: '15 min',
        materials: 'Short video clips or still images (2 contrasting celebrations); sentence frame (projected or on board); optional note-taking slip or mini whiteboards',
        example: 'I noticed the music at Carnival of Barranquilla is livelier than at the Ethiopian Epiphany. This shows a more festive tradition because...',
        teacherNote: 'Replay only 20-30 seconds from two contrasting clips. Project the sentence frame for support.',
      },
      {
        title: 'Reflect on Celebration Gallery Walk',
        studentTask: 'Silently revisit the gallery walls and place two dots on comments you find interesting or confusing. Then in pairs, discuss these guided questions: (1) Which celebration looks more public? Why? (2) Which seems more traditional or more modern? Give one visual clue. (3) Which celebration looks safer? Compare and say why. (4) Which is the most crowded celebration? (5) Who participates more visibly (children/elders/performers)? Compare two photos. (6) Which festival looks more meaningful? Give one evidence-based reason.',
        time: '15 min',
        materials: 'Gallery photos with comments (from CE activity); colored dots or stickers (2 per student); guiding question handout or projected slide; optional summary writing sheet',
        example: 'The Notting Hill Carnival looks more public than the wedding photo. The Day of the Dead seems the most traditional.',
        teacherNote: 'Questions move students from observation to inference across cultural dimensions (access, tradition/modernity, safety, scale, roles, meaning). Optional: class discussion or written synthesis.',
      },
      {
        title: 'Reflect on Family Celebration Portraits',
        studentTask: 'In pairs or small groups, discuss these reflection prompts about the photos and celebrations you observed: (1) What did you notice about the celebrations in other families\' photos? (2) How are the celebrations similar or different from your own family\'s celebration? (3) How did looking at others\' photos make you feel? Why? (4) What new things did you learn about family celebrations from your classmates? A few pairs share reflections with the whole class.',
        time: '15 min',
        materials: 'Display of student celebration portraits (physical or digital); reflection prompts (projected or printed); optional reflection sheet with written responses',
        example: 'My partner\'s family celebration is simpler than mine, but it seems more meaningful because they focus on being together.',
        teacherNote: 'Provide an optional written reflection sheet for students who prefer writing. Keep the atmosphere supportive and respectful.',
      },
    ],
    abstract: [
      {
        title: 'Listening Comprehension: Festivals Around the World',
        studentTask: 'Listen to short descriptions of six global celebrations (St. Patrick\'s Day, Moon Festival, Bob Marley Day, Day of the Dead, Kartini Day, St. Lucia\'s Day). Before listening, look at images and share what you know. Learn key words: parade, candles, harvest, concert. Listen once for gist: identify where and when each celebration takes place.',
        time: '25 min',
        materials: 'Audio from english-practice.net (A2 Celebrations); images of the celebrations; listening transcript + answer key',
        example: 'St. Patrick\'s Day has bigger parades than Kartini Day, but Kartini Day is more meaningful for Indonesian women.',
        teacherNote: 'Audio source: english-practice.net A2 Celebrations. Pre-teach vocabulary before playing audio. Play once for gist only.',
        links: [
          { label: 'Audio: Six Global Celebrations', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/stream.aspx?id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%201%2FRecursos%2Fsix%20global%20celebrations%2Emp3&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2E11da4d6a%2Da649%2D4b21%2Da110%2Dbb1b5b7f4c7f', type: 'audio' },
          { label: 'Images About the Celebrations', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B0F2A68E0-B63A-4A31-8835-C14B92F4057C%7D&file=images%20about%20the%20celebrations.docx&action=default&mobileredirect=true', type: 'images' },
          { label: 'Transcript and Answer Key', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B071C7FF6-E4D9-4D4E-AA3C-205A5F040A3E%7D&file=transcript%20and%20answer%20key.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
      {
        title: 'Guided Discovery of Grammar',
        studentTask: 'Listen to the audio again. After each description, write down adjectives you hear. Review the grammar reference (Essential Grammar in Use, 3rd Ed, 2007) summarizing comparative and superlative rules and do the included exercises as a class. Look at examples from the audio scripts (e.g., "St. Patrick\'s Day is a bigger festival in the United States than in Ireland"). In pairs, create sentences comparing the celebrations using at least one comparative and one superlative. Prompts: "Which celebration is more colorful?", "Which celebration has the biggest parades?" Share with the class. Complete the fill-in-the-blank worksheet and short writing task.',
        time: '25 min',
        materials: 'Listening audio (same as Activity 1); transcript; grammar reference (Essential Grammar in Use, 3rd Ed, 2007); fill-in-the-blank + short writing task worksheet',
        example: 'The Moon Festival is quieter than St. Patrick\'s Day. St. Patrick\'s Day has the biggest parades of all six celebrations.',
        teacherNote: 'Extension homework: research another celebration from a different country and write a short paragraph using comparatives and superlatives.',
        links: [
          { label: 'Grammar Reference (Essential Grammar in Use)', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%201%2FRecursos%2Fgrammar%20reference%20from%20Essential%20%20English%20Grammar%20in%20Use%20%283rd%20Ed%29%20%282007%29%2Epdf&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%201%2FRecursos', type: 'reference' },
        ],
      },
      {
        title: 'Comparative Bingo',
        studentTask: 'Look at the projected bingo grid with adjectives. Choose 9 adjectives and write one sentence per square (comparative or superlative) about any topic. The teacher reads one prompt per round (e.g., "-er than", "more/less... than", "the most/least", themed prompts like "longer/longest", "more expensive/most expensive"). If you have a matching sentence, tick the square and read it aloud to validate. Everyone with a matching sentence marks it. First line (row/column/diagonal) shouts "Bingo!" and reads their winning sentences.',
        time: '25 min',
        materials: 'Bingo grid with adjectives (projected or printed)',
        example: '"Cheaper" prompt → "Street food is cheaper than a restaurant meal." | "The most" prompt → "Christmas is the most popular celebration."',
        teacherNote: 'End with quick board fix of common errors (e.g., "more cheap" → "cheaper", use of "than", "the" with superlatives). Keep energy high.',
        icon: icons.gamepad,
        links: [
          { label: 'Bingo Grid', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%201%2FRecursos%2Fbingo%20grid%2Epdf&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%201%2FRecursos', type: 'worksheet' },
        ],
      },
      {
        title: 'Personal Celebration – Compare and Choose',
        studentTask: 'Read a passage with birthday-party activity options (ranging from active games to creative experiences). Then: (1) Quick warm-up: write "birthday" and jot three ideas, build a spidergram/word cloud; (2) Complete the vocabulary task; (3) Answer reading comprehension items; (4) Do the Compare & Choose scenario: use comparatives and superlatives to describe and compare activities from the text and choose your favorites.',
        time: '30 min',
        materials: 'Passage with birthday-party activity options; optional writing sheet for party paragraph extension',
        example: 'A treasure hunt is more exciting than a movie night, but karaoke is the most fun of all the activities.',
        teacherNote: 'Extension: students write a paragraph describing their ideal birthday party using target language.',
        links: [
          { label: 'Passage with Birthday-Party Options', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B50FFB941-E264-45F0-8131-C3E5E5193730%7D&file=passage%20with%20birthday-party%20activity%20options.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
      {
        title: 'Vocabulary Building – Major Life Events',
        studentTask: 'Start with a photo of a bride. In pairs, describe what you see and answer: What is happening? What important transitions does this suggest? As a class, build a list of transitions (starting school, getting a driver\'s license, voting, changing careers, divorce). Learn about the cultural context: the image shows a Kosovar Bosnian bride with traditional intricate face painting believed to prevent bad luck. Then learn the concept of "milestones." Look at major life-event images (graduation, first job, marriage, moving, retirement), guess event names, and confirm meanings. Reflect: At what age do people in your country usually experience these milestones? Is there a "right time"? In groups, discuss milestone-related questions and report 1-2 insights.',
        time: '30 min',
        materials: 'Photo of a bride; set of major life-event images; printed milestone-related question slips for group work',
        example: 'Getting married is more common at a younger age in Colombia than in Europe. Graduation is the most celebrated milestone for students.',
        teacherNote: 'Provide cultural context about the Kosovar bride photo. Encourage cross-cultural reflection on milestone timing.',
        links: [
          { label: 'Photo of a Bride', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B282BE5C8-7CD6-4DE0-88B8-E249DE7A800C%7D&file=photo%20of%20a%20bride.docx&action=default&mobileredirect=true', type: 'images' },
          { label: 'Major Life-Event Images', url: 'https://eafit.sharepoint.com/:p:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B7BD3CDC8-4642-413E-B940-FD7FD0ADAB3A%7D&file=major%20life%20events.pptx&action=edit&mobileredirect=true', type: 'images' },
          { label: 'Milestone-Related Questions', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BAC9F7719-5B8F-4ADF-9C21-C918F32CBC52%7D&file=milestone-related%20questions.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
      {
        title: 'Vocabulary Building and Reading About Celebrations',
        studentTask: 'Explore the Hogmanay celebration (New Year\'s festival in Edinburgh, Scotland). Steps: (1) Look at a Hogmanay photo and think about what you see and what activities take place; (2) From a provided word list, choose three words you expect to encounter in the reading; (3) Read a short passage about Hogmanay together with the class; (4) While reading, underline eight important words related to celebrations; (5) Match vocabulary words to their meanings; (6) Complete sentences using the discussed vocabulary.',
        time: '30 min',
        materials: 'Photo of Hogmanay festival (projected or printed); vocabulary and reading worksheet',
        example: 'Hogmanay is the biggest New Year celebration in Scotland. It is more lively than a typical New Year\'s Eve party.',
        teacherNote: 'Vocabulary prediction helps activate prior knowledge. Guide students through the reading together.',
        links: [
          { label: 'Hogmanay Festival', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BE7EC2302-FFDD-43A6-BF9B-956BE1B6C82E%7D&file=Hogmanay%20Festival.docx&action=default&mobileredirect=true', type: 'reference' },
          { label: 'Vocabulary and Reading Worksheet', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BD9EFAF86-D589-4142-A14D-1C0954BEABDA%7D&file=vocabulary%20and%20reading%20worksheet.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
    ],
    practice: [
      {
        title: 'Cultural Celebration Research Presentation',
        studentTask: 'Guiding question: "How do cultural celebrations reflect the values and traditions of different societies, and how can we compare them to understand their significance?" Choose a celebration from any culture (e.g., Dia de los Muertos, Thanksgiving — well-known or lesser-known). In small groups, discuss what you know, then research: origins, cultural significance, typical practices, cost, venue, etc. Choose a presentation format (digital presentation, poster, storytelling). Your product must include: comparatives and superlatives to describe findings (e.g., "Dia de los Muertos is more colorful than Halloween"); visuals and evidence. Present to the class, then participate in a wrap-up discussion comparing similarities and differences.',
        time: '80 min',
        materials: 'Research planning worksheet; comparative & superlative reference sheet; rubric or checklist; visual aids (photos, flags, maps, videos); display space or digital platform',
        example: 'Dia de los Muertos is more colorful than Halloween. Thanksgiving is the most family-oriented celebration we researched.',
        teacherNote: 'Include discussion prompts about shared traditions, symbols, values, setting, participants, costs, inclusivity, sustainability, music/food/rituals.',
        icon: icons.globe,
      },
      {
        title: 'Celebration Planning',
        studentTask: 'Scenario: Plan a Networking Event for your university (or celebration for an organization) — e.g., end-of-semester party, cultural festival to welcome foreign students. Budget: COP $5,000,000 covering venue, catering, and entertainment. Goal: memorable experience promoting connections and showcasing cultural diversity. Phase 1 — Research (30-40 min): research options using guided questions about venues, food/drinks, entertainment, cultural values, costs, and accessibility. Phase 2 — Decision making (25-30 min): use planning worksheet to compare criteria (cost, capacity, cultural significance, accessibility) applying comparatives and superlatives. Phase 3 — Presentation (20-30 min): present your celebration plan with introduction, details, and justifications. Class discussion and reflection follow.',
        time: '95 min',
        materials: 'Scenario (including budget and planning goal); event planning worksheet; comparative & superlative grammar support sheet; online resources for research; rubric or checklist',
        example: 'This venue is cheaper than the other one, but the other has the best capacity. The most culturally diverse menu costs more.',
        teacherNote: 'Provide online resources: Cornell event planning guide, Medellin caterers list, entertainment ideas. Encourage creative presentation formats.',
        icon: icons.puzzle,
        links: [
          { label: 'Event Planning Guide (Cornell)', url: 'https://scheduling.cornell.edu/planning-guide-and-policies/event-planning-guide', type: 'reference' },
          { label: 'Best Event Caterers in Medellín', url: 'https://eventflare.io/expert-advice/medellin/the-7-best-event-caterers-in-medellin', type: 'reference' },
          { label: 'Party Entertainment Ideas', url: 'https://www.fielddrive.com/blog/party-entertainment-ideas-event-size', type: 'reference' },
          { label: 'Planning Worksheet', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BA219BCC1-1042-40B2-ACE9-3E8C1052082C%7D&file=planning%20worksheet.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
      {
        title: 'Celebration Review Writing',
        studentTask: 'Write a review comparing three different celebrations using target language structures. Steps: (1) Watch video clips or look at images of celebrations for initial reactions; (2) Read 1-2 sample reviews/articles/blogs about celebrations; (3) Walk through the writing outline: short introduction/"hook," three comparison criteria (meaning, energy, accessibility), conclusion/personal opinion; optional title, image, question to readers; (4) Draft your review using the outline; (5) Exchange drafts for peer feedback on clarity of comparison, coherence, and language structures; (6) Revise to final version of 180-220 words with specific details and well-formed comparisons.',
        time: '95 min',
        materials: 'Short video clips or still images of 3+ celebrations; 1-2 sample celebration reviews; writing outline handout; access to writing/editing tools',
        example: 'Carnival of Barranquilla is the most energetic celebration I have experienced. It is more colorful than the Feria de las Flores.',
        teacherNote: 'Publishing option: best reviews on Google Sites, Medium, or Padlet. Provide the writing outline handout for structure.',
        icon: icons.pen,
      },
      {
        title: 'Latin American Cultural Fair',
        studentTask: 'Create interactive booths representing various Latin American celebrations (e.g., Dia de los Muertos, Carnaval de Rio de Janeiro, Inti Raymi). Develop informative posters highlighting key vocabulary and comparison language from the unit. Incorporate artifacts (traditional decorations, music playlists, food samples like pan de muerto). You are encouraged to wear traditional costumes and engage visitors by explaining the significance of your celebration using comparatives and superlatives.',
        time: '120 min',
        materials: 'Informational poster supplies; comparison language reference (comparatives/superlatives prompt sheet); celebration-specific vocabulary lists; cultural artifacts (optional: traditional decorations, flags); traditional music playlists; traditional costumes (optional); food samples (optional, check allergies); presentation checklist; visitor feedback form',
        example: 'Inti Raymi is the oldest celebration at our fair. The Carnaval de Rio is more famous internationally than Inti Raymi.',
        teacherNote: 'Check for food allergies in advance. Encourage students to curate music playlists. This is a multi-session project.',
        icon: icons.palette,
      },
    ],
    closing: [
      {
        title: 'Reflective Ball Toss with Questions',
        studentTask: 'Gather in a circle. Catch the ball, answer a reflective question (e.g., "What was your favorite cultural celebration learned in this unit and why?", "Describe a celebration you would like to experience and why."), then toss to another classmate. Students ask follow-up questions after each response. At the end, discuss common themes. Optional: write a journal entry summarizing your reflections.',
        time: '10 min',
        materials: 'Soft tossable ball; list of 6-10 reflective questions (printed or projected); optional reflection journal sheet',
        teacherNote: 'Prepare a lightweight ball and 6-10 reflective questions. Encourage follow-up questions between students.',
      },
      {
        title: 'Create News "Headlines"',
        studentTask: 'Synthesize key learnings by creating impactful headlines. In pairs, brainstorm at least two headlines in 5-10 minutes (e.g., "Celebrations Around the World: Colorful traditions!", "How cultures get together to celebrate!"). Share and explain which concepts you aimed to capture. The class compiles headlines on the whiteboard or poster and discusses which headline best represents the unit\'s essence.',
        time: '15 min',
        materials: 'Slips of paper or mini whiteboards; optional headline samples for inspiration; large poster or board for collecting group headlines',
        teacherNote: 'Encourage creative, catchy headlines. Display the best ones on a poster for the classroom.',
      },
    ],
    livingLearning: [
      {
        title: 'Cooking Demonstrations (Cocina Pedagógica)',
        studentTask: 'Participate in an interactive cooking or craft-making session relevant to the celebrations studied in this unit. Follow the recipe handout, learn about the cultural background of the dish, and practice using comparative and superlative language to describe the experience.',
        time: '75 min',
        materials: 'Ingredients, portable cooking setup or kitchen access, recipe handouts, cultural background info',
        teacherNote: 'Coordinate kitchen access in advance. Check for food allergies. Connect the cooking to specific celebrations studied.',
      },
      {
        title: 'Multi-Cultural Celebration Crafts',
        studentTask: 'Create crafts focused on celebrations from different cultures (New Year, Christmas, Diwali, Eid, etc.). Follow cultural guides or video instructions to make traditional items. Describe your craft using comparative forms.',
        time: '45 min',
        materials: 'Craft supplies (paper, glue, scissors, markers), cultural guides or video instructions',
        teacherNote: 'Provide a variety of craft options representing different cultures. Video instructions help visual learners.',
      },
      {
        title: 'Guest Speakers from the Spanish Program',
        studentTask: 'Listen to guest speakers discuss cultural practices related to celebrations. Take notes, prepare questions in advance, and participate in the Q&A session using comparative and superlative language to compare what you learn with your own culture.',
        time: '40 min',
        materials: 'Speaker invitation, projector/audio setup, Q&A prompts for students',
        teacherNote: 'Arrange speakers in advance from the Spanish program. Provide students with Q&A prompts to prepare.',
      },
      {
        title: 'Regional Diversity Group Projects',
        studentTask: 'In groups, incorporate regional diversity (students from Cartagena, Bogota, Huila, etc.) through a group project requiring collaboration and learning from each other\'s regional perspectives on celebrations. Create a poster, chart, or digital presentation comparing celebrations across regions.',
        time: '150 min (spread across sessions)',
        materials: 'Poster/chart paper or digital tools (Canva, Slides), project rubric, celebration profile templates',
        teacherNote: 'Spread across 2-3 sessions. Leverage the diverse backgrounds of students in the class.',
      },
      {
        title: 'Language Exchange Opportunities',
        studentTask: 'Participate in language exchange events at various city venues to exchange ideas about celebrations with speakers of other languages. Use guiding questions from the worksheet to structure your conversations and practice comparative forms.',
        time: 'Flexible (1-2 events, 1-2 hours each)',
        materials: 'Info flyers or list of local exchange venues, optional worksheet with guiding questions',
        teacherNote: 'Encourage participation outside class hours. Provide a list of local language exchange venues in the city.',
      },
    ],
  },
  unit2: {
    warmUps: [
      {
        title: 'Concentric Circles Discussion',
        instructions: 'Form two concentric circles (inner facing outer). Ask and answer questions about your current living situations. After each timed round, the inner circle rotates one seat right so you get a new partner. At the end, volunteers share one interesting point learned from a partner.',
        time: '15 min',
        materials: 'Questions about current living situations (printed or projected)',
        teacherNote: 'Prepare 4-5 questions about living situations. Keep rounds timed (2-3 min each). Encourage use of quantity expressions.',
        links: [
          { label: 'Discussion Questions', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B0AE97C3E-FC45-4F67-9960-51ED83DA9B11%7D&file=questions%20about%20their%20current%20living%20situations.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
      {
        title: 'Video – "Where do you live?"',
        instructions: 'Watch a video of real people discussing their living environments (likes/dislikes). Before viewing, the teacher introduces the topic and asks what makes a good living environment, presenting key vocabulary. Take notes, complete the video worksheet with comprehension questions, then discuss: Where do you live? House or apartment? What do you like/dislike? Share your own experiences.',
        time: '15 min',
        materials: 'Video, video answer key, video worksheet (from Speakout Elementary, Pearson)',
        teacherNote: 'Based on Speakout Elementary (Pearson). Pre-teach key vocabulary before viewing.',
        links: [
          { label: 'Video Script', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B53C4FA09-DD96-4274-83C9-E8433B272A36%7D&file=script.doc&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Video Worksheet', url: 'https://eafit.sharepoint.com/:b:/s/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/IQAUhQ1xK88-R6ZsYEePcK4oAfVIFZ22yFg8LQJ7YjXmszw?e=6Mo20D', type: 'worksheet' },
          { label: 'Video Answer Key', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&FolderCTID=0x012000B3680363A70AE44ABDD184DD23BA61F5&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources%2Fvideo%20answer%20key%2Epng&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources', type: 'worksheet' },
        ],
      },
      {
        title: 'Trashketball',
        instructions: 'Your teacher places a basket/bin as a shooting target. Form teams of 3-4 with rotating roles (answer, shoot, score-keep). The teacher reads 20 unit-related vocabulary prompts (furniture, parts of the house). First team to raise their hand answers with a full sentence. Correct answer = 1 point + 1 shot for an extra point. Incorrect = chance passes to another team. Roles rotate each turn.',
        time: '15 min',
        materials: 'Basket or bin, vocabulary prompts (20 items: furniture, parts of the house)',
        teacherNote: 'TPR activity. Prepare 20 vocabulary prompts about furniture and parts of the house. Keep energy high with the physical element.',
        links: [
          { label: '20 Questions', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BCA372DA5-5BC7-4884-9A62-D7EE0F04D179%7D&file=20%20questions.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
    ],
    concreteExperience: [
      {
        title: 'Global Housing Collage',
        studentTask: 'Act as international urban planners. In pairs, select 3 types of homes from a curated image bank and build a digital collage on Padlet (or similar). For each home, answer guided questions about: (1) Location — where is it and what is culturally/geographically important; (2) Housing features — materials and standout features; (3) Basic needs — how the home meets needs for water, food, heating, compared to your own; (4) Affordability & preferences — could someone afford it, would you want to live there and why. Close with a short written or oral reflection justifying your preferred home.',
        time: '35 min',
        materials: 'Collaborative platform (Padlet), curated image bank of global housing, optional sentence frames',
        example: 'This house in Indonesia uses a lot of wood. There isn\'t much heating because the climate is warm.',
        teacherNote: 'Prepare a curated image bank of diverse global housing types. Provide optional sentence frames for weaker students.',
        icon: icons.globe,
        links: [
          { label: 'Image Bank', url: 'https://eafit.sharepoint.com/:p:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BA9BD0F88-E3A1-4B2E-ADE3-49416AC7AFAB%7D&file=image%20bank.pptx&action=edit&mobileredirect=true', type: 'images' },
          { label: 'Sentence Frames', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BD0380D14-0D7D-4521-9BC3-C5E7CAB8D4E6%7D&file=Sentence%20frames.docx&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Padlet', url: 'https://padlet.com/', type: 'reference' },
        ],
      },
      {
        title: 'One Person, One Home',
        studentTask: 'Your teacher writes "Home =" on the board and asks "What does home mean to you?" Then shows sample images. You receive an individual image of a home from somewhere in the world (rural, urban, aquatic, developed, developing) with a location caption. Silently reflect using 7 guiding questions: (1) What does this home look like? (2) What objects/features on/in/around the home? (3) How much water or food might people need daily? (4) How is this similar/different from your own? (5) What is daily life like here? (6) How would you describe the people/family? (7) Do you think this home is important to them? Why? Then pair up or group to share insights, followed by whole-class sharing of surprises.',
        time: '35 min',
        materials: 'One image per student (printed or digital) with location captions, reflection questions, optional Google Docs for letter-writing extension, sticky notes',
        example: 'There isn\'t much space in this home, but there are many personal items. How much water do they use daily?',
        teacherNote: 'Prepare diverse images (rural, urban, aquatic, developed, developing). Each student gets a different image. Encourage empathy.',
        icon: icons.home,
      },
      {
        title: 'Collaborative Write-On – "What We Need for Comfortable Living"',
        studentTask: 'Multi-phase activity: Phase 1 — Stations: Visit thematic stations with real objects representing comfort (blanket, lamp, plant, cup, photo of a fan). Discuss "How does this object contribute to a comfortable home?" and write short notes. Phase 2 — Watch a brief video/slideshow on different living conditions with the guiding question: "What does it mean to live comfortably, and why does it matter?" Phase 3 — Roleplay: you get a role (environmentalist, student on a budget, parent of three, elderly person) and discuss what is essential for comfortable living from that perspective. Phase 4 — Mini-survey: interview 3 classmates about what they consider essential for comfort. Phase 5 — Write a two-paragraph text titled "What we need for comfortable living" selecting at least 5 essential items with justifications. Phase 6 — Gallery walk: post texts and leave sticky-note comments.',
        time: '45 min',
        materials: 'Real objects for stations (blanket, lamp, plant, cup, fan photo), slideshow/video, sentence stems, writing template, poster paper, sticky notes',
        example: 'How much natural light do we need? There are a few essential items every home should have.',
        teacherNote: 'Set up stations before class. Assign roles for Phase 3. Provide sentence stems for the roleplay discussion.',
        icon: icons.users,
        links: [
          { label: 'Video: Small Rural House in Cornwall', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/stream.aspx?id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources%2F09%2E%20small%20rural%20house%20in%20Cornwall%2Emp4&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2E6f0e0a2a%2D248f%2D42df%2Da746%2D68dd8b9c6603', type: 'video' },
          { label: 'Slideshow', url: 'https://eafit.sharepoint.com/:p:/s/RenovacinCursosAdultos/EXzzJp2PLAhJvu42IAsDFYQBOXOwfE5ObtnxAzO6fcmxVw?e=qaMTVd', type: 'images' },
          { label: 'Sentence Stems', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BAD04501E-8445-4A36-805A-67E6316C2A01%7D&file=Sentence%20Stems.docx&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Writing Template', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BDD15D265-54F0-4964-8FC3-B8AE1E3F979D%7D&file=writing%20template.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
    ],
    reflection: [
      {
        title: '"What Makes a Home?" (Reflection on Housing Collage)',
        studentTask: 'In small groups, exchange and discuss your collages using guided sentence starters: "One interesting thing we found was...", "Compared to your homes, we noticed...", "A surprising feature of this house was...", "This type of housing reflects the culture because..." Then answer teacher-led reflection questions comparing "house" vs. "home" and analyzing how geography/culture influence housing. Optional: write an individual reflection choosing 2-3 prompts from: "After seeing different homes, I think a home is...", "I was surprised by...because...", "My home is comfortable because..."',
        time: '15 min',
        materials: 'Guided sentence starters (projected), teacher-led questions, optional written reflection sheet',
        example: 'One interesting thing we found was that there isn\'t much furniture in traditional Japanese homes.',
        teacherNote: 'Start with small group discussion, then teacher-led reflection. Compare "house" vs. "home" concepts.',
        links: [
          { label: 'Teacher-Led Reflection Questions', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BE1628973-2980-4432-B36D-DCFC361132FF%7D&file=teacher-led%20reflection%20questions.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
      {
        title: '"Home, More Than a Structure" (Reflection on One Person, One Home)',
        studentTask: 'Revisit the "home" question — likely you focused on physical characteristics. The teacher suggests additional dimensions: family, meals, comfort, rest, safety. Use a T-chart graphic organizer (one side "homes" / other side "home/family life") to show a home is both a physical structure and the life/relationships inside it. Add more words/phrases to your lists. Reflect on "Do people need homes? Why?" Alternative: write two paragraphs about what your home means to you and why having a home is important to all people worldwide.',
        time: '15 min',
        materials: 'T-chart graphic organizer, markers/post-its, optional soft background music',
        example: 'How many people share this home? There is a lot of love in a small space. Not much furniture, but much happiness.',
        teacherNote: 'Use a T-chart on the board. Play soft background music to create a reflective atmosphere.',
        links: [
          { label: 'T-Chart', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources%2Ft%2Dchart%2Epdf&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources', type: 'worksheet' },
        ],
      },
      {
        title: 'Comfort Corners (Reflection on Collaborative Writing)',
        studentTask: 'Four classroom corners are labeled: "Absolutely Essential," "Nice to Have," "Not Really Needed," and "It Depends." The teacher calls out household items/resources (hot shower, internet, fan, natural light, fridge, sofa, microwave, green space). Move to the corner matching your opinion. In your corner, discuss your reasoning with same-opinion peers. After several rounds, volunteers share key arguments. Closing discussion: "Did anyone change their mind?" "What new perspectives did you gain about comfort needs?"',
        time: '20 min',
        materials: '4 large signs for corners, list of 6-8 household comfort items',
        example: 'How much do we really need internet? I think it is absolutely essential because there isn\'t much you can do without it today.',
        teacherNote: 'Physical movement activity. Label corners clearly. Read items one at a time and let students move between rounds.',
      },
    ],
    abstract: [
      {
        title: 'Reading About World Homes',
        studentTask: 'Four phases: (1) Build context (10 min): Read the World Homes article intro aloud. Create a collaborative mind map: "What materials are used to build homes in your community?" and "What housing problems are common in Colombia?" Look at 4-5 images of Colombian homes. (2) Divide and assign (10 min): Split into 3 groups, each reading one article section (Indonesia, Mongolia, or Cote d\'Ivoire). Use guiding questions and a visual organizer (comparison chart, cause-effect map, or timeline). (3) Group presentations (10 min): Present key points using your visual summary, comparing with local housing. (4) Conceptual debate (10 min): "What makes housing fair?" and "Is housing a right or a privilege?" Justify with evidence from readings.',
        time: '40 min',
        materials: 'World Homes article (Habitat for Humanity), Colombian housing images, graphic organizers, guiding question handouts',
        example: 'How many rooms do typical homes in Mongolia have? There isn\'t much wood in the desert, so they use felt.',
        teacherNote: 'Source: Habitat for Humanity World Homes article. Prepare 3 sections for jigsaw. Include Colombian housing images for local context.',
        links: [
          { label: 'World Homes Article', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources%2FWorld%20Homes%2Epdf&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources', type: 'reference' },
          { label: 'Guiding Questions', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BEF9B806E-D6B3-4174-842B-CD27FAE729B5%7D&file=guiding%20questions%20to%20facilitate%20discovery.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
      {
        title: 'House and Furniture Vocabulary',
        studentTask: 'Vocabulary activation (10 min): The teacher writes "Parts of the House" on the board and elicits responses ("What do we call the place where we cook?"). Record parts (kitchen, bedroom, living room, bathroom) and related furniture items. Group work (10 min): Groups of 3-4 are assigned a specific room; list 7-10 furniture pieces and present to class. Then complete rooms/parts worksheet and furniture worksheet. Practice — Battleship game: place furniture/house words on a grid and guess coordinates to find your partner\'s words. Hit = partner reveals letter. You can guess full words at any point. First to find all words wins.',
        time: '20 min',
        materials: 'Vocabulary worksheet (from Teach This), furniture worksheet (from English Vocabulary in Use, Elementary), battleship game sheet, optional flashcards/picture prompts',
        example: 'How many bedrooms are there? There is a lot of furniture in the living room.',
        teacherNote: 'Elicit before teaching. The Battleship game adds a fun competitive element to vocabulary practice.',
        links: [
          { label: 'Rooms and Parts of the House Worksheet', url: 'https://eafit.sharepoint.com/:b:/s/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/IQCpLUDNl396T69snpBqSryKARRhEYKZIvv8pm_5_E2C4JE?e=62G7gL', type: 'worksheet' },
          { label: 'Furniture Worksheet', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources%2Ffurniture%20worksheet%2Epdf&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources', type: 'worksheet' },
          { label: 'Battleship Game Sheet', url: 'https://eafit.sharepoint.com/:b:/s/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/IQBG_5vNKMhETqDJdAvMdcn6AXnJxw1hJQYK68BnbZovqpI?e=oX1YnE', type: 'worksheet' },
          { label: 'Answer Key', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources%2F04%2E%20answer%20key%2Epdf&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources', type: 'worksheet' },
        ],
      },
      {
        title: 'Grammar Guided Discovery 1 – Countable vs. Uncountable',
        studentTask: 'Warm-up reflection (5 min): Answer the board question "What things are important for you when choosing a place to live?" Brainstorm 5 aspects individually. Pair work (5 min): Discuss and justify answers. The teacher collects 10-12 nouns on the board. Discovery stage (10 min): Look at a two-column chart (Countable / Uncountable) and classify the listed nouns using guiding questions. Clarify rules with real-life housing vocabulary. Review grammar reference. Controlled practice (10 min): Complete the countable/uncountable worksheet.',
        time: '30 min',
        materials: 'Guiding questions, grammar reference, controlled practice worksheet + answers (from TeachThis.com)',
        example: '"Space" is uncountable but "room" can be both. How much space do you need? How many rooms?',
        teacherNote: 'Let students classify before confirming. Metacognitive closure: "What do countable and uncountable nouns allow us to do when talking about housing?"',
        links: [
          { label: 'Guiding Questions', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BEF9B806E-D6B3-4174-842B-CD27FAE729B5%7D&file=15.%20guiding%20questions%20to%20facilitate%20discovery.docx&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Grammar Reference (Count vs. Uncount)', url: 'https://eafit.sharepoint.com/:p:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B1BEF7A8A-AD38-4C73-841A-E26AC2108760%7D&file=grammar%20reference%20count%20vs%20uncount.pptx&action=edit&mobileredirect=true', type: 'reference' },
          { label: 'Practice Worksheet', url: 'https://eafit.sharepoint.com/:b:/s/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/IQAHbbnY5YiFTLnzLx0LmyBpAfNEDrbeP7LJm3kUl05rj-c?e=ErNdFO', type: 'worksheet' },
          { label: 'Controlled Practice Worksheet', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources%2Fcountable%20and%20uncountable%20controlled%20practice%2Epdf&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources', type: 'worksheet' },
        ],
      },
      {
        title: 'Grammar Guided Discovery 2 – How Much / How Many',
        studentTask: 'Adapted from face2face Elementary (Cambridge). Exercise 1 & 2: Review vocabulary for rooms and household items using an apartment plan. Exercise 3: Answer comprehension questions (individually or pairs). Exercise 4: Classify nouns as countable/uncountable and deduce grammar rules for "how much" vs. "how many." Explain your reasoning, compare with a partner, then check as a group and formulate rules together. Wrap up with a short oral activity: ask and answer questions about your own homes using the target language.',
        time: '25 min',
        materials: 'Guided discovery worksheet (adapted from face2face Elementary, Cambridge), worksheet key, optional visual aids of household items',
        example: 'How much rent do you pay? How many windows does your apartment have?',
        teacherNote: 'Based on face2face Elementary (Cambridge). Let students deduce rules before confirming.',
        links: [
          { label: 'Guided Discovery Worksheet', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BFD556BA5-66CD-4580-A1A8-E97F2FEA8795%7D&file=guided%20discovery%20worksheet.docx&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Worksheet Key', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BB613FDD4-B362-47A8-B56B-64426B328714%7D&file=Worksheet%20key.docx&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Short Oral Activity', url: 'https://eafit.sharepoint.com/:w:/s/RenovacinCursosAdultos/EadUn2dde8VGs6JvhOIFgAsBYsz4TZEnj1vHR-6lp3UAAg?e=qlehCo', type: 'worksheet' },
        ],
      },
      {
        title: 'Find Someone Who',
        studentTask: 'Receive a "Find Someone Who" housing worksheet. Talk to a different classmate for each item. When someone answers "Yes" or gives a specific quantity, write that student\'s name. Before starting, review countable/uncountable nouns and how much vs. how many. Ask follow-up questions ("Why?", "Is that a lot or a little for you?", "Do you like that?"). After, report key findings. Optional: create a class bar graph from the most common answers.',
        time: '25 min',
        materials: 'Printed Find Someone Who worksheet',
        example: '"Find someone who has more than 3 rooms" → "How many rooms do you have?" "I have a few — four rooms."',
        teacherNote: 'Model one sample question with a volunteer first. Encourage follow-up questions. Metacognitive closure: "What surprised you? How did using how much/how many help?"',
        icon: icons.users,
        links: [
          { label: 'Find Someone Who Housing Worksheet', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BC3DEFB01-1781-4DF5-90E6-C6B9AD3402AD%7D&file=Find_Someone_Who_Housing.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
      {
        title: 'A Place to Rent',
        studentTask: 'Information gap activity from English File Elementary (Oxford). In pairs, role-play a phone call about a rental property. Student A = estate agent with a London flat ad; Student B = customer who reviews prompts under "What I want to know" and forms complete questions. Student B initiates the conversation. Do not show each other your worksheets. After the first role-play, check how many Student Bs chose to rent. Then switch roles and repeat with a second property listing. Debrief: Who rented? Why? What influenced the decision?',
        time: '25 min',
        materials: 'Information gap worksheet (Student A and Student B), from English File Elementary (Oxford)',
        example: '"How much is the rent?" "It\'s £1,200 per month." "How many bedrooms does it have?" "There are a few — two bedrooms."',
        teacherNote: 'From English File Elementary (Oxford). Students must NOT show each other their worksheets. Metacognitive closure: "What strategies helped you ask questions fluently?"',
        icon: icons.home,
        links: [
          { label: 'Information Gap Worksheet', url: 'https://eafit.sharepoint.com/:b:/s/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/IQB284OU86FxRpsR4MmK_sCNAb8G8KwI9l9RyB0muDdU7hs?e=NOck5g', type: 'worksheet' },
        ],
      },
    ],
    practice: [
      {
        title: 'Housing Across Colombia – A Showcase of Diversity',
        studentTask: 'Each group selects a Colombian city/region representing a distinct cultural and geographic identity (Caribbean coast, Andean highlands, Amazon basin, etc.). Guiding question: "How do climate, culture, and economy influence housing in different parts of Colombia?" Research phase: Gather info using websites, blogs, digital maps with a structured template (housing types, average rent, materials, local lifestyle). Creative element: Create a "Day in the Life" narrative or video diary about a fictional family in your chosen region, incorporating drawings, images, or video clips. Presentation: Simple visual display (poster, collage, or slide) + the narrative. Include interactive components (quizzes, polls). Culmination: Mini housing fair where groups showcase work. Closing discussion: "What did you learn about housing diversity in Colombia?"',
        time: '105 min',
        materials: 'Research template, poster board/markers/digital tools (Canva, Google Slides), optional sticky notes or online polling',
        example: 'There is a lot of humidity on the Caribbean coast, so houses have many windows. In the Andes, there isn\'t much heat, so homes use a lot of brick.',
        teacherNote: 'Provide the structured research template. Encourage interactive components. This is a multi-session project.',
        icon: icons.map,
        links: [
          { label: 'Structured Research Template', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BF85083BF-0789-4B83-8DB0-E1641067E898%7D&file=structured%20template.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
      {
        title: 'Room Makeover Challenge',
        studentTask: 'Redesign a room in your own home based on a real need or personal goal. Step 1: Reflect on a space to improve (bedroom, study area, shared space). Identify a specific problem (lack of light, not enough storage, no privacy). Step 2: Search online stores (Homecenter, Exito, IKEA) for affordable solutions within a budget (e.g., 600,000 COP). Record prices, quantities, and purpose. Justify choices using unit target language, explain trade-offs. Step 3: Create a visual plan of the redesigned space (Canva, PowerPoint, or before/after layout). Step 4: Brief presentation — pitch your redesign to an "interior design committee." Present current space, issues, redesigned plan, and total cost. Classmates ask follow-up questions using quantity expressions.',
        time: '70 min',
        materials: 'Budget template, access to online stores, Canva or PowerPoint',
        example: 'How much does the new desk cost? There aren\'t many affordable options, but I found a few good ones.',
        teacherNote: 'Provide a budget template. Students search real online stores for authentic pricing. Encourage peer questions using quantity expressions.',
        icon: icons.home,
        links: [
          { label: 'Budget Template', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources%2Fbudget%20template%2Epdf&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%202%2FResources', type: 'worksheet' },
        ],
      },
      {
        title: 'Life on a Budget',
        studentTask: 'Teams represent different Colombian families (4 members: 2 parents, 2 children) with assigned income levels: Team A (Low: 1,500,000 COP/month), Team B (Lower-Middle: 2,500,000), Team C (Middle: 3,500,000), Team D (Upper-Middle: 4,500,000), Team E (High: 25,000,000). Driving question: "How can effective budgeting help different Colombian families manage their finances?" Steps: (1) Discuss financial stability in Colombia, review budgeting resources; (2) Use budget template with expense categories and local price examples; (3) Research real local prices using flyers, websites, family interviews; (4) Create a budget allocating funds for essential needs while balancing discretionary spending and savings; (5) Create a visual presentation and present using target language. Q&A session. Class vote on most realistic/balanced budget. Reflection on what you learned about budgeting across income levels.',
        time: '95 min',
        materials: 'Budget template, online flyers/websites, voting slips, budgeting resources (articles from TeachMoney)',
        example: 'How much money is left for savings? There isn\'t much after rent. A few families can save a lot, but many cannot.',
        teacherNote: 'Assign income levels randomly. Provide real local price references. Discuss budgeting mistakes ("sick budgets" from TeachMoney). Extension: written justification of budget decisions.',
        icon: icons.building,
        links: [
          { label: 'Budget Template', url: 'https://eafit.sharepoint.com/:b:/s/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/IQA-3Vw1bdo3SLUni3enKLQ2AcGCl387Y0BWrYD7-nSvaHg?e=BpAaan', type: 'worksheet' },
          { label: 'Spending Plan', url: 'https://eafit.sharepoint.com/:b:/s/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/IQA8uzjiBHGVTbVt2HbglIP8ASSzqdookerB_dRl2UQoVj4?e=85NpcL', type: 'worksheet' },
          { label: 'Money Management Video', url: 'https://eafit.sharepoint.com/:v:/s/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/IQBhTDlmQKmBRpd3N6K2uNR0AQhwJa4zEXhmN0oT5o1aYkQ?e=XG4FAa', type: 'video' },
          { label: 'Master Your Finance (Infographic)', url: 'https://www.kwsp.gov.my/en/w/article/master-your-finance', type: 'reference' },
          { label: 'Sick Budgets', url: 'https://eafit.sharepoint.com/:b:/s/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/IQD7yPY3E4ufQIDZoIufZmqKAbgXLi-EPjStpyRcB_J0pwc?e=EOYhfT', type: 'reference' },
        ],
      },
    ],
    closing: [
      {
        title: 'Sticky Notes Insights',
        studentTask: 'On sticky notes, write one personal insight about housing, budgeting, or comfort that changed during the unit (e.g., "I didn\'t realize how different homes are around Colombia" or "I used to think only rich homes are comfortable, but now I think differently"). Post your notes on a "Reflection Wall" divided into 4 themes: Housing Around the World, Budgeting & Priorities, Language I Learned, What I\'d Like to Learn Next.',
        time: '12 min',
        materials: 'Sticky notes (1-3 per student), markers, wall/board divided into 4 sections',
        teacherNote: 'Prepare the Reflection Wall with 4 labeled sections before the activity. Read a few notes aloud at the end.',
      },
      {
        title: 'Tweeting',
        studentTask: 'Write a "tweet" (max 280 characters) summarizing what you learned about budgeting and life priorities (e.g., "I discovered I can\'t live without Wi-Fi, but I can survive without an expensive lamp. #BudgetLife #Adulting"). Display tweets around the classroom or on a Padlet wall.',
        time: '12 min',
        materials: 'Whiteboard or digital board, Padlet (optional)',
        teacherNote: 'Encourage creativity and humor. Share favorites with the class.',
      },
      {
        title: 'Comfort Spectrum Corners',
        studentTask: 'Four classroom corners are labeled: Essential, Important, Nice to Have, Not Necessary. The teacher reads aloud housing conditions/items (hot shower, natural light, two bathrooms, low rent, privacy, internet, etc.). Walk to the corner matching your opinion. After 4-5 rounds, pause to explain your choices using quantity expressions and home-related vocabulary. Closing reflective question: "Has your opinion changed about what makes a good living space?"',
        time: '12 min',
        materials: '4 signs, list of 8-10 housing-related items, optional ball/talking stick',
        teacherNote: 'Physical movement activity. Read items one at a time. Encourage explanations using unit target language.',
      },
    ],
    livingLearning: [
      {
        title: 'Family Expense Discussion',
        studentTask: 'At home, discuss typical monthly expenses (housing, food, transport) with your relatives. Bring real data to class for the budgeting activities. Use interview questions to guide the conversation.',
        time: '10 min (homework)',
        materials: 'Interview questions about family expenses',
        teacherNote: 'Assign as homework before the budgeting activities. Emphasize privacy — students share only what they are comfortable with.',
      },
      {
        title: 'Home Comfort Walk',
        studentTask: 'Walk through your home and list objects/features contributing to comfort (windows, lighting, quiet spaces). Bring your list to class to compare with classmates using quantity expressions.',
        time: '10 min (homework)',
        materials: 'Observation checklist',
        teacherNote: 'Simple homework task. Lists feed into classroom comparison activities.',
      },
      {
        title: 'Neighbourhood Housing Observation',
        studentTask: 'Take photos or notes about housing types in your neighbourhood (materials, size, rent estimates). Reflect on how location affects comfort or affordability. Bring observations to class.',
        time: '10 min (homework)',
        materials: 'Mobile phone/camera, observation notebook',
        teacherNote: 'Connects classroom learning to real-world observation. Students share findings in class.',
      },
      {
        title: 'Room Makeover Family Feedback',
        studentTask: 'Show your final redesign ideas from the Room Makeover Challenge to a family member. Ask for their feedback and report it to the class: "My mom said there isn\'t much storage in my plan" or "My dad thinks I need a few more shelves."',
        time: '10 min (homework)',
        materials: 'Room Makeover project from class',
        teacherNote: 'Bridges classroom work to family engagement. Students report feedback using target language.',
      },
    ],
  },
  unit3: {
    warmUps: [
      {
        title: 'Bingo Town',
        instructions: 'Play bingo using place names related to services. The teacher (or a student caller) reads definitions of places aloud without saying the place name. Listen, check your card, and cross off matching places. First to get four in a row shouts "Bingo!" and reads aloud the places crossed off.',
        time: '15 min',
        materials: 'Bingo cards with place names (1 per student), caller\'s definition sheet, markers or paper pieces',
        teacherNote: 'Prepare bingo cards with service-related place names. Read definitions only — do not say the place name. Vocabulary activation activity.',
        links: [
          { label: 'Bingo Cards and Caller\'s Sheet', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B0C283724-BCF5-40D2-B219-48ED430EBD2E%7D&file=bingo%20cards%20and%20caller%E2%80%99s%20sheet.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
      {
        title: 'Words Within Words',
        instructions: 'The teacher writes a long unit-related word on the board (e.g., "transportation," "entertainment," "community center"). In pairs or groups, you have 3 minutes to make as many new English words as possible using only the letters from that word. 1 point per correct word, 1 bonus for the longest valid word. Optionally connect found words to the unit theme and add them to a word wall.',
        time: '10 min',
        materials: 'Timer, board/markers',
        teacherNote: 'Good words to use: "transportation," "entertainment," "community center." Quick vocabulary activation and teamwork.',
      },
      {
        title: 'Place Taboo',
        instructions: 'Guess common places related to the unit (zoo, market, mall) while one student describes the location without using three "taboo" words shown on screen. Can be played whole-class (volunteer stands with back to screen, class gives clues) or in small groups. 30-60 seconds per round.',
        time: '15 min',
        materials: 'Taboo cards (digital or printed), screen/projector, optional timer/buzzer',
        teacherNote: 'Prepare taboo cards with common service places and 3 forbidden words per card. Keep rounds fast (30-60 seconds).',
        links: [
          { label: 'Taboo Cards', url: 'https://eafit.sharepoint.com/:p:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BB732678B-3EB7-461B-99B8-7826A4178FDB%7D&file=taboo%20cards.pptx&action=edit&mobileredirect=true', type: 'worksheet' },
        ],
      },
    ],
    concreteExperience: [
      {
        title: 'EAFIT Campus Quest – Scavenger Hunt',
        studentTask: 'Three phases: (1) Orientation Phase (~10 min): Explore an illustrated campus map (2018) and an OpenStreetMap digital map. In pairs, answer questions like "Can you find the cafeteria?" and "Which services have you used before?" (2) Field Trip Phase (~60 min): In teams, visit 8 campus locations, each with short missions (take a photo, ask a question, describe something, record a short video). Scoring: up to 10 base points per stop + up to 20 bonus points (+2 English use, +3 creative output, +2 real-life interaction in English, +2 teamwork). Maximum: 100 points. (3) Return Phase (~15 min): Check evidence at a "checkpoint station" (photos, videos, notes). Upload to shared Padlet/Google Drive/Slides. Small rewards given.',
        time: '120 min',
        materials: 'Printed missions, timer, small rewards, printed/digital campus maps (EAFIT 2018 illustrated map + OpenStreetMap), clipboard, Padlet/Google Drive for uploads',
        example: 'There are some computers in the library. There isn\'t much space in the gym at noon.',
        teacherNote: 'Originally designed for main campus; adaptable to other sites. Prepare 8 mission cards with specific tasks per location. Maximum 100 points.',
        icon: icons.map,
        links: [
          { label: 'Illustrated Campus Map', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources%2Fillustrated%20campus%20map%2Epdf&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources', type: 'images' },
          { label: 'EAFIT Campus Map (OpenStreetMap)', url: 'https://www.eafit.edu.co/campus-eafit/mapa', type: 'reference' },
          { label: 'Missions', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B7C278E15-F26E-4286-8FBB-CA4196578FB0%7D&file=missions.docx&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Printed Maps', url: 'https://eafit.sharepoint.com/:b:/s/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/IQAuqhYXmO_UQb2hJuRNBiQvAZNN4TJ4kj1J6O0aFGYMWLc?e=tAWQI3', type: 'images' },
        ],
      },
      {
        title: 'Medellin Tourist Information Center',
        studentTask: 'Simulate interactions in a Tourist Information Centre in Medellin. Three phases: (1) Vocabulary activation worksheet (15 min): classify destination words by category, then name real Medellin places and explain why you\'d recommend them. (2) Tourist task cards (15 min): Using cards like "Where can I try local food?", small groups brainstorm actual places that meet tourist needs, select and justify choices. 5-minute whole-class debrief. (3) Role-play rotations (20 min): Tourist Information Officers stay at desks, tourists move around completing information sheets. After 15 min, switch roles.',
        time: '75 min',
        materials: 'Posters/photos of real Medellin locations, vocabulary activation worksheet, tourist task cards, information sheets for tourists',
        example: 'Are there any good restaurants near Parque Lleras? Yes, there are some traditional ones. There is a lot of nightlife there.',
        teacherNote: 'Use real Medellin locations and photos. Prepare tourist task cards with specific needs (local food, museums, nightlife, etc.).',
        icon: icons.globe,
        links: [
          { label: 'Vocabulary Activation Worksheet', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B9138FD02-6D3E-41CC-8F6F-6C068B85A758%7D&file=vocabulary%20activation%20worksheet.docx&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Tourist Task Cards', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BEA2106ED-9DB6-4F22-B2FD-AEE9D66E2804%7D&file=tourist%20task%20cards.docx&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Information Sheet', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B16E18D67-2769-4AC2-81EB-EE6A8DDF9DC1%7D&file=information%20sheet.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
      {
        title: 'Learning Stations – Exploring Services in Real Life',
        studentTask: 'Rotate through three stations (15-20 min each): Station 1: "Flying Isn\'t Always Easy" — Watch an airport documentary, discuss common travel problems, identify problems in the video, share personal experiences, write humorous/realistic complaints in an airport forum. Station 2: "Quick Service, Big Taste" — Watch a documentary on street food in Brazil, Morocco, and Thailand. Match visuals to food items, complete sentences with descriptive adjectives, reflect on street food as a culturally rich service. Station 3: "Books on the Move — El Biblioburro" — Read about a creative rural education service in Colombia. Answer comprehension questions, discuss community impact, reflect on educational access. After all rotations, share your final task from each station with the whole class.',
        time: '65 min',
        materials: 'Station 1/2/3 worksheets, devices to watch videos (airport documentary, street food documentary)',
        example: 'There aren\'t any direct flights from here. There is some amazing street food in Thailand. There aren\'t many libraries in rural Colombia.',
        teacherNote: 'Set up 3 physical stations before class. Each station needs a device for video and a printed worksheet. Time rotations carefully.',
        icon: icons.play,
        links: [
          { label: 'Airport Documentary Video', url: 'https://eafit.sharepoint.com/:v:/s/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/IQCRam-m2CifTaAyMAYETEDRAdDS3UuZqh29qtWpljHpR9E?e=stAtDY', type: 'video' },
          { label: 'Street Food Documentary Video', url: 'https://eafit.sharepoint.com/:v:/s/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/IQDQ0jakfqh6SphlAqLWT4vYAWi9elPcfguLTx5u5DOcnoU?e=dfNIsn', type: 'video' },
          { label: 'Station 1 Worksheet', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B2EF45546-3392-4A20-ABAA-B7CBE0489EEC%7D&file=station%201%20worksheet.docx&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Station 2 Worksheet', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B4FDE6713-5164-4108-B4F3-F385AF034F81%7D&file=station%202%20worksheet.docx&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Station 3 Worksheet', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B1390AB29-547A-4DF6-8CD5-43CA9148BB7D%7D&file=station%203%20worksheet.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
    ],
    reflection: [
      {
        title: 'Reflection on EAFIT Campus Quest',
        studentTask: 'Do a gallery walk or screen share of photos/captions/notes from the scavenger hunt. In pairs, discuss: "Which service surprised you the most and why?" and "Which mission was the most fun or difficult?" Language noticing: "What useful words or phrases did you use today?" 2-3 volunteers share with the class. Highlight how English was used to navigate real spaces.',
        time: '15 min',
        materials: 'Photos/notes/captions from the hunt, completed mission cards, physical or digital gallery display, optional Padlet/Google Slides',
        example: 'I used "Are there any...?" a lot during the scavenger hunt. The most surprising service was the wellness center.',
        teacherNote: 'Focus on language noticing — write useful words/phrases on the board. Highlight real-world English use.',
      },
      {
        title: 'Reflection on Medellin Tourist Information Center',
        studentTask: 'Class discussion: "What made a recommendation effective?", "Was it easy/hard to answer tourists\' questions?", "Which expressions did you use most?", "Did people understand you?" Then complete a written reflection with three prompts: (1) One useful thing I said/heard, (2) One thing I want to improve, (3) A new word/phrase I learned. Optionally share anonymously.',
        time: '15 min',
        materials: 'Role-play notes/cue cards, printed/projected discussion questions, reflection template',
        example: 'One useful thing I said was "There are some great cafés near the university." I want to improve using "any" in questions.',
        teacherNote: 'Start with whole-class discussion, then move to individual written reflection. Anonymous sharing reduces pressure.',
      },
      {
        title: 'Reflection on Learning Stations',
        studentTask: 'The teacher asks "Which station was most interesting or surprising, and why?" Share your answers. In pairs, complete a noticing task: recall one useful phrase from each station (e.g., "You can visit...", "There is a place where..."). Discuss how different needs lead to different communication. Final question: "What do these stations show us about how people solve problems or provide services?"',
        time: '15 min',
        materials: 'Printed/projected discussion questions, whiteboard/digital board, optional poster paper, sticky notes',
        example: 'At the airport station I used "There aren\'t any..." At the food station I used "There is some..." Each service needs different language.',
        teacherNote: 'Metalinguistic discussion about how different needs lead to different communication. Keep focus on language patterns.',
      },
    ],
    abstract: [
      {
        title: 'Grammar Discovery 1 – A/An, Some, Any',
        studentTask: 'Look at photos of two London street food stalls (Chinese food and pizza) and discuss which you\'d eat at. Listen to a conversation (from Navigate Elementary, Oxford) where two friends order food at a market. First listen: identify which stall and what they order. Second listen: match sentence beginnings 1-6 to endings a-f. Then analyze the highlighted transcript to discover uses of a/an/some/any: "any" in questions, "some" in affirmative sentences, "any" in negative sentences, "a/an" with singular countable nouns. Complete grammar rules. Review grammar reference (from Speakout Elementary, Pearson). Do controlled practice.',
        time: '30 min',
        materials: 'Images of food stalls, conversation audio (Navigate Elementary, Oxford), transcript, grammar reference (Speakout Elementary, Pearson), practice link',
        example: '"Can I have some chicken?" "Do you have any Coke?" "I\'d like a coffee." — "some" in affirmative, "any" in questions, "a" with singular.',
        teacherNote: 'Based on Navigate Elementary (Oxford). Grammar reference from Speakout Elementary (Pearson). Guide discovery, don\'t give rules directly.',
        links: [
          { label: 'Chinese Food Stall Image', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources%2Fchinese%20food%20stall%2Ewebp&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources', type: 'images' },
          { label: 'Pizza Stall Image', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources%2Fpizza%20stall%2Ejpg&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources', type: 'images' },
          { label: 'Audio: Two Friends', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/stream.aspx?id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources%2Ftwo%20friends%2Emp3&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2Ea96f610f%2Db505%2D4407%2D9a97%2D3536a7d0dc02', type: 'audio' },
          { label: 'Highlighted Transcript', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B73888942-9E54-4735-A483-816F1A7FA4EA%7D&file=highlighted%20transcript.docx&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Grammar Reference (A/AN, SOME, ANY)', url: 'https://eafit.sharepoint.com/:p:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BF4611292-FCD8-4C1F-897B-1F77B354046A%7D&file=grammar%20reference%20%20for%20A-AN%20SOME%20ANY%20-%20Copia.pptx&action=edit&mobileredirect=true', type: 'reference' },
          { label: 'Practice: A/Some/Any (test-english.com)', url: 'https://test-english.com/grammar-points/a1/a-some-any-countable-uncountable/', type: 'reference' },
        ],
      },
      {
        title: 'Shopping List',
        studentTask: 'Pairwork grammar practice from English File Elementary (4th Ed., Oxford). Practice "Do we need any...? / Yes, we need some... / No, we don\'t need any..." The teacher demonstrates with classroom materials. Pairs get A/B worksheets — Student A is in the supermarket calling Student B at home. B looks at the fridge picture and answers. A marks tick/cross for items needed. Then swap roles. Wrap-up: pairs share what they needed most or found surprising.',
        time: '30 min',
        materials: 'Shopping list worksheet (A and B) from English File Elementary (4th Ed., Oxford)',
        example: '"Do we need any milk?" "Yes, we need some milk." "Do we need any eggs?" "No, we don\'t need any eggs."',
        teacherNote: 'From English File Elementary (4th Ed., Oxford). Demonstrate with classroom materials first.',
        links: [
          { label: 'Shopping List Worksheet', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources%2Fshopping%20list%20worksheet%2Epdf&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources', type: 'worksheet' },
        ],
      },
      {
        title: 'Grammar in Context – Quantifiers',
        studentTask: 'Take a shopping habits quiz (circle Y/N for each statement). Count your answers and read the quiz result interpretation (careful shopper vs. impulsive shopper). Discuss if it matches you. Then focus on highlighted quantifiers in the quiz (much, a lot of, a few, some, a bit). Sort quantifiers/determiners into categories: singular countable, plural countable, uncountable, or both. Review answers as a class. Reinforce with online practice exercises for: much/many/little/few/some/any, demonstratives (this/that/these/those), a little/a few, each/every/all.',
        time: '30 min',
        materials: 'Shopping habits quiz, highlighted quantifiers handout, sorting handout, each/every/all worksheet (from Business Grammar and Practice, Collins), online practice links',
        example: '"I buy a lot of snacks" — "a lot of" works with both countable and uncountable. "I spend much time shopping" — "much" with uncountable.',
        teacherNote: 'Multiple online practice links available. Include the each/every/all worksheet from Business Grammar and Practice (Collins).',
        links: [
          { label: 'Shopping Habits Quiz', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B7C0C9F96-AE50-4AA2-A2A1-D55CD3654F5D%7D&file=shopping%20habits%20quiz.docx&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Highlighted Quantifiers', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B33112595-1123-4B91-B163-DA283738C523%7D&file=highlighted%20quantifiers.docx&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Sort Quantifiers and Determiners', url: 'https://eafit.sharepoint.com/:p:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B6FD687A7-EC44-4B27-B1E7-767DCCC6E21D%7D&file=sort%20the%20following%20quantifiers%20and%20determiners.pptx&action=edit&mobileredirect=true', type: 'reference' },
          { label: 'Practice: Much/Many/Little/Few (test-english.com)', url: 'https://test-english.com/grammar-points/a2/much-many-little-few-some-any/', type: 'reference' },
          { label: 'This vs These (prowritingaid.com)', url: 'https://prowritingaid.com/grammar/1000142/-these-vs-this-', type: 'reference' },
          { label: 'This/That/These/Those (test-english.com)', url: 'https://test-english.com/grammar-points/a1/this-that-these-those/', type: 'reference' },
          { label: 'Little vs Few (ego4u.com)', url: 'https://www.ego4u.com/en/cram-up/vocabulary/little-few', type: 'reference' },
          { label: 'Each/Every/All Worksheet', url: 'https://eafit.sharepoint.com/:b:/s/RenovacinCursosAdultos/ESh2R_6Z36hAiAIokQEktNEB0HiUAPtwLbE0JNluOAF7Ug?e=jqccqG', type: 'worksheet' },
        ],
      },
      {
        title: 'Quantifiers Board Game',
        studentTask: 'Play in pairs or groups of three. Roll a die, move your token, land on a square with a "How much/many...?" question (e.g., "How many online subscriptions do you have?" or "How much money do you spend on delivery apps?"). First decide whether the question requires "How much" or "How many," say it aloud, then answer using an appropriate quantifier (some, a few, a lot of, not much, etc.). Group members ask follow-up questions.',
        time: '20 min',
        materials: 'Board game (one per pair/group), dice (one per group), small tokens/counters',
        example: '"How many streaming services do you use?" → "I use a few — Netflix and Spotify." Follow-up: "How much do you pay for them?"',
        teacherNote: 'Print one board per group. Encourage follow-up questions to extend speaking time.',
        icon: icons.gamepad,
        links: [
          { label: 'Quantifiers Board Game', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B12749F76-3E6D-4AFE-8EAD-A5A4CF4821B0%7D&file=quantifiers%20board%20game.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
    ],
    practice: [
      {
        title: 'A Service Review',
        studentTask: 'Seven-step task: (1) Service Experience Stories (5-10 min): In pairs, share a memorable service experience (positive or negative), then summarize partner\'s story to class. (2) Pre-task Recap (5-10 min): Review useful expressions/grammar. Discuss characteristics of a good review. (3) Model Reading & Analyzing (10-15 min): Analyze real TripAdvisor/Google Maps reviews for vocabulary, tone, and structure using model worksheets. (4) Task Instructions: Write a review of a recently used service. (5) Production Phase (15-20 min): Write the review using quantifiers/determiners (a lot of noise, a few problems, not enough staff, some nice features). (6) Sharing & Peer Review (10-15 min): Share in pairs/groups. Peers ask questions and give feedback. Optional: vote for "most helpful review." (7) Whole-class Reflection (5 min): "What did you learn about using English to give recommendations?"',
        time: '60 min',
        materials: 'Service review worksheet/digital template, peer feedback checklist, real-life service review examples (TripAdvisor/Google Maps), model 1 and model 2 worksheets, optional Padlet',
        example: '"I visited a new coffee shop near EAFIT. There are some comfortable seats but there isn\'t much Wi-Fi. I would recommend it for a quick coffee."',
        teacherNote: 'Potential summative assessment. Show real reviews as models. Two model worksheets available: Model 1 (extended narrative) and Model 2 (shorter online review form).',
        icon: icons.star,
        links: [
          { label: 'TripAdvisor Example Review', url: 'https://www.tripadvisor.ca/Restaurant_Review-g297478-d19114830-Reviews-Hatoviejo_Oviedo-Medellin_Antioquia_Department.html', type: 'reference' },
          { label: 'Model 1 Worksheet', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources%2Fmodel%201%20worksheet%2Epdf&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources', type: 'worksheet' },
          { label: 'Model 2 Worksheet', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources%2Fmodel%202%20worksheet%2Epdf&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources', type: 'worksheet' },
        ],
      },
      {
        title: 'A Product Unboxing Video',
        studentTask: 'Five-step task: (1) Opening: Watch a trending unboxing video from social media. Discussion: "What products have you recently unboxed or would like to unbox?" (2) Introduction to New Material: Brainstorm key unboxing vocabulary (packaging, features, user experience) on digital whiteboard. Discuss adjectives for product quality. Optional description worksheet. (3) Practice: Groups receive a mystery product to unbox together. Role-play an unboxing presentation focusing on packaging, features, and excitement of discovery. Choose a spokesperson. (4) Unboxing: Create an individual unboxing video with introduction, unboxing process, product feature description, and conclusion. Encourage sharing on TikTok or Instagram. (5) Closing: Discussion about new vocabulary and what you learned.',
        time: '90 min',
        materials: 'Selection of unboxing videos, description worksheet (optional, from English for Everyone, Business English), mystery products for group practice, mobile phones for recording',
        example: '"Today I\'m unboxing a subscription box! There are some snacks, a few stickers, and a lot of candy inside. This product has a lot of variety."',
        teacherNote: 'Potential summative assessment. Show a trending unboxing video first. Provide mystery products for group practice before individual recording.',
        icon: icons.camera,
        links: [
          { label: 'Best Unboxing Videos', url: 'https://www.demoup-cliplister.com/en/blog/best-unboxing-videos/', type: 'video' },
          { label: 'Description Worksheet', url: 'https://eafit.sharepoint.com/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/Documentos%20compartidos/Forms/AllItems.aspx?viewid=3f7bdafa%2D8368%2D47b1%2Da8a1%2D57bd0da68bd5&newTargetListUrl=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos&viewpath=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FForms%2FAllItems%2Easpx&id=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources%2Fdescription%20worksheet%2Epdf&parent=%2Fsites%2FIdiomasEAFIT%2Fjefaturacad%C3%A9mica%2Fprofesidiomas%2Finglesadultos%2FDocumentos%20compartidos%2FAdult%20English%20Program%20Curriculum%2FNew%20Curriculum%202026%2FA2%20Elementary%2FElementary%202%2FUnit%203%2FResources', type: 'worksheet' },
        ],
      },
      {
        title: 'A Catalog of Services in My Community',
        studentTask: 'Essential Research Question: "What services are available in our neighborhoods, and how do community members perceive their effectiveness and quality?" Six steps: (1) Warm-up Discussion: Conversation question set about local services to activate prior knowledge. (2) Research and Planning: Select 2-3 services, develop a specific research question (e.g., "How do local cafes support community events?"). Conduct field research: visit locations, interview providers, survey community members. Optional mini-lesson on open-ended vs. closed-ended questions. (3) Data Collection: Create and use a structured survey/questionnaire. Document findings through notes, photos, or recordings. (4) Catalog Creation: Compile catalog with brief descriptions, key survey findings (ratings, feedback), and visual elements. (5) Presentation: Present catalogs to the class, highlighting interesting findings. (6) Class Discussion & Reflection: Discuss variety of services and importance of customer feedback.',
        time: '120 min',
        materials: 'Survey templates, catalog design materials, conversation question set, open-ended vs. closed-ended questions handout, mobile phones for photos',
        example: '"In my neighborhood, there are a lot of small shops but there aren\'t any bookstores. Some residents want more cultural services."',
        teacherNote: 'Potential summative assessment. Multi-session project. Great for real-world application and community engagement.',
        icon: icons.globe,
        links: [
          { label: 'Conversation Question Set', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7BB38F3051-4C2D-4627-9D0E-423F9385BA7A%7D&file=conversation%20question%20set%20about%20local%20services.docx&action=default&mobileredirect=true', type: 'worksheet' },
          { label: 'Open-Ended vs Closed-Ended Questions Handout', url: 'https://eafit.sharepoint.com/:w:/r/sites/IdiomasEAFIT/jefaturacad%C3%A9mica/profesidiomas/inglesadultos/_layouts/15/Doc.aspx?sourcedoc=%7B7CF68EE9-60C7-43E9-80D5-92C813EA3F78%7D&file=open%20ended%20vs%20closed%20ended%20questions%20handout.pdf.docx&action=default&mobileredirect=true', type: 'worksheet' },
        ],
      },
    ],
    closing: [
      {
        title: 'Cultural Service Storytelling Circle',
        studentTask: 'Form a circle and share a brief personal story about a cultural service you experienced during the unit (on campus, community, or fieldwork). Express how it made you feel and what you learned about accessibility or quality. Use determiners and quantifiers in your story.',
        time: '15 min',
        materials: 'Optional talking object to pass around',
        teacherNote: 'Affective reflection activity. Create a supportive atmosphere. Encourage students to connect their stories to unit themes.',
      },
      {
        title: 'Service Review Awards Ceremony',
        studentTask: 'Present your service reviews or unboxing videos and receive creative awards (e.g., "Most Helpful Review," "Most Creative Unboxing," "Best Use of Quantifiers"). Celebrate each other\'s work and give positive feedback.',
        time: '15 min',
        materials: 'Printed/digital award certificates or badges, optional background music/sound effects/applause animations',
        teacherNote: 'Informal celebration. Prepare fun award categories in advance. Make it celebratory.',
      },
      {
        title: 'Reflection Wall',
        studentTask: 'Post on a collaborative wall (physical or digital) three items: (1) One new thing I learned, (2) One challenge I overcame, (3) One cultural service I want to explore more. Read your classmates\' posts and add comments or reactions.',
        time: '15 min',
        materials: 'Large poster paper/bulletin board, sticky notes or reflection cards, optional Padlet',
        teacherNote: 'Collaborative visual reflection. Prepare the wall space before the activity. Can be physical or digital (Padlet).',
      },
    ],
    livingLearning: [
      {
        title: 'Neighborhood Service Exploration',
        studentTask: 'Explore services around your neighborhood (bakery, pharmacy, gym). Take photos, list key information (opening hours, prices, offerings). Describe findings using quantifiers and demonstratives: "This bakery has some great bread. There isn\'t much variety, but the prices are low."',
        time: '30 min (outside class)',
        materials: 'Mobile phones/cameras, guided worksheet (name of service, opening hours, prices, services offered), notebook/Google Docs, optional Padlet/printed neighborhood map',
        teacherNote: 'Out-of-class fieldwork. Provide a guided worksheet for structured observations.',
      },
      {
        title: 'Service Budget Classification',
        studentTask: 'Create a simple service-related budget (phone, transport, streaming) and classify countable/uncountable items. Use quantifiers to describe your spending: "I spend a lot of money on transport. There are a few subscriptions I don\'t need."',
        time: '30 min (outside class)',
        materials: 'Sample budget template, word bank with quantifiers/determiners, vocabulary cards (countable/uncountable categories)',
        teacherNote: 'Real-world language application. Connect to budgeting skills from Unit 2.',
      },
      {
        title: 'Voice Message Service Inquiry',
        studentTask: 'Send short voice messages (via WhatsApp or similar) asking someone about a service they used recently. Report back using target language: "She said there are some good options. There isn\'t much parking, but there is a lot of variety."',
        time: '30 min (outside class)',
        materials: 'Guided worksheet for reporting findings',
        teacherNote: 'Authentic communication task. Students practice speaking and reporting.',
      },
      {
        title: 'Bienestar Universitario Visit',
        studentTask: 'Prepare questions about available student services and visit Bienestar Universitario. Ask your questions using target language and report findings: "There are some free counseling sessions. There isn\'t much information about sports classes."',
        time: '20 min (outside class)',
        materials: 'Printed/digital questionnaire, vocabulary list of common student services, optional recording permission, reflection sheet',
        teacherNote: 'On-campus fieldwork. Prepare questions in class before the visit.',
      },
      {
        title: 'Sports Area Observation',
        studentTask: 'Visit the sports area and count how many classes or courts are available. Observe peak hours and report using quantifiers: "There are a lot of students at noon. There are a few courts available in the morning. There aren\'t many classes in the evening."',
        time: '20 min (outside class)',
        materials: 'Observation worksheet, watch/phone for timing, optional photos, whiteboard/group poster for reporting',
        teacherNote: 'On-campus observation task. Students observe and report using quantifiers. Combine with reporting activity in class.',
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
    'Celebrations Kickoff': {
      steps: ['Teacher introduces the unit on celebrations through two lenses on the board.', 'Students work in pairs, choosing one question from each section of the question bank.', 'Pairs discuss their questions and share answers.', 'Quick whole-class share of representative ideas.'],
      materials: ['Question bank (printed or projected)', 'Mini word bank on board'],
      tips: ['Set up the board with "Celebrations" and two headers before class.', 'Provide a printed or projected question bank for pairs to select from.'],
    },
    'Image Spark: Festival Photos': {
      steps: ['Teacher shows photos of a street parade (e.g., Chinese New Year).', 'Elicit descriptions: "What can you see? What\'s happening?"', 'Teach/confirm vocabulary like "parade" and "costume."', 'In pairs, discuss celebration questions. Whole-class harvest of ideas and vocabulary.'],
      materials: ['Festival photos (projected)', 'Discussion prompts'],
      tips: ['Elicit descriptions before teaching vocabulary.', 'Build a class vocabulary list from emergent words.'],
    },
    'Think-Pair-Share: What is a Celebration?': {
      steps: ['Students write a short personal definition of "celebration."', 'In pairs, compare definitions and share personal experiences.', 'Class builds a mind map on the board distinguishing celebration, festival, tradition, custom.', 'Clarify overlaps and differences.'],
      materials: ['Board or whiteboard for mind map'],
      tips: ['Guide the mind map construction collaboratively.', 'Encourage personal examples from diverse backgrounds.'],
    },
    'Celebration Snapshots': {
      steps: ['Watch 3-5 short video clips of celebrations from around the world.', 'Individually take notes on key elements, cultural reflections, and similarities/differences.', 'In pairs, discuss notes and capture partner\'s ideas.', 'Each pair shares key takeaways plus one unique aspect with the class.'],
      materials: ['3-5 celebration videos (curated list)', 'Note-taking sheet'],
      tips: ['Curate 3-5 clips from diverse cultures.', 'Links are reference only — substitute with other resources as needed.'],
    },
    'Celebration Gallery Walk: Exploring Global Festivities': {
      steps: ['Post 8-10 celebration photos around the room with guiding criteria visible.', 'Students rotate clockwise in pairs, writing short notes at each photo.', 'Use criteria: Place, People, Activities, Meaning, Energy, Access.', 'Each pair presents one similarity, one difference, and one unique aspect.'],
      materials: ['8-10 celebration photos', 'Markers', 'Guiding criteria posted near each photo'],
      tips: ['Include both public/community festivals and private/family celebrations.', 'Alternative: Padlet, Jamboard, or Google Slides for digital version.'],
    },
    'Family Celebration Portraits': {
      steps: ['Pre-class: Students bring a printed photo and complete the worksheet.', 'In-class: Pair interview — share celebration details with a partner.', 'Mini gallery walk: display worksheets and leave comments/questions.', 'Whole-class discussion of interesting observations.'],
      materials: ['Printed photo or drawing', 'Family Celebration Portrait Worksheet', 'Sticky notes or Padlet'],
      tips: ['Assign pre-class homework in advance.', 'Provide a digital Padlet option for students who prefer it.'],
    },
    'Reflect on Celebration Snapshots (Video Activity)': {
      steps: ['Teacher replays 20-30 seconds from two contrasting clips or shows two still images.', 'In pairs, share observations using the sentence frame.', 'Class discussion: How does this celebration reflect values or community?', 'Identify one similarity and one difference compared to another celebration.'],
      materials: ['Short video clips or still images', 'Sentence frame (projected)', 'Optional mini whiteboards'],
      tips: ['Only replay 20-30 seconds — keep it brief.', 'Project the sentence frame for all students to see.'],
    },
    'Reflect on Celebration Gallery Walk': {
      steps: ['Silently revisit gallery walls and place two dots on interesting/confusing comments.', 'In pairs, discuss guided questions requiring comparatives/superlatives.', 'Questions move from observation to inference across cultural dimensions.', 'Optional: class discussion or written synthesis.'],
      materials: ['Gallery photos with comments', 'Colored dots/stickers (2 per student)', 'Guiding question handout'],
      tips: ['Questions progress: access, tradition/modernity, safety, scale, roles, meaning.', 'Optional follow-up: written synthesis on celebrations vs. personal gatherings.'],
    },
    'Reflect on Family Celebration Portraits': {
      steps: ['In pairs or small groups, discuss 4 reflection prompts about the photos observed.', 'Focus on similarities, differences, feelings, and new learnings.', 'A few pairs share reflections with the whole class.', 'Optional: written reflection sheet.'],
      materials: ['Display of student celebration portraits', 'Reflection prompts (projected or printed)'],
      tips: ['Keep the atmosphere supportive and respectful.', 'Provide an optional written reflection sheet.'],
    },
    'Listening Comprehension: Festivals Around the World': {
      steps: ['Show images of six celebrations and ask what students know.', 'Pre-teach key words: parade, candles, harvest, concert.', 'Play audio once for gist: identify where and when celebrations take place.', 'Check comprehension as a class.'],
      materials: ['Audio from english-practice.net (A2 Celebrations)', 'Celebration images', 'Transcript + answer key'],
      tips: ['Pre-teach vocabulary before playing audio.', 'Play once for gist only at this stage.'],
    },
    'Guided Discovery of Grammar': {
      steps: ['Play audio again; students write down adjectives heard after each description.', 'Review grammar reference summarizing comparative/superlative rules.', 'In pairs, create sentences comparing celebrations.', 'Complete fill-in-the-blank worksheet and short writing task.'],
      materials: ['Listening audio', 'Grammar reference (Essential Grammar in Use)', 'Worksheet'],
      tips: ['Extension homework: research another celebration and write a paragraph with comparatives/superlatives.'],
    },
    'Comparative Bingo': {
      steps: ['Project bingo grid with adjectives.', 'Students choose 9 and write one sentence per square (comparative or superlative).', 'Teacher reads prompts; matching sentences get ticked.', 'First line shouts "Bingo!" and reads winning sentences.'],
      materials: ['Bingo grid with adjectives'],
      tips: ['End with quick board fix of common errors.', 'Keep energy high throughout.'],
    },
    'Personal Celebration – Compare and Choose': {
      steps: ['Quick warm-up: "birthday" spidergram/word cloud.', 'Complete vocabulary task.', 'Read passage with birthday-party activity options.', 'Compare & Choose scenario using comparatives and superlatives.'],
      materials: ['Passage with birthday-party options', 'Optional writing sheet'],
      tips: ['Extension: students write a paragraph about their ideal birthday party.'],
    },
    'Vocabulary Building – Major Life Events': {
      steps: ['Start with photo of a bride — pairs describe what they see.', 'Build a class list of transitions/milestones.', 'Learn about cultural context (Kosovar Bosnian bride).', 'Groups discuss milestone-related questions and report insights.'],
      materials: ['Photo of a bride', 'Major life-event images', 'Question slips for group work'],
      tips: ['Provide cultural context about the bride photo.', 'Encourage cross-cultural reflection on milestone timing.'],
    },
    'Vocabulary Building and Reading About Celebrations': {
      steps: ['Look at Hogmanay photo and predict what happens.', 'Choose three words expected in the reading from a word list.', 'Read the Hogmanay passage together.', 'Match vocabulary to meanings and complete sentences.'],
      materials: ['Hogmanay photo', 'Vocabulary and reading worksheet'],
      tips: ['Vocabulary prediction activates prior knowledge.', 'Guide the reading collaboratively.'],
    },
    'Cultural Celebration Research Presentation': {
      steps: ['Choose a celebration from any culture.', 'Research origins, significance, practices, cost, venue.', 'Create presentation with comparatives/superlatives and visuals.', 'Present to class and participate in wrap-up discussion.'],
      materials: ['Research planning worksheet', 'Reference sheet', 'Rubric/checklist'],
      tips: ['Include discussion prompts about shared traditions and values.', 'Allow various presentation formats.'],
    },
    'Celebration Planning': {
      steps: ['Phase 1: Research options for the networking event (30-40 min).', 'Phase 2: Decision making using planning worksheet with comparatives (25-30 min).', 'Phase 3: Present celebration plan with justifications (20-30 min).', 'Class discussion and reflection.'],
      materials: ['Scenario with budget', 'Event planning worksheet', 'Grammar support sheet'],
      tips: ['Provide online resources for research.', 'Encourage creative presentation formats.'],
    },
    'Celebration Review Writing': {
      steps: ['Watch clips/images of celebrations for initial reactions.', 'Read 1-2 sample reviews for structure analysis.', 'Draft review using writing outline (hook, 3 criteria, conclusion).', 'Peer feedback, revise to 180-220 words.'],
      materials: ['Video clips/images', 'Sample reviews', 'Writing outline handout'],
      tips: ['Publishing option: Google Sites, Medium, or Padlet.'],
    },
    'Latin American Cultural Fair': {
      steps: ['Choose a Latin American celebration for your booth.', 'Create informative posters with comparison language.', 'Incorporate artifacts, music, optional food samples.', 'Engage visitors explaining significance using comparatives/superlatives.'],
      materials: ['Poster supplies', 'Comparison language reference', 'Cultural artifacts', 'Visitor feedback form'],
      tips: ['Check for food allergies in advance.', 'Multi-session project.'],
    },
    'Reflective Ball Toss with Questions': {
      steps: ['Gather in a circle.', 'Catch the ball and answer a reflective question.', 'Toss to another classmate. Follow-up questions encouraged.', 'Discuss common themes at the end.'],
      materials: ['Soft ball', 'List of 6-10 reflective questions'],
      tips: ['Prepare questions in advance.', 'Encourage follow-up questions between students.'],
    },
    'Create News "Headlines"': {
      steps: ['In pairs, brainstorm at least two headlines in 5-10 minutes.', 'Share and explain which concepts you aimed to capture.', 'Class compiles headlines on whiteboard/poster.', 'Discuss which headline best represents the unit.'],
      materials: ['Slips of paper or mini whiteboards', 'Large poster for collecting headlines'],
      tips: ['Encourage creative, catchy headlines.', 'Display the best ones on a classroom poster.'],
    },
  },
  unit2: {
    'Concentric Circles Discussion': {
      steps: ['Form two concentric circles (inner facing outer).', 'Ask and answer questions about living situations.', 'Inner circle rotates one seat right after each timed round.', 'Volunteers share one interesting point at the end.'],
      materials: ['Questions about living situations'],
      tips: ['Keep rounds timed (2-3 min each).', 'Encourage quantity expression use.'],
    },
    'Video – "Where do you live?"': {
      steps: ['Teacher introduces topic and key vocabulary.', 'Watch video of real people discussing living environments.', 'Complete video worksheet with comprehension questions.', 'Discuss video questions, sharing own experiences.'],
      materials: ['Video', 'Video worksheet (Speakout Elementary, Pearson)', 'Answer key'],
      tips: ['Pre-teach key vocabulary before viewing.', 'Based on Speakout Elementary (Pearson).'],
    },
    'Trashketball': {
      steps: ['Teacher reads vocabulary prompts (furniture, parts of house).', 'First team to raise hand answers with a full sentence.', 'Correct answer = 1 point + 1 basketball shot for bonus point.', 'Rotate roles each turn.'],
      materials: ['Basket or bin', '20 vocabulary prompts'],
      tips: ['TPR activity — keep energy high.', 'Prepare 20 prompts about furniture and house parts.'],
    },
    'Global Housing Collage': {
      steps: ['In pairs, select 3 homes from the image bank.', 'Build a digital collage on Padlet answering guided questions.', 'Address location, features, basic needs, affordability.', 'Close with reflection justifying preferred home.'],
      materials: ['Padlet', 'Curated image bank', 'Optional sentence frames'],
      tips: ['Prepare diverse global housing images.', 'Provide sentence frames for weaker students.'],
    },
    'One Person, One Home': {
      steps: ['Teacher writes "Home =" on board, asks what home means.', 'Each student receives an individual home image with caption.', 'Silently reflect using 7 guiding questions.', 'Pair/group sharing, then whole-class sharing of surprises.'],
      materials: ['One image per student with captions', 'Reflection questions'],
      tips: ['Prepare diverse images (rural, urban, aquatic).', 'Encourage empathy and open-mindedness.'],
    },
    'Collaborative Write-On – "What We Need for Comfortable Living"': {
      steps: ['Phase 1: Visit thematic stations with comfort objects.', 'Phase 2: Watch video/slideshow on living conditions.', 'Phase 3: Roleplay discussion from assigned perspectives.', 'Phase 4-6: Mini-survey, collaborative writing, gallery walk.'],
      materials: ['Real objects for stations', 'Video/slideshow', 'Sentence stems', 'Poster paper', 'Sticky notes'],
      tips: ['Set up stations before class.', 'Assign roles for Phase 3 (environmentalist, student, parent, elderly).'],
    },
    '"What Makes a Home?" (Reflection on Housing Collage)': {
      steps: ['Small groups exchange and discuss collages with sentence starters.', 'Teacher-led reflection comparing "house" vs. "home."', 'Analyze how geography/culture influence housing.', 'Optional individual written reflection.'],
      materials: ['Sentence starters', 'Teacher-led questions', 'Optional reflection sheet'],
      tips: ['Compare "house" vs. "home" concepts.', 'Optional written reflection with provided prompts.'],
    },
    '"Home, More Than a Structure" (Reflection on One Person, One Home)': {
      steps: ['Revisit "home" question — teacher suggests additional dimensions.', 'Use T-chart: "homes" vs. "home/family life."', 'Add words/phrases to both sides.', 'Reflect: "Do people need homes? Why?"'],
      materials: ['T-chart graphic organizer', 'Markers/post-its', 'Optional soft music'],
      tips: ['Play soft background music for reflection.', 'Alternative: students write two paragraphs.'],
    },
    'Comfort Corners (Reflection on Collaborative Writing)': {
      steps: ['Four corners labeled: Absolutely Essential, Nice to Have, Not Really Needed, It Depends.', 'Teacher reads items; students move to matching corner.', 'In corners, discuss reasoning with peers.', 'Closing: "Did anyone change their mind?"'],
      materials: ['4 large signs', 'List of 6-8 household comfort items'],
      tips: ['Physical movement activity.', 'Read items one at a time for each round.'],
    },
    'Reading About World Homes': {
      steps: ['Build context: read intro, mind map, look at Colombian housing images.', 'Jigsaw: 3 groups each read one article section.', 'Group presentations with visual summaries.', 'Conceptual debate: "Is housing a right or a privilege?"'],
      materials: ['World Homes article (Habitat for Humanity)', 'Colombian housing images', 'Graphic organizers'],
      tips: ['Prepare 3 article sections for jigsaw.', 'Include local housing images for context.'],
    },
    'House and Furniture Vocabulary': {
      steps: ['Elicit parts of the house and furniture vocabulary.', 'Groups list 7-10 furniture pieces per assigned room.', 'Complete rooms/furniture worksheets.', 'Play Battleship game with house/furniture words.'],
      materials: ['Vocabulary worksheets', 'Battleship game sheet', 'Optional flashcards'],
      tips: ['Elicit before teaching.', 'Battleship adds a fun competitive element.'],
    },
    'Grammar Guided Discovery 1 – Countable vs. Uncountable': {
      steps: ['Warm-up: "What is important when choosing a place to live?"', 'Pair work: discuss and justify 5 aspects.', 'Discovery: classify nouns on board using two-column chart.', 'Controlled practice with worksheet.'],
      materials: ['Guiding questions', 'Grammar reference', 'Practice worksheet'],
      tips: ['Let students classify before confirming rules.', 'Metacognitive closure question included.'],
    },
    'Grammar Guided Discovery 2 – How Much / How Many': {
      steps: ['Review vocabulary with apartment plan (Ex. 1-2).', 'Comprehension questions (Ex. 3).', 'Classify nouns and deduce how much/how many rules (Ex. 4).', 'Oral activity: ask/answer about own homes.'],
      materials: ['Guided discovery worksheet (face2face Elementary)', 'Worksheet key'],
      tips: ['Based on face2face Elementary (Cambridge).', 'Let students deduce rules before confirming.'],
    },
    'Find Someone Who': {
      steps: ['Review countable/uncountable and how much/how many.', 'Teacher models one question with a volunteer.', 'Students mingle, talking to a different classmate per item.', 'Report findings. Optional: class bar graph.'],
      materials: ['Find Someone Who worksheet'],
      tips: ['Encourage follow-up questions.', 'Model before starting.'],
    },
    'A Place to Rent': {
      steps: ['Pairs role-play a phone call about a rental (Student A = agent, B = customer).', 'Student B forms questions from "What I want to know" prompts.', 'After round 1, check how many chose to rent.', 'Switch roles and repeat with second property.'],
      materials: ['Information gap worksheets (A and B)', 'From English File Elementary (Oxford)'],
      tips: ['Students must NOT show each other their worksheets.', 'Debrief: Who rented? Why?'],
    },
    'Housing Across Colombia – A Showcase of Diversity': {
      steps: ['Select a Colombian city/region to research.', 'Research housing types, rent, materials, lifestyle.', 'Create "Day in the Life" narrative + visual display.', 'Mini housing fair and class reflection.'],
      materials: ['Research template', 'Poster/digital tools', 'Optional polling tools'],
      tips: ['Multi-session project.', 'Encourage interactive components at the fair.'],
    },
    'Room Makeover Challenge': {
      steps: ['Reflect on a space to improve and identify a problem.', 'Search online stores for affordable solutions within budget.', 'Create visual plan of redesigned space.', 'Present to "interior design committee." Classmates ask questions.'],
      materials: ['Budget template', 'Access to online stores', 'Canva/PowerPoint'],
      tips: ['Real online stores for authentic pricing.', 'Encourage peer questions using quantity expressions.'],
    },
    'Life on a Budget': {
      steps: ['Discuss financial stability; review budgeting resources.', 'Use budget template to allocate funds for assigned income level.', 'Research real local prices.', 'Create visual presentation. Q&A. Class votes on best budget.'],
      materials: ['Budget template', 'Online flyers/websites', 'Voting slips'],
      tips: ['Assign income levels randomly.', 'Extension: written justification of budget decisions.'],
    },
    'Sticky Notes Insights': {
      steps: ['Write one personal insight on a sticky note.', 'Post on "Reflection Wall" under one of 4 themes.', 'Read classmates\' notes.', 'Teacher reads a few aloud.'],
      materials: ['Sticky notes', 'Markers', 'Wall divided into 4 sections'],
      tips: ['Prepare the Reflection Wall before the activity.'],
    },
    'Tweeting': {
      steps: ['Write a "tweet" (max 280 characters) summarizing what you learned.', 'Display tweets on classroom wall or Padlet.', 'Read and react to classmates\' tweets.'],
      materials: ['Whiteboard or Padlet'],
      tips: ['Encourage creativity and humor.'],
    },
    'Comfort Spectrum Corners': {
      steps: ['Four corners: Essential, Important, Nice to Have, Not Necessary.', 'Teacher reads housing items; students move to matching corner.', 'After 4-5 rounds, explain choices using quantity expressions.', 'Closing: "Has your opinion changed?"'],
      materials: ['4 signs', 'List of 8-10 housing items'],
      tips: ['Physical movement activity.', 'Encourage unit target language in explanations.'],
    },
  },
  unit3: {
    'Bingo Town': {
      steps: ['Each student receives a bingo card with place names.', 'Teacher/caller reads definitions without saying the place name.', 'Students listen, check cards, and cross off matching places.', 'First with four in a row shouts "Bingo!" and reads places aloud.'],
      materials: ['Bingo cards with place names', 'Caller\'s definition sheet', 'Markers'],
      tips: ['Prepare bingo cards with service-related place names.', 'Read definitions only — never say the place name.'],
    },
    'Words Within Words': {
      steps: ['Teacher writes a long unit-related word on the board.', 'Pairs/groups have 3 minutes to make as many words as possible.', '1 point per word, 1 bonus for longest valid word.', 'Connect found words to the unit theme.'],
      materials: ['Timer', 'Board'],
      tips: ['Good words: "transportation," "entertainment," "community center."'],
    },
    'Place Taboo': {
      steps: ['One student describes a place without using 3 taboo words.', 'Class or group guesses the place.', '30-60 seconds per round.', 'Rotate to give multiple students a turn.'],
      materials: ['Taboo cards', 'Screen/projector', 'Optional timer/buzzer'],
      tips: ['Keep rounds fast (30-60 seconds).', 'Can be whole-class or small groups.'],
    },
    'EAFIT Campus Quest – Scavenger Hunt': {
      steps: ['Orientation: explore campus maps and answer warm-up questions (10 min).', 'Field Trip: teams visit 8 locations with mission cards (60 min).', 'Return: check evidence at checkpoint station (15 min).', 'Upload to Padlet/Google Drive. Small rewards.'],
      materials: ['Mission cards', 'Campus maps', 'Timer', 'Small rewards', 'Padlet'],
      tips: ['Prepare 8 mission cards per location.', 'Adaptable to other sites. Maximum 100 points.'],
    },
    'Medellin Tourist Information Center': {
      steps: ['Vocabulary activation worksheet: classify destination words (15 min).', 'Tourist task cards: brainstorm places for tourist needs (15 min).', 'Role-play rotations: officers at desks, tourists move around (20 min).', 'Switch roles after 15 min.'],
      materials: ['Medellin photos/posters', 'Vocabulary worksheet', 'Tourist task cards', 'Information sheets'],
      tips: ['Use real Medellin locations.', 'Prepare tourist task cards with specific needs.'],
    },
    'Learning Stations – Exploring Services in Real Life': {
      steps: ['Station 1: Airport documentary — identify problems, write complaints (15-20 min).', 'Station 2: Street food documentary — match visuals, complete sentences (15-20 min).', 'Station 3: El Biblioburro reading — comprehension and reflection (15-20 min).', 'Whole-class share from each station.'],
      materials: ['Station worksheets (3 sets)', 'Devices for videos'],
      tips: ['Set up 3 physical stations before class.', 'Time rotations carefully (15-20 min each).'],
    },
    'Reflection on EAFIT Campus Quest': {
      steps: ['Gallery walk or screen share of hunt photos/notes.', 'Pairs discuss which service surprised them most.', 'Language noticing: write useful words/phrases on board.', '2-3 volunteers share with class.'],
      materials: ['Photos/notes from hunt', 'Optional Padlet/Google Slides'],
      tips: ['Focus on language noticing.', 'Highlight real-world English use.'],
    },
    'Reflection on Medellin Tourist Information Center': {
      steps: ['Class discussion on effective recommendations.', 'Discuss expressions used and comprehension.', 'Individual written reflection: 3 prompts.', 'Optional anonymous sharing.'],
      materials: ['Role-play notes', 'Discussion questions', 'Reflection template'],
      tips: ['Start with whole-class, then individual.', 'Anonymous sharing reduces pressure.'],
    },
    'Reflection on Learning Stations': {
      steps: ['Teacher asks which station was most interesting/surprising.', 'Pairs recall one useful phrase from each station.', 'Metalinguistic discussion on different communication needs.', 'Final question: "How do people solve problems or provide services?"'],
      materials: ['Discussion questions', 'Whiteboard/digital board'],
      tips: ['Focus on metalinguistic awareness.', 'Keep discussion on language patterns.'],
    },
    'Grammar Discovery 1 – A/An, Some, Any': {
      steps: ['Look at food stall photos and discuss preferences.', 'Listen to conversation: identify stall and order (1st listen).', 'Match sentence beginnings to endings (2nd listen).', 'Analyze transcript for a/an/some/any patterns. Complete grammar rules.'],
      materials: ['Food stall images', 'Audio (Navigate Elementary)', 'Transcript', 'Grammar reference (Speakout Elementary)'],
      tips: ['Based on Navigate Elementary (Oxford).', 'Guide discovery, don\'t give rules directly.'],
    },
    'Shopping List': {
      steps: ['Teacher demonstrates with classroom materials.', 'Pairs get A/B worksheets — A calls from supermarket, B checks fridge.', 'A marks tick/cross; B answers using some/any.', 'Swap roles. Share what was needed most.'],
      materials: ['Shopping list worksheets A and B (English File Elementary)'],
      tips: ['From English File Elementary (4th Ed., Oxford).', 'Demonstrate first with classroom materials.'],
    },
    'Grammar in Context – Quantifiers': {
      steps: ['Take the shopping habits quiz (Y/N).', 'Read interpretation. Discuss if it matches.', 'Focus on highlighted quantifiers; sort into categories.', 'Reinforce with online practice exercises.'],
      materials: ['Shopping habits quiz', 'Quantifiers handout', 'Sorting handout', 'Each/every/all worksheet (Collins)'],
      tips: ['Multiple online practice links available.', 'Include each/every/all worksheet.'],
    },
    'Quantifiers Board Game': {
      steps: ['Roll die, move token to a square.', 'Decide: "How much" or "How many"?', 'Answer in complete sentence with appropriate quantifier.', 'Group members ask follow-up questions.'],
      materials: ['Board game per pair/group', 'Dice', 'Tokens/counters'],
      tips: ['Print one per group.', 'Encourage follow-up questions.'],
    },
    'A Service Review': {
      steps: ['Step 1: Share service experience stories in pairs (5-10 min).', 'Step 2: Pre-task recap of useful expressions (5-10 min).', 'Step 3: Analyze real reviews using model worksheets (10-15 min).', 'Steps 4-7: Write review, peer review, revise, whole-class reflection.'],
      materials: ['Service review template', 'Peer feedback checklist', 'Real review examples', 'Model worksheets'],
      tips: ['Potential summative assessment.', 'Two model worksheets: narrative and online review form.'],
    },
    'A Product Unboxing Video': {
      steps: ['Watch a trending unboxing video; discuss products.', 'Brainstorm unboxing vocabulary; optional description worksheet.', 'Groups practice with mystery product.', 'Individual unboxing video recording. Closing discussion.'],
      materials: ['Unboxing video examples', 'Description worksheet', 'Mystery products', 'Mobile phones'],
      tips: ['Potential summative assessment.', 'Provide mystery products for group practice.'],
    },
    'A Catalog of Services in My Community': {
      steps: ['Warm-up discussion about local services.', 'Select 2-3 services; develop research question; conduct field research.', 'Create survey, collect data, compile catalog.', 'Present and reflect on findings.'],
      materials: ['Survey templates', 'Catalog design materials', 'Question handout'],
      tips: ['Multi-session project.', 'Potential summative assessment. Real-world application.'],
    },
    'Cultural Service Storytelling Circle': {
      steps: ['Form a circle.', 'Share a brief story about a cultural service experienced during the unit.', 'Express feelings and learnings about accessibility/quality.', 'Use determiners and quantifiers.'],
      materials: ['Optional talking object'],
      tips: ['Create a supportive atmosphere.', 'Connect stories to unit themes.'],
    },
    'Service Review Awards Ceremony': {
      steps: ['Present service reviews or unboxing videos.', 'Receive creative awards (Most Helpful, Most Creative, Best Quantifiers).', 'Celebrate and give positive feedback.'],
      materials: ['Award certificates/badges', 'Optional background music'],
      tips: ['Prepare fun award categories in advance.', 'Make it celebratory.'],
    },
    'Reflection Wall': {
      steps: ['Post 3 items on the wall: (1) new thing learned, (2) challenge overcome, (3) service to explore more.', 'Read classmates\' posts and add comments.'],
      materials: ['Poster paper/bulletin board', 'Sticky notes', 'Optional Padlet'],
      tips: ['Prepare wall space before the activity.', 'Can be physical or digital.'],
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

  const openExpandedActivity = (stage: keyof typeof stageImages, section: string, targetUnitKey: string, activityId: string, activity: WarmUp | Activity) => {
    resetAudioPlayer()
    setExpandedActivity({ stage, section, unitKey: targetUnitKey, activityId, activity })
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
                            onClick={() => openExpandedActivity('warmUps', 'Warm-Up Activities', unitKey, activityId, activity)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                openExpandedActivity('warmUps', 'Warm-Up Activities', unitKey, activityId, activity)
                              }
                            }}
                            className={`cursor-pointer p-4 rounded-xl border hover:shadow-lg transition-all ${isCompleted
                              ? 'bg-emerald-50 border-emerald-200'
                              : 'bg-rose-50 border-rose-100 hover:border-rose-200'
                              }`}
                          >
                            {/* Image Header */}
                            <div className="-mt-4 -mx-4 mb-4 relative h-36 border-b group overflow-hidden bg-slate-100 rounded-t-xl">
                              <Image 
                                src={`https://images.unsplash.com/photo-${stageImages.warmUps}?auto=format&fit=crop&q=80&w=600&h=300`} 
                                alt={activity.title} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                            </div>
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
                            onClick={() => openExpandedActivity('concreteExperience', 'Concrete Experience', unitKey, activityId, activity)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                openExpandedActivity('concreteExperience', 'Concrete Experience', unitKey, activityId, activity)
                              }
                            }}
                            className={`cursor-pointer p-4 rounded-xl border hover:border-emerald-200 hover:shadow-lg transition-all ${isCompleted ? 'bg-emerald-50 border-emerald-300' : 'bg-emerald-50 border-emerald-100'
                              }`}
                          >
                            {/* Image Header */}
                            <div className="-mt-4 -mx-4 mb-4 relative h-36 border-b group overflow-hidden bg-slate-100 rounded-t-xl">
                              <Image 
                                src={`https://images.unsplash.com/photo-${stageImages.concreteExperience}?auto=format&fit=crop&q=80&w=600&h=300`} 
                                alt={activity.title} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                            </div>
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
                            onClick={() => openExpandedActivity('reflection', 'Reflective Observation', unitKey, activityId, activity)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                openExpandedActivity('reflection', 'Reflective Observation', unitKey, activityId, activity)
                              }
                            }}
                            className={`cursor-pointer p-4 rounded-xl border hover:border-amber-200 hover:shadow-lg transition-all ${isCompleted ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-100'
                              }`}
                          >
                            {/* Image Header */}
                            <div className="-mt-4 -mx-4 mb-4 relative h-36 border-b group overflow-hidden bg-slate-100 rounded-t-xl">
                              <Image 
                                src={`https://images.unsplash.com/photo-${stageImages.reflection}?auto=format&fit=crop&q=80&w=600&h=300`} 
                                alt={activity.title} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                            </div>
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
                            onClick={() => openExpandedActivity('abstract', 'Abstract Conceptualization', unitKey, activityId, activity)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                openExpandedActivity('abstract', 'Abstract Conceptualization', unitKey, activityId, activity)
                              }
                            }}
                            whileHover={{ y: -3, scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`cursor-pointer p-4 rounded-xl border relative hover:border-blue-200 hover:shadow-lg transition-all ${isCompleted ? 'bg-emerald-50 border-emerald-300' : 'bg-blue-50 border-blue-100'
                              }`}
                          >
                            {/* Image Header */}
                            <div className="-mt-4 -mx-4 mb-4 relative h-36 border-b group overflow-hidden bg-slate-100 rounded-t-xl">
                              <Image 
                                src={`https://images.unsplash.com/photo-${stageImages.abstract}?auto=format&fit=crop&q=80&w=600&h=300`} 
                                alt={activity.title} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
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
                            onClick={() => openExpandedActivity('practice', 'Active Experimentation', unitKey, activityId, activity)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                openExpandedActivity('practice', 'Active Experimentation', unitKey, activityId, activity)
                              }
                            }}
                            className={`cursor-pointer p-5 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border relative hover:border-violet-200 hover:shadow-lg transition-all ${isCompleted ? 'border-emerald-300' : 'border-violet-100'
                              }`}
                          >
                            {/* Image Header */}
                            <div className="-mt-4 -mx-4 mb-4 relative h-36 border-b group overflow-hidden bg-slate-100 rounded-t-xl">
                              <Image 
                                src={`https://images.unsplash.com/photo-${stageImages.practice}?auto=format&fit=crop&q=80&w=600&h=300`} 
                                alt={activity.title} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
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
          <DialogContent className="w-[min(960px,95vw)] max-h-[92vh] overflow-y-auto p-0 sm:max-w-4xl border-none shadow-2xl bg-white rounded-2xl">
            {/* Hero Image Section */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <Image 
                src={`https://images.unsplash.com/photo-${stageImages[expandedActivity.stage]}?auto=format&fit=crop&q=80&w=1200&h=600`}
                alt={expandedActivity.activity.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/40 backdrop-blur-md px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                    {expandedActivity.section}
                  </Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/40 backdrop-blur-md px-3 py-1 text-xs font-semibold">
                    <Icon icon={icons.clock} className="w-3 h-3 mr-1" />
                    {expandedActivity.activity.time}
                  </Badge>
                </div>
                <DialogTitle className="text-3xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-md">
                  {expandedActivity.activity.title}
                </DialogTitle>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                  <DialogDescription className="text-slate-600 text-lg">
                    Expanded activity view.
                  </DialogDescription>
                </div>
                <Button
                  type="button"
                  size="lg"
                  variant={completedActivities[expandedActivity.activityId] ? 'default' : 'outline'}
                  className={`h-12 px-6 rounded-full transition-all shadow-sm ${
                    completedActivities[expandedActivity.activityId] 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                  onClick={() => toggleActivityCompletion(expandedActivity.activityId)}
                >
                  <Icon icon={completedActivities[expandedActivity.activityId] ? icons.checkCircle : icons.task} className="mr-2 h-5 w-5" />
                  {completedActivities[expandedActivity.activityId] ? 'Activity Completed' : 'Mark as Completed'}
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-12 space-y-6">
                  {/* Primary Task Section */}
                  {isRegularActivity(expandedActivity.activity) ? (
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm">
                      <h5 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                        Instructions
                      </h5>
                      <p className="text-slate-700 leading-relaxed text-lg font-medium">
                        {expandedActivity.activity.studentTask}
                      </p>
                    </div>
                  ) : null}

                  {/* Audio Player Section (if applicable) */}
                  {!isRegularActivity(expandedActivity.activity) && expandedActivity.activity.audioSrc && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
                      <h5 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
                        <Icon icon="lucide:music" className="w-5 h-5 text-indigo-500" />
                        Audio Resource
                      </h5>
                      <audio
                        ref={audioRef}
                        preload="none"
                        src={expandedActivity.activity.audioSrc}
                        onEnded={() => setIsAudioPlaying(false)}
                        className="hidden"
                      />
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Button 
                            type="button" 
                            size="lg" 
                            className="rounded-full w-14 h-14 p-0 bg-indigo-600 hover:bg-indigo-700 shadow-lg" 
                            onClick={isAudioPlaying ? handlePauseAudio : handlePlayAudio}
                          >
                            <Icon icon={isAudioPlaying ? icons.pause : icons.play} className="h-6 w-6 text-white" />
                          </Button>
                          <div className="flex-1">
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full bg-indigo-500 ${isAudioPlaying ? 'animate-shimmer w-full transition-all duration-1000' : 'w-0'}`} />
                            </div>
                            <p className="mt-2 text-xs font-medium text-slate-500">
                              {isAudioPlaying ? 'Now Playing: Audio Material' : 'Player Ready'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-50">
                          <div className="flex gap-2">
                            <Button type="button" size="sm" variant="ghost" className="h-8 px-3" onClick={handleStopAudio}>
                              <Icon icon={icons.stop} className="h-3.5 w-3.5 mr-1.5" /> Stop
                            </Button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Playback Speed</span>
                            {[0.75, 1, 1.25, 1.5].map((speed) => (
                              <button
                                key={speed}
                                type="button"
                                className={`text-xs font-bold px-2.5 py-1 rounded-md transition-all ${
                                  audioSpeed === speed 
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                                onClick={() => handleSetAudioSpeed(speed)}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Implementation Pack Sections */}
                  {expandedActivityPack && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h5 className="font-bold text-slate-800 flex items-center gap-2">
                              <Icon icon="lucide:list-checks" className="h-5 w-5 text-indigo-500" />
                              Steps
                            </h5>
                          </div>
                          <div className="p-6">
                            <ol className="space-y-4">
                              {expandedActivityPack.steps.map((step, idx) => (
                                <li key={`${expandedActivity.activityId}-dialog-step-${idx}`} className="flex gap-4">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold flex items-center justify-center border border-indigo-100 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span className="text-slate-700 leading-relaxed font-medium">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                          <Icon icon="lucide:package" className="h-5 w-5 text-indigo-500" />
                          <h5 className="font-bold text-slate-800">Materials</h5>
                        </div>
                        <div className="p-6">
                          <ul className="space-y-3">
                            {expandedActivityPack.materials.map((material, idx) => (
                              <li key={`${expandedActivity.activityId}-dialog-material-${idx}`} className="flex items-start gap-3 text-sm text-slate-600">
                                <Icon icon="lucide:check" className="w-4 h-4 text-emerald-500 mt-0.5" />
                                {material}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                          <Icon icon="lucide:lightbulb" className="h-5 w-5 text-amber-500" />
                          <h5 className="font-bold text-slate-800">Tips</h5>
                        </div>
                        <div className="p-6">
                          <ul className="space-y-3">
                            {expandedActivityPack.tips.map((tip, idx) => (
                              <li key={`${expandedActivity.activityId}-dialog-tip-${idx}`} className="flex items-start gap-3 text-sm text-slate-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Examples Section */}
                    {isRegularActivity(expandedActivity.activity) && expandedActivity.activity.example && (
                      <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                          <Icon icon="lucide:quote" className="w-16 h-16 text-indigo-600" />
                        </div>
                        <h5 className="text-sm font-bold uppercase tracking-wider text-indigo-700 mb-3">Example</h5>
                        <p className="italic text-slate-800 text-lg leading-relaxed relative z-10">
                          "{expandedActivity.activity.example}"
                        </p>
                      </div>
                    )}

                    {/* Teacher Notes Section */}
                    {showTeacherNotes && (
                      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                          <Icon icon="lucide:award" className="w-16 h-16 text-amber-600" />
                        </div>
                        <h5 className="text-sm font-bold uppercase tracking-wider text-amber-700 mb-3">Teacher's Notes</h5>
                        <p className="text-slate-800 leading-relaxed font-medium relative z-10">
                          {expandedActivity.activity.teacherNote}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Resource Links Section */}
                  {(() => {
                    const act = expandedActivity.activity as any
                    if (!act.links || act.links.length === 0) return null
                    return (
                      <div className="pt-6 border-t border-slate-100">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                          <Icon icon="lucide:link-2" className="w-4 h-4" />
                          Resources
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {act.links.map((link: ResourceLink, i: number) => (
                            <a
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`group flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md ${
                                link.type === 'video' ? 'bg-rose-50 border-rose-100 hover:border-rose-200' :
                                link.type === 'audio' ? 'bg-purple-50 border-purple-100 hover:border-purple-200' :
                                link.type === 'worksheet' ? 'bg-blue-50 border-blue-100 hover:border-blue-200' :
                                link.type === 'images' ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-200' :
                                'bg-slate-50 border-slate-100 hover:border-slate-200'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${
                                link.type === 'video' ? 'bg-rose-500 text-white' :
                                link.type === 'audio' ? 'bg-purple-500 text-white' :
                                link.type === 'worksheet' ? 'bg-blue-500 text-white' :
                                link.type === 'images' ? 'bg-emerald-500 text-white' :
                                'bg-slate-500 text-white'
                              }`}>
                                <Icon icon={
                                  link.type === 'video' ? 'lucide:play-circle' :
                                  link.type === 'audio' ? 'lucide:headphones' :
                                  link.type === 'worksheet' ? 'lucide:file-text' :
                                  link.type === 'images' ? 'lucide:image' :
                                  'lucide:external-link'
                                } className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold truncate ${
                                  link.type === 'video' ? 'text-rose-900' :
                                  link.type === 'audio' ? 'text-purple-900' :
                                  link.type === 'worksheet' ? 'text-blue-900' :
                                  link.type === 'images' ? 'text-emerald-900' :
                                  'text-slate-900'
                                }`}>{link.label}</p>
                                <p className="text-[10px] font-medium opacity-60 uppercase tracking-tighter">Click to launch resource</p>
                              </div>
                              <Icon icon="lucide:arrow-up-right" className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
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
