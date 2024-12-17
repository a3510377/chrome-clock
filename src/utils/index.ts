export const IS_CHROME = Boolean(window.chrome?.runtime);
export const canvasTime = (
  defaultTime: number,
  time?: string | number | null
): number =>
  time
    ? new Date(/^\d+$/.test(time.toString()) ? +time : time).getTime()
    : defaultTime;
