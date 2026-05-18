import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid2 as Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EmptyState from '@/components/EmptyState';
import { MOCK_APP_USAGE, MOCK_USER_ACTIVITY } from '@/data/mock';

type Range = '1d' | '7d' | '30d';

const SUMMARY = [
  { key: 'apps', label: '应用总数', icon: AppsIcon, color: '#4BB8FA' },
  { key: 'users', label: '注册用户数', icon: PeopleAltIcon, color: '#4BB8FA' },
  { key: 'calls', label: '总调用次数', icon: QueryStatsIcon, color: '#4BB8FA' },
  { key: 'active', label: '活跃用户数', icon: HowToRegIcon, color: '#4BB8FA' },
];

export default function OpsOverviewPage() {
  const [range, setRange] = useState<Range>('7d');

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            监控总览
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 13, mt: 0.5 }}>
            观察应用调用情况与用户活跃度，定位高频应用与活跃用户群体
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={range}
          exclusive
          color="primary"
          size="small"
          onChange={(_, v) => v && setRange(v)}
        >
          <ToggleButton value="1d">今日</ToggleButton>
          <ToggleButton value="7d">近 7 天</ToggleButton>
          <ToggleButton value="30d">近 30 天</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Grid container spacing={2}>
        {SUMMARY.map((m) => {
          const Icon = m.icon;
          return (
            <Grid key={m.key} size={{ xs: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                        {m.label}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 28, fontWeight: 700, mt: 0.5, color: 'text.disabled' }}
                      >
                        —
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                        待真实数据接入
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        bgcolor: `${m.color}1A`,
                        color: m.color,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon fontSize="small" />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}

        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
                应用使用次数
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2 }}>
                统计各 AI 应用在当前时间范围内的调用次数与独立使用人数
              </Typography>
              {MOCK_APP_USAGE.length === 0 ? (
                <EmptyState
                  title="暂无应用使用记录"
                  description="待应用接入埋点上报后，将按应用展示调用次数、独立使用人数与最近使用时间"
                  height={220}
                />
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>应用</TableCell>
                      <TableCell align="right">调用次数</TableCell>
                      <TableCell align="right">独立用户</TableCell>
                      <TableCell>最近使用</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {MOCK_APP_USAGE.map((r) => (
                      <TableRow key={r.appId} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{r.appName}</TableCell>
                        <TableCell align="right">{r.callCount.toLocaleString()}</TableCell>
                        <TableCell align="right">{r.uniqueUsers}</TableCell>
                        <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>
                          {r.lastUsedAt}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
                用户活跃度
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2 }}>
                统计活跃用户的登录与应用使用次数
              </Typography>
              {MOCK_USER_ACTIVITY.length === 0 ? (
                <EmptyState
                  title="暂无活跃记录"
                  description="待登录与使用行为采集后，将按用户展示活跃度排行"
                  height={220}
                />
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>用户</TableCell>
                      <TableCell align="right">登录次数</TableCell>
                      <TableCell align="right">应用使用</TableCell>
                      <TableCell>最近活跃</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {MOCK_USER_ACTIVITY.map((r) => (
                      <TableRow key={r.userId} hover>
                        <TableCell>
                          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                            {r.displayName}
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                            {r.enterprise}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{r.loginCount}</TableCell>
                        <TableCell align="right">{r.appUsedCount}</TableCell>
                        <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>
                          {r.lastActiveAt}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
