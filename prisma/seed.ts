import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
});

async function main() {
  await prisma.reviewResult.deleteMany();
  await prisma.practiceLog.deleteMany();
  await prisma.practiceSequence.deleteMany();
  await prisma.theoryCard.deleteMany();
  await prisma.exercise.deleteMany();

  const exercises = await Promise.all([
    prisma.exercise.create({
      data: {
        slug: "basic-pelvis-assessment",
        title: "Базовая проверка положения таза",
        originalNumber: "demo-001",
        category: "Диагностика",
        difficulty: "basic",
        bodyZones: ["таз", "поясница", "ноги"],
        goals: ["оценить асимметрию", "подготовить план работы"],
        clientPosition: "Лежа на спине",
        practitionerPosition: "У стоп клиента",
        steps: [
          "Попросить клиента лечь ровно и расслабиться.",
          "Сравнить положение стоп и визуальную длину ног.",
          "Оценить симметрию таза и напряжение в поясничной зоне.",
          "Зафиксировать наблюдения перед началом коррекции.",
        ],
        keyPoints: ["Не делать вывод по одному признаку.", "Смотреть на общую картину тела."],
        commonMistakes: [
          "Считать разницу длины ног единственным доказательством перекоса.",
          "Игнорировать напряжение мышц.",
        ],
        contraindications: ["Острая боль", "Недавняя травма"],
        expectedEffect: "Дает исходную точку для выбора техник.",
        clientFeeling: "Клиент обычно не чувствует сильного воздействия, так как это диагностический этап.",
        sourceReference: "Demo seed",
      },
    }),
    prisma.exercise.create({
      data: {
        slug: "gentle-hip-release",
        title: "Мягкое освобождение тазобедренной зоны",
        originalNumber: "demo-002",
        category: "Подготовка",
        difficulty: "basic",
        bodyZones: ["таз", "бедро", "крестец"],
        goals: ["снизить напряжение", "подготовить сустав к коррекции"],
        clientPosition: "Лежа на спине",
        practitionerPosition: "Сбоку от рабочей ноги",
        steps: [
          "Стабилизировать таз мягким контактом.",
          "Плавно привести бедро в комфортный диапазон движения.",
          "Выполнить несколько малых амплитуд без рывка.",
          "Вернуть ногу в нейтраль и проверить ощущение клиента.",
        ],
        keyPoints: ["Работать только в безболезненном диапазоне.", "Сохранять ровное дыхание клиента."],
        commonMistakes: ["Увеличивать амплитуду слишком рано.", "Терять контакт со стабильностью таза."],
        contraindications: ["Боль в суставе", "Послеоперационный период без разрешения врача"],
        expectedEffect: "Уменьшает защитное напряжение и делает дальнейшую работу спокойнее.",
        clientFeeling: "Мягкое растяжение или тепло в области бедра.",
        sourceReference: "Demo seed",
      },
    }),
    prisma.exercise.create({
      data: {
        slug: "spinal-line-check",
        title: "Проверка линии позвоночника сидя",
        originalNumber: "demo-003",
        category: "Диагностика",
        difficulty: "basic",
        bodyZones: ["позвоночник", "плечи", "таз"],
        goals: ["увидеть компенсации", "связать осанку с положением таза"],
        clientPosition: "Сидя на кушетке",
        practitionerPosition: "Позади клиента",
        steps: [
          "Попросить клиента сесть ровно без напряжения.",
          "Оценить уровень плеч и положение головы.",
          "Проследить линию позвоночника сверху вниз.",
          "Сравнить наблюдения с положением таза.",
        ],
        keyPoints: ["Смотреть без спешки.", "Отмечать не только форму, но и тонус."],
        commonMistakes: ["Просить клиента слишком активно выпрямиться.", "Оценивать плечи отдельно от таза."],
        contraindications: ["Головокружение", "Сильная усталость клиента"],
        expectedEffect: "Помогает выбрать порядок работы и объяснить клиенту наблюдения.",
        clientFeeling: "Нейтральная диагностическая позиция.",
        sourceReference: "Demo seed",
      },
    }),
  ]);

  await prisma.theoryCard.createMany({
    data: [
      {
        topic: "Основы метода",
        title: "Роль таза",
        question: "Почему таз считается ключевой зоной в Юмейхо?",
        answer: "Положение таза влияет на центр тяжести и может запускать компенсаторные изменения во всем теле.",
        practicalMeaning: "Перед локальной работой с симптомом важно оценить общий баланс тела.",
        tags: ["таз", "центр тяжести", "основа метода"],
        difficulty: 1,
        sourceReference: "Demo seed",
      },
      {
        topic: "Диагностика",
        title: "Один признак не является диагнозом",
        question: "Почему нельзя строить план только по визуальной разнице длины ног?",
        answer: "Один признак может быть следствием позы, мышечного тонуса или временной компенсации.",
        practicalMeaning: "Нужно сопоставлять стопы, таз, позвоночник, тонус и ощущения клиента.",
        tags: ["диагностика", "наблюдение"],
        difficulty: 1,
        sourceReference: "Demo seed",
      },
      {
        topic: "Безопасность",
        title: "Работа без боли",
        question: "Что означает принцип работы в безболезненном диапазоне?",
        answer: "Воздействие не должно провоцировать острую боль или защитное напряжение.",
        practicalMeaning: "Комфортный диапазон помогает телу принять технику и снижает риск перегрузки.",
        tags: ["безопасность", "диапазон"],
        difficulty: 1,
        sourceReference: "Demo seed",
      },
      {
        topic: "Практика",
        title: "Контакт и стабильность",
        question: "Зачем практику сохранять стабильный контакт во время техники?",
        answer: "Стабильный контакт дает клиенту ощущение безопасности и помогает контролировать направление воздействия.",
        practicalMeaning: "Если контакт теряется, техника становится менее точной и более тревожной для клиента.",
        tags: ["контакт", "стабильность"],
        difficulty: 2,
        sourceReference: "Demo seed",
      },
      {
        topic: "Сессия",
        title: "Порядок наблюдений",
        question: "Почему полезно фиксировать исходное состояние до коррекции?",
        answer: "Исходная точка позволяет сравнить изменения после работы и не полагаться только на память.",
        practicalMeaning: "Запись наблюдений помогает улучшать план следующих сессий.",
        tags: ["лог", "сессия", "наблюдение"],
        difficulty: 2,
        sourceReference: "Demo seed",
      },
    ],
  });

  await prisma.practiceSequence.createMany({
    data: [
      {
        slug: "initial-assessment-flow",
        title: "Первичная оценка перед сессией",
        description: "Спокойный диагностический порядок для начала работы.",
        useCase: "Первая встреча или возвращение после паузы",
        exerciseIds: [exercises[0].id, exercises[2].id],
        notes: "Сначала наблюдения лежа, затем проверка сидя.",
      },
      {
        slug: "pelvis-preparation-flow",
        title: "Подготовка таза к мягкой работе",
        description: "Мини-последовательность перед более активными техниками.",
        useCase: "Когда видна защитная скованность таза и бедер",
        exerciseIds: [exercises[0].id, exercises[1].id],
        notes: "Не переходить к амплитуде, если есть боль.",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
