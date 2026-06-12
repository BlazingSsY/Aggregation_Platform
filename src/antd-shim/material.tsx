import type { CSSProperties, ReactElement, ReactNode } from 'react';
import React, { Children, cloneElement, isValidElement } from 'react';
import {
  Alert as AntAlert,
  Avatar as AntAvatar,
  Button as AntButton,
  Card as AntCard,
  Checkbox as AntCheckbox,
  Divider as AntDivider,
  Input,
  Modal,
  Select,
  Switch as AntSwitch,
  Tag,
  Tooltip as AntTooltip,
} from 'antd';

type AnyProps = Record<string, any>;

const toSpace = (value: any) => (typeof value === 'number' ? value * 8 : value);

const themeValues: Record<string, string> = {
  'background.default': 'var(--antx-bg)',
  'background.paper': '#ffffff',
  'primary.main': 'var(--antx-blue)',
  'primary.light': 'var(--antx-blue-soft)',
  'primary.dark': 'var(--antx-blue-active)',
  'text.primary': 'var(--antx-text)',
  'text.secondary': 'var(--antx-muted)',
  'text.disabled': 'var(--antx-placeholder)',
  'success.main': 'var(--antx-success)',
  'warning.main': 'var(--antx-warning)',
  'error.main': 'var(--antx-error)',
  'info.main': 'var(--antx-blue)',
};

function resolveValue(value: any) {
  return typeof value === 'string' ? themeValues[value] ?? value : value;
}

function sxValue(key: string, value: any) {
  const resolved = resolveValue(value);
  if (key === 'gap' || key === 'rowGap' || key === 'columnGap' || key === 'borderRadius') {
    return toSpace(resolved);
  }
  return resolved;
}

function sxToStyle(sx: any): CSSProperties {
  if (!sx || typeof sx !== 'object' || Array.isArray(sx)) return {};
  const style: CSSProperties = {};
  const map: Record<string, keyof CSSProperties> = {
    bgcolor: 'background',
    background: 'background',
    backgroundColor: 'backgroundColor',
    color: 'color',
    display: 'display',
    flex: 'flex',
    flexDirection: 'flexDirection',
    flexWrap: 'flexWrap',
    alignItems: 'alignItems',
    alignSelf: 'alignSelf',
    justifyContent: 'justifyContent',
    gap: 'gap',
    rowGap: 'rowGap',
    columnGap: 'columnGap',
    width: 'width',
    minWidth: 'minWidth',
    maxWidth: 'maxWidth',
    height: 'height',
    minHeight: 'minHeight',
    maxHeight: 'maxHeight',
    overflow: 'overflow',
    overflowX: 'overflowX',
    overflowY: 'overflowY',
    position: 'position',
    inset: 'inset',
    top: 'top',
    right: 'right',
    bottom: 'bottom',
    left: 'left',
    zIndex: 'zIndex',
    border: 'border',
    borderLeft: 'borderLeft',
    borderBottom: 'borderBottom',
    borderColor: 'borderColor',
    borderRadius: 'borderRadius',
    boxShadow: 'boxShadow',
    cursor: 'cursor',
    userSelect: 'userSelect',
    opacity: 'opacity',
    textAlign: 'textAlign',
    whiteSpace: 'whiteSpace',
    textOverflow: 'textOverflow',
    fontFamily: 'fontFamily',
    fontSize: 'fontSize',
    fontWeight: 'fontWeight',
    lineHeight: 'lineHeight',
    letterSpacing: 'letterSpacing',
  };
  const aliases: Record<string, string[]> = {
    p: ['padding'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
    pt: ['paddingTop'],
    pr: ['paddingRight'],
    pb: ['paddingBottom'],
    pl: ['paddingLeft'],
    m: ['margin'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
    mt: ['marginTop'],
    mr: ['marginRight'],
    mb: ['marginBottom'],
    ml: ['marginLeft'],
  };

  Object.entries(sx).forEach(([key, raw]) => {
    if (key.startsWith('&') || key.startsWith('@')) return;
    const responsive = raw as AnyProps;
    const value =
      raw && typeof raw === 'object' && !Array.isArray(raw)
        ? (responsive.md ?? responsive.sm ?? responsive.xs ?? undefined)
        : raw;
    if (value === undefined) return;
    if (aliases[key]) {
      aliases[key].forEach((target) => {
        (style as AnyProps)[target] = toSpace(resolveValue(value));
      });
      return;
    }
    const target = map[key];
    if (target) (style as AnyProps)[target] = sxValue(key, value);
  });
  return style;
}

function mergeStyle(props: AnyProps): CSSProperties {
  return { ...sxToStyle(props.sx), ...(props.style ?? {}) };
}

function cleanProps(props: AnyProps) {
  const {
    sx,
    ownerState,
    component,
    fullWidth,
    startIcon,
    endIcon,
    slotProps,
    InputProps,
    inputProps,
    InputLabelProps,
    FormHelperTextProps,
    primaryTypographyProps,
    disablePadding,
    dense,
    flexItem,
    underline,
    color,
    variant,
    elevation,
    size,
    ...rest
  } = props;
  return rest;
}

export function Box(props: AnyProps) {
  const { component: Component = 'div', children, ...rest } = props;
  return (
    <Component {...cleanProps(rest)} style={mergeStyle(rest)}>
      {children}
    </Component>
  );
}

export function Stack(props: AnyProps) {
  const { direction = 'column', spacing = 0, children, ...rest } = props;
  return (
    <div
      {...cleanProps(rest)}
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: toSpace(spacing),
        ...mergeStyle(rest),
      }}
    >
      {children}
    </div>
  );
}

export function Typography(props: AnyProps) {
  const { component, variant, noWrap, children, ...rest } = props;
  const Component = component ?? (variant === 'h5' ? 'h2' : variant === 'h6' ? 'h3' : 'div');
  return (
    <Component
      {...cleanProps(rest)}
      style={{
        display: Component === 'span' ? 'inline' : 'block',
        margin: 0,
        ...(noWrap ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } : {}),
        ...mergeStyle(rest),
      }}
    >
      {children}
    </Component>
  );
}

export function Button(props: AnyProps) {
  const { variant, color, fullWidth, size, startIcon, endIcon, children, ...rest } = props;
  const danger = color === 'error';
  const type = variant === 'contained' ? 'primary' : 'default';
  return (
    <AntButton
      {...cleanProps(rest)}
      danger={danger}
      type={danger && variant === 'contained' ? 'primary' : type}
      size={size === 'large' ? 'large' : size === 'small' ? 'small' : 'middle'}
      style={{ width: fullWidth ? '100%' : undefined, ...mergeStyle(rest) }}
    >
      {startIcon}
      {children}
      {endIcon}
    </AntButton>
  );
}

export function IconButton(props: AnyProps) {
  const { children, color, ...rest } = props;
  return (
    <AntButton
      {...cleanProps(rest)}
      danger={color === 'error'}
      type="text"
      size="small"
      style={mergeStyle(rest)}
    >
      {children}
    </AntButton>
  );
}

export function Card(props: AnyProps) {
  const { children, ...rest } = props;
  return (
    <AntCard {...cleanProps(rest)} style={mergeStyle(rest)}>
      {children}
    </AntCard>
  );
}

export function CardContent(props: AnyProps) {
  const { children, ...rest } = props;
  return (
    <div {...cleanProps(rest)} style={{ padding: 20, ...mergeStyle(rest) }}>
      {children}
    </div>
  );
}

export function TextField(props: AnyProps) {
  const {
    label,
    select,
    children,
    value,
    onChange,
    placeholder,
    type,
    multiline,
    minRows,
    helperText,
    disabled,
    autoFocus,
    fullWidth = true,
    ...rest
  } = props;
  const style = { width: fullWidth ? '100%' : undefined, ...mergeStyle(rest) };
  const addonBefore = rest.slotProps?.input?.startAdornment ?? rest.InputProps?.startAdornment;
  const addonAfter = rest.slotProps?.input?.endAdornment ?? rest.InputProps?.endAdornment;
  const control = select ? (
    <Select
      value={value}
      onChange={(next) => onChange?.({ target: { value: next } })}
      disabled={disabled}
      autoFocus={autoFocus}
      style={style}
      placeholder={placeholder}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return null;
        const option = child as ReactElement<AnyProps>;
        return (
          <Select.Option value={option.props.value} disabled={option.props.disabled}>
            {option.props.children}
          </Select.Option>
        );
      })}
    </Select>
  ) : multiline ? (
    <Input.TextArea
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoFocus={autoFocus}
      placeholder={placeholder}
      rows={minRows}
      style={style}
    />
  ) : type === 'password' ? (
    <Input.Password
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoFocus={autoFocus}
      placeholder={placeholder}
      style={style}
      addonBefore={addonBefore}
      addonAfter={addonAfter}
    />
  ) : (
    <Input
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoFocus={autoFocus}
      placeholder={placeholder}
      style={style}
      addonBefore={addonBefore}
      addonAfter={addonAfter}
    />
  );
  return (
    <label className={`antd-field${label ? ' has-label' : ''}`} style={style}>
      {label && <span className="antd-field-label">{label}</span>}
      {control}
      {helperText && <span className="antd-field-help">{helperText}</span>}
    </label>
  );
}

export function Chip(props: AnyProps) {
  const { label, children, color, icon, ...rest } = props;
  const colorMap: Record<string, string> = {
    primary: 'blue',
    info: 'blue',
    success: 'green',
    warning: 'gold',
    error: 'red',
    default: 'default',
  };
  return (
    <Tag {...cleanProps(rest)} color={colorMap[color] ?? 'default'} style={mergeStyle(rest)}>
      {icon}
      {label ?? children}
    </Tag>
  );
}

export function Alert(props: AnyProps) {
  const { severity = 'info', children, ...rest } = props;
  return (
    <AntAlert
      {...cleanProps(rest)}
      type={severity === 'error' ? 'error' : severity}
      message={children}
      showIcon={false}
      style={mergeStyle(rest)}
    />
  );
}

export function Avatar(props: AnyProps) {
  const { children, ...rest } = props;
  return (
    <AntAvatar {...cleanProps(rest)} style={mergeStyle(rest)}>
      {children}
    </AntAvatar>
  );
}

export function Tooltip(props: AnyProps) {
  const { title, children, placement = 'top', ...rest } = props;
  return (
    <AntTooltip
      {...cleanProps(rest)}
      title={title}
      placement={placement}
      destroyOnHidden
      mouseLeaveDelay={0}
    >
      {children}
    </AntTooltip>
  );
}

export function Divider(props: AnyProps) {
  const { orientation, ...rest } = props;
  return <AntDivider type={orientation === 'vertical' ? 'vertical' : 'horizontal'} style={mergeStyle(rest)} />;
}

export function Checkbox(props: AnyProps) {
  const { checked, indeterminate, onChange, children, ...rest } = props;
  return (
    <AntCheckbox
      {...cleanProps(rest)}
      checked={checked}
      indeterminate={indeterminate}
      onChange={onChange}
      style={mergeStyle(rest)}
    >
      {children}
    </AntCheckbox>
  );
}

export function Switch(props: AnyProps) {
  const { checked, onChange, disabled, ...rest } = props;
  return (
    <AntSwitch
      checked={checked}
      disabled={disabled}
      onChange={(next) => onChange?.({ target: { checked: next } })}
      style={mergeStyle(rest)}
    />
  );
}

export function FormControlLabel(props: AnyProps) {
  const { control, label, ...rest } = props;
  return (
    <label {...cleanProps(rest)} className="antd-form-control-label" style={mergeStyle(rest)}>
      {control}
      {label}
    </label>
  );
}

export function Dialog(props: AnyProps) {
  const { open, onClose, children, maxWidth, fullWidth } = props;
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={maxWidth === 'xs' ? 420 : maxWidth === 'md' ? 820 : fullWidth ? 640 : undefined}
      centered
      destroyOnClose={false}
    >
      {children}
    </Modal>
  );
}

export function DialogTitle(props: AnyProps) {
  return <div className="antd-dialog-title" style={mergeStyle(props)}>{props.children}</div>;
}

export function DialogContent(props: AnyProps) {
  return <div className="antd-dialog-content" style={mergeStyle(props)}>{props.children}</div>;
}

export function DialogActions(props: AnyProps) {
  return <div className="antd-dialog-actions" style={mergeStyle(props)}>{props.children}</div>;
}

export function Drawer(props: AnyProps) {
  return <aside className={`antd-permanent-drawer ${props.className ?? ''}`}>{props.children}</aside>;
}

export function Toolbar(props: AnyProps) {
  return (
    <div
      {...cleanProps(props)}
      className={`antd-toolbar ${props.className ?? ''}`}
      style={{ minHeight: 64, ...mergeStyle(props) }}
    >
      {props.children}
    </div>
  );
}

export function List(props: AnyProps) {
  return <div {...cleanProps(props)} style={mergeStyle(props)}>{props.children}</div>;
}

export function ListItemButton(props: AnyProps) {
  const { component: Component = 'button', selected, children, ...rest } = props;
  return (
    <Component
      {...cleanProps(rest)}
      className={`antd-list-item-button${selected ? ' selected' : ''} ${props.className ?? ''}`}
      style={mergeStyle(rest)}
    >
      {children}
    </Component>
  );
}

export function ListItemIcon(props: AnyProps) {
  return <span className="antd-list-item-icon" style={mergeStyle(props)}>{props.children}</span>;
}

export function ListItemText(props: AnyProps) {
  return <span className="antd-list-item-text">{props.primary}</span>;
}

export function Collapse(props: AnyProps) {
  return props.in ? <div>{props.children}</div> : null;
}

export function Menu(props: AnyProps) {
  if (!props.open) return null;
  return <div className="antd-pop-menu">{props.children}</div>;
}

export function MenuItem(props: AnyProps) {
  if ('value' in props && !props.onClick) return <>{props.children}</>;
  return <button type="button" className="antd-pop-menu-item" onClick={props.onClick}>{props.children}</button>;
}

export function InputAdornment(props: AnyProps) {
  return <span className="antd-input-adornment">{props.children}</span>;
}

export function Link(props: AnyProps) {
  const { component: Component = 'a', children, ...rest } = props;
  return <Component {...cleanProps(rest)} style={mergeStyle(rest)}>{children}</Component>;
}

export function Breadcrumbs(props: AnyProps) {
  const items = Children.toArray(props.children);
  return (
    <nav className="antd-breadcrumbs" style={mergeStyle(props)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item}
          {index < items.length - 1 && <span className="antd-breadcrumb-separator">/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function Snackbar(props: AnyProps) {
  if (!props.open) return null;
  return <div className="antd-snackbar">{props.message}</div>;
}

export function Tabs(props: AnyProps) {
  const { value, onChange, children, ...rest } = props;
  return (
    <div className="antd-tabs" style={mergeStyle(rest)}>
      <div className="antd-tabs-nav">
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return null;
          const tab = child as ReactElement<AnyProps>;
          return (
            <button
              type="button"
              className={`antd-tab${tab.props.value === value ? ' active' : ''}`}
              onClick={() => onChange?.(null, tab.props.value)}
            >
              {tab.props.label}
            </button>
          );
        })}
      </div>
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return null;
        const tab = child as ReactElement<AnyProps>;
        return tab.props.value === value ? <div className="antd-tab-panel">{tab.props.children}</div> : null;
      })}
    </div>
  );
}

export function Tab(_props: AnyProps) {
  return null;
}

export function Grid2(props: AnyProps) {
  const { container, spacing: gapValue = 0, size, children, ...rest } = props;
  if (container) {
    return (
      <div
        {...cleanProps(rest)}
        className="antd-grid-container"
        style={{ gap: toSpace(gapValue), ...mergeStyle(rest) }}
      >
        {children}
      </div>
    );
  }
  const span = typeof size === 'object' ? (size.lg ?? size.md ?? size.sm ?? size.xs ?? 12) : size ?? 12;
  return (
    <div
      {...cleanProps(rest)}
      className="antd-grid-item"
      style={{ gridColumn: `span ${Math.min(12, span)}`, ...mergeStyle(rest) }}
    >
      {children}
    </div>
  );
}

export function ToggleButtonGroup(props: AnyProps) {
  const { value, onChange, children, ...rest } = props;
  return (
    <div {...cleanProps(rest)} className="antd-toggle-group" style={mergeStyle(rest)}>
      {Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<AnyProps>, {
              selected: (child as ReactElement<AnyProps>).props.value === value,
              onGroupChange: onChange,
            })
          : child,
      )}
    </div>
  );
}

export function ToggleButton(props: AnyProps) {
  const { value, selected, onGroupChange, children, ...rest } = props;
  return (
    <AntButton
      {...cleanProps(rest)}
      type={selected ? 'primary' : 'default'}
      onClick={(event) => onGroupChange?.(event, value)}
      style={mergeStyle(rest)}
    >
      {children}
    </AntButton>
  );
}

export function Stepper(props: AnyProps) {
  return <div className="antd-stepper">{props.children}</div>;
}

export function Step(props: AnyProps) {
  return <span className="antd-step">{props.children}</span>;
}

export function StepLabel(props: AnyProps) {
  return <span>{props.children}</span>;
}

export function Table(props: AnyProps) {
  return <table {...cleanProps(props)} className="antd-native-table" style={mergeStyle(props)}>{props.children}</table>;
}

export function TableHead(props: AnyProps) {
  return <thead>{props.children}</thead>;
}

export function TableBody(props: AnyProps) {
  return <tbody>{props.children}</tbody>;
}

export function TableRow(props: AnyProps) {
  return <tr {...cleanProps(props)} style={mergeStyle(props)}>{props.children}</tr>;
}

export function TableCell(props: AnyProps) {
  const { align, colSpan, children, ...rest } = props;
  const TagName = rest.component === 'th' ? 'th' : 'td';
  return <TagName colSpan={colSpan} style={{ textAlign: align, ...mergeStyle(rest) }}>{children}</TagName>;
}

export function TablePagination(props: AnyProps) {
  return <div className="antd-table-pagination">共 {props.count} 条</div>;
}

export const Paper = Box;
