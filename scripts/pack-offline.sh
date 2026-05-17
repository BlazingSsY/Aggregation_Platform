#!/usr/bin/env bash
# =================================================================
#  打包离线部署包（在有 Docker 的开发机执行）
#  产出: ./offline-package/
#    ├── aap-frontend.tar         # 镜像（docker load 用）
#    ├── docker-compose.yml       # 一键启动配置
#    ├── install.sh               # 离线机执行脚本
#    └── README.txt               # 简版操作说明
#
#  使用：
#    bash scripts/pack-offline.sh
# =================================================================

set -euo pipefail

IMAGE_NAME="aap-frontend:latest"
OUT_DIR="$(pwd)/offline-package"
TAR_FILE="${OUT_DIR}/aap-frontend.tar"

echo "==> 1/4 构建镜像 ${IMAGE_NAME}"
docker build -t "${IMAGE_NAME}" .

echo "==> 2/4 准备输出目录 ${OUT_DIR}"
rm -rf "${OUT_DIR}"
mkdir -p "${OUT_DIR}"

echo "==> 3/4 导出镜像 → ${TAR_FILE}"
docker save -o "${TAR_FILE}" "${IMAGE_NAME}"

echo "==> 4/4 复制启动脚本"
cp docker-compose.yml "${OUT_DIR}/"

cat > "${OUT_DIR}/install.sh" <<'INSTALL'
#!/usr/bin/env bash
# 在离线服务器上执行（前提：已安装 Docker 引擎）
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"

echo "==> 加载镜像 aap-frontend.tar"
docker load -i "${HERE}/aap-frontend.tar"

echo "==> 启动容器（端口 5177）"
if command -v docker-compose >/dev/null 2>&1; then
  cd "${HERE}" && docker-compose up -d
elif docker compose version >/dev/null 2>&1; then
  cd "${HERE}" && docker compose up -d
else
  docker run -d \
    --name aap-frontend \
    --restart unless-stopped \
    -p 5177:80 \
    aap-frontend:latest
fi

echo ""
echo "==> 已启动，访问 http://<本机IP>:5177"
echo "    查看日志: docker logs -f aap-frontend"
echo "    停止:    docker stop aap-frontend && docker rm aap-frontend"
INSTALL
chmod +x "${OUT_DIR}/install.sh"

cat > "${OUT_DIR}/README.txt" <<'TXT'
AI 应用聚合平台 —— 离线部署包
================================

【前提】目标 Linux 服务器已安装 Docker 引擎（任何 20.10+ 版本均可）。
       若服务器完全无任何工具，请先用 Docker 官方离线安装包安装 Docker：
       https://docs.docker.com/engine/install/binaries/

【步骤】
1. 把整个 offline-package/ 目录拷到目标服务器（U盘 / scp / 内网传输等）。
2. 进入该目录：
       cd offline-package
3. 执行一键安装：
       bash install.sh
4. 浏览器访问：
       http://<服务器IP>:5177
   默认账号：admin / admin

【常用】
- 查看日志:   docker logs -f aap-frontend
- 停止服务:   docker stop aap-frontend && docker rm aap-frontend
- 卸载镜像:   docker rmi aap-frontend:latest
- 调整端口:   编辑 docker-compose.yml 的 ports 字段后 docker compose up -d
TXT

# 计算包体积
SIZE=$(du -sh "${OUT_DIR}" | awk '{print $1}')
echo ""
echo "============================================"
echo " 离线部署包已生成：${OUT_DIR}"
echo " 总体积：${SIZE}"
echo " 内容："
ls -lh "${OUT_DIR}" | awk 'NR>1 {print "   " $NF " (" $5 ")"}'
echo "============================================"
