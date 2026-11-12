// Sample editorial content for MW Futuretech; replace with approved announcements.
export const journalStories = [
  {
    id: 'new-digital-experience', category: 'News', label: 'Company update',
    title: 'A new digital chapter for MW Futuretech',
    summary: 'Discover our refreshed digital experience, bringing our projects, ideas and capabilities into one connected space.',
    date: '2026-10-28', dateLabel: '28 October 2026',
    image: '/images/work-preview-1.png', imageAlt: 'A visual from the MW Futuretech project showcase',
    paragraphs: [
      'MW Futuretech introduces a refreshed digital experience designed to bring our work and our thinking closer to the people we collaborate with.',
      'The new project showcase offers a closer look at our creative approach, combining visual storytelling with an intuitive way to explore individual projects.',
      'This marks a new chapter in how we share ideas, celebrate our work and connect with clients, collaborators and curious minds.',
    ], link: '/', action: 'Explore our work',
  },
  {
    id: 'ideas-into-impact', category: 'News', label: 'Inside MW Futuretech',
    title: 'Turning ideas into meaningful digital experiences',
    summary: 'A look at how our team brings design, technology and human understanding together throughout the creative process.',
    date: '2026-10-24', dateLabel: '24 October 2026',
    image: '/images/photo-7.jpg', imageAlt: 'Architectural forms illustrating design and technology',
    paragraphs: [
      'At MW Futuretech, every project begins with understanding the people it is being created for. That perspective guides our approach to design and technology.',
      'Our teams bring research, creative exploration and technical thinking together to move an idea from an early possibility into a considered digital experience.',
      'Through our organisation updates, we will share more of the ideas, processes and collaborations that shape our work.',
    ], link: '/lets-talk', action: 'Connect with our team',
  },
  {
    id: 'mw-open-house', category: 'Events', label: 'Upcoming event',
    title: 'MW Futuretech Design & Technology Open House',
    summary: 'Join our team for project walkthroughs, fresh perspectives and an open conversation about the future of digital experiences.',
    date: '2026-11-20', dateLabel: '20 November 2026',
    image: '', imageAlt: 'MW Futuretech Design and Technology Open House, 20 November 2026',
    paragraphs: [
      'Meet the people and thinking behind MW Futuretech at our Design & Technology Open House, an online session bringing together our team, collaborators and curious minds.',
      'The session will include selected project walkthroughs, a look at our creative process and a conversation about how design and technology can create more meaningful experiences.',
      'Date: 20 November 2026. Format: online. Session time and joining details will be announced. Contact our team to express your interest.',
    ], link: '/lets-talk', action: 'Enquire about this event',
  },
  {
    id: 'creative-toolkit', category: 'News', label: 'Innovation',
    title: 'Exploring the next generation of creative tools',
    summary: 'MW Futuretech explores new ways to bring imagination, emerging technology and thoughtful design into everyday creative work.',
    date: '2026-10-22', dateLabel: '22 October 2026',
    image: '/images/work-preview-7.png', imageAlt: 'MW Futuretech creative technology project visual',
    paragraphs: [
      'MW Futuretech is exploring a new generation of creative tools, with a focus on how emerging technology can support clear thinking and expressive digital work.',
      'Our approach starts with experimentation: trying new workflows, sharing what we learn and considering how each tool can make a meaningful contribution to a project.',
      'We will continue sharing perspectives and experiments from the team as these ideas develop.',
    ], link: '/lets-talk', action: 'Explore a collaboration',
  },
  {
    id: 'creative-sessions', category: 'Events', label: 'Upcoming workshop',
    title: 'MW Futuretech Creative Sessions',
    summary: 'An interactive online session for curious minds, exploring how ideas become digital experiences through design and technology.',
    date: '2026-12-04', dateLabel: '4 December 2026',
    image: '', imageAlt: 'MW Futuretech Creative Sessions, 4 December 2026', coverTitle: 'CREATIVE\nSESSIONS.',
    paragraphs: [
      'Creative Sessions is a workshop concept from MW Futuretech, bringing our team and collaborators together to explore an idea from first sketch to digital expression.',
      'The online session will include a practical creative exercise, discussion of different approaches and time for questions. It is designed to encourage participation and shared thinking.',
      'Date: 4 December 2026. Format: online. Session time and joining details will be announced. Contact our team to express your interest.',
    ], link: '/lets-talk', action: 'Enquire about the workshop',
  },
  {
    id: 'collaboration-first', category: 'News', label: 'Our people',
    title: 'Better ideas begin with collaboration',
    summary: 'Inside the conversations and shared perspectives that help shape MW Futuretech’s approach to creating purposeful digital work.',
    date: '2026-10-18', dateLabel: '18 October 2026',
    image: '/images/work-preview-8.png', imageAlt: 'Creative direction from the MW Futuretech project collection',
    paragraphs: [
      'Collaboration is an important part of how MW Futuretech approaches creative work. Different perspectives help reveal new possibilities and challenge early assumptions.',
      'From conversations with collaborators to shared reviews within the team, we make room for ideas to evolve throughout the process.',
      'These exchanges help bring design and technology into a more thoughtful relationship with the people an experience is created for.',
    ], link: '/lets-talk', action: 'Start a conversation',
  },
];
export const filterJournal = (category) => journalStories.filter(story => category === 'All' || story.category === category);
