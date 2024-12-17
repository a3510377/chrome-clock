import './main.css';
import './style.css';
import './fonts/font.css';

import { canvasTime, IS_CHROME } from './utils';

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

  document.addEventListener('DOMContentLoaded', async () => {
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
    const bgMaskEl = document.querySelector('#bg-mask')!;
    const settingEl = document.querySelector('#setting')!;

    let countDownDate = new Date('2025-04-26T00:00:00+08:00').getTime();
    let loop: NodeJS.Timeout | undefined;

    const updateInfo = () => {
      titleEl.textContent = baseTitle;
      inputTitleEl.value = baseTitle;
      inputLaveTimeEl.valueAsDate = new Date(countDownDate);
    };

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

    const updateURL = () => {
      const queryParams = new URLSearchParams(window.location.search);
      if (IS_CHROME) {
        chrome.storage.local.set({
          title: baseTitle,
          time: countDownDate.toString(),
        });
      } else {
        queryParams.set('title', baseTitle);
        queryParams.set('laveTime', countDownDate.toString());
        history.replaceState(null, '', '?' + queryParams.toString());
      }
      updateInfo();
    };

    if (IS_CHROME) {
      const reloadConfig = (config: { title?: string; time?: string }) => {
        countDownDate = canvasTime(countDownDate, config.time);
        baseTitle = config.title || baseTitle;
        update();
      };

      chrome.storage.onChanged.addListener(({ config: { newValue } }) => {
        reloadConfig(newValue);
        updateInfo();
      });

      const { config } = await chrome.storage.local.get('config');
      reloadConfig(config);
    } else {
      const searchParams = new URLSearchParams(window.location.search);

      if (!searchParams.has('hide')) {
        settingsEl.classList.remove('hidden');
      }
      baseTitle = searchParams.get('title') || baseTitle;
      countDownDate = canvasTime(countDownDate, searchParams.get('laveTime'));
    }

    updateInfo();

    inputTitleEl.addEventListener('input', () => {
      baseTitle = inputTitleEl.value;
      update();
      updateURL();
    });

    inputLaveTimeEl.addEventListener('input', () => {
      countDownDate = (inputLaveTimeEl.valueAsDate || new Date()).getTime();
      update();
      updateURL();
    });

    const { classList: bgMaskElClassList } = bgMaskEl;
    bgMaskEl.addEventListener('click', () => {
      settingEl.classList.add('hidden');
      bgMaskElClassList.add('hidden');
    });

    openSettingBtn.addEventListener('click', () => {
      if (settingEl.classList.toggle('hidden')) bgMaskElClassList.add('hidden');
      else bgMaskElClassList.remove('hidden');
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

    update();
    loop = setInterval(update, 100);
  });
})();
