export type BoardType = "frontend" | "backend";

export const isBoardType = (type: any): type is BoardType => {
  return type === "backend" || type === "frontend";
};
