import { AIService, AIContext, AIResponse, AITool } from './types';
import { IntentParser } from './IntentParser';
import { HardwareService } from '../hardware/HardwareService';

export class MockAIService implements AIService {
  private tools: Map<string, AITool> = new Map();

  constructor() {
    this.registerBuiltinTools();
  }

  registerTool(tool: AITool): void {
    this.tools.set(tool.name, tool);
  }

  private registerBuiltinTools(): void {
    // 1. getCurrentTime
    this.registerTool({
      name: 'getCurrentTime',
      description: 'Get the current local time and date',
      parameters: {},
      execute: () => ({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
      }),
    });

    // 2. getTodaySchedule
    this.registerTool({
      name: 'getTodaySchedule',
      description: 'Get all scheduled study blocks and exams for today',
      parameters: {},
      execute: (_, context) => {
        return context.schedule.map((s) => ({
          time: `${s.startTime} - ${s.endTime}`,
          title: s.title,
          topic: s.topicName,
          status: s.status,
          priority: s.priority,
        }));
      },
    });

    // 3. getUpcomingExams
    this.registerTool({
      name: 'getUpcomingExams',
      description: 'Get list of upcoming exams and days remaining',
      parameters: {},
      execute: (_, context) => {
        return context.exams.map((ex) => {
          const days = Math.max(0, Math.ceil((new Date(ex.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          return {
            title: ex.title,
            examDate: ex.examDate,
            daysRemaining: days,
            targetScore: `${ex.targetScore}%`,
            priority: ex.priority,
          };
        });
      },
    });

    // 4. getTasks
    this.registerTool({
      name: 'getTasks',
      description: 'Retrieve pending or urgent study tasks',
      parameters: { filter: 'TODO | ALL' },
      execute: (args, context) => {
        const list = args.filter === 'ALL' ? context.tasks : context.tasks.filter((t) => t.status !== 'COMPLETED');
        return list.map((t) => ({
          id: t.id,
          title: t.title,
          priority: t.priority,
          dueDate: t.dueDate,
          status: t.status,
        }));
      },
    });

    // 5. createTask
    this.registerTool({
      name: 'createTask',
      description: 'Create a new study task or homework item',
      parameters: { title: 'string', subjectId: 'string', priority: 'string' },
      execute: (args, _, stateMutators) => {
        if (stateMutators?.addTask) {
          const newTask = stateMutators.addTask(args.title, args.subjectId || 'sub-phys', args.priority || 'HIGH');
          return { success: true, createdTask: newTask };
        }
        return { success: false, message: 'State mutator not available' };
      },
    });

    // 6. getStudyHistory
    this.registerTool({
      name: 'getStudyHistory',
      description: 'Get record of recent study sessions',
      parameters: {},
      execute: (_, context) => {
        const totalMinutes = context.sessions
          .filter((s) => s.status === 'COMPLETED')
          .reduce((a, b) => a + (b.actualMinutes || b.durationMinutes), 0);
        return {
          totalCompletedSessions: context.sessions.length,
          totalStudyMinutes: totalMinutes,
          recentSessions: context.sessions.slice(-3),
        };
      },
    });
  }

  async processMessage(userPrompt: string, context: AIContext, stateMutators: any): Promise<AIResponse> {
    // 1. Notify Hardware of Thinking State
    HardwareService.setProcessing(true);

    // Simulate realistic AI deliberation / tool calling delay (400ms)
    await new Promise((resolve) => setTimeout(resolve, 450));

    const parsed = IntentParser.parse(userPrompt);
    const executedTools: { name: string; args: any; result: any }[] = [];

    let responseMessage = '';
    let actionTriggered: AIResponse['actionTriggered'] = undefined;

    switch (parsed.intent) {
      case 'GET_NEXT_OR_RECOMMENDED': {
        const scheduleTool = this.tools.get('getTodaySchedule');
        const examTool = this.tools.get('getUpcomingExams');
        const schedData = scheduleTool?.execute({}, context, stateMutators);
        const examData = examTool?.execute({}, context, stateMutators);

        executedTools.push(
          { name: 'getTodaySchedule', args: {}, result: schedData },
          { name: 'getUpcomingExams', args: {}, result: examData }
        );

        const nextSession = context.schedule.find((s) => s.status === 'UPCOMING' || s.status === 'CURRENT');
        if (nextSession) {
          responseMessage = `Your next scheduled activity is **${nextSession.title}** (${nextSession.topicName}) at **${nextSession.startTime}**.\n\n` +
            `* **Priority:** ${nextSession.priority}\n` +
            `* **Upcoming Exam Alert:** Physics Midterm is in **6 days**.\n\n` +
            `💡 *Recommendation:* I suggest initiating a **45-minute focused study session** on Gauss's Law to solidify your weakest electrostatics concepts before the afternoon block.`;
        } else {
          responseMessage = `You have completed all scheduled blocks for today! I recommend a light 20-minute active recall quiz or relaxing to consolidate your memory.`;
        }
        break;
      }

      case 'GET_TODAY_SCHEDULE': {
        const scheduleTool = this.tools.get('getTodaySchedule');
        const schedData = scheduleTool?.execute({}, context, stateMutators);
        executedTools.push({ name: 'getTodaySchedule', args: {}, result: schedData });

        const itemsFormatted = context.schedule
          .map((s) => `- **${s.startTime} - ${s.endTime}** [${s.status}]: ${s.title} (${s.topicName})`)
          .join('\n');

        responseMessage = `Here is your full itinerary for today:\n\n${itemsFormatted}\n\n` +
          `Your highest priority block is **Electrostatics Deep Dive** at 10:30 AM.`;
        break;
      }

      case 'GET_EVENING_PLAN': {
        const eveningItems = context.schedule.filter((s) => s.timeOfDay === 'EVENING');
        const itemsFormatted = eveningItems
          .map((s) => `- **${s.startTime} - ${s.endTime}**: ${s.title} (${s.type})`)
          .join('\n');

        responseMessage = `Here is your planned evening routine:\n\n${itemsFormatted || 'No specific evening items yet.'}\n\n` +
          `Would you like me to reserve 20:00 for a CS Data Structures quiz?`;
        break;
      }

      case 'START_FOCUS_SESSION': {
        const { duration, subjectId, topicName } = parsed.extractedArgs;
        const sub = context.subjects.find((s) => s.id === subjectId) || context.subjects[0];
        
        executedTools.push({
          name: 'startFocusSession',
          args: { duration, subject: sub.name, topic: topicName },
          result: { status: 'SESSION_INITIALIZED', targetSeconds: duration * 60 },
        });

        if (stateMutators?.startFocusTimer) {
          stateMutators.startFocusTimer(duration, sub.id, topicName);
        }

        actionTriggered = {
          type: 'START_FOCUS',
          payload: { duration, subjectId: sub.id, topicName },
        };

        responseMessage = `Initiating a **${duration}-minute focused study block** for **${sub.name}** (${topicName}).\n\n` +
          `* Simulated OLED screen updated to **STUDY MODE**.\n` +
          `* Green Focus LED activated.\n\n` +
          `Let's minimize distractions and maximize deep work.`;
        break;
      }

      case 'START_QUIZ': {
        const { subjectId } = parsed.extractedArgs;
        const sub = context.subjects.find((s) => s.id === subjectId) || context.subjects[0];

        executedTools.push({
          name: 'createQuiz',
          args: { subjectId: sub.id },
          result: { questionsPrepared: 5, difficulty: 'ADAPTIVE' },
        });

        actionTriggered = {
          type: 'OPEN_QUIZ',
          payload: { subjectId: sub.id },
        };

        responseMessage = `Preparing an adaptive study quiz for **${sub.name}**.\n\n` +
          `Questions will assess conceptual understanding, formula derivations, and weak areas. Ready when you are!`;
        break;
      }

      case 'GET_STUDY_HISTORY': {
        const histTool = this.tools.get('getStudyHistory');
        const histData = histTool?.execute({}, context, stateMutators);
        executedTools.push({ name: 'getStudyHistory', args: {}, result: histData });

        const totalMinutes = context.sessions
          .filter((s) => s.status === 'COMPLETED')
          .reduce((a, b) => a + (b.actualMinutes || b.durationMinutes), 0);

        responseMessage = `📊 **Study Analytics Summary:**\n\n` +
          `- **Total Study Logged:** ${Math.round(totalMinutes / 60 * 10) / 10} hours (${totalMinutes} mins)\n` +
          `- **Completed Sessions:** ${context.sessions.length} sessions\n` +
          `- **Top Subject:** Physics (${context.subjects.find(s => s.id === 'sub-phys')?.totalStudyMinutes || 480} mins)\n\n` +
          `You are maintaining an optimal learning pace this week.`;
        break;
      }

      case 'GET_TASKS': {
        const tasksTool = this.tools.get('getTasks');
        const taskData = tasksTool?.execute({ filter: 'TODO' }, context, stateMutators);
        executedTools.push({ name: 'getTasks', args: { filter: 'TODO' }, result: taskData });

        const pending = context.tasks.filter((t) => t.status !== 'COMPLETED');
        const tasksList = pending
          .map((t) => `- [**${t.priority}**] ${t.title} *(Due: ${t.dueDate})*`)
          .join('\n');

        responseMessage = `You have **${pending.length} pending tasks**:\n\n${tasksList}\n\n` +
          `I recommend tackling *${pending[0]?.title || 'the top item'}* first.`;
        break;
      }

      case 'GET_UPCOMING_EXAMS': {
        const examsTool = this.tools.get('getUpcomingExams');
        const examsData = examsTool?.execute({}, context, stateMutators);
        executedTools.push({ name: 'getUpcomingExams', args: {}, result: examsData });

        const examsList = context.exams
          .map((e) => {
            const days = Math.max(0, Math.ceil((new Date(e.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
            return `- **${e.title}**: **${days} days remaining** (Target Score: ${e.targetScore}%)`;
          })
          .join('\n');

        responseMessage = `📅 **Upcoming Examination Schedule:**\n\n${examsList}\n\n` +
          `Your highest-priority exam is Physics in 6 days. Daily revision is highly recommended.`;
        break;
      }

      case 'EXPLAIN_CONCEPT': {
        const q = userPrompt.toLowerCase();
        if (q.includes('newton')) {
          responseMessage = `### Newton's Three Laws of Motion\n\n` +
            `1. **First Law (Law of Inertia):** An object continues in its state of rest, or in uniform motion in a straight line, unless acted upon by a net external force: $\\sum \\mathbf{F} = 0 \\implies \\mathbf{v} = \\text{const}$.\n` +
            `2. **Second Law (Fundamental Equation):** The acceleration of an object is directly proportional to the net force and inversely proportional to its mass: $\\mathbf{F} = \\frac{d\\mathbf{p}}{dt} = m\\mathbf{a}$.\n` +
            `3. **Third Law (Action-Reaction):** When body A exerts force $\\mathbf{F}_{AB}$ on body B, body B simultaneously exerts an equal and opposite force $\\mathbf{F}_{BA} = -\\mathbf{F}_{AB}$.`;
        } else if (q.includes('gauss') || q.includes('electrostatics')) {
          responseMessage = `### Gauss's Law in Electrostatics\n\n` +
            `Gauss's law relates the electric flux through a closed hypothetical Gaussian surface to the enclosed net electric charge:\n\n` +
            `$$\\Phi_E = \\oint_{\\mathcal{S}} \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{\\text{enc}}}{\\varepsilon_0}$$\n\n` +
            `* **Key Application Steps:**\n` +
            `  1. Choose a surface with spatial symmetry (spherical, cylindrical, or planar).\n` +
            `  2. Factor $|\\mathbf{E}|$ out of the integral where $\\mathbf{E}$ is perpendicular to $d\\mathbf{A}$.\n` +
            `  3. Calculate $Q_{\\text{enc}}$ inside your Gaussian boundary.`;
        } else if (q.includes('avl') || q.includes('tree')) {
          responseMessage = `### AVL Trees & Self-Balancing Mechanisms\n\n` +
            `An **AVL Tree** is a height-balanced Binary Search Tree where for every node:\n\n` +
            `$$\\text{Balance Factor } BF(node) = \\text{Height}(Left) - \\text{Height}(Right) \\in \\{-1, 0, +1\\}$$\n\n` +
            `* **Rebalancing Rotations:**\n` +
            `  - **Left-Left (LL):** Single right rotation on root.\n` +
            `  - **Right-Right (RR):** Single left rotation on root.\n` +
            `  - **Left-Right (LR):** Left rotation on child $\\rightarrow$ Right rotation on root.\n` +
            `  - **Right-Left (RL):** Right rotation on child $\\rightarrow$ Left rotation on root.`;
        } else {
          responseMessage = `I can provide full step-by-step mathematical proofs, conceptual derivations, and study flashcards for any topic in **Physics**, **Mathematics**, **Chemistry**, or **Computer Science**. What specific theorem or problem would you like to explore?`;
        }
        break;
      }

      default: {
        responseMessage = `I am at your service. You can ask me to inspect your schedule, start a focused study session, create study tasks, quiz you on specific subjects, or explain complex formulas.`;
        break;
      }
    }

    // 2. Return Hardware to Ready / Idle
    HardwareService.setProcessing(false);

    return {
      message: responseMessage,
      intent: parsed.intent,
      toolCalls: executedTools,
      actionTriggered,
    };
  }
}
