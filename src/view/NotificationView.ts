import { injectable } from 'inversify';

@injectable()
export class NotificationView {
  public render(team: string[]) {
    return `
⏰ *Now on duty:*
${team.map((member) => `    👤 ${member}`).join('\n')}
    `;
  }
}
