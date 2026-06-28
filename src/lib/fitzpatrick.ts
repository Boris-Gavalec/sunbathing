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
    description: "Very fair — always burns, never tans",
    baseMinutes: 67,
    color: "#FDEBD0",
  },
  {
    type: 2,
    label: "Type II",
    description: "Fair — burns easily, tans minimally",
    baseMinutes: 100,
    color: "#F5CBA7",
  },
  {
    type: 3,
    label: "Type III",
    description: "Medium — burns moderately, tans gradually",
    baseMinutes: 133,
    color: "#E0B084",
  },
  {
    type: 4,
    label: "Type IV",
    description: "Olive — burns minimally, tans well",
    baseMinutes: 167,
    color: "#C68E5B",
  },
  {
    type: 5,
    label: "Type V",
    description: "Brown — rarely burns, tans darkly",
    baseMinutes: 200,
    color: "#8D6E4C",
  },
  {
    type: 6,
    label: "Type VI",
    description: "Dark brown/black — never burns",
    baseMinutes: 233,
    color: "#5C4033",
  },
];
