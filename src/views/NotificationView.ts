import { injectable } from "inversify";

@injectable()
export class NotificationView {
  public render(team: string[]) {
    return `
\u23F0 *Now on duty:*
${team.map((member) => `    \u{1F464} ${member}`).join("\n")}
        `;
  }
}
