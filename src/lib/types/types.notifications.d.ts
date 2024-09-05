export interface INotificationsConfigSection
{
  title: string;
  type: "general" | "push" | "mail";
  options: {
    id: number;
    label: string;
    checked: boolean;
  }[];
}