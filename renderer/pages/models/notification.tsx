export default class Notification {
  notificationId: string;
  employeeId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;

  constructor(
    notificationId: string,
    employeeId: string,
    title: string,
    message: string,
    isRead: boolean,
    createdAt: Date
  ) {
    this.notificationId = notificationId;
    this.employeeId = employeeId;
    this.title = title;
    this.message = message;
    this.isRead = isRead;
    this.createdAt = createdAt;
  }

  insert(): boolean {
    return false;
  }
}
