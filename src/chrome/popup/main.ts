import '@/main.css';
import {
  canvasTime,
  DEFAULT_TIME,
  DEFAULT_TITLE,
  IChromeConfig,
  IConfig,
  IS_CHROME,
} from '@/utils';

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

  const { config } = (await chrome.storage.local.get('config')) as {
    config?: IChromeConfig;
  };
  const nowConfig: IConfig = {
    time: DEFAULT_TIME,
    title: DEFAULT_TITLE,
  };

  nowConfig.time = canvasTime(DEFAULT_TIME, config?.time);
  nowConfig.title = config?.title || DEFAULT_TITLE;

  const updateConfig = async () => {
    await chrome.storage.local.set({ config: nowConfig });
  };

  inputTitleEl.value = nowConfig.title;
  inputLaveTimeEl.valueAsDate = new Date(nowConfig.time);

  inputTitleEl.addEventListener('input', () => {
    nowConfig.title = inputTitleEl.value;
    updateConfig();
  });

  inputLaveTimeEl.addEventListener('input', () => {
    nowConfig.time = inputLaveTimeEl.valueAsDate?.getTime() || DEFAULT_TIME;
    updateConfig();
  });
});
