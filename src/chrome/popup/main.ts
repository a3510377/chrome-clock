import '@/main.css';
import { canvasTime, IS_CHROME } from '@/utils';

document.addEventListener('DOMContentLoaded', async () => {
  if (!IS_CHROME) {
    return;
  }

  const inputTitleEl = document.querySelector(
    '#title-input'
  )! as HTMLInputElement;
  const inputLaveTimeEl = document.querySelector(
    '#laveTime-input'
  )! as HTMLInputElement;

  const { config } = await chrome.storage.local.get('config');
  let title: string | null = config.title;
  let time: string | number | null = canvasTime(config.time, config.time);

  const updateConfig = async () => {
    await chrome.storage.local.set({
      config: { title: title, time: time?.toString() },
    });
  };

  inputTitleEl.value = title || '';
  if (time) {
    inputLaveTimeEl.valueAsDate = new Date(time);
  }

  inputTitleEl.addEventListener('input', () => {
    title = inputTitleEl.value;
    updateConfig();
  });

  inputLaveTimeEl.addEventListener('input', () => {
    time = (inputLaveTimeEl.valueAsDate || new Date()).getTime();
    updateConfig();
  });
});
