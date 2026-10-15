# TransCmd


TransCmd 是一个面向开发者的 Alfred Workflow，提供快速翻译和代码变量命名转换。输入中文、英文或其他语言后，可以直接获得翻译结果或符合常见编程规范的变量名；按回车即可复制并粘贴到当前应用。

## 功能

- 自动识别输入语言并快速翻译
- 可选指定翻译结果语言
- 中文短语转换为常用代码变量格式
- 无需申请翻译 API 密钥
- 无 npm 运行时依赖

## 安装

从 [GitHub Releases](https://github.com/pjpjsocute/transcmd/releases) 下载最新的 `TransCmd.alfredworkflow`，双击文件并在 Alfred 中确认安装。

运行要求：

- macOS
- Alfred 4 或更高版本，并启用 Powerpack
- Node.js 12 或更高版本

## 快速翻译

使用 `tr` 命令。源语言始终由 Google 自动识别，不需要手动指定。

```text
tr 用户信息       → User information
tr payment status → 支付状态
tr Guten Morgen   → 早上好
```

默认情况下，中文翻译为英文，其他语言翻译为中文。

如需指定结果语言，在内容前添加 `>语言`：

```text
tr >de 用户信息     → Benutzerinformationen
tr >en Guten Morgen → Good morning
tr >zh hello        → 你好
```

支持标准语言代码和常用中文别名，例如：

| 写法 | 结果语言 |
| --- | --- |
| `>zh`、`>中文` | 中文 |
| `>en`、`>英文` | 英文 |
| `>de`、`>德文` | 德文 |
| `>ja`、`>日文` | 日文 |
| `>ko`、`>韩文` | 韩文 |
| `>fr`、`>法文` | 法文 |

## 变量命名

以下命令会先将输入翻译为英文，再转换为对应的变量格式：

| 命令 | 命名方式 | `用户信息` 的结果 |
| --- | --- | --- |
| `xt` | 小驼峰命名 | `userInformation` |
| `dt` | 大驼峰命名 | `UserInformation` |
| `xh` | 下划线命名 | `user_information` |
| `cl` | 常量命名 | `USER_INFORMATION` |
| `zh` | 中划线命名 | `user-information` |

## 项目结构

处理流程按照职责拆分，便于增加命令、命名规则或翻译服务：

```text
Alfred 输入
  ↓
输入与目标语言解析
  ↓
翻译服务适配器
  ↓
场景处理（直接翻译或变量命名）
  ↓
Alfred 结果输出
```

主要模块：

| 文件 | 职责 |
| --- | --- |
| `src/input.js` | 读取并清理 Alfred 输入 |
| `src/languages.js` | 解析目标语言和默认翻译方向 |
| `src/translators/google.js` | 请求 Google 翻译并规范化响应 |
| `src/naming.js` | 转换不同的代码命名格式 |
| `src/commands.js` | 管理命令和使用场景 |
| `src/workflow.js` | 编排完整处理流程 |
| `src/presenter.js` | 生成 Alfred Script Filter 输出 |

Google 翻译适配器使用网页端非官方接口，因此不需要 API 密钥。该接口未来可能变化；翻译层已经与其他模块隔离，可以独立替换为正式 Google API、DeepL 或其他服务。

## 本地开发

运行测试：

```bash
npm test
```

构建 Alfred 安装包：

```bash
npm run build
```

构建产物位于 `dist/TransCmd.alfredworkflow`。

## 作者

- GitHub：[@pjpjsocute](https://github.com/pjpjsocute)
- 项目地址：[github.com/pjpjsocute/transcmd](https://github.com/pjpjsocute/transcmd)

## 许可证

ISC
