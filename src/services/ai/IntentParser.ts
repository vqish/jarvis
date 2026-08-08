export interface ParsedIntent {
  intent: string;
  confidence: number;
  extractedArgs: Record<string, any>;
}

export class IntentParser {
  static parse(input: string): ParsedIntent {
    const text = input.trim().toLowerCase();

    // 1. Next activity / What to study
    if (
      text.includes('what should i study') ||
      text.includes("what's next") ||
      text.includes('what is next') ||
      text.includes('next session') ||
      text.includes('what do i have') ||
      text.includes('recommend')
    ) {
      return {
        intent: 'GET_NEXT_OR_RECOMMENDED',
        confidence: 0.95,
        extractedArgs: {},
      };
    }

    // 2. Today's schedule / Timetable
    if (
      text.includes('schedule today') ||
      text.includes("what's my schedule") ||
      text.includes('today schedule') ||
      text.includes('timetable') ||
      text.includes('today plan')
    ) {
      return {
        intent: 'GET_TODAY_SCHEDULE',
        confidence: 0.95,
        extractedArgs: {},
      };
    }

    // 3. Evening Plan
    if (text.includes('plan my evening') || text.includes('evening plan') || text.includes('evening schedule')) {
      return {
        intent: 'GET_EVENING_PLAN',
        confidence: 0.92,
        extractedArgs: {},
      };
    }

    // 4. Start focus / study session
    if (text.includes('start') && (text.includes('session') || text.includes('studying') || text.includes('focus') || text.includes('timer'))) {
      let duration = 45;
      if (text.includes('25') || text.includes('pomodoro')) duration = 25;
      if (text.includes('50')) duration = 50;
      if (text.includes('60') || text.includes('1 hour') || text.includes('one hour')) duration = 60;
      if (text.includes('45')) duration = 45;

      let subjectId = 'sub-phys';
      let topicName = 'Electrostatics & Coulomb Law';

      if (text.includes('phys') || text.includes('electrostatics') || text.includes('mechanic')) {
        subjectId = 'sub-phys';
        topicName = 'Electrostatics & Coulomb Law';
      } else if (text.includes('math') || text.includes('calculus') || text.includes('integral')) {
        subjectId = 'sub-math';
        topicName = 'Differential Calculus & Limits';
      } else if (text.includes('chem') || text.includes('organic')) {
        subjectId = 'sub-chem';
        topicName = 'Organic Reaction Mechanisms';
      } else if (text.includes('computer') || text.includes('tree') || text.includes('data structure') || /\bcs\b/.test(text)) {
        subjectId = 'sub-cs';
        topicName = 'Binary Trees & AVL Balancing';
      }

      return {
        intent: 'START_FOCUS_SESSION',
        confidence: 0.9,
        extractedArgs: { duration, subjectId, topicName },
      };
    }

    // 5. Quiz me
    if (text.includes('quiz') || text.includes('test me') || text.includes('ask question')) {
      let subjectId = 'sub-phys';
      if (text.includes('phys')) subjectId = 'sub-phys';
      else if (text.includes('math') || text.includes('calculus')) subjectId = 'sub-math';
      else if (text.includes('chem')) subjectId = 'sub-chem';
      else if (text.includes('computer') || text.includes('data structure') || text.includes('tree') || /\bcs\b/.test(text)) subjectId = 'sub-cs';

      return {
        intent: 'START_QUIZ',
        confidence: 0.95,
        extractedArgs: { subjectId },
      };
    }

    // 6. Study History / Yesterday
    if (text.includes('yesterday') || text.includes('study history') || text.includes('how much did i study') || text.includes('progress')) {
      return {
        intent: 'GET_STUDY_HISTORY',
        confidence: 0.9,
        extractedArgs: {},
      };
    }

    // 7. Tasks / To-dos
    if (text.includes('task') || text.includes('to do') || text.includes('todo') || text.includes('pending work')) {
      return {
        intent: 'GET_TASKS',
        confidence: 0.88,
        extractedArgs: {},
      };
    }

    // 8. Upcoming Exams
    if (text.includes('exam') || text.includes('test') || text.includes('midterm') || text.includes('final')) {
      return {
        intent: 'GET_UPCOMING_EXAMS',
        confidence: 0.9,
        extractedArgs: {},
      };
    }

    // 9. Add or Move schedule item
    if (text.includes('add') && (text.includes('revision') || text.includes('study') || text.includes('session'))) {
      return {
        intent: 'ADD_SCHEDULE_ITEM',
        confidence: 0.85,
        extractedArgs: { rawText: input },
      };
    }

    if (text.includes('move') || text.includes('reschedule')) {
      return {
        intent: 'RESCHEDULE_ITEM',
        confidence: 0.85,
        extractedArgs: { rawText: input },
      };
    }

    // 10. Explain topic / Academic explanation
    if (text.includes('explain') || text.includes('what is') || text.includes('how does') || text.includes('formula')) {
      return {
        intent: 'EXPLAIN_CONCEPT',
        confidence: 0.9,
        extractedArgs: { query: input },
      };
    }

    // Default conversational
    return {
      intent: 'GENERAL_ASSISTANCE',
      confidence: 0.6,
      extractedArgs: { rawText: input },
    };
  }
}
