import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
dayjs.extend(duration);
dayjs.extend(relativeTime);

export function formatDuration(durationData: any) {
  durationData = durationData.$d;
  let formatted = '';

  if (durationData.years > 0) formatted += `${durationData.years} 年 `;
  if (durationData.months > 0) formatted += `${durationData.months} 月 `;
  if (durationData.days > 0) formatted += `${durationData.days} 天 `;
  if (durationData.hours > 0) formatted += `${durationData.hours} 小时 `;
  if (durationData.minutes > 0) formatted += `${durationData.minutes} 分 `;
  if (durationData.seconds > 0) formatted += `${durationData.seconds} 秒 `;

  // 去掉结尾多余的空格
  return formatted.trim();
}
export default dayjs;
