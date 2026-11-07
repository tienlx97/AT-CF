# Cấu hình máy mới cho agent (DeepSeek Harness)

Làm một lần trên mỗi máy để chạy agent trên repo này. Quyết định và lý do nằm ở
`docs/adr/0004-deepseek-harness.md`; tài liệu này chỉ là các bước. Máy chính là
Windows 11; ghi chú cho Linux/macOS ở cuối.

Không có bí mật nào trong repo. Khoá model, token đăng nhập, `.env.local`
nằm trên từng máy; đừng commit, đừng dán vào chat hay memory.

## 0. Cần có sẵn

| Công cụ | Phiên bản | Kiểm tra |
|---|---|---|
| Git for Windows (có Git Bash) | bản mới | `git --version` |
| Node.js | 22 LTS (`>=20 <25`) | `node -v` |
| pnpm (qua corepack) | 11.5.3 (`packageManager`) | `corepack enable; pnpm -v` |
| WSL 2 + Ubuntu | | `wsl -l -v` |

## 1. Lấy code

```powershell
git clone <URL repo ANH-TU-COFFEE> ANH-TU-COFFEE
cd ANH-TU-COFFEE
pnpm install --frozen-lockfile        # chưa có pnpm-lock.yaml thì: pnpm install
Copy-Item .env.example .env.local
```

## 2. DeepSeek Harness (dsh)

```powershell
npm install -g @deepseek-ai/dsh@0.2.2-rc.1
dsh --version                            # 0.2.2-rc.1
```

Luôn ghi rõ phiên bản: dsh là bản preview, mỗi lần nâng phải chạy lại
`--dump-config` (bước 7).

## 3. Engram 3.6.2 (memory)

Cài từ bản release có checksum. `go install` của 3.6 cần Go 1.26.

```powershell
$v = '3.6.2'; $d = "$env:TEMP\engram-$v"; New-Item -ItemType Directory -Force $d | Out-Null
$base = "https://github.com/Gentleman-Programming/engram/releases/download/v$v"
Invoke-WebRequest "$base/engram_${v}_windows_amd64.zip" -OutFile "$d\engram.zip"
Invoke-WebRequest "$base/checksums.txt" -OutFile "$d\checksums.txt"
$want = ((Select-String "$d\checksums.txt" -Pattern "engram_${v}_windows_amd64.zip").Line -split '\s+')[0]
if ((Get-FileHash "$d\engram.zip" -Algorithm SHA256).Hash.ToLower() -ne $want) { throw 'checksum sai, dừng lại' }
Expand-Archive "$d\engram.zip" "$d\out" -Force
$bin = "$env:LOCALAPPDATA\Programs\engram"; New-Item -ItemType Directory -Force $bin | Out-Null
Copy-Item "$d\out\engram.exe" $bin -Force
[Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path', 'User') + ";$bin", 'User')
```

Mở terminal mới, rồi trong thư mục repo:

```powershell
engram version                 # 3.6.2
engram doctor                  # ok
engram sync --import           # nạp memory dùng chung từ .engram/
engram stats                   # có session/observation của project anh-tu-coffee
```

dsh gọi `engram mcp` theo tên lệnh, nên `engram` phải nằm trong PATH của tiến
trình dsh. Nếu đã có Engram cũ đang chạy (exe bị khoá), đổi tên file cũ, chép
file mới, rồi dừng tiến trình cũ.

## 4. Node trong WSL (cổng kiểm tra)

Cổng `verify.sh` cần `flock`, nên trên Windows nó chạy trong WSL
(`node harness/verify-wsl.mjs`). WSL cần Node 22 + pnpm riêng ở `~/.local/node`.
Trong Ubuntu (WSL):

```bash
set -euo pipefail
base=https://nodejs.org/dist/latest-v22.x
tmp=$(mktemp -d); cd "$tmp"
curl -fsSLO "$base/SHASUMS256.txt"
file=$(grep -oE 'node-v22[0-9.]+-linux-x64\.tar\.xz' SHASUMS256.txt | head -1)
curl -fsSLO "$base/$file"
grep " $file\$" SHASUMS256.txt | sha256sum -c -
mkdir -p ~/.local/node && tar -xJf "$file" -C ~/.local/node --strip-components=1
export PATH="$HOME/.local/node/bin:$PATH" COREPACK_ENABLE_DOWNLOAD_PROMPT=0
corepack enable --install-directory ~/.local/node/bin
corepack prepare pnpm@11.5.3 --activate
node -v && pnpm -v
```

## 5. Model điều phối (cấu hình cá nhân, không nằm trong repo)

Chạy dsh từ thư mục repo:

```powershell
dsh web --patch harness/dsh/project.cordis.patch.yml
```

Trong **Settings → Models**, chọn model mặc định cho phiên mới. Các đường được
phép (ADR-0004):

- **DeepSeek**: đăng nhập tài khoản DeepSeek hoặc API key.
- **ChatGPT Plus/Pro**: route `openai-codex`, đăng nhập "OpenAI (ChatGPT Plus/Pro)".
- **Claude làm model chính**: route `anthropic` với **Anthropic API key**.
  **Không** bấm "Claude Pro/Max" sign-in: gói Pro/Max chỉ dùng qua Claude Code (bước 6).

Lựa chọn này được lưu ở `~/.dsh/profiles/web/cordis.patch.yml`. Overlay của repo
không bao giờ đặt model, vì `--patch` áp sau lớp profile và sẽ đè lựa chọn của bạn.

### `dsh-plugin-subscriptions` (dùng cho đăng nhập ChatGPT Plus/Pro)

Được phép ở profile cá nhân, theo đúng điều kiện ADR-0004. Chạy tuần tự, đừng chạy
hai lệnh `dsh plugin` song song (chúng giữ chung `package.json.lock` của profile,
lệnh sau sẽ báo "timed out waiting for the writer lock").

```powershell
# 1. Cài plugin, luôn ghi rõ phiên bản
dsh plugin --profile web add dsh-plugin-subscriptions@0.9.12

# 2. Thêm cấu hình vào profile cá nhân (không thêm vào repo; test sẽ chặn).
#    Bỏ qua nếu đã có, nên chạy lại nhiều lần vẫn an toàn.
$patch = "$HOME\.dsh\profiles\web\cordis.patch.yml"
if (-not (Select-String $patch -Pattern 'id: llm-subscriptions' -Quiet)) {
  Add-Content $patch @'
- id: llm-subscriptions
  name: dsh-plugin-subscriptions
  config:
    providers: [codex]          # không bật `claude`; provider khác chỉ sau khi đọc điều khoản của họ
    pool:
      autoAccounts: false       # một tài khoản mỗi provider, không xoay vòng khi bị 429
'@
}
```

Kiểm tra plugin đã vào `dsh.profile.bundles` trong `~/.dsh/profiles/web/package.json`
(lệnh `add` ghi ở bước cuối; nếu `add` bị dừng giữa chừng thì thiếu). Thiếu thì
`--dump-config` báo `patch: entry "llm-subscriptions" not found`: chạy lại `add`
cho tới khi xong.

Nếu `cordis.patch.yml` chưa tồn tại, chạy `dsh web --patch harness/dsh/project.cordis.patch.yml`
một lần để dsh tạo nó (rồi tắt), sau đó làm lại lệnh trên.

Khởi động lại `dsh web`, rồi đăng nhập ở **Settings → Subscriptions** (Codex).
Đăng nhập là thao tác tay trên từng máy, không chép token giữa các máy.

## 6. Tuỳ chọn: subagent Claude Code / Codex

Dùng khi muốn model điều phối giao việc cho Claude Code (gói Claude Pro) hoặc Codex.
**Phải ghi phiên bản**: tag `latest` trên npm của gói Claude Code vẫn trỏ về `0.0.1-rc.1`.

```powershell
dsh plugin --profile web add @deepseek-ai/dsh-subagent-claude-code@0.2.2-rc.1 @deepseek-ai/dsh-subagent-codex@0.2.2-rc.1
claude              # đăng nhập Claude Code một lần (gói Pro)
codex login         # chỉ khi dùng subagent Codex
dsh web --patch harness/dsh/project.cordis.patch.yml --patch harness/dsh/project.subagents.cordis.patch.yml
```

## 7. Kiểm tra máy đã sẵn sàng

```powershell
# Cấu hình dsh: hai dòng egress tắt, MCP engram, model lấy từ profile
dsh web --patch harness/dsh/project.cordis.patch.yml --dump-config > $env:TEMP\dsh.yml
Select-String $env:TEMP\dsh.yml -Pattern 'session-log-deepseek|plugin-package-inventory-deepseek|serverName: engram|patched by' -Context 0,2
Select-String $env:TEMP\dsh.yml -Pattern 'llm-subscriptions' -Context 0,6   # providers: [codex], autoAccounts: false

node harness/sh.mjs ./harness/audit-harness.sh        # tất cả passed
node --test harness/tests/*.test.cjs                  # 0 fail (một số "skipped" trên Windows là bình thường)
node harness/verify-wsl.mjs --change <change>   # cổng đầy đủ trong WSL, ~2 phút
```

Lần chạy cổng đầu sẽ tạo bản clone riêng `~/.harness-gate/ANH-TU-COFFEE` trong WSL và cài
dependency ở đó. Nếu task đầu tiên chưa đánh dấu của change không còn, dùng một
change đang mở khác (`ls openspec/changes`).

## 8. Phiên thử

Trong `dsh web`, mở phiên mới ở thư mục repo và yêu cầu: "dùng skill
`project-task` làm task tiếp theo của change `<tên>`". Một phiên đúng sẽ:

1. Gọi `mem_current_project` (ra `anh-tu-coffee`), `mem_session_start`, `mem_search`.
2. Chạy `node harness/task.mjs context <change>` và chỉ làm một task.
3. Chạy `node harness/verify-wsl.mjs --change <change>`, đọc `status` `fresh: true`.
4. Đánh dấu task, ghi đầu `harness/PROGRESS.md`, `mem_save`, `mem_session_finalize`,
   `engram sync`, commit cả `.engram/`.

Nếu bước nào bị bỏ qua, đó là lỗ hổng harness: ghi vào PROGRESS "Harness gaps".

## Việc một lần cho cả repo (không phải mỗi máy)

- GitHub → Settings → Branches → `main`: bật **Require status checks to pass**
  với check `verify` (CI chạy trên pull request). Không cấm push để không chặn
  chính chủ dự án.

## Linux / macOS

- Bỏ bước 4: chạy cổng trực tiếp `./harness/verify.sh --change <change>`
  (cần `flock`; macOS: `brew install flock`).
- Engram: tải `engram_3.6.2_linux_amd64.tar.gz` / `darwin_arm64` cùng
  `checksums.txt`, kiểm tra bằng `sha256sum -c` / `shasum -a 256`, đặt vào
  `~/.local/bin`.
- Script repo chạy thẳng bằng `bash`, không cần `harness/sh.mjs`.

## Sự cố thường gặp

| Triệu chứng | Cách xử lý |
|---|---|
| `verify-wsl` thoát mã 3, "WSL needs Node + pnpm" | Làm lại bước 4 |
| Không có công cụ `mcp__engram__*` trong phiên dsh | `engram` chưa vào PATH; mở lại terminal rồi chạy lại `dsh web` |
| Cài subagent ra bản `0.0.1-rc.1` | Gỡ rồi cài lại có `@0.2.2-rc.1` |
| `dsh plugin ...` báo "timed out waiting for the writer lock" | Có lệnh `dsh plugin` khác đang chạy; đợi nó xong hoặc dừng nó, rồi chạy lại |
| Không thấy mục Subscriptions trong Settings | Chưa có khối `llm-subscriptions` trong `~/.dsh/profiles/web/cordis.patch.yml`, hoặc chưa khởi động lại `dsh web` |
| Model chọn trong Settings bị đổi lại | Có overlay nào đặt `agent-default-model`? Repo không được làm vậy |
| `audit-harness` báo PROGRESS quá dài | `node harness/progress-rotate.mjs`, commit kết quả |
