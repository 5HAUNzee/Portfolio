export type NavItem = {
  label: string;
  href: string;
};

export type HeroStat = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
};

export type SkillCategory = {
  category: string;
  items: string[];
};

export type Project = {
  name: string;
  description: string;
  stack: string[];
  image: string;
  links: {
    live?: string;
    repo?: string;
  };
};

export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
};

export type Award = {
  title: string;
  subtitle: string;
};

export type SocialLink = {
  label: string;
  href: string;
};
