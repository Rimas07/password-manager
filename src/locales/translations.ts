import type { Lang } from "../contexts/LangContext";

interface StepTranslation {
  title: string;
  desc: string;
  highlight: string | null;
}

export interface Translations {
  // Vault header
  searchPlaceholder: string;
  searchPlaceholderShort: string;
  btnSecurity: string;
  btnSettings: string;
  btnLock: string;
  // Vault stats
  records: string;
  weak: string;
  reused: string;
  // Categories
  categoryAll: string;
  // Sort
  sortLabel: string;
  sortDate: string;
  sortName: string;
  sortStrength: string;
  // Vault content
  nothingFound: string;
  copiedSuffix: string;
  kbNewEntry: string;
  kbLock: string;
  // PasswordCard
  strengthWeak: string;
  strengthFair: string;
  strengthStrong: string;
  loginLabel: string;
  passwordLabel: string;
  ageBadge: string;
  reusedBadge: string;
  deleteConfirm: string;
  deleteTitle: string;
  // EmptyState
  emptyTitle: string;
  emptyDesc: string;
  emptyButton: string;
  // OnboardingModal
  onboardingSkip: string;
  onboardingBack: string;
  onboardingNext: string;
  onboardingStart: string;
  steps: StepTranslation[];
  // LockScreen
  title: string;
  subtitleNew: string;
  subtitleExisting: string;
  placeholder: string;
  placeholderConfirm: string;
  errorMismatch: string;
  errorShort: string;
  errorWrong: string;
  errorGeneric: string;
  loading: string;
  buttonCreate: string;
  buttonUnlock: string;
  // Settings
  settingsTitle: string;
  changeMasterPassword: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  wrongCurrentPassword: string;
  changePasswordError: string;
  passwordChanged: string;
  saving: string;
  changePasswordBtn: string;
  autoLockLabel: string;
  lock5min: string;
  lock15min: string;
  lock30min: string;
  lockNever: string;
  dataTitle: string;
  dataDesc: string;
  downloadBackup: string;
  importFromJSON: string;
  importFromCSV: string;
  importSuccess: string;
  importSuccessCSV: string;
  importErrorFile: string;
  importErrorCSVProcess: string;
  importErrorCSVFormat: string;
  dangerZone: string;
  dangerZoneDesc: string;
  clearVault: string;
  clearVaultConfirm: string;
  // Security
  securityTitle: string;
  overallRating: string;
  scoreGood: string;
  scoreWarning: string;
  scoreCritical: string;
  passwordDistribution: string;
  countStrong: string;
  countFair: string;
  countWeak: string;
  weakPasswordsTitle: string;
  fixBtn: string;
  reusedPasswordsTitle: string;
  oldPasswordsTitle: string;
  daysCount: string;
  allGood: string;
  allGoodDesc: string;
  // Category labels (display only, stored values stay in English)
  categoryLabels: Record<string, string>;
  // AddEdit
  editTitle: string;
  newEntryTitle: string;
  fieldName: string;
  errorNameRequired: string;
  fieldLogin: string;
  errorLoginRequired: string;
  fieldPassword: string;
  errorPasswordRequired: string;
  hideGenerator: string;
  showGeneratorBtn: string;
  checkingBreaches: string;
  noBreaches: string;
  breachFound: string;
  generatorLength: string;
  generateBtn: string;
  fieldCategory: string;
  fieldNotes: string;
  notesPlaceholder: string;
  saveChanges: string;
  addEntry: string;
}

const en: Translations = {
  // Vault header
  searchPlaceholder: "Search by name, login, URL...",
  searchPlaceholderShort: "Search...",
  btnSecurity: "Security",
  btnSettings: "Settings",
  btnLock: "Lock",
  // Vault stats
  records: "entries",
  weak: "weak",
  reused: "reused",
  categoryAll: "All",
  // Sort
  sortLabel: "Sort:",
  sortDate: "By date",
  sortName: "By name",
  sortStrength: "By strength",
  // Vault content
  nothingFound: "Nothing found",
  copiedSuffix: "copied",
  kbNewEntry: "new entry",
  kbLock: "lock",
  // PasswordCard
  strengthWeak: "Weak",
  strengthFair: "Fair",
  strengthStrong: "Strong",
  loginLabel: "Login",
  passwordLabel: "Password",
  ageBadge: "90+ days",
  reusedBadge: "Reused",
  deleteConfirm: "Delete this entry?",
  deleteTitle: "Delete",
  // EmptyState
  emptyTitle: "Vault is empty",
  emptyDesc: "Add your first password — all data is stored encrypted in your browser.",
  emptyButton: "Add first password",
  // OnboardingModal
  onboardingSkip: "Skip",
  onboardingBack: "Back",
  onboardingNext: "Next →",
  onboardingStart: "Get started",
  steps: [
    {
      title: "Welcome to PassVault",
      desc: "Corporate password manager with AES-256-GCM encryption. All data is stored locally in your browser — no servers involved. Let us show you what the app can do.",
      highlight: null,
    },
    {
      title: "Adding passwords",
      desc: "Click the + button in the bottom right to add a new password. The built-in password generator will create a strong combination, and the strength indicator will show how secure it is.",
      highlight: "Supported categories: Engineering, Marketing, Finance, HR, Design, Other",
    },
    {
      title: "Search & filter",
      desc: "The search bar in the header searches by service name, login, and URL simultaneously. Category buttons below the search filter entries by department. Switch between grid and list views.",
      highlight: "All changes are instant — no delays or reloads",
    },
    {
      title: "Security dashboard",
      desc: "The shield icon in the header opens the Security Dashboard — a password health score from 0 to 100. See weak, reused, and old passwords. Each password is checked against the HIBP breach database.",
      highlight: "HIBP check uses k-anonymity — your password is never sent anywhere",
    },
    {
      title: "Settings",
      desc: "In settings you can change the master password, configure auto-lock (5, 15, 30 minutes or never), export all passwords to a JSON file and import them back.",
      highlight: "Auto-lock triggers on inactivity — your data is always protected",
    },
    {
      title: "All set!",
      desc: "You know everything you need. Click a card to copy the password or login. The lock icon in the header instantly locks the vault.",
      highlight: null,
    },
  ],
  // LockScreen
  title: "PassVault",
  subtitleNew: "Create a master password",
  subtitleExisting: "Enter your master password",
  placeholder: "Master password",
  placeholderConfirm: "Confirm password",
  errorMismatch: "Passwords do not match",
  errorShort: "Minimum 6 characters",
  errorWrong: "Incorrect password",
  errorGeneric: "Something went wrong",
  loading: "Loading...",
  buttonCreate: "Create vault",
  buttonUnlock: "Unlock",
  // Settings
  settingsTitle: "Settings",
  changeMasterPassword: "Change master password",
  currentPassword: "Current password",
  newPassword: "New password",
  confirmNewPassword: "Confirm new password",
  wrongCurrentPassword: "Incorrect current password",
  changePasswordError: "Error changing password",
  passwordChanged: "✓ Password changed successfully",
  saving: "Saving...",
  changePasswordBtn: "Change password",
  autoLockLabel: "Auto-lock",
  lock5min: "5 minutes",
  lock15min: "15 minutes",
  lock30min: "30 minutes",
  lockNever: "Never",
  dataTitle: "Data",
  dataDesc: "Export and import backup",
  downloadBackup: "Download backup",
  importFromJSON: "Import from JSON",
  importFromCSV: "Import from CSV",
  importSuccess: "✓ Imported {n} entries",
  importSuccessCSV: "✓ Imported {n} entries from CSV",
  importErrorFile: "Error: invalid file format",
  importErrorCSVProcess: "Error: could not process CSV",
  importErrorCSVFormat: "Error: invalid CSV format",
  dangerZone: "Danger zone",
  dangerZoneDesc: "Delete all saved entries with no way to recover",
  clearVault: "Clear vault",
  clearVaultConfirm: "Delete all entries? This action cannot be undone.",
  // Security
  securityTitle: "Security",
  overallRating: "Overall security rating",
  scoreGood: "Good",
  scoreWarning: "Needs attention",
  scoreCritical: "Critical",
  passwordDistribution: "Password distribution",
  countStrong: "Strong",
  countFair: "Fair",
  countWeak: "Weak",
  weakPasswordsTitle: "⚠ Weak passwords",
  fixBtn: "Fix →",
  reusedPasswordsTitle: "⚠ Reused passwords",
  oldPasswordsTitle: "Not updated for 90+ days",
  daysCount: "{n} days",
  allGood: "All good",
  allGoodDesc: "All passwords are unique and strong enough",
  // Category labels
  categoryLabels: {
    Engineering: "Engineering",
    Marketing: "Marketing",
    Finance: "Finance",
    HR: "HR",
    Design: "Design",
    Other: "Other",
  },
  // AddEdit
  editTitle: "Edit",
  newEntryTitle: "New entry",
  fieldName: "Service name *",
  errorNameRequired: "Enter a name",
  fieldLogin: "Login / Email *",
  errorLoginRequired: "Enter a login",
  fieldPassword: "Password *",
  errorPasswordRequired: "Enter a password",
  hideGenerator: "Hide generator",
  showGeneratorBtn: "Generator",
  checkingBreaches: "Checking breaches...",
  noBreaches: "✓ Not found in known breaches",
  breachFound: "⚠ Found in {n} breaches — change password",
  generatorLength: "Length: {n}",
  generateBtn: "Generate",
  fieldCategory: "Category",
  fieldNotes: "Notes",
  notesPlaceholder: "Additional info...",
  saveChanges: "Save changes",
  addEntry: "Add entry",
};

const ru: Translations = {
  // Vault header
  searchPlaceholder: "Поиск по имени, логину, URL...",
  searchPlaceholderShort: "Поиск...",
  btnSecurity: "Безопасность",
  btnSettings: "Настройки",
  btnLock: "Заблокировать",
  // Vault stats
  records: "записей",
  weak: "слабых",
  reused: "повторяются",
  categoryAll: "Все",
  // Sort
  sortLabel: "Сортировка:",
  sortDate: "По дате",
  sortName: "По имени",
  sortStrength: "По силе",
  // Vault content
  nothingFound: "Ничего не найдено",
  copiedSuffix: "скопирован",
  kbNewEntry: "новая запись",
  kbLock: "заблокировать",
  // PasswordCard
  strengthWeak: "Слабый",
  strengthFair: "Средний",
  strengthStrong: "Сильный",
  loginLabel: "Логин",
  passwordLabel: "Пароль",
  ageBadge: "90+ дней",
  reusedBadge: "Повторяется",
  deleteConfirm: "Удалить эту запись?",
  deleteTitle: "Удалить",
  // EmptyState
  emptyTitle: "Хранилище пусто",
  emptyDesc: "Добавьте первый пароль — все данные хранятся зашифрованными прямо в браузере.",
  emptyButton: "Добавить первый пароль",
  // OnboardingModal
  onboardingSkip: "Пропустить",
  onboardingBack: "Назад",
  onboardingNext: "Далее →",
  onboardingStart: "Начать работу",
  steps: [
    {
      title: "Добро пожаловать в PassVault",
      desc: "Корпоративный менеджер паролей с шифрованием AES-256-GCM. Все данные хранятся локально в браузере — никакие серверы не задействованы. Давайте покажем что умеет приложение.",
      highlight: null,
    },
    {
      title: "Добавление паролей",
      desc: "Нажмите кнопку + в правом нижнем углу чтобы добавить новый пароль. Встроенный генератор паролей создаст надёжную комбинацию, а индикатор силы покажет насколько она безопасна.",
      highlight: "Поддерживаются категории: Engineering, Marketing, Finance, HR, Design, Other",
    },
    {
      title: "Поиск и фильтрация",
      desc: "Строка поиска в шапке ищет по имени сервиса, логину и URL одновременно. Кнопки категорий под поиском фильтруют записи по отделам. Переключайтесь между сеткой и списком.",
      highlight: "Все изменения мгновенные — без задержек и перезагрузок",
    },
    {
      title: "Дашборд безопасности",
      desc: "Иконка щита в шапке открывает Security Dashboard — оценка здоровья паролей от 0 до 100. Видны слабые пароли, повторяющиеся и старые. Каждый пароль проверяется по базе утечек HIBP.",
      highlight: "HIBP проверка использует k-anonymity — ваш пароль никуда не отправляется",
    },
    {
      title: "Настройки",
      desc: "В настройках можно сменить мастер-пароль, настроить автоблокировку (5, 15, 30 минут или никогда), экспортировать все пароли в JSON-файл и импортировать обратно.",
      highlight: "Автоблокировка сработает при неактивности — ваши данные всегда защищены",
    },
    {
      title: "Всё готово!",
      desc: "Вы знаете всё что нужно. Нажмите на карточку чтобы скопировать пароль или логин. Иконка замка в шапке мгновенно блокирует хранилище.",
      highlight: null,
    },
  ],
  // LockScreen
  title: "PassVault",
  subtitleNew: "Создайте мастер-пароль",
  subtitleExisting: "Введите мастер-пароль",
  placeholder: "Мастер-пароль",
  placeholderConfirm: "Подтвердите пароль",
  errorMismatch: "Пароли не совпадают",
  errorShort: "Минимум 6 символов",
  errorWrong: "Неверный пароль",
  errorGeneric: "Что-то пошло не так",
  loading: "Загрузка...",
  buttonCreate: "Создать хранилище",
  buttonUnlock: "Разблокировать",
  // Settings
  settingsTitle: "Настройки",
  changeMasterPassword: "Сменить мастер-пароль",
  currentPassword: "Текущий пароль",
  newPassword: "Новый пароль",
  confirmNewPassword: "Подтвердите новый пароль",
  wrongCurrentPassword: "Неверный текущий пароль",
  changePasswordError: "Ошибка при смене пароля",
  passwordChanged: "✓ Пароль успешно изменён",
  saving: "Сохранение...",
  changePasswordBtn: "Сменить пароль",
  autoLockLabel: "Автоблокировка",
  lock5min: "5 минут",
  lock15min: "15 минут",
  lock30min: "30 минут",
  lockNever: "Никогда",
  dataTitle: "Данные",
  dataDesc: "Экспорт и импорт резервной копии",
  downloadBackup: "Скачать backup",
  importFromJSON: "Импортировать из JSON",
  importFromCSV: "Импортировать из CSV",
  importSuccess: "✓ Импортировано {n} записей",
  importSuccessCSV: "✓ Импортировано {n} записей из CSV",
  importErrorFile: "Ошибка: неверный формат файла",
  importErrorCSVProcess: "Ошибка: не удалось обработать CSV",
  importErrorCSVFormat: "Ошибка: неверный формат CSV",
  dangerZone: "Опасная зона",
  dangerZoneDesc: "Удалить все сохранённые записи без возможности восстановления",
  clearVault: "Очистить хранилище",
  clearVaultConfirm: "Удалить все записи? Это действие нельзя отменить.",
  // Security
  securityTitle: "Безопасность",
  overallRating: "Общий рейтинг безопасности",
  scoreGood: "Хорошо",
  scoreWarning: "Требует внимания",
  scoreCritical: "Критично",
  passwordDistribution: "Распределение паролей",
  countStrong: "Сильных",
  countFair: "Средних",
  countWeak: "Слабых",
  weakPasswordsTitle: "⚠ Слабые пароли",
  fixBtn: "Исправить →",
  reusedPasswordsTitle: "⚠ Повторяющиеся пароли",
  oldPasswordsTitle: "Не обновлялись более 90 дней",
  daysCount: "{n} дней",
  allGood: "Всё в порядке",
  allGoodDesc: "Все пароли уникальны и достаточно сильны",
  // Category labels
  categoryLabels: {
    Engineering: "Разработка",
    Marketing: "Маркетинг",
    Finance: "Финансы",
    HR: "HR",
    Design: "Дизайн",
    Other: "Прочее",
  },
  // AddEdit
  editTitle: "Редактировать",
  newEntryTitle: "Новая запись",
  fieldName: "Название сервиса *",
  errorNameRequired: "Укажите название",
  fieldLogin: "Логин / Email *",
  errorLoginRequired: "Укажите логин",
  fieldPassword: "Пароль *",
  errorPasswordRequired: "Укажите пароль",
  hideGenerator: "Скрыть генератор",
  showGeneratorBtn: "Генератор",
  checkingBreaches: "Проверка утечек...",
  noBreaches: "✓ Не найден в известных утечках",
  breachFound: "⚠ Найден в {n} утечках — смените пароль",
  generatorLength: "Длина: {n}",
  generateBtn: "Сгенерировать",
  fieldCategory: "Категория",
  fieldNotes: "Заметки",
  notesPlaceholder: "Дополнительная информация...",
  saveChanges: "Сохранить изменения",
  addEntry: "Добавить запись",
};

const uz: Translations = {
  // Vault header
  searchPlaceholder: "Ism, login, URL bo'yicha qidirish...",
  searchPlaceholderShort: "Qidirish...",
  btnSecurity: "Xavfsizlik",
  btnSettings: "Sozlamalar",
  btnLock: "Qulflash",
  // Vault stats
  records: "yozuv",
  weak: "zaif",
  reused: "takrorlanadi",
  categoryAll: "Barchasi",
  // Sort
  sortLabel: "Saralash:",
  sortDate: "Sana bo'yicha",
  sortName: "Nom bo'yicha",
  sortStrength: "Kuch bo'yicha",
  // Vault content
  nothingFound: "Hech narsa topilmadi",
  copiedSuffix: "nusxalandi",
  kbNewEntry: "yangi yozuv",
  kbLock: "qulflash",
  // PasswordCard
  strengthWeak: "Zaif",
  strengthFair: "O'rtacha",
  strengthStrong: "Kuchli",
  loginLabel: "Login",
  passwordLabel: "Parol",
  ageBadge: "90+ kun",
  reusedBadge: "Takrorlanadi",
  deleteConfirm: "Bu yozuvni o'chirishni xohlaysizmi?",
  deleteTitle: "O'chirish",
  // EmptyState
  emptyTitle: "Xazina bo'sh",
  emptyDesc: "Birinchi parolni qo'shing — barcha ma'lumotlar brauzeringizda shifrlangan holda saqlanadi.",
  emptyButton: "Birinchi parolni qo'shish",
  // OnboardingModal
  onboardingSkip: "O'tkazib yuborish",
  onboardingBack: "Orqaga",
  onboardingNext: "Keyingi →",
  onboardingStart: "Boshlash",
  steps: [
    {
      title: "PassVault-ga xush kelibsiz",
      desc: "AES-256-GCM shifrlash bilan korporativ parol menejeri. Barcha ma'lumotlar brauzeringizda mahalliy saqlanadi — hech qanday server ishlatilmaydi. Ilova nima qila olishini ko'rsatamiz.",
      highlight: null,
    },
    {
      title: "Parol qo'shish",
      desc: "Yangi parol qo'shish uchun pastki o'ng burchakdagi + tugmasini bosing. O'rnatilgan parol generatori kuchli kombinatsiya yaratadi, kuch ko'rsatkichi esa uni qanchalik xavfsiz ekanini ko'rsatadi.",
      highlight: "Qo'llab-quvvatlanadigan kategoriyalar: Engineering, Marketing, Finance, HR, Design, Other",
    },
    {
      title: "Qidirish va filtrlash",
      desc: "Yuqoridagi qidiruv satri xizmat nomi, login va URL bo'yicha bir vaqtda qidiradi. Qidiruv ostidagi kategoriya tugmalari yozuvlarni bo'limlar bo'yicha filtrlaydi. Katakcha va ro'yxat ko'rinishlari o'rtasida almashing.",
      highlight: "Barcha o'zgarishlar darhol — kechikish va qayta yuklamasiz",
    },
    {
      title: "Xavfsizlik paneli",
      desc: "Sarlavhadagi qalqon belgisi Security Dashboard-ni ochadi — 0 dan 100 gacha parol salomatligi bahosi. Zaif, takrorlangan va eski parollarni ko'ring. Har bir parol HIBP ma'lumotlar bazasida tekshiriladi.",
      highlight: "HIBP tekshiruvi k-anonymity ishlatadi — parolingiz hech qaerga yuborilmaydi",
    },
    {
      title: "Sozlamalar",
      desc: "Sozlamalarda master parolni o'zgartirish, avtomatik bloklashni sozlash (5, 15, 30 daqiqa yoki hech qachon), barcha parollarni JSON-faylga eksport qilish va qaytarib import qilish mumkin.",
      highlight: "Faoliyatsizlikda avtomatik bloklash ishlaydi — ma'lumotlaringiz doim himoyalangan",
    },
    {
      title: "Hammasi tayyor!",
      desc: "Kerakli narsalarni bilasiz. Parol yoki loginni nusxalash uchun kartaga bosing. Sarlavhadagi qulf belgisi xazinani darhol bloklaydi.",
      highlight: null,
    },
  ],
  // LockScreen
  title: "PassVault",
  subtitleNew: "Master parol yarating",
  subtitleExisting: "Master parolni kiriting",
  placeholder: "Master parol",
  placeholderConfirm: "Parolni tasdiqlang",
  errorMismatch: "Parollar mos kelmadi",
  errorShort: "Kamida 6 ta belgi",
  errorWrong: "Noto'g'ri parol",
  errorGeneric: "Xatolik yuz berdi",
  loading: "Yuklanmoqda...",
  buttonCreate: "Xazinani yaratish",
  buttonUnlock: "Ochish",
  // Settings
  settingsTitle: "Sozlamalar",
  changeMasterPassword: "Master parolni o'zgartirish",
  currentPassword: "Joriy parol",
  newPassword: "Yangi parol",
  confirmNewPassword: "Yangi parolni tasdiqlang",
  wrongCurrentPassword: "Joriy parol noto'g'ri",
  changePasswordError: "Parolni o'zgartirishda xatolik",
  passwordChanged: "✓ Parol muvaffaqiyatli o'zgartirildi",
  saving: "Saqlanmoqda...",
  changePasswordBtn: "Parolni o'zgartirish",
  autoLockLabel: "Avtomatik bloklash",
  lock5min: "5 daqiqa",
  lock15min: "15 daqiqa",
  lock30min: "30 daqiqa",
  lockNever: "Hech qachon",
  dataTitle: "Ma'lumotlar",
  dataDesc: "Zaxira nusxasini eksport va import qilish",
  downloadBackup: "Zaxira nusxasini yuklab olish",
  importFromJSON: "JSON'dan import qilish",
  importFromCSV: "CSV'dan import qilish",
  importSuccess: "✓ {n} ta yozuv import qilindi",
  importSuccessCSV: "✓ CSV'dan {n} ta yozuv import qilindi",
  importErrorFile: "Xato: fayl formati noto'g'ri",
  importErrorCSVProcess: "Xato: CSV qayta ishlanmadi",
  importErrorCSVFormat: "Xato: CSV formati noto'g'ri",
  dangerZone: "Xavfli zona",
  dangerZoneDesc: "Barcha saqlangan yozuvlarni qaytarib bo'lmas tarzda o'chirish",
  clearVault: "Xazinani tozalash",
  clearVaultConfirm: "Barcha yozuvlarni o'chirishni xohlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.",
  // Security
  securityTitle: "Xavfsizlik",
  overallRating: "Umumiy xavfsizlik reytingi",
  scoreGood: "Yaxshi",
  scoreWarning: "E'tibor talab etadi",
  scoreCritical: "Kritik",
  passwordDistribution: "Parollar taqsimoti",
  countStrong: "Kuchli",
  countFair: "O'rtacha",
  countWeak: "Zaif",
  weakPasswordsTitle: "⚠ Zaif parollar",
  fixBtn: "Tuzatish →",
  reusedPasswordsTitle: "⚠ Takrorlangan parollar",
  oldPasswordsTitle: "90+ kun davomida yangilanmagan",
  daysCount: "{n} kun",
  allGood: "Hammasi yaxshi",
  allGoodDesc: "Barcha parollar noyob va yetarlicha kuchli",
  // Category labels
  categoryLabels: {
    Engineering: "Muhandislik",
    Marketing: "Marketing",
    Finance: "Moliya",
    HR: "HR",
    Design: "Dizayn",
    Other: "Boshqa",
  },
  // AddEdit
  editTitle: "Tahrirlash",
  newEntryTitle: "Yangi yozuv",
  fieldName: "Xizmat nomi *",
  errorNameRequired: "Nomni kiriting",
  fieldLogin: "Login / Email *",
  errorLoginRequired: "Loginni kiriting",
  fieldPassword: "Parol *",
  errorPasswordRequired: "Parolni kiriting",
  hideGenerator: "Generatorni yashirish",
  showGeneratorBtn: "Generator",
  checkingBreaches: "Buzilishlar tekshirilmoqda...",
  noBreaches: "✓ Ma'lum buzilishlarda topilmadi",
  breachFound: "⚠ {n} ta buzilishda topildi — parolni o'zgartiring",
  generatorLength: "Uzunlik: {n}",
  generateBtn: "Generatsiya qilish",
  fieldCategory: "Kategoriya",
  fieldNotes: "Eslatmalar",
  notesPlaceholder: "Qo'shimcha ma'lumot...",
  saveChanges: "O'zgarishlarni saqlash",
  addEntry: "Yozuv qo'shish",
};

export const translations: Record<Lang, Translations> = { en, ru, uz };
