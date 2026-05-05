import {
  AppstoreOutlined,
  AuditOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CodeOutlined,
  FileAddOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { ComponentType } from 'react';

export type AppCategory = '研发提效' | '硬件设计' | '办公协同';

export interface AppItem {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  icon: ComponentType<{ style?: React.CSSProperties; className?: string }>;
  url: string;
}

export const CATEGORIES: Array<{ label: string; value: AppCategory | 'all' }> = [
  { label: '全部应用', value: 'all' },
  { label: '研发提效', value: '研发提效' },
  { label: '硬件设计', value: '硬件设计' },
  { label: '办公协同', value: '办公协同' },
];

export const APPS: AppItem[] = [
  {
    id: 'knowledge',
    name: '知识助手',
    description: '智能检索企业知识库，精准定位信息，秒级生成问题答案，赋能企业知识沉淀与复用',
    category: '办公协同',
    icon: BookOutlined,
    url: 'https://example.com/knowledge',
  },
  {
    id: 'meeting',
    name: '会议纪要',
    description: '音频实时转写，智能提取会议核心观点、待办事项、决策结论，一键生成标准化会议纪要',
    category: '办公协同',
    icon: FileTextOutlined,
    url: 'https://example.com/meeting',
  },
  {
    id: 'codegen',
    name: '代码生成',
    description: '基于自然语言需求，快速生成多语言高质量代码片段、完整功能模块，大幅提升研发效率',
    category: '研发提效',
    icon: CodeOutlined,
    url: 'https://example.com/codegen',
  },
  {
    id: 'codereview',
    name: '代码审查',
    description: 'AI辅助全量代码评审，智能识别代码漏洞、安全隐患、性能问题、规范问题，输出优化建议',
    category: '研发提效',
    icon: CheckCircleOutlined,
    url: 'https://example.com/codereview',
  },
  {
    id: 'circuit',
    name: '电路审查',
    description: '智能校验电路图设计合规性，识别硬件逻辑错误、原理图风险、参数匹配问题，规避硬件研发隐患',
    category: '硬件设计',
    icon: ThunderboltOutlined,
    url: 'https://example.com/circuit',
  },
  {
    id: 'components',
    name: '元器件库',
    description: '企业级全品类元器件参数库，支持精准选型、参数比对、BOM清单一键生成，赋能硬件研发全流程',
    category: '硬件设计',
    icon: AppstoreOutlined,
    url: 'https://example.com/components',
  },
  {
    id: 'docgen',
    name: '文档生成',
    description: '基于需求一键生成技术文档、项目报告、商务方案、规章制度等多类型标准化文档，降本提效',
    category: '办公协同',
    icon: FileAddOutlined,
    url: 'https://example.com/docgen',
  },
  {
    id: 'docreview',
    name: '文档审查',
    description: 'AI辅助文档全量校验，智能校对文字错误、格式规范、逻辑漏洞、合规风险，输出专业修改建议',
    category: '办公协同',
    icon: AuditOutlined,
    url: 'https://example.com/docreview',
  },
];
