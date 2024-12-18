export const IS_CHROME = Boolean(window.chrome?.runtime);
export const canvasTime = (
  defaultTime: number,
  time?: string | number | null
): number =>
  time
    ? new Date(/^\d+$/.test(time.toString()) ? +time : time).getTime()
    : defaultTime;

export const DEFAULT_TIME = new Date('2025-04-26T00:00:00+08:00').getTime();
export const DEFAULT_TITLE = '114年統一入學測驗倒數';

export interface IConfig {
  time: number;
  title: string;
}

export type IChromeConfig = Partial<IConfig>;
