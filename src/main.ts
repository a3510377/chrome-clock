import './style.css';

(() => {
  let baseTitle = '114年統一入學測驗倒數';
  const ONE_SECOND = 1000;
  const ONE_MINUTE = ONE_SECOND * 60;
  const ONE_HOUR = ONE_MINUTE * 60;
  const ONE_DAY = ONE_HOUR * 24;
  const ICONS_NAMES = [
    'star',
    'menu_book',
    'auto_stories',
    'experiment',
    'local_library',
  ];

  const getRandomValue = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const getRandomPosition = () => `${Math.floor(getRandomValue(0, 100))}%`;

  document.addEventListener('DOMContentLoaded', () => {
    const dayEl = document.querySelector('#day>p')!;
    const hourEl = document.querySelector('#hour>p')!;
    const minuteEl = document.querySelector('#minute>p')!;
    const secondEl = document.querySelector('#second>p')!;
    const titleEl = document.querySelector('#title')!;
    const settingsEl = document.querySelector('#settings')!;
    const openSettingBtn = document.querySelector('#open-setting')!;
    const inputTitleEl = document.querySelector(
      '#title-input'
    )! as HTMLInputElement;
    const inputLaveTimeEl = document.querySelector(
      '#laveTime-input'
    )! as HTMLInputElement;

    if ('chrome' in window) {
      settingsEl.classList.remove('hidden');
    }

    const searchParams = new URLSearchParams(window.location.search);

    let countDownDate = new Date('2025-04-26T00:00:00+08:00').getTime();

    const laveTime = searchParams.get('laveTime');
    baseTitle = searchParams.get('title') || baseTitle;
    countDownDate = laveTime
      ? new Date(/^\d+$/.test(laveTime) ? +laveTime : laveTime).getTime()
      : countDownDate;
    inputTitleEl.value = baseTitle;
    inputLaveTimeEl.valueAsDate = new Date(countDownDate);

    inputTitleEl.addEventListener('change', () => {
      baseTitle = inputTitleEl.value;
      titleEl.textContent = baseTitle;
      update();
      location.search = `?title=${baseTitle}&laveTime=${countDownDate}`;
    });

    inputLaveTimeEl.addEventListener('change', () => {
      countDownDate = (inputLaveTimeEl.valueAsDate || new Date()).getTime();
      update();
      location.search = `?title=${baseTitle}&laveTime=${countDownDate}`;
    });

    openSettingBtn.addEventListener('click', () => {
      const setting = document.querySelector('#setting')!;
      setting.classList.toggle('hidden');
    });

    titleEl.textContent = baseTitle;

    const icons = document.querySelector('#bg-float-icons') as HTMLDivElement;
    icons.append(
      ...Array.from({ length: 15 }).map((_, i) => {
        const span = document.createElement('span');
        const { style, classList } = span;

        span.textContent =
          ICONS_NAMES[~~getRandomValue(0, ICONS_NAMES.length - 1)];
        i % 2 && classList.add('inv');
        classList.add('material-symbols-outlined', 'float');

        style.top = getRandomPosition();
        style.left = getRandomPosition();
        style.animationDuration = `${Math.floor(getRandomValue(20, 40))}s`;

        style.setProperty('--x', `${getRandomValue(0, 50)}px`);
        style.setProperty('--y', `${getRandomValue(0, 50)}px`);

        return span;
      })
    );

    const update = () => {
      const distance = countDownDate - new Date().getTime();

      if (distance < 0) {
        dayEl.textContent = '00';
        hourEl.textContent = '00';
        minuteEl.textContent = '00';
        secondEl.textContent = '00';
        document.title = `結束了 - ${baseTitle}`;
        clearInterval(loop);
        return;
      }

      const days = Math.floor(distance / ONE_DAY);
      const hours = Math.floor((distance % ONE_DAY) / ONE_HOUR);
      const minutes = Math.floor((distance % ONE_HOUR) / ONE_MINUTE);
      const seconds = Math.floor((distance % ONE_MINUTE) / ONE_SECOND);

      dayEl.textContent = String(days).padStart(2, '0');
      hourEl.textContent = String(hours).padStart(2, '0');
      minuteEl.textContent = String(minutes).padStart(2, '0');
      secondEl.textContent = String(seconds).padStart(2, '0');
      document.title = `${days}天 - ${baseTitle}`;
    };

    update();
    const loop = setInterval(update, 100);
  });
})();
