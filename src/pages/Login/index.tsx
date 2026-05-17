import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Link as MuiLink,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { ROLE_NAME_TO_KEY, useAuth, type RoleKey } from '@/auth/AuthContext';
import { MOCK_USERS } from '@/data/mock';

const SHARED_PWD = 'admin';

/** admin/admin 兜底为 admin1（超级管理员） */
function resolveAccount(input: string) {
  const key = input.trim();
  if (!key) return null;
  if (key === 'admin') return MOCK_USERS.find((u) => u.username === 'admin1') ?? null;
  return MOCK_USERS.find((u) => u.username === key) ?? null;
}

const ERROR_MESSAGES: Record<string, string> = {
  password: '账号或密码错误，请重试',
  captcha: '验证码错误或已失效',
  locked: '账号已被锁定，请联系企业管理员',
  disabled: '账号已被禁用',
  enterprise: '所在企业当前已停用',
  unknown: '登录失败，请稍后再试',
};

function useCaptchaCountdown() {
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<number | null>(null);
  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
  }, []);
  const start = (s = 60) => {
    setSeconds(s);
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setSeconds((v) => {
        if (v <= 1) {
          if (timer.current) window.clearInterval(timer.current);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  };
  return { seconds, start };
}

function ForgotDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { seconds, start } = useCaptchaCountdown();

  const reset = () => {
    setStep(0);
    setEmail('');
    setCode('');
    setPwd('');
    setPwd2('');
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const sendCode = () => {
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }
    start(60);
    setStep(1);
  };

  const verifyCode = () => {
    setError(null);
    if (code.length !== 6) {
      setError('请输入 6 位验证码');
      return;
    }
    setStep(2);
  };

  const submit = () => {
    setError(null);
    if (pwd.length < 8 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) {
      setError('密码至少 8 位，且需包含大写字母和数字');
      return;
    }
    if (pwd !== pwd2) {
      setError('两次输入的密码不一致');
      return;
    }
    setSuccess(true);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>忘记密码</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={success ? 3 : step} sx={{ mb: 3 }}>
          <Step><StepLabel>输入邮箱</StepLabel></Step>
          <Step><StepLabel>验证码</StepLabel></Step>
          <Step><StepLabel>设置新密码</StepLabel></Step>
          <Step><StepLabel>完成</StepLabel></Step>
        </Stepper>

        {success ? (
          <Alert severity="success">密码已修改成功，请使用新密码重新登录。</Alert>
        ) : (
          <>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {step === 0 && (
              <TextField
                label="企业邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@your-company.com"
                autoFocus
              />
            )}
            {step === 1 && (
              <Stack spacing={2}>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  验证码已发送至 {email}，5 分钟内有效。
                </Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="6 位验证码"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                  <Button
                    variant="outlined"
                    disabled={seconds > 0}
                    onClick={() => start(60)}
                    sx={{ minWidth: 120 }}
                  >
                    {seconds > 0 ? `${seconds}s 后重发` : '重新发送'}
                  </Button>
                </Stack>
              </Stack>
            )}
            {step === 2 && (
              <Stack spacing={2}>
                <TextField
                  type="password"
                  label="新密码"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  helperText="至少 8 位，包含大写字母和数字"
                />
                <TextField
                  type="password"
                  label="确认新密码"
                  value={pwd2}
                  onChange={(e) => setPwd2(e.target.value)}
                />
              </Stack>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{success ? '关闭' : '取消'}</Button>
        {!success && step === 0 && (
          <Button variant="contained" onClick={sendCode}>
            获取验证码
          </Button>
        )}
        {!success && step === 1 && (
          <Button variant="contained" onClick={verifyCode}>
            下一步
          </Button>
        )}
        {!success && step === 2 && (
          <Button variant="contained" onClick={submit}>
            提交
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

function FindAccountDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'single' | 'multi' | 'none'>('idle');

  const handleClose = () => {
    setEmail('');
    setStatus('idle');
    onClose();
  };

  const submit = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    if (email.startsWith('multi')) setStatus('multi');
    else if (email.startsWith('none')) setStatus('none');
    else setStatus('single');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>找回账号</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            请输入您注册时使用的企业邮箱，系统将向该邮箱发送账号信息。
          </Typography>
          <TextField
            label="企业邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@your-company.com"
            autoFocus
          />
          {status === 'single' && (
            <Alert severity="success">
              已向 {email} 发送账号 demo*****@your-company.com 的找回信息。
            </Alert>
          )}
          {status === 'multi' && (
            <Alert severity="warning">
              该邮箱对应多个账号：demo*****01、demo*****02。如未找到，请联系企业管理员协助。
            </Alert>
          )}
          {status === 'none' && (
            <Alert severity="error">未找到与该邮箱关联的账号，请确认输入是否正确。</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>关闭</Button>
        <Button variant="contained" onClick={submit}>
          找回账号
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromState = (location.state as { from?: string } | null) ?? null;

  const [account, setAccount] = useState('admin');
  const [pwd, setPwd] = useState(SHARED_PWD);
  const [captcha, setCaptcha] = useState('');
  const [remember, setRemember] = useState(true);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [failCount, setFailCount] = useState(0);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [findOpen, setFindOpen] = useState(false);

  const captchaRequired = useMemo(() => failCount >= 2, [failCount]);

  const submit = () => {
    setErrorKey(null);
    if (!account || !pwd) {
      setErrorKey('password');
      return;
    }
    if (captchaRequired && captcha.length !== 4) {
      setErrorKey('captcha');
      return;
    }
    const candidate = resolveAccount(account);
    // 接受两类密码：1) 通用的 'admin'（兼容快捷登录）；2) 用户在「用户管理」中设置/重置后的实际密码
    const passwordMatches =
      !!candidate && (pwd === SHARED_PWD || pwd === candidate.password);
    if (!candidate || !passwordMatches) {
      const next = failCount + 1;
      setFailCount(next);
      setErrorKey(next >= 5 ? 'locked' : 'password');
      return;
    }
    if (candidate.status === 'disabled') {
      setErrorKey('disabled');
      return;
    }

    const roleKey: RoleKey = ROLE_NAME_TO_KEY[candidate.roleName] ?? 'user';
    login({
      userId: candidate.id,
      username: candidate.username,
      displayName: candidate.username === 'admin1' ? '超级管理员' : candidate.displayName,
      email: candidate.email,
      enterprise: candidate.enterprise,
      department: candidate.department,
      roles: [roleKey],
    });
    navigate(fromState?.from ?? '/', { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle 520px at 50% 40%, rgba(22,217,227,0.55) 0%, rgba(48,199,236,0.28) 40%, transparent 72%), radial-gradient(900px 600px at 80% -10%, rgba(70,174,247,0.40) 0%, transparent 60%), radial-gradient(700px 500px at 10% 110%, rgba(217,119,6,0.20) 0%, transparent 60%), linear-gradient(135deg, #082742 0%, #0C3458 30%, #1565A0 55%, #1E7FC7 80%, #30C7EC 100%)',
        px: 2,
        py: 6,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 980,
          minHeight: 520,
          background: '#fff',
          borderRadius: 3,
          boxShadow: '0 30px 60px rgba(8,39,66,0.25)',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            background:
              'linear-gradient(160deg, #082742 0%, #0C3458 45%, #1E7FC7 100%)',
            color: '#fff',
            p: { xs: 4, md: 6 },
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.2,
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(214,239,253,0.18) 100%)',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: '-1px',
                fontFamily:
                  '"PingFang SC", "Microsoft YaHei", "Source Han Sans CN", sans-serif',
                color: '#fff',
                textShadow: '0 1px 2px rgba(8,39,66,0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              机载
            </Box>
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>AI 应用聚合平台</Typography>
          </Stack>
          <Box>
            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 700,
                mb: 1,
                background:
                  'linear-gradient(135deg, #ffffff 0%, #D6EFFD 60%, #46AEF7 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                letterSpacing: 0.5,
              }}
            >
              企业级 AI 能力统一入口
            </Typography>
            <Typography sx={{ fontSize: 14, opacity: 0.85, lineHeight: 1.8 }}>
              整合知识、研发、硬件、办公全场景 AI 应用，提供统一身份、统一权限、统一配额、统一监控。
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 12, opacity: 0.6 }}>
            © {new Date().getFullYear()} 智研航空 · 内部使用，受访问控制保护
          </Typography>
        </Box>

        <Box
          sx={{
            p: { xs: 3, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 700,
                background:
                  'linear-gradient(135deg, #104A78 0%, #1E7FC7 55%, #30C7EC 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                letterSpacing: 0.5,
              }}
            >
              账号登录
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>
              欢迎使用 AI 应用聚合平台
            </Typography>
          </Box>

          {errorKey && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {ERROR_MESSAGES[errorKey]}
            </Alert>
          )}

          <Stack spacing={2}>
            <TextField
              label="账号"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              autoFocus
            />
            <TextField
              type="password"
              label="密码"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
            {captchaRequired && (
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  label="验证码"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value.slice(0, 4))}
                />
                <Box
                  sx={{
                    width: 120,
                    height: 40,
                    borderRadius: 1,
                    background: 'linear-gradient(135deg, #EBF7FE 0%, #D6EFFD 100%)',
                    color: '#1E7FC7',
                    fontWeight: 700,
                    letterSpacing: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    flex: 'none',
                  }}
                  onClick={() => setCaptcha('')}
                >
                  A8K3
                </Box>
              </Stack>
            )}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mt: -0.5 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    size="small"
                  />
                }
                label={<Typography sx={{ fontSize: 13 }}>记住我</Typography>}
              />
              <Stack direction="row" spacing={1.5}>
                <MuiLink
                  component="button"
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  sx={{ fontSize: 13 }}
                >
                  忘记密码
                </MuiLink>
                <MuiLink
                  component="button"
                  type="button"
                  onClick={() => setFindOpen(true)}
                  sx={{ fontSize: 13 }}
                >
                  找回账号
                </MuiLink>
              </Stack>
            </Stack>
          </Stack>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={submit}
            startIcon={<LoginIcon />}
            sx={{ mt: 3, py: 1.2 }}
          >
            登录
          </Button>

          <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 2, textAlign: 'center' }}>
            默认账号：admin / admin（超级管理员）
            <br />
            可切换账号验证权限下放：admin2 / admin3 / user1 / user2 / user3（统一密码 admin）
          </Typography>
        </Box>
      </Box>

      <ForgotDialog open={forgotOpen} onClose={() => setForgotOpen(false)} />
      <FindAccountDialog open={findOpen} onClose={() => setFindOpen(false)} />
    </Box>
  );
}
