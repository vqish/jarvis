import { 
  Subject, 
  Topic, 
  ScheduleItem, 
  Task, 
  Exam, 
  StudySession, 
  QuizQuestion, 
  Note, 
  UserSettings 
} from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-phys',
    name: 'Physics',
    code: 'PHYS-101',
    color: '#06b6d4', // Cyan
    iconName: 'Atom',
    totalStudyMinutes: 480,
  },
  {
    id: 'sub-math',
    name: 'Mathematics',
    code: 'MATH-201',
    color: '#3b82f6', // Blue
    iconName: 'Sigma',
    totalStudyMinutes: 620,
  },
  {
    id: 'sub-chem',
    name: 'Chemistry',
    code: 'CHEM-102',
    color: '#10b981', // Emerald
    iconName: 'FlaskConical',
    totalStudyMinutes: 340,
  },
  {
    id: 'sub-cs',
    name: 'Computer Science',
    code: 'CS-301',
    color: '#8b5cf6', // Violet
    iconName: 'Cpu',
    totalStudyMinutes: 510,
  },
];

export const INITIAL_TOPICS: Topic[] = [
  { id: 'top-1', subjectId: 'sub-phys', name: 'Electrostatics & Coulomb Law', masteryLevel: 68, isWeakArea: true },
  { id: 'top-2', subjectId: 'sub-phys', name: 'Classical Mechanics & Newton Laws', masteryLevel: 88, isWeakArea: false },
  { id: 'top-3', subjectId: 'sub-phys', name: 'Thermodynamics & Heat Cycles', masteryLevel: 55, isWeakArea: true },
  { id: 'top-4', subjectId: 'sub-math', name: 'Differential Calculus & Limits', masteryLevel: 92, isWeakArea: false },
  { id: 'top-5', subjectId: 'sub-math', name: 'Multivariable Integration', masteryLevel: 72, isWeakArea: false },
  { id: 'top-6', subjectId: 'sub-math', name: 'Linear Algebra & Eigenvalues', masteryLevel: 64, isWeakArea: true },
  { id: 'top-7', subjectId: 'sub-chem', name: 'Organic Reaction Mechanisms', masteryLevel: 60, isWeakArea: true },
  { id: 'top-8', subjectId: 'sub-chem', name: 'Chemical Kinetics & Equilibrium', masteryLevel: 84, isWeakArea: false },
  { id: 'top-9', subjectId: 'sub-cs', name: 'Binary Trees & AVL Balancing', masteryLevel: 94, isWeakArea: false },
  { id: 'top-10', subjectId: 'sub-cs', name: 'Dynamic Programming & Memoization', masteryLevel: 76, isWeakArea: false },
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch-1',
    title: 'Differential Calculus Review',
    subjectId: 'sub-math',
    topicName: 'Differential Calculus & Limits',
    startTime: '09:00',
    endTime: '10:00',
    date: new Date().toISOString().split('T')[0],
    timeOfDay: 'MORNING',
    type: 'STUDY',
    priority: 'HIGH',
    status: 'COMPLETED',
    notes: 'Completed practice set 2 with 95% accuracy.',
  },
  {
    id: 'sch-2',
    title: 'Electrostatics Deep Dive',
    subjectId: 'sub-phys',
    topicName: 'Electrostatics & Coulomb Law',
    startTime: '10:30',
    endTime: '11:15',
    date: new Date().toISOString().split('T')[0],
    timeOfDay: 'MORNING',
    type: 'STUDY',
    priority: 'URGENT',
    status: 'UPCOMING',
    notes: 'Focus on Gauss Law boundary conditions and flux calculation.',
  },
  {
    id: 'sch-3',
    title: 'Organic Chemistry Synthesis',
    subjectId: 'sub-chem',
    topicName: 'Organic Reaction Mechanisms',
    startTime: '14:00',
    endTime: '15:00',
    date: new Date().toISOString().split('T')[0],
    timeOfDay: 'AFTERNOON',
    type: 'STUDY',
    priority: 'MEDIUM',
    status: 'UPCOMING',
    notes: 'Review carbonyl group reactions and Grignard reagents.',
  },
  {
    id: 'sch-4',
    title: 'Mechanics Formula Revision',
    subjectId: 'sub-phys',
    topicName: 'Classical Mechanics & Newton Laws',
    startTime: '17:00',
    endTime: '18:00',
    date: new Date().toISOString().split('T')[0],
    timeOfDay: 'EVENING',
    type: 'REVISION',
    priority: 'HIGH',
    status: 'UPCOMING',
    notes: 'Quick active recall and 10 past exam questions.',
  },
  {
    id: 'sch-5',
    title: 'Data Structures Mastery Quiz',
    subjectId: 'sub-cs',
    topicName: 'Binary Trees & AVL Balancing',
    startTime: '20:00',
    endTime: '20:45',
    date: new Date().toISOString().split('T')[0],
    timeOfDay: 'EVENING',
    type: 'QUIZ',
    priority: 'MEDIUM',
    status: 'UPCOMING',
    notes: '15 questions timed quiz on tree rotations.',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-1',
    title: 'Complete Electrostatics Problem Set #4',
    description: 'Solve problems 12 through 28 from Halliday & Resnick Chapter 22 on Gauss Law.',
    subjectId: 'sub-phys',
    priority: 'URGENT',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    status: 'TODO',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk-2',
    title: 'Prove Mean Value Theorem & Cauchy Variation',
    description: 'Write out rigorous mathematical proofs with step-by-step epsilon-delta conditions.',
    subjectId: 'sub-math',
    priority: 'HIGH',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    status: 'IN_PROGRESS',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk-3',
    title: 'Summarize SN1 vs SN2 Reaction Kinetics',
    description: 'Create a comparative study sheet including solvent effects and stereochemistry inversion.',
    subjectId: 'sub-chem',
    priority: 'MEDIUM',
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    status: 'TODO',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk-4',
    title: 'Implement Red-Black Tree in TypeScript/C++',
    description: 'Code the balancing rotations and write unit tests for node insertion and deletion cases.',
    subjectId: 'sub-cs',
    priority: 'LOW',
    dueDate: new Date(Date.now() + 432000000).toISOString().split('T')[0],
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'ex-1',
    subjectId: 'sub-phys',
    title: 'Physics Midterm: Electrostatics & Magnetism',
    examDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    priority: 'URGENT',
    targetScore: 92,
    topicsCovered: ['Electrostatics', 'Coulomb Law', 'Electric Potential', 'Capacitance'],
  },
  {
    id: 'ex-2',
    subjectId: 'sub-math',
    title: 'Advanced Calculus Final Examination',
    examDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    priority: 'HIGH',
    targetScore: 95,
    topicsCovered: ['Limits', 'Derivatives', 'Multiple Integrals', 'Taylor Series'],
  },
  {
    id: 'ex-3',
    subjectId: 'sub-cs',
    title: 'Algorithms & Data Structures Practical Exam',
    examDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
    priority: 'MEDIUM',
    targetScore: 98,
    topicsCovered: ['AVL Trees', 'Dynamic Programming', 'Graph Theory', 'Dijkstra'],
  },
];

export const INITIAL_SESSIONS: StudySession[] = [
  {
    id: 'sess-1',
    subjectId: 'sub-math',
    topicName: 'Differential Calculus & Limits',
    durationMinutes: 45,
    actualMinutes: 45,
    startTime: '09:00',
    endTime: '09:45',
    date: new Date().toISOString().split('T')[0],
    status: 'COMPLETED',
    notes: 'Completed 15 calculus problems on L Hopital rule.',
  },
  {
    id: 'sess-2',
    subjectId: 'sub-phys',
    topicName: 'Classical Mechanics & Newton Laws',
    durationMinutes: 50,
    actualMinutes: 50,
    startTime: '16:00',
    endTime: '16:50',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    status: 'COMPLETED',
    notes: 'Rotational dynamics and torque calculation review.',
  },
  {
    id: 'sess-3',
    subjectId: 'sub-cs',
    topicName: 'Binary Trees & AVL Balancing',
    durationMinutes: 60,
    actualMinutes: 60,
    startTime: '11:00',
    endTime: '12:00',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    status: 'COMPLETED',
    notes: 'Solved 3 tree balance interview questions.',
  },
];

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    subjectId: 'sub-phys',
    topicName: 'Electrostatics & Coulomb Law',
    questionText: 'According to Gauss’s Law, what is the net electric flux through any closed Gaussian surface enclosing a total charge Q?',
    options: [
      'Φ = Q / ε₀',
      'Φ = Q · ε₀',
      'Φ = 4πk · Q²',
      'Φ = 0 regardless of charge',
    ],
    correctOptionIndex: 0,
    explanation: 'Gauss’s Law states that the net outward electric flux through any closed hypothetical surface is equal to 1/ε₀ times the net electric charge enclosed by that surface.',
    difficulty: 'EASY',
  },
  {
    id: 'q-2',
    subjectId: 'sub-phys',
    topicName: 'Electrostatics & Coulomb Law',
    questionText: 'Two point charges +q and +4q are placed a distance L apart. At what distance from +q on the line joining them is the net electric field zero?',
    options: [
      'L / 3',
      'L / 2',
      'L / 4',
      '2L / 3',
    ],
    correctOptionIndex: 0,
    explanation: 'Setting E₁ = E₂ gives k·q/x² = k·4q/(L - x)², so 1/x = 2/(L - x), yielding L - x = 2x => 3x = L => x = L/3.',
    difficulty: 'MEDIUM',
  },
  {
    id: 'q-3',
    subjectId: 'sub-math',
    topicName: 'Differential Calculus & Limits',
    questionText: 'What is the limit of (sin 3x) / (2x) as x approaches 0?',
    options: [
      '3/2',
      '2/3',
      '0',
      '1',
    ],
    correctOptionIndex: 0,
    explanation: 'Using the standard limit lim_{u->0} sin(u)/u = 1, (sin 3x)/(2x) = (3/2) * (sin 3x)/(3x) -> 3/2.',
    difficulty: 'EASY',
  },
  {
    id: 'q-4',
    subjectId: 'sub-cs',
    topicName: 'Binary Trees & AVL Balancing',
    questionText: 'In an AVL tree, what is the maximum permissible difference between heights of left and right subtrees of any node?',
    options: [
      '1',
      '0',
      '2',
      'log(n)',
    ],
    correctOptionIndex: 0,
    explanation: 'An AVL tree is a strictly self-balancing binary search tree where the balance factor of any node is strictly -1, 0, or +1 (height difference at most 1).',
    difficulty: 'EASY',
  },
  {
    id: 'q-5',
    subjectId: 'sub-chem',
    topicName: 'Organic Reaction Mechanisms',
    questionText: 'Which solvent type best facilitates an SN2 nucleophilic substitution reaction?',
    options: [
      'Polar aprotic solvents (e.g., Acetone, DMSO)',
      'Polar protic solvents (e.g., Water, Ethanol)',
      'Non-polar solvents (e.g., Hexane)',
      'Strongly acidic solutions',
    ],
    correctOptionIndex: 0,
    explanation: 'Polar aprotic solvents solvate cations well but leave nucleophilic anions unencumbered (naked nucleophiles), drastically accelerating the bimolecular rate in SN2.',
    difficulty: 'MEDIUM',
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Coulomb Law & Electric Potential Formula Sheet',
    subjectId: 'sub-phys',
    topicName: 'Electrostatics & Coulomb Law',
    content: `# Electrostatics Summary

## 1. Coulomb's Law
$$F = k \\frac{|q_1 q_2|}{r^2} \\quad \\text{where } k = \\frac{1}{4\\pi\\varepsilon_0} \\approx 8.99 \\times 10^9 \\text{ N}\\cdot\\text{m}^2/\\text{C}^2$$

## 2. Electric Field & Potential
- Field due to point charge: $E = \\frac{kq}{r^2} \\hat{r}$
- Electric Potential: $V = \\frac{kq}{r}$
- Relation: $\\mathbf{E} = -\\nabla V$

## Key Tips for Midterm
- Always check symmetry when using **Gauss's Law**: $\\oint \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{\\text{enc}}}{\\varepsilon_0}$.
- Inside a conductor in electrostatic equilibrium, $\\mathbf{E} = 0$.`,
    tags: ['Physics', 'Formulas', 'Midterm-Prep', 'Gauss-Law'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    title: 'Calculus Integration Techniques Cheat Sheet',
    subjectId: 'sub-math',
    topicName: 'Multivariable Integration',
    content: `# Integration Strategies

## Integration by Parts
$$\\int u \\, dv = uv - \\int v \\, du$$
*Use the LIATE rule to choose $u$: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential.*

## Trigonometric Substitutions
- $\\sqrt{a^2 - x^2} \\implies x = a\\sin\\theta$
- $\\sqrt{a^2 + x^2} \\implies x = a\\tan\\theta$
- $\\sqrt{x^2 - a^2} \\implies x = a\\sec\\theta$`,
    tags: ['Math', 'Calculus', 'Techniques'],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-3',
    title: 'AVL Tree Rotation Patterns',
    subjectId: 'sub-cs',
    topicName: 'Binary Trees & AVL Balancing',
    content: `# AVL Tree Balancing

Balance Factor = Height(Left) - Height(Right)
Must stay within $\\{-1, 0, 1\\}$.

### Rotations:
1. **Left-Left (LL)**: Single Right Rotation
2. **Right-Right (RR)**: Single Left Rotation
3. **Left-Right (LR)**: Left rotation on child, then Right rotation on root
4. **Right-Left (RL)**: Right rotation on child, then Left rotation on root`,
    tags: ['CS', 'DataStructures', 'AVL', 'Algorithms'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_SETTINGS: UserSettings = {
  jarvisName: 'JARVIS',
  theme: 'dark',
  defaultFocusDuration: 45,
  defaultBreakDuration: 10,
  dailyGoalHours: 4.5,
  soundEffects: true,
  voiceOutput: false,
  hardwareMode: 'SIMULATOR',
  esp32IpAddress: '192.168.1.142',
  esp32Port: 8080,
};
