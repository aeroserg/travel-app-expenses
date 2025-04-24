export interface Group {
  _id: string; // Уникальный идентификатор группы
  name: string; // Название группы (например, "Поездка в Турцию")
  code: string; // Код для приглашения (например, "TUR123")
  members: { _id: string; name: string; [key: string]: string }[]; // Список ID участников группы
  createdAt: string; // Дата создания группы (ISO строка)
}
