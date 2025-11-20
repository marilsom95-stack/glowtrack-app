import { NextRequest, NextResponse } from 'next/server';

type ChecklistItem = {
  id: string;
  label: string;
  completed?: boolean;
  progress?: number;
};

type TimelineEntry = {
  title: string;
  time?: string;
  description?: string;
};

type WellbeingState = {
  glowScore: number;
  checklist: ChecklistItem[];
  timeline: TimelineEntry[];
};

const defaultState: WellbeingState = {
  glowScore: 78,
  checklist: [
    { id: 'hydration', label: 'Hidratação diária', progress: 68, completed: false },
    { id: 'facial-exercises', label: 'Exercícios faciais', completed: false },
    { id: 'self-esteem', label: 'Autoestima', completed: false },
    { id: 'breathing', label: 'Respiração', completed: false },
    { id: 'mindfulness', label: 'Mindfulness', completed: false },
  ],
  timeline: [
    { title: 'Glow matinal', time: '08:00', description: 'Hidratação + respiração 4-7-8' },
    { title: 'Alongar & sorrir', time: '13:00', description: 'Exercícios faciais rápidos' },
    { title: 'Momento mindful', time: '18:30', description: '5 minutos de atenção plena' },
  ],
};

let wellbeingState: WellbeingState = { ...defaultState };

export async function GET() {
  return NextResponse.json({ data: wellbeingState });
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = await request.json();

    if (Array.isArray(payload.checklist)) {
      wellbeingState = {
        ...wellbeingState,
        checklist: payload.checklist.map((item: ChecklistItem) => ({
          ...item,
          completed: Boolean(item.completed),
        })),
      };
    }

    if (typeof payload.glowScore === 'number') {
      wellbeingState.glowScore = payload.glowScore;
    }

    if (Array.isArray(payload.timeline)) {
      wellbeingState.timeline = payload.timeline;
    }

    return NextResponse.json({ data: wellbeingState });
  } catch (error) {
    console.error('Failed to update wellbeing state', error);
    return NextResponse.json({ error: 'Unable to update wellbeing data' }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  return PATCH(request);
}
