export interface Stat {
  num: string;
  label: string;
}

export interface SkillGroup {
  group: string;
  tags: string[];
  featured?: string[];
}

export interface Experience {
  date: string;
  company: string;
  role: string;
  description: string;
  tags: string[];
}

export interface ProjectVisualLine {
  label: string;
  value: string;
}

export interface Project {
  num: string;
  title: string;
  description: string[];
  tags: string[];
  linkLabel?: string;
  link?: string;
  featured?: boolean;
  visual?: ProjectVisualLine[];
}
