# Grokbot Harness — bfe1879

此仓库保留 **bfe1879** 版本的 `src/`、`packages/`、`dune/` 结构，将先前
2bea36a 恢复项目中验证过的本地适配迁移到新版。**构建根目录是本仓库根目录**，
不是 `packages/grok-bot-harness`。本机路径为 `/Users/river/Developer/gbh`。

默认 `local` 版本在本地运行 Host、Agent、Linux Sandbox、搜索与语音服务；
模型推理调用你配置的 OpenAI Responses 兼容 API。登录、计费、云端部署与远端同步
由构建配置禁用，原实现保留。`original` 版本保留原路径及其原有运行条件，未验证厂商服务。

[构建配置原理](runtime/BUILD_PROFILES.md) · [迁移及验证状态](MIGRATION_STATUS.md) ·
[语音实现](runtime/VOICE.md) · [维护约定](AGENTS.md)

## 1. 环境要求

- Node.js **22.16+**、npm、Python **3.9+**。
- Docker Desktop 已启动，能运行 `linux/amd64` 容器。
- 桌面当前验证平台为 **Intel macOS**，使用 Electron **42.1.0**。
  复制的桌面资源版本为 **0.44.0**，与 Host bfe1879 分别标注版本。
- 首次安装需要下载 npm 依赖、Electron、Docker 镜像和语音模型；需要相应网络与磁盘空间。
  模型缓存完成后，语音推理在本地运行。全新 checkout 的首次启动可能明显慢于后续启动。

```sh
cd /Users/river/Developer/gbh
node --version
python3 --version
docker info
npm ci
npm ci --prefix runtime
```

`vendor/` 中已保存运行所需的发布依赖和桌面资源；不依赖另一份仓库或已安装的
Grok Bot.app。Node/npm 依赖和 Docker 镜像仍按 lockfile / 固定镜像摘要安装。

## 2. 配置模型 API 与密钥

配置模板是根目录 [.env.example](.env.example)。首次配置可以复制为 `.env`；
已有 `.env` 时直接编辑，避免覆盖现有配置。

```sh
# 仅首次创建配置时执行
cp .env.example .env
chmod 600 .env
```

编辑 `.env`：

```dotenv
GROKBOT_RESPONSES_BASE_URL=http://litellm.home/v1
GROKBOT_MODEL=gpt-5.6-sol
GROKBOT_REASONING_EFFORT=low
GROKBOT_CONTEXT_TOKENS=128000
GROKBOT_INFERENCE_TIMEOUT_MS=180000
```

URL 是 API 的 base URL（含 `/v1`，不要再写 `/responses`）；适配器会调用
`/responses`，要求服务支持流式响应、工具调用及工具结果回传。

推荐在启动后端的同一个终端设置密钥。macOS 默认 zsh 下可交互输入，避免把真实值写进命令历史：

```sh
read -rs 'LITELLM_API_KEY?API key: '
printf '\n'
export LITELLM_API_KEY
```

也可在未跟踪的 `.env` 中设置 `LITELLM_API_KEY=实际密钥`。不要将真实密钥写入
`.env.example`、README 或 Git。根 `.env` 的非空 `GROKBOT_*` / `LITELLM_API_KEY`
会覆盖同名 shell 环境变量；因此若想使用新 export 的 key，请清空或移除 `.env` 中的旧 key。
配置加载代码在 [runtime/config.cjs](runtime/config.cjs)。

本机验证时 `litellm.home` 无法解析，未跟踪的 `.env` 改用了同一服务器的
`http://192.168.0.104:4000/v1`。请按你的网络环境设置，仓库默认值仍为域名。
若 API 跑在本机 `127.0.0.1` / `localhost`，启动器会将容器内使用的地址转换为
`host.docker.internal`，避免容器访问自身。特殊情况下可设置 `GROKBOT_CONTAINER_API_URL`
单独指定容器访问地址；它优先于上述自动转换。

## 3. 构建、启动与停止

在仓库根目录执行：

```sh
npm run build -- --profile local
npm run prepare:desktop -- --profile local
npm start
npm run status
npm run start:desktop -- --profile local
```

`build` 先编译本地 TypeScript 适配，再根据 `reconstruction-manifest.json` 重建
Host bundle。`prepare:desktop` 将保留的桌面资源、桌面适配及本地编译结果组装到独立目录。
这不是生成已签名的 `.app` / DMG 安装包；桌面命令使用开发用 Electron 启动组装结果。

`npm start` 创建本仓库独立的 **gbh-local** Compose stack。语音首次下载模型期间请等待
`npm run status` 显示 healthy；Host 启动成功不代表外部模型 key 已通过验证。

| 地址 | 用途 |
| --- | --- |
| `http://127.0.0.1:1540` | Host Gateway，容器内部为 1340；业务 API 需要本地 token |
| `http://127.0.0.1:6180` / `6181` | Linux Sandbox 的 noVNC 显示端口，容器内部为 6080 / 6081 |
| `http://search:8080` | 仅 Compose 网络内的搜索服务 |
| `http://speech:8000` | 仅 Compose 网络内的识别 / 合成服务 |

```sh
npm run logs                  # 最近的服务日志
npm stop                      # 停止此仓库的容器，保留数据
node runtime/manage.cjs restart # 重启现有容器，不刷新其环境变量
```

关闭 Electron 窗口/进程与停止容器是两件事。修改 `.env`、image、挂载或 Compose overlay
后执行 **`npm start`** 以更新/重建容器，单纯 restart 不会更新已有容器的环境配置。
修改 Host 源码后先重新 build，再重启 Host；修改桌面或本地适配后重新 build、prepare，
退出并重新启动桌面。不要在进行中的 Agent 任务中切换构建产物。

## 4. Build profile 与功能开关

构建定义在 [runtime/build-profiles.json](runtime/build-profiles.json)，默认 `local`。

| 功能 | `local` | `original` |
| --- | --- | --- |
| 本地 workspace / 自定义 Responses API | 启用本地适配 | 使用原实现 |
| 厂商登录、计费、云端部署、远端同步 | 禁用，代码保留 | 允许原路径，仍受账号及原有 feature gates 约束 |
| 原 Agent / Sandbox 工具与审批 | 保留 | 保留 |

```sh
# 只构建 original，不登录、不启动远端服务
npm run build -- --profile original
npm run prepare:desktop -- --profile original
```

两套产物分别位于 `.runtime/build` / `.runtime/desktop` 和
`.runtime/build-original` / `.runtime/desktop-original`。`npm start` 专用于 local stack。
生成的 `build-profile.json` 在应用代码启动前生效；不要直接编辑生成文件，
也不能靠 export `GROKBOT_LOCAL_MODE=0` 把 local 构建切换回 original。

**当前账号相关功能是成组切换，不是四个独立开关。** 不存在独立可用的
`DISABLE_BILLING` 或 `ENABLE_CLOUD` 参数。原始实验开关仍在源码中，开发 override 受原有
开发模式规则限制，不能绕过 local profile 的账号服务禁用。详见 [BUILD_PROFILES.md](runtime/BUILD_PROFILES.md)。

其他实际可用设置：

| 配置位置 | 设置 | 作用 / 生效方式 |
| --- | --- | --- |
| `.env` | `GROKBOT_LOCAL_VOICE=0` / `1` | 禁用 / 启用桌面本地通话入口，默认 1；重启桌面。不会停止 speech 服务或取消听写/预览 |
| `.env` | `GROKBOT_SEARCH_BASE_URL` | Host 搜索服务地址，默认 `http://search:8080`；`npm start` |
| `.env` | `GROKBOT_TRANSCRIPTION_BASE_URL`、`GROKBOT_TTS_BASE_URL` | Host 语音服务地址，默认 `http://speech:8000`；`npm start` |
| `.env` | `GROKBOT_SPEECH_THREADS` | CPU 语音服务线程数，默认 4；`npm start` |
| 桌面 Plugins / MCP 设置 | 启用 / 禁用服务器工具，安装 / 卸载插件 | workspace 配置持久化；不要手改生成 bundle |
| 桌面 Settings | Auto-review、本机执行权限 | 见下节；与 Docker 文件权限分别控制 |

本地版不要求启用每项服务才使用文本 Agent；但当前默认 Compose 仍会启动 search 和 speech。
关闭语音入口并不会移除相应镜像。要删减 Compose 服务，需要同步调整 `depends_on` 及相关
工具可用性，目前没有统一的逐服务 build 开关。

## 5. Sandbox 与本机权限

### Linux Sandbox 和 Mac 本机执行是两条路径

Agent 默认的 Shell / Read / Screenshot 在 Linux Box 内执行，能访问容器文件系统及显式挂载。
MacShell / MacRead 等本机工具通过桌面执行桥，遵循原有本机权限审批。构建 local
并不等于允许 Agent 任意操作 Mac。

桌面 Settings 的本机执行设置（`sand-setting-local-execution`）支持：

| 值 | 含义 |
| --- | --- |
| `ask`（默认） | 对本机执行请求弹出审批，可允许一次或拒绝 |
| `never` | 禁止本机工具，不会停止 Linux Sandbox 的 Shell |
| `always` | 授予本机执行的常驻权限；仍受对应操作类型、权限上限及其他审批约束 |

界面中可选择相应选项，例如 **Never allow**。按机器保存的设置优先于默认设置，
并保存在本地 Host 数据中。不要把“允许本机工具”与“给容器挂载某个目录”混为一谈。

### Auto-review

在应用 Settings 中配置 Auto-review 是否启用及其指令。本地审查使用同一 Responses API
和 `GROKBOT_MODEL`，保留原审批流程。需要固定运行模式时，在下一节的 Compose overlay
中为 app 设置：

```yaml
services:
  app:
    environment:
      SAND_AUTO_REVIEW_MODE: enforce
```

支持 `enforce`（执行审查决策）、`shadow`（审查但不强制拦截）、`off`（关闭这一层审查）。
**此项只有 Settings 的 Auto-review 已开启时才生效**；`enforce` 不会替你开启 Settings。
关闭 Auto-review 不会改变 Docker 文件权限，也不会自动授予 Mac 本机工具权限。
任意 `SAND_*` 不会从根 `.env` 自动透传进容器，使用 overlay 的 `environment` 显式设置。

### 文件与网络边界

挂载 `:ro` 可禁止容器修改那个挂载目录；`:rw` 允许修改，仍受宿主机/容器文件权限约束。
Docker Desktop 必须允许共享对应宿主路径。默认不是无网络沙箱：模型 API、搜索、MCP
可能需要网络。挂载和工具审批不能替代网络隔离。不要为普通 workspace 挂载添加
`privileged: true`，也不需要挂载 Docker socket。

## 6. 选择镜像、挂载目录和自定义启动参数

image 是容器的基础文件系统，volume/bind mount 则把宿主目录映射进去，两者分别设置。
默认镜像与全部默认挂载在 [runtime/compose.yaml](runtime/compose.yaml)。

| 宿主路径（相对仓库根） | 容器路径 | 模式 / 用途 |
| --- | --- | --- |
| `.runtime/build/sand-host` | `/home/box/sand-host` | 只读，重建 Host |
| `.runtime/build/deps` | `/home/box/deps` | 只读，原生依赖 |
| `.runtime/data` | `/home/box/sand-data` | 读写，Agent、设置和会话持久化 |
| `.runtime/workspace` | `/workspace` | 读写，工作文件 |
| `runtime/box-entrypoint.sh` | `/opt/grokbot/box-entrypoint.sh` | 只读，启动入口 |
| `runtime/tests` | `/opt/grokbot/tests` | 只读，验证脚本 |
| `.runtime/models/whisper` / `kokoro` | speech 容器 `/models` / `/tts-models` | 语音模型缓存 |

### 替换 workspace 或 image

在 `.env` 中设置绝对宿主路径：

```dotenv
GROKBOT_WORKSPACE_DIR=/Users/river/Developer/my-project
# 可选：本地已构建或能拉取的兼容镜像
GROKBOT_SANDBOX_IMAGE=gbh-sandbox:dev
```

确保目录存在，然后运行 `npm start`。未设置时使用仓库的 `.runtime/workspace`
和固定 SHA-256 的原始 Box image。只设置需要改变的选项，空值继续使用默认值。

自定义 image 必须兼容 `linux/amd64`，保留 `/exec-daemon/node`、
`/usr/local/bin/start-sand-box`、Box 用户、执行 daemon 以及截图/显示服务。
普通 Ubuntu/Node 镜像不能直接替换。可从 Compose 中固定的原镜像派生：

```dockerfile
FROM public.ecr.aws/k0i0n2g5/cursorenvironments/universal@sha256:322c3a9031d61e210a05400dd74c82bbb1fdb42db315a8cf5ab39368c2f0c1c8
# 在此安装所需工具，保留原有 Box 启动和执行组件。
```

保存到 `.runtime/Dockerfile.sandbox`，执行：

```sh
docker build --platform linux/amd64 -t gbh-sandbox:dev -f .runtime/Dockerfile.sandbox .runtime
npm start
```

### 添加只读资料目录或额外环境变量

创建忽略追踪的 `.runtime/compose.local.yaml`：

```yaml
services:
  app:
    volumes:
      - /Users/river/Documents/reference:/mnt/reference:ro
      - /Users/river/Developer/output:/mnt/output:rw
    environment:
      SAND_AUTO_REVIEW_MODE: enforce
```

在根 `.env` 中设置：

```dotenv
GROKBOT_COMPOSE_OVERRIDE=.runtime/compose.local.yaml
```

然后 `npm start`。此路径相对于**仓库根**解析；overlay 内的相对 bind mount 路径则遵循
Compose 的规则，相对于第一个配置文件所在的 **`runtime/`** 目录解析，因此推荐绝对路径。
启动器对 start、stop、status、logs、restart 使用同一 overlay；用完要停止相关容器后再修改配置。
同一容器 target 的 volume 会覆盖基础配置，不要意外遮盖 `/home/box/sand-host` 或 `deps`。

自定义端口请修改 `runtime/compose.yaml` 的映射；同步给桌面 shell 设置
`SAND_HOST_GATEWAY_URL=http://127.0.0.1:新端口` 再启动。根 `.env` 的 loader 不读取
`SAND_*`，因此桌面此项使用 shell export。当前 noVNC/Gateway 默认只发布到 loopback。

## 7. 数据、产物和维护

`.runtime/` 保存本仓库的构建产物、workspace、Agent 数据、模型、桌面 profile 和自动生成的
Gateway token / search secret；`dist/local` 是严格 TypeScript 的输出。以上目录和 `.env`
不提交。`npm stop` 不删除这些数据；备份 `.runtime/data`、`.runtime/workspace` 与
`.runtime/profiles` 前先停止写入。不要复制旧项目的 key 或账号状态来初始化新项目。

| 源目录 | 职责 |
| --- | --- |
| `src/host` / `src/shared` | Host 扩展、Gateway、协议与共享服务 |
| `packages/grok-bot-harness` | Agent 循环、工具、记忆、MCP；其 `src/local` 为本地适配 |
| `packages` / `dune` | 保留的执行、插件、扩展/RPC/调度等包 |
| `sand-host` | 不修改的 bfe1879 发布基线 |
| `reconstruction` | bundle 专用变体与独立脚本 |
| `runtime` | 构建配置、启动器、桌面适配、搜索/语音与测试 |
| `vendor` | 复制资源、依赖、来源信息与哈希清单 |
| `tools` | 源码恢复工具；`npm run recover` 导出到新的忽略目录 |

恢复的 `.ts` 文件仍包含发布后 JavaScript 和 bundle 作用域符号；不能声称已经还原了
原始类型/import。构建依赖 `// @recovered-fragment` 边界，修改映射源码即可重建 bundle。
大范围机械 diff 补的是精确边界与初始化片段，不是用旧 Host 覆盖新版。
`reconstruction-manifest.json` 的 `outputHashes` 记录干净恢复基线；本地修改的产物哈希
记录在 `.runtime/build/build-manifest.json`。末尾空行属于原发布字节，`.gitattributes` 为恢复目录保留该格式。

## 8. 验证与常见问题

```sh
npm run check:local
npm run test:recovery
npm run test:runtime-build
npm run test:responses-contract
npm run test:voice
npm run test:mcp-scopes
npm run test:plugin-files
# 真实模型验证，需要当前 shell / .env 提供 key
npm run test:responses
```

完整实测范围见 [MIGRATION_STATUS.md](MIGRATION_STATUS.md)。容器中原 Agent 验证：

```sh
docker exec gbh-local-app-1 /exec-daemon/node /opt/grokbot/tests/agent-sandbox.cjs
```

该测试使用确定性模型 fixture 与真实 Sandbox，不能替代真实 API 测试。共享同一个 Box
的 Agent/截图测试请串行运行，避免争用显示资源。

| 症状 | 排查方式 |
| --- | --- |
| `fetch failed` | 检查 API 域名/DNS、地址和端口；确认 Mac 与容器均能访问；检查是否需要 `GROKBOT_CONTAINER_API_URL` |
| API 401 / 403 | 检查当前 key，以及 `.env` 是否覆盖了新 export；不要打印完整环境或 token |
| 修改 key 后仍报错 | 执行 `npm start` 更新容器环境；仅 restart 不会换 key |
| 语音 unhealthy / 等待很久 | `npm run logs` 查看模型下载/加载；首次启动需下载，Intel CPU 推理也有延迟 |
| 桌面连接不上 | 检查 `npm run status`、Gateway 1540、对应 local profile 及本仓库生成的 token |
| 挂载不可写 | 检查 `ro/rw`、Docker Desktop 文件共享和文件所有权；本机工具的 Always 不会改变 volume 权限 |
| 缺少编译文件 / profile 不匹配 | 从根目录依次 build、prepare:desktop，并保持相同 profile |

尚未完成或未在新版全面验证的图像生成、完整通话、Mac GUI 等范围有单独状态记录。
Eval 执行不属于本次恢复目标。
