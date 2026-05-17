# syntax=docker/dockerfile:1.6
# =================================================================
#  AI 应用聚合平台 —— 多阶段构建
#  Stage 1: 用 Node 编译产出 dist/
#  Stage 2: 用 nginx 提供静态服务（含 SPA 路由 fallback + gzip + 缓存）
#  最终镜像 ≈ 50MB（nginx:alpine 基础镜像 + dist 静态产物）
# =================================================================

# ---------- Stage 1: builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

# 国内或受限网络环境可改为镜像源（按需取消注释）
# RUN npm config set registry https://registry.npmmirror.com

# 先拷依赖清单，最大化利用 docker 层缓存
COPY package.json package-lock.json ./

# 严格按 lock 安装（CI/CD 推荐 npm ci）
RUN npm ci --no-audit --no-fund

# 再拷源码
COPY tsconfig.json tsconfig.node.json vite.config.ts index.html ./
COPY public ./public
COPY src ./src

# 类型检查 + 构建
RUN npm run build


# ---------- Stage 2: nginx 静态服务 ----------
FROM nginx:1.27-alpine AS runtime

# 删默认站点配置
RUN rm -f /etc/nginx/conf.d/default.conf

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 健康检查（HEAD /）
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
