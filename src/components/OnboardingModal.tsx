import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    icon: (
      <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "Добро пожаловать в PassVault",
    desc: "Ваш личный менеджер паролей с шифрованием AES-256-GCM. Все данные хранятся локально в браузере — никакие серверы не задействованы. Давайте покажем что умеет приложение.",
    highlight: null,
  },
  {
    icon: (
      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    ),
    title: "Добавление паролей",
    desc: "Нажмите кнопку + в правом нижнем углу чтобы добавить новый пароль. Встроенный генератор паролей создаст надёжную комбинацию, а индикатор силы покажет насколько она безопасна.",
    highlight: "Поддерживаются категории: Engineering, Marketing, Finance, HR, Design, Other",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Поиск и фильтрация",
    desc: "Строка поиска в шапке ищет по имени сервиса, логину и URL одновременно. Кнопки категорий под поиском фильтруют записи по отделам. Переключайтесь между сеткой и списком.",
    highlight: "Все изменения мгновенные — без задержек и перезагрузок",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Дашборд безопасности",
    desc: "Иконка щита в шапке открывает Security Dashboard — оценка здоровья паролей от 0 до 100. Видны слабые пароли, повторяющиеся и старые. Каждый пароль проверяется по базе утечек HIBP.",
    highlight: "HIBP проверка использует k-anonymity — ваш пароль никуда не отправляется",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Настройки",
    desc: "В настройках можно сменить мастер-пароль, настроить автоблокировку (5, 15, 30 минут или никогда), экспортировать все пароли в JSON-файл и импортировать обратно.",
    highlight: "Автоблокировка сработает при неактивности — ваши данные всегда защищены",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
      </svg>
    ),
    title: "Всё готово!",
    desc: "Вы знаете всё что нужно. Нажмите на карточку чтобы скопировать пароль или логин. Иконка замка в шапке мгновенно блокирует хранилище.",
    highlight: null,
  },
];

interface Props {
  onClose: () => void;
}

export default function OnboardingModal({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  function handleClose() {
    localStorage.setItem("onboardingDone", "1");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative z-10 w-full max-w-md bg-[#0e0e18] border border-white/8 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Progress bar */}
        <div className="h-0.5 bg-white/5">
          <motion.div
            className="h-full bg-indigo-500"
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
          />
        </div>

        <div className="p-6">
          {/* Step counter */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-zinc-600 text-xs">
              {step + 1} / {steps.length}
            </span>
            <button
              onClick={handleClose}
              className="text-zinc-600 hover:text-white transition-colors text-xs"
            >
              Пропустить
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-4">
                {current.icon}
              </div>

              <h2 className="text-white font-semibold text-lg mb-2">
                {current.title}
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                {current.desc}
              </p>

              {current.highlight && (
                <div className="bg-indigo-500/8 border border-indigo-500/20 rounded-xl px-4 py-3">
                  <p className="text-indigo-300 text-xs leading-relaxed">
                    {current.highlight}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-6">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2.5 rounded-xl border border-white/8 text-zinc-400 hover:text-white text-sm transition-all"
              >
                Назад
              </button>
            )}
            <button
              onClick={isLast ? handleClose : () => setStep((s) => s + 1)}
              className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
            >
              {isLast ? "Начать работу" : "Далее →"}
            </button>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`rounded-full transition-all ${
                  i === step
                    ? "w-4 h-1.5 bg-indigo-500"
                    : "w-1.5 h-1.5 bg-white/15 hover:bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
