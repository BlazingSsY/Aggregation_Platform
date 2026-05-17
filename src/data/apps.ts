import MenuBookIcon from '@mui/icons-material/MenuBook';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import RuleIcon from '@mui/icons-material/Rule';
import BoltIcon from '@mui/icons-material/Bolt';
import AppsIcon from '@mui/icons-material/Apps';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import HubIcon from '@mui/icons-material/Hub';
import type { SvgIconComponent } from '@mui/icons-material';

export type AppCategory = '研发提效' | '硬件设计' | '办公协同';

export type AppIconKey =
  | 'knowledge'
  | 'meeting'
  | 'codegen'
  | 'codereview'
  | 'circuit'
  | 'components'
  | 'docgen'
  | 'docreview'
  | 'robot'
  | 'hub'
  | 'default';

export const APP_ICONS: Record<AppIconKey, SvgIconComponent> = {
  knowledge: MenuBookIcon,
  meeting: DescriptionIcon,
  codegen: CodeIcon,
  codereview: RuleIcon,
  circuit: BoltIcon,
  components: AppsIcon,
  docgen: NoteAddIcon,
  docreview: FactCheckIcon,
  robot: SmartToyIcon,
  hub: HubIcon,
  default: HelpOutlineIcon,
};

export const APP_ICON_OPTIONS: Array<{ key: AppIconKey; label: string }> = [
  { key: 'knowledge', label: '知识 / 书' },
  { key: 'meeting', label: '文档' },
  { key: 'codegen', label: '代码' },
  { key: 'codereview', label: '审查' },
  { key: 'circuit', label: '电路' },
  { key: 'components', label: '组件 / 应用' },
  { key: 'docgen', label: '新建文档' },
  { key: 'docreview', label: '文档审查' },
  { key: 'robot', label: '机器人 / AI' },
  { key: 'hub', label: '中心 / 枢纽' },
  { key: 'default', label: '通用' },
];

export function getAppIcon(key: AppIconKey | undefined): SvgIconComponent {
  return APP_ICONS[key ?? 'default'] ?? APP_ICONS.default;
}

export interface AppItem {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  iconKey: AppIconKey;
  url: string;
  status: 'enabled' | 'disabled';
  /** 被授权可访问此应用的用户 ID 列表；超级管理员始终可访问 */
  permittedUserIds: string[];
}

export const CATEGORIES: Array<{ label: string; value: AppCategory | 'all' }> = [
  { label: '全部应用', value: 'all' },
  { label: '研发提效', value: '研发提效' },
  { label: '硬件设计', value: '硬件设计' },
  { label: '办公协同', value: '办公协同' },
];

/** 默认对所有 mock 用户授权，可在「应用管理」中收回或追加 */
const SEED_PERMITTED = [
  'u-admin1',
  'u-admin2',
  'u-admin3',
  'u-user1',
  'u-user2',
  'u-user3',
];

export const APPS: AppItem[] = [
  {
    id: 'knowledge',
    name: '知识助手',
    description:
      '智能检索企业知识库，精准定位信息，秒级生成问题答案，赋能企业知识沉淀与复用',
    category: '办公协同',
    iconKey: 'knowledge',
    url: 'https://example.com/knowledge',
    status: 'enabled',
    permittedUserIds: SEED_PERMITTED,
  },
  {
    id: 'meeting',
    name: '会议纪要',
    description:
      '音频实时转写，智能提取会议核心观点、待办事项、决策结论，一键生成标准化会议纪要',
    category: '办公协同',
    iconKey: 'meeting',
    url: 'https://example.com/meeting',
    status: 'enabled',
    permittedUserIds: SEED_PERMITTED,
  },
  {
    id: 'codegen',
    name: '代码生成',
    description:
      '基于自然语言需求，快速生成多语言高质量代码片段、完整功能模块，大幅提升研发效率',
    category: '研发提效',
    iconKey: 'codegen',
    url: 'https://example.com/codegen',
    status: 'enabled',
    permittedUserIds: SEED_PERMITTED,
  },
  {
    id: 'codereview',
    name: '代码审查',
    description:
      'AI辅助全量代码评审，智能识别代码漏洞、安全隐患、性能问题、规范问题，输出优化建议',
    category: '研发提效',
    iconKey: 'codereview',
    url: 'https://example.com/codereview',
    status: 'enabled',
    permittedUserIds: SEED_PERMITTED,
  },
  {
    id: 'circuit',
    name: '电路审查',
    description:
      '智能校验电路图设计合规性，识别硬件逻辑错误、原理图风险、参数匹配问题，规避硬件研发隐患',
    category: '硬件设计',
    iconKey: 'circuit',
    url: 'https://example.com/circuit',
    status: 'enabled',
    permittedUserIds: SEED_PERMITTED,
  },
  {
    id: 'components',
    name: '元器件库',
    description:
      '企业级全品类元器件参数库，支持精准选型、参数比对、BOM清单一键生成，赋能硬件研发全流程',
    category: '硬件设计',
    iconKey: 'components',
    url: 'https://example.com/components',
    status: 'enabled',
    permittedUserIds: SEED_PERMITTED,
  },
  {
    id: 'docgen',
    name: '文档生成',
    description:
      '基于需求一键生成技术文档、项目报告、商务方案、规章制度等多类型标准化文档，降本提效',
    category: '办公协同',
    iconKey: 'docgen',
    url: 'https://example.com/docgen',
    status: 'enabled',
    permittedUserIds: SEED_PERMITTED,
  },
  {
    id: 'docreview',
    name: '文档审查',
    description:
      'AI辅助文档全量校验，智能校对文字错误、格式规范、逻辑漏洞、合规风险，输出专业修改建议',
    category: '办公协同',
    iconKey: 'docreview',
    url: 'https://example.com/docreview',
    status: 'enabled',
    permittedUserIds: SEED_PERMITTED,
  },
];
