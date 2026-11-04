import type { CircularCarouselItem } from './CircularCarousel';

export interface WorkProject extends CircularCarouselItem {
  title: string;
  category: string;
  description: string;
}

const entries = [
  ['Form / Field', 'Visual identity · Digital experience', 'An independent creative direction where natural imagery meets bold typography. A study in turning loose ideas into a distinct digital identity.'],
  ['Element', 'Art direction · Web design', 'An architectural approach to a digital experience. Strong imagery, considered space and confident type bring a different perspective into focus.'],
  ['Studio North', 'Brand expression · Digital design', 'A new point of view, shaped into a memorable online presence. An expressive visual language with people and their stories at its center.'],
  ['Objects', 'Editorial design · Digital experience', 'A considered space for the objects of tomorrow. Editorial typography and a quiet composition give every detail room to be discovered.'],
  ['New Culture', 'Creative direction · Web design', 'Culture in the making. An evolving visual exploration of new ideas, using a clear layout and oversized typography to frame what comes next.'],
  ['In Motion', 'Art direction · Brand experience', 'A new wave of imagination. Color, expressive imagery and fluid composition come together in a digital experience with a sense of movement.'],
  ['Everyday / Future', 'Digital design · Visual storytelling', 'Finding possibility in the everyday. A cinematic visual direction that connects familiar places with a fresh perspective on the future.'],
  ['Beyond', 'Brand direction · Digital experience', 'A creative expression built around going beyond the expected. Bold contrasts and a simple structure let an individual point of view lead the experience.'],
];

export const workProjects: WorkProject[] = entries.map(([title, category, description], index) => ({
  title, category, description, src: `/images/work-preview-${index + 1}.png`, alt: `${title} project preview`,
}));
