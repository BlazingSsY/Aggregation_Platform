import {
  Box,
  Card,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import type { RoleRow } from '@/data/mock';

interface Props {
  rows: RoleRow[];
  activeId: string;
  isSuperAdmin: boolean;
  enterpriseOptions: string[];
  search: string;
  statusFilter: 'all' | 'enabled' | 'disabled';
  enterpriseFilter: string;
  onSearchChange: (v: string) => void;
  onStatusFilterChange: (v: 'all' | 'enabled' | 'disabled') => void;
  onEnterpriseFilterChange: (v: string) => void;
  onSelect: (id: string) => void;
  onEdit: (row: RoleRow) => void;
  onCopy: (row: RoleRow) => void;
  onDelete: (row: RoleRow) => void;
  onToggleStatus: (id: string, status: 'enabled' | 'disabled') => void;
}

export default function RolesTable({
  rows,
  activeId,
  isSuperAdmin,
  enterpriseOptions,
  search,
  statusFilter,
  enterpriseFilter,
  onSearchChange,
  onStatusFilterChange,
  onEnterpriseFilterChange,
  onSelect,
  onEdit,
  onCopy,
  onDelete,
  onToggleStatus,
}: Props) {
  return (
    <Card>
      <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
        <TextField
          placeholder="搜索角色名称或编码"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ maxWidth: 280 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        {isSuperAdmin && (
          <TextField
            select
            value={enterpriseFilter}
            onChange={(e) => onEnterpriseFilterChange(e.target.value)}
            sx={{ width: 160 }}
            label="所属企业"
          >
            <MenuItem value="all">全部企业</MenuItem>
            {enterpriseOptions.map((e) => (
              <MenuItem key={e} value={e}>
                {e}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as never)}
          sx={{ width: 140 }}
          label="状态"
        >
          <MenuItem value="all">全部状态</MenuItem>
          <MenuItem value="enabled">启用</MenuItem>
          <MenuItem value="disabled">停用</MenuItem>
        </TextField>
      </Toolbar>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>角色名称</TableCell>
              <TableCell>编码</TableCell>
              <TableCell>所属</TableCell>
              <TableCell align="right">用户数</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>更新时间</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow
                key={r.id}
                hover
                selected={r.id === activeId}
                sx={{ cursor: 'pointer' }}
                onClick={() => onSelect(r.id)}
              >
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {r.name}
                    </Typography>
                    {r.builtin && r.code !== 'super_admin' && (
                      <Chip size="small" label="内置" color="info" variant="outlined" />
                    )}
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{r.code}</TableCell>
                <TableCell>{r.enterprise}</TableCell>
                <TableCell align="right">{r.userCount}</TableCell>
                <TableCell>
                  <Switch
                    size="small"
                    checked={r.status === 'enabled'}
                    disabled={r.builtin}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      onToggleStatus(r.id, e.target.checked ? 'enabled' : 'disabled')
                    }
                  />
                </TableCell>
                <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{r.updatedAt}</TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="查看">
                    <IconButton size="small" onClick={() => onSelect(r.id)}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="编辑">
                    <IconButton size="small" onClick={() => onEdit(r)}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="复制">
                    <IconButton size="small" onClick={() => onCopy(r)}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={r.builtin ? '内置角色不可删除' : '删除'}>
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        disabled={r.builtin}
                        onClick={() => onDelete(r)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}
