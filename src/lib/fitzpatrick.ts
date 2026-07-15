export interface SkinType {
  type: number;
  label: string;
  description: string;
  baseMinutes: number;
  color: string;
}

export const SKIN_TYPES: SkinType[] = [
  {
    type: 1,
    label: "Type I",
    description: "Very fair, always burns and never tans",
    baseMinutes: 67,
    color: "#FDEBD0",
  },
  {
    type: 2,
    label: "Type II",
    description: "Fair, burns easily and tans minimally",
    baseMinutes: 100,
    color: "#F5CBA7",
  },
  {
    type: 3,
    label: "Type III",
    description: "Medium, burns moderately and tans gradually",
    baseMinutes: 133,
    color: "#E0B084",
  },
  {
    type: 4,
    label: "Type IV",
    description: "Olive, burns minimally and tans well",
    baseMinutes: 167,
    color: "#C68E5B",
  },
  {
    type: 5,
    label: "Type V",
    description: "Brown, rarely burns and tans darkly",
    baseMinutes: 200,
    color: "#8D6E4C",
  },
  {
    type: 6,
    label: "Type VI",
    description: "Dark brown or black, never burns",
    baseMinutes: 233,
    color: "#5C4033",
  },
];
